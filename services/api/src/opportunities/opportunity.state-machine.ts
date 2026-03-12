import type { OpportunityStatus } from "@experts/contracts";

const allowedTransitions: Record<OpportunityStatus, OpportunityStatus[]> = {
  invited: ["screening_in_progress", "declined", "accepted"],
  screening_in_progress: ["accepted", "declined"],
  accepted: ["slot_proposed", "declined"],
  declined: [],
  slot_proposed: ["scheduled", "declined"],
  scheduled: ["completed", "held"],
  completed: ["payment_pending"],
  payment_pending: ["paid", "held"],
  paid: [],
  held: ["payment_pending", "paid"],
};

export function assertOpportunityTransition(
  current: OpportunityStatus,
  next: OpportunityStatus,
) {
  if (!allowedTransitions[current].includes(next)) {
    throw new Error(`Invalid opportunity transition: ${current} -> ${next}`);
  }
}
