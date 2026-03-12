import { demoAvailabilityRules } from "@experts/contracts";
import { describe, expect, it } from "vitest";

import { canBookSlot, matchesAvailabilityRule } from "./availability.logic";

describe("availability logic", () => {
  it("matches a slot inside a rule window", () => {
    const start = new Date("2026-03-17T09:30:00.000Z");
    const end = new Date("2026-03-17T10:15:00.000Z");

    expect(matchesAvailabilityRule(demoAvailabilityRules[0]!, start, end)).toBe(
      true,
    );
  });

  it("blocks booking if lead time is too short", () => {
    const start = new Date("2026-03-17T09:30:00.000Z");
    const end = new Date("2026-03-17T10:15:00.000Z");
    const now = new Date("2026-03-16T20:00:00.000Z");

    expect(canBookSlot(demoAvailabilityRules, start, end, now)).toBe(false);
  });
});
