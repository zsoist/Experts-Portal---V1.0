import type { ExecutionContext } from "@nestjs/common";
import type { Reflector } from "@nestjs/core";
import { describe, expect, it } from "vitest";

import { RolesGuard, WorkosJwtVerifier } from "./auth.module";

describe("RolesGuard", () => {
  it("allows matching roles", () => {
    const reflector = {
      getAllAndOverride: () => ["ops_admin"],
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);
    const context = {
      getHandler: () => null,
      getClass: () => null,
      switchToHttp: () => ({
        getRequest: () => ({
          user: { role: "ops_admin" },
        }),
      }),
    } as unknown as ExecutionContext;

    expect(guard.canActivate(context)).toBe(true);
  });
});

describe("WorkosJwtVerifier", () => {
  it("accepts demo tokens without remote JWKS lookup", async () => {
    const verifier = new WorkosJwtVerifier({
      env: {
        NODE_ENV: "development",
        WORKOS_JWKS_URL: "https://example.com/jwks",
        WORKOS_ISSUER: "https://example.com",
      },
    } as never);

    await expect(
      verifier.verifyAuthorizationHeader("Bearer demo-ops_admin-user-1"),
    ).resolves.toMatchObject({ role: "ops_admin" });
  });
});
