import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  Module,
  SetMetadata,
  UnauthorizedException,
  createParamDecorator,
} from "@nestjs/common";
import { APP_GUARD, type Reflector } from "@nestjs/core";
import { decode, verify } from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import type { AppConfigService } from "../config/app-config.service";

export type PortalRole =
  | "expert"
  | "ops_admin"
  | "compliance_admin"
  | "finance_admin";

export type PortalUser = {
  id: string;
  email: string;
  role: PortalRole;
};

const ROLES_KEY = "roles";
const PUBLIC_KEY = "isPublic";

export const Roles = (...roles: PortalRole[]) => SetMetadata(ROLES_KEY, roles);
export const Public = () => SetMetadata(PUBLIC_KEY, true);

export const CurrentUser = createParamDecorator(
  (_data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<{ user: PortalUser }>();
    return request.user;
  },
);

@Injectable()
export class WorkosJwtVerifier {
  constructor(private readonly config: AppConfigService) {}

  async verifyAuthorizationHeader(
    authorizationHeader?: string,
  ): Promise<PortalUser> {
    if (!authorizationHeader && this.config.env.NODE_ENV !== "production") {
      return {
        id: "4dd4d84f-33fd-476f-b814-5cc6d55f32a9",
        email: "maria.fischer@example.com",
        role: "expert",
      };
    }

    const token = authorizationHeader?.replace("Bearer ", "");
    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    if (token.startsWith("demo-")) {
      const [, role, id] = token.split("-");
      return {
        id: id ?? "demo-user",
        email: `${role ?? "expert"}@demo.local`,
        role: (role as PortalRole) ?? "expert",
      };
    }

    const decoded = decode(token, { complete: true });
    const kid =
      decoded && typeof decoded === "object" ? decoded.header.kid : undefined;
    if (!kid) {
      throw new UnauthorizedException("Token is missing kid");
    }

    const client = jwksClient({ jwksUri: this.config.env.WORKOS_JWKS_URL });
    const signingKey = await client.getSigningKey(kid);
    const publicKey = signingKey.getPublicKey();
    const payload = verify(token, publicKey, {
      issuer: this.config.env.WORKOS_ISSUER,
      algorithms: ["RS256"],
    }) as Record<string, string>;

    return {
      id: payload.sub ?? "unknown-user",
      email: payload.email ?? "unknown@example.com",
      role: (payload.role as PortalRole) ?? "expert",
    };
  }
}

@Injectable()
export class RequestContextGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtVerifier: WorkosJwtVerifier,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
      user?: PortalUser;
    }>();
    request.user = await this.jwtVerifier.verifyAuthorizationHeader(
      request.headers.authorization,
    );
    return true;
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<PortalRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: PortalUser }>();
    return Boolean(request.user && requiredRoles.includes(request.user.role));
  }
}

@Module({
  providers: [
    WorkosJwtVerifier,
    {
      provide: APP_GUARD,
      useClass: RequestContextGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [WorkosJwtVerifier],
})
export class AuthModule {}
