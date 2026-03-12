import { describe, expect, it } from "vitest";

import { assertOpportunityTransition } from "./opportunity.state-machine";

describe("assertOpportunityTransition", () => {
  it("allows accepted to slot proposed", () => {
    expect(() =>
      assertOpportunityTransition("accepted", "slot_proposed"),
    ).not.toThrow();
  });

  it("rejects scheduled to accepted", () => {
    expect(() => assertOpportunityTransition("scheduled", "accepted")).toThrow(
      "Invalid opportunity transition",
    );
  });
});
