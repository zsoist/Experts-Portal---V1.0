import {
  Body,
  Controller,
  Get,
  Module,
  Param,
  Patch,
  Post,
} from "@nestjs/common";
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
} from "class-validator";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser, Roles } from "../auth/auth.module";
import {
  ComplianceModule,
  type ComplianceService,
} from "../compliance/compliance.module";
import { ExpertsModule, type ExpertsService } from "../experts/experts.module";
import {
  OpportunitiesModule,
  type OpportunitiesService,
} from "../opportunities/opportunities.module";
import {
  PaymentsModule,
  type PaymentsService,
} from "../payments/payments.module";

class OpportunityInputDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title!: string;

  @IsString()
  topic!: string;

  @IsString()
  deadlineAt!: string;

  @IsString()
  description!: string;

  @IsInt()
  estimatedMinutes!: number;

  @IsInt()
  rateUsd!: number;
}

class AddCandidatesDto {
  @IsArray()
  expertIds!: string[];
}

class UpdateVerificationDto {
  @IsString()
  status!: "not_started" | "pending" | "completed" | "failed" | "expired";

  @IsOptional()
  @IsString()
  reason?: string;
}

class ComplianceRuleDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name!: string;

  @IsString()
  ruleType!: string;

  @IsString()
  description!: string;

  @IsBoolean()
  blocking!: boolean;
}

class UpdatePaymentStatusDto {
  @IsString()
  status!:
    | "not_eligible"
    | "pending_request"
    | "requested_external"
    | "submitted"
    | "approved"
    | "paid"
    | "held";
}

@Controller("ops")
@Roles("ops_admin", "compliance_admin", "finance_admin")
export class OpsController {
  constructor(
    private readonly opportunities: OpportunitiesService,
    private readonly experts: ExpertsService,
    private readonly compliance: ComplianceService,
    private readonly payments: PaymentsService,
    private readonly audit: AuditService,
  ) {}

  @Post("opportunities")
  createOpportunity(
    @CurrentUser() _user: PortalUser,
    @Body() body: OpportunityInputDto,
  ) {
    return this.opportunities.upsertOpportunity(body);
  }

  @Patch("opportunities")
  updateOpportunity(
    @CurrentUser() user: PortalUser,
    @Body() body: OpportunityInputDto,
  ) {
    const opportunity = this.opportunities.upsertOpportunity(body);
    this.audit.emit({
      actor: user,
      action: "expert.profile.updated",
      entityType: "opportunity",
      entityId: opportunity.id,
      payload: { topic: opportunity.topic },
    });
    return opportunity;
  }

  @Post("opportunities/:opportunityId/candidates")
  addCandidates(
    @CurrentUser() user: PortalUser,
    @Param("opportunityId") opportunityId: string,
    @Body() body: AddCandidatesDto,
  ) {
    const response = this.opportunities.addCandidates(
      opportunityId,
      body.expertIds,
    );
    this.audit.emit({
      actor: user,
      action: "expert.profile.updated",
      entityType: "opportunity_candidate",
      entityId: opportunityId,
      payload: { count: body.expertIds.length },
    });
    return response;
  }

  @Patch("verification/:expertId")
  @Roles("ops_admin", "compliance_admin")
  updateVerification(
    @CurrentUser() user: PortalUser,
    @Body() body: UpdateVerificationDto,
  ) {
    return this.experts.updateVerification(user, body.status, body.reason);
  }

  @Post("compliance-rules")
  @Roles("ops_admin", "compliance_admin")
  createRule(@CurrentUser() user: PortalUser, @Body() body: ComplianceRuleDto) {
    return this.compliance.upsertRule(user, body);
  }

  @Patch("compliance-rules")
  @Roles("ops_admin", "compliance_admin")
  updateRule(@CurrentUser() user: PortalUser, @Body() body: ComplianceRuleDto) {
    return this.compliance.upsertRule(user, body);
  }

  @Patch("payments/:paymentId/status")
  @Roles("ops_admin", "finance_admin")
  updatePaymentStatus(
    @CurrentUser() user: PortalUser,
    @Param("paymentId") paymentId: string,
    @Body() body: UpdatePaymentStatusDto,
  ) {
    return this.payments.updateStatus(user, paymentId, body.status);
  }

  @Get("audit-events")
  listAuditEvents() {
    return this.audit.list();
  }
}

@Module({
  imports: [
    OpportunitiesModule,
    ExpertsModule,
    ComplianceModule,
    PaymentsModule,
    AuditModule,
  ],
  controllers: [OpsController],
})
export class OpsModule {}
