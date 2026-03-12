import {
  demoComplianceAttestations,
  demoComplianceRules,
} from "@experts/contracts";
import { describe, expect, it } from "vitest";

import { evaluateComplianceGate } from "./compliance.logic";

describe("evaluateComplianceGate", () => {
  it("blocks scheduling when verification is incomplete", () => {
    expect(
      evaluateComplianceGate({
        verificationStatus: "pending",
        rules: demoComplianceRules,
        attestations: demoComplianceAttestations,
      }).allowed,
    ).toBe(false);
  });

  it("blocks scheduling when a blocking attestation is missing", () => {
    expect(
      evaluateComplianceGate({
        verificationStatus: "completed",
        rules: demoComplianceRules,
        attestations: [],
      }).allowed,
    ).toBe(false);
  });
});
