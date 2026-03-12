import { describe, expect, it } from "vitest";

import {
  buildPersonaSignature,
  verifyPersonaSignature,
} from "./persona-signature";

describe("verifyPersonaSignature", () => {
  it("accepts matching signatures", () => {
    const payload = JSON.stringify({ id: "evt_1" });
    const signature = buildPersonaSignature("secret", payload);

    expect(
      verifyPersonaSignature({
        secret: "secret",
        payload,
        signatureHeader: `sha256=${signature}`,
      }),
    ).toBe(true);
  });

  it("rejects mismatched signatures", () => {
    expect(
      verifyPersonaSignature({
        secret: "secret",
        payload: "{}",
        signatureHeader: "sha256=nope",
      }),
    ).toBe(false);
  });
});
