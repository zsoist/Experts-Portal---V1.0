import { Body, Controller, Get, Module, Post } from "@nestjs/common";
import { IsBoolean, IsString } from "class-validator";

import type { AuditService } from "../audit/audit.module";
import { AuditModule } from "../audit/audit.module";
import { CurrentUser, type PortalUser } from "../auth/auth.module";
import type { ExpertsService } from "../experts/experts.module";
import { ExpertsModule } from "../experts/experts.module";
import { type PortalStoreService, PrismaModule } from "../prisma/prisma.module";
import { evaluateComplianceGate } from "./compliance.logic";

class CreateAttestationDto {
  @IsString()
  ruleId!: string;

  @IsBoolean()
  accepted!: boolean;
}

export class ComplianceService {
  constructor(
    private readonly store: PortalStoreService,
    private readonly audit: AuditService,
    private readonly expertsService: ExpertsService,
  ) {}

  listAttestations() {
    return this.store.listComplianceAttestations();
  }

  completeAttestation(user: PortalUser, input: CreateAttestationDto) {
    const attestation = this.store.addComplianceAttestation({
      id: crypto.randomUUID(),
      ruleId: input.ruleId,
      accepted: input.accepted,
      createdAt: new Date().toISOString(),
    });

    this.audit.emit({
      actor: user,
      action: "attestation.completed",
      entityType: "compliance_attestation",
      entityId: attestation.id,
      payload: { ruleId: attestation.ruleId, accepted: attestation.accepted },
    });

    return attestation;
  }

  upsertRule(
    user: PortalUser,
    input: {
      id?: string;
      name: string;
      ruleType: string;
      description: string;
      blocking: boolean;
    },
  ) {
    const rule = this.store.upsertComplianceRule({
      id: input.id ?? crypto.randomUUID(),
      name: input.name,
      ruleType: input.ruleType,
      description: input.description,
      blocking: input.blocking,
    });

    this.audit.emit({
      actor: user,
      action: "expert.profile.updated",
      entityType: "compliance_rule",
      entityId: rule.id,
      payload: { blocking: rule.blocking, ruleType: rule.ruleType },
    });

    return rule;
  }

  evaluateSchedulingGate() {
    const expert = this.expertsService.getMe();
    return evaluateComplianceGate({
      verificationStatus: expert.verification.status,
      rules: this.store.listComplianceRules(),
      attestations: this.store.listComplianceAttestations(),
    });
  }
}

@Controller("compliance/attestations")
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get()
  list() {
    return this.complianceService.listAttestations();
  }

  @Post()
  create(@CurrentUser() user: PortalUser, @Body() input: CreateAttestationDto) {
    return this.complianceService.completeAttestation(user, input);
  }
}

@Module({
  imports: [PrismaModule, AuditModule, ExpertsModule],
  controllers: [ComplianceController],
  providers: [ComplianceService],
  exports: [ComplianceService],
})
export class ComplianceModule {}
