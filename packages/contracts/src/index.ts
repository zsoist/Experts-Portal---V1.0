export * from "./client";
export * from "./generated";
export * from "./mock-data";

import type { components } from "./generated";

export type ExpertStatus = components["schemas"]["ExpertStatus"];
export type VerificationStatus = components["schemas"]["VerificationStatus"];
export type BookingStatus = components["schemas"]["BookingStatus"];
export type PaymentStatus = components["schemas"]["PaymentStatus"];
export type OpportunityStatus = components["schemas"]["OpportunityStatus"];
export type ExpertProfile = components["schemas"]["ExpertProfile"];
export type OpportunitySummary = components["schemas"]["OpportunitySummary"];
export type OpportunityDetail = components["schemas"]["OpportunityDetail"];
export type AvailabilityRule = components["schemas"]["AvailabilityRule"];
export type Booking = components["schemas"]["Booking"];
export type ComplianceRule = components["schemas"]["ComplianceRule"];
export type ComplianceAttestation =
  components["schemas"]["ComplianceAttestation"];
export type PaymentRecord = components["schemas"]["PaymentRecord"];
export type AuditEvent = components["schemas"]["AuditEvent"];
export type RecencySignal = components["schemas"]["RecencySignal"];
