import {
  type AuditEvent,
  type AvailabilityRule,
  type Booking,
  type ComplianceAttestation,
  type ComplianceRule,
  type ExpertProfile,
  type OpportunityDetail,
  type OpportunitySummary,
  type PaymentRecord,
  type VerificationStatus,
  demoAuditEvents,
  demoAvailabilityRules,
  demoBookings,
  demoComplianceAttestations,
  demoComplianceRules,
  demoExpertProfile,
  demoOpportunities,
  demoOpportunityDetails,
  demoPayments,
} from "@experts/contracts";
import {
  Injectable,
  Module,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

type ScreeningAnswerRecord = {
  id: string;
  questionId: string;
  answerText: string;
  submittedAt: string;
  version: number;
};

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    if (process.env.NODE_ENV !== "test") {
      await this.$connect().catch(() => undefined);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect().catch(() => undefined);
  }
}

@Injectable()
export class PortalStoreService {
  private expertProfile: ExpertProfile = structuredClone(demoExpertProfile);
  private opportunities: OpportunitySummary[] =
    structuredClone(demoOpportunities);
  private opportunityDetails: Record<string, OpportunityDetail> =
    structuredClone(demoOpportunityDetails);
  private availabilityRules: AvailabilityRule[] = structuredClone(
    demoAvailabilityRules,
  );
  private bookings: Booking[] = structuredClone(demoBookings);
  private complianceRules: ComplianceRule[] =
    structuredClone(demoComplianceRules);
  private complianceAttestations: ComplianceAttestation[] = structuredClone(
    demoComplianceAttestations,
  );
  private payments: PaymentRecord[] = structuredClone(demoPayments);
  private auditEvents: AuditEvent[] = structuredClone(demoAuditEvents);
  private screeningAnswers = new Map<string, ScreeningAnswerRecord[]>();
  private opportunityCandidates = new Map<string, string[]>();

  getExpertProfile() {
    return structuredClone(this.expertProfile);
  }

  updateExpertProfile(update: Partial<ExpertProfile>) {
    this.expertProfile = {
      ...this.expertProfile,
      ...update,
      lastConfirmedAt: new Date().toISOString(),
    };

    return this.getExpertProfile();
  }

  updateVerification(status: VerificationStatus, outcomeSummary?: string) {
    this.expertProfile = {
      ...this.expertProfile,
      status: status === "completed" ? "active" : "pending_verification",
      verification: {
        ...this.expertProfile.verification,
        status,
        outcomeSummary,
        updatedAt: new Date().toISOString(),
      },
    };

    return structuredClone(this.expertProfile.verification);
  }

  listOpportunities() {
    return structuredClone(this.opportunities);
  }

  getOpportunity(opportunityId: string) {
    const fallbackOpportunity = this.opportunities[0]!;
    return structuredClone(
      this.opportunityDetails[opportunityId] ??
        this.opportunityDetails[fallbackOpportunity.id]!,
    );
  }

  saveOpportunity(opportunity: OpportunityDetail) {
    this.opportunityDetails[opportunity.id] = structuredClone(opportunity);
    const summary: OpportunitySummary = {
      id: opportunity.id,
      title: opportunity.title,
      topic: opportunity.topic,
      status: opportunity.status,
      deadlineAt: opportunity.deadlineAt,
      rateUsd: opportunity.rateUsd,
      complianceFlags: opportunity.complianceFlags,
    };

    const existingIndex = this.opportunities.findIndex(
      (item) => item.id === opportunity.id,
    );
    if (existingIndex >= 0) {
      this.opportunities[existingIndex] = summary;
    } else {
      this.opportunities.unshift(summary);
    }

    return structuredClone(opportunity);
  }

  updateOpportunityStatus(
    opportunityId: string,
    status: OpportunitySummary["status"],
  ) {
    const detail = this.getOpportunity(opportunityId)!;
    detail.status = status;
    this.saveOpportunity(detail);
    return this.opportunities.find((item) => item.id === opportunityId)!;
  }

  listAvailabilityRules() {
    return structuredClone(this.availabilityRules);
  }

  upsertAvailabilityRule(rule: AvailabilityRule) {
    const index = this.availabilityRules.findIndex(
      (item) => item.id === rule.id,
    );

    if (index >= 0) {
      this.availabilityRules[index] = structuredClone(rule);
    } else {
      this.availabilityRules.push(structuredClone(rule));
    }

    return structuredClone(rule);
  }

  listBookings() {
    return structuredClone(this.bookings);
  }

  listComplianceRules() {
    return structuredClone(this.complianceRules);
  }

  upsertComplianceRule(rule: ComplianceRule) {
    const index = this.complianceRules.findIndex((item) => item.id === rule.id);
    if (index >= 0) {
      this.complianceRules[index] = structuredClone(rule);
    } else {
      this.complianceRules.unshift(structuredClone(rule));
    }

    return structuredClone(rule);
  }

  listComplianceAttestations() {
    return structuredClone(this.complianceAttestations);
  }

  addComplianceAttestation(attestation: ComplianceAttestation) {
    this.complianceAttestations.unshift(structuredClone(attestation));
    return structuredClone(attestation);
  }

  listPayments() {
    return structuredClone(this.payments);
  }

  updatePaymentStatus(paymentId: string, status: PaymentRecord["status"]) {
    const payment = this.payments.find((item) => item.id === paymentId);
    if (!payment) {
      throw new Error(`Unknown payment ${paymentId}`);
    }

    payment.status = status;
    return structuredClone(payment);
  }

  saveScreeningAnswers(
    opportunityId: string,
    answers: ScreeningAnswerRecord[],
  ) {
    const existing = this.screeningAnswers.get(opportunityId) ?? [];
    const nextVersion = existing.length + 1;
    const stampedAnswers = answers.map((answer) => ({
      ...answer,
      version: nextVersion,
      submittedAt: new Date().toISOString(),
    }));

    this.screeningAnswers.set(opportunityId, [...existing, ...stampedAnswers]);
    return structuredClone(stampedAnswers);
  }

  listAuditEvents() {
    return structuredClone(this.auditEvents);
  }

  addAuditEvent(event: AuditEvent) {
    this.auditEvents.unshift(structuredClone(event));
    return structuredClone(event);
  }

  addCandidates(opportunityId: string, expertIds: string[]) {
    const existing = this.opportunityCandidates.get(opportunityId) ?? [];
    const next = [...new Set([...existing, ...expertIds])];
    this.opportunityCandidates.set(opportunityId, next);
    return { opportunityId, expertIds: structuredClone(next) };
  }
}

@Module({
  providers: [PrismaService, PortalStoreService],
  exports: [PrismaService, PortalStoreService],
})
export class PrismaModule {}
