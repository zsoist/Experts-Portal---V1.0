import { describe, expect, it } from "vitest";

import { buildBookingIcs } from "./bookings.module";

describe("buildBookingIcs", () => {
  it("generates a valid VCALENDAR payload", () => {
    const output = buildBookingIcs({
      title: "Test call",
      startAt: "2026-03-14T15:00:00.000Z",
      endAt: "2026-03-14T15:45:00.000Z",
      description: "Opportunity details",
    });

    expect(output).toContain("BEGIN:VCALENDAR");
    expect(output).toContain("SUMMARY:Test call");
  });
});
