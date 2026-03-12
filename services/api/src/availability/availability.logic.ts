import type { AvailabilityRule } from "@experts/contracts";

export function matchesAvailabilityRule(
  rule: AvailabilityRule,
  startAt: Date,
  endAt: Date,
) {
  if (startAt >= endAt) {
    return false;
  }

  const weekday = startAt.getUTCDay();
  const startTime = startAt.toISOString().slice(11, 16);
  const endTime = endAt.toISOString().slice(11, 16);
  const startDate = startAt.toISOString().slice(0, 10);

  if (rule.weekday !== weekday) {
    return false;
  }

  if (rule.blackoutDates.includes(startDate)) {
    return false;
  }

  return startTime >= rule.startTime && endTime <= rule.endTime;
}

export function canBookSlot(
  rules: AvailabilityRule[],
  startAt: Date,
  endAt: Date,
  now = new Date(),
) {
  const leadHours = Math.floor(
    (startAt.getTime() - now.getTime()) / (1000 * 60 * 60),
  );
  return rules.some(
    (rule) =>
      leadHours >= rule.leadHours &&
      matchesAvailabilityRule(rule, startAt, endAt),
  );
}
