import { Body, Controller, Get, Module, Patch, Post } from "@nestjs/common";
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";

class AvailabilityRuleInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  timezone!: string;

  @IsInt()
  @Min(0)
  @Max(6)
  weekday!: number;

  @IsString()
  startTime!: string;

  @IsString()
  endTime!: string;

  @IsInt()
  @Min(0)
  leadHours!: number;

  @IsOptional()
  @IsArray()
  blackoutDates?: string[];
}

export class AvailabilityService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly audit: AuditService,
  ) {}

  list() {
    return this.store.listAvailabilityRules();
  }

  save(user: PortalUser, input: AvailabilityRuleInputDto) {
    const rule = this.store.upsertAvailabilityRule({
      id: input.id ?? crypto.randomUUID(),
      timezone: input.timezone,
      weekday: input.weekday,
      startTime: input.startTime,
      endTime: input.endTime,
      leadHours: input.leadHours,
      blackoutDates: input.blackoutDates ?? [],
    });
    this.audit.emit({
      actor: user,
      action: "expert.profile.updated",
      entityType: "availability_rule",
      entityId: rule.id,
      payload: { weekday: rule.weekday, timezone: rule.timezone },
    });
    return rule;
  }
}

@Controller("availability-rules")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  list() {
    return this.availabilityService.list();
  }

  @Post()
  create(
    @CurrentUser() user: PortalUser,
    @Body() input: AvailabilityRuleInputDto,
  ) {
    return this.availabilityService.save(user, input);
  }

  @Patch()
  update(
    @CurrentUser() user: PortalUser,
    @Body() input: AvailabilityRuleInputDto,
  ) {
    return this.availabilityService.save(user, input);
  }
}

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}
