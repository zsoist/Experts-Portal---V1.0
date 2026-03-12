import { describe, expect, it } from "vitest";

import { PersonaEventProcessor } from "./persona-event.processor";

describe("PersonaEventProcessor", () => {
  it("rejects duplicate events", () => {
    const processor = new PersonaEventProcessor();
    const event = {
      id: "evt_1",
      inquiryId: "inq_1",
      status: "completed",
      createdAt: "2026-03-10T10:00:00.000Z",
    };

    expect(processor.process(event).accepted).toBe(true);
    expect(processor.process(event).reason).toBe("duplicate_event");
  });

  it("rejects out-of-order events", () => {
    const processor = new PersonaEventProcessor();
    processor.process({
      id: "evt_2",
      inquiryId: "inq_1",
      status: "completed",
      createdAt: "2026-03-10T11:00:00.000Z",
    });

    expect(
      processor.process({
        id: "evt_1",
        inquiryId: "inq_1",
        status: "pending",
        createdAt: "2026-03-10T10:00:00.000Z",
      }).reason,
    ).toBe("out_of_order_event");
  });
});
