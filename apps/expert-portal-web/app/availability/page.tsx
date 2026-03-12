import { fetchAvailabilityRules } from "@experts/contracts";
import { Card, PageShell, SectionHeading } from "@experts/ui";

import { AppNav } from "../../components/app-nav";
import { AvailabilityForm } from "../../components/availability-form";

export default async function AvailabilityPage() {
  const rules = await fetchAvailabilityRules();

  return (
    <PageShell
      title="Availability rules and call readiness"
      subtitle="First-party availability reduces scheduling back-and-forth while keeping a conservative v1 boundary before 2-way calendar sync."
      accent={<AppNav currentPath="/availability" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <AvailabilityForm rules={rules} />
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="v1 boundary"
            title="ICS export now, two-way sync later"
            body="The booking layer only needs authoritative rules, blackout dates, and exportable events for the MVP."
          />
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Weekly windows and timezone ownership live with the expert.</li>
            <li>
              Lead-time rules prevent ops from proposing unrealistic slots.
            </li>
            <li>
              Blackout dates remain explicit until Google and Microsoft sync
              lands in v2.
            </li>
          </ul>
        </Card>
      </div>
    </PageShell>
  );
}
