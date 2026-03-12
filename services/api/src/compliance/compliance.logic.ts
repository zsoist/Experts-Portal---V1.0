import type {
  ComplianceAttestation,
  ComplianceRule,
  VerificationStatus,
} from "@experts/contracts";

export function evaluateComplianceGate(input: {
  verificationStatus: VerificationStatus;
  rules: ComplianceRule[];
  attestations: ComplianceAttestation[];
}) {
  if (input.verificationStatus !== "completed") {
    return {
      allowed: false,
      reason: "Verification must be completed before scheduling.",
    };
  }

  const missingBlockingRule = input.rules.find((rule) => {
    if (!rule.blocking) {
      return false;
    }

    return !input.attestations.some(
      (attestation) => attestation.ruleId === rule.id && attestation.accepted,
    );
  });

  if (missingBlockingRule) {
    return {
      allowed: false,
      reason: `Missing blocking attestation: ${missingBlockingRule.name}.`,
    };
  }

  return { allowed: true, reason: null };
}
