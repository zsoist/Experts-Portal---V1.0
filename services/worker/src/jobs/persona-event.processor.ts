export type PersonaEvent = {
  id: string;
  inquiryId: string;
  status: string;
  createdAt: string;
};

export class PersonaEventProcessor {
  private readonly processedIds = new Set<string>();
  private readonly latestSeenAtByInquiry = new Map<string, number>();

  process(event: PersonaEvent) {
    if (this.processedIds.has(event.id)) {
      return { accepted: false, reason: "duplicate_event" as const };
    }

    const createdAt = Date.parse(event.createdAt);
    const latestSeenAt = this.latestSeenAtByInquiry.get(event.inquiryId) ?? 0;

    if (createdAt < latestSeenAt) {
      return { accepted: false, reason: "out_of_order_event" as const };
    }

    this.processedIds.add(event.id);
    this.latestSeenAtByInquiry.set(event.inquiryId, createdAt);

    return { accepted: true, reason: "processed" as const };
  }
}
