import { Body, Controller, Get, Module, Patch } from "@nestjs/common";
import { IsArray, IsOptional, IsString } from "class-validator";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";

class UpdateExpertProfileDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsArray()
  expertiseTags?: string[];
}

export class ExpertsService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly audit: AuditService,
  ) {}

  getMe() {
    return this.store.getExpertProfile();
  }

  updateMe(user: PortalUser, update: UpdateExpertProfileDto) {
    const profile = this.store.updateExpertProfile(update);
    this.audit.emit({
      actor: user,
      action: "expert.profile.updated",
      entityType: "expert_profile",
      entityId: profile.id,
      payload: { changedFields: Object.keys(update) },
    });
    return profile;
  }

  updateVerification(
    user: PortalUser,
    status: "not_started" | "pending" | "completed" | "failed" | "expired",
    reason?: string,
  ) {
    const verification = this.store.updateVerification(status, reason);
    this.audit.emit({
      actor: user,
      action: "verification.completed",
      entityType: "verification",
      entityId: this.store.getExpertProfile().id,
      payload: { status, reason },
    });
    return verification;
  }
}

@Controller("experts")
export class ExpertsController {
  constructor(private readonly expertsService: ExpertsService) {}

  @Get("me")
  getMe() {
    return this.expertsService.getMe();
  }

  @Patch("me")
  updateMe(
    @CurrentUser() user: PortalUser,
    @Body() update: UpdateExpertProfileDto,
  ) {
    return this.expertsService.updateMe(user, update);
  }
}

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [ExpertsController],
  providers: [ExpertsService],
  exports: [ExpertsService],
})
export class ExpertsModule {}
