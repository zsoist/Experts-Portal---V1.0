import {
  demoOpportunityDetails,
  fetchOpportunityDetail,
} from "@experts/contracts";
import { Badge, Card, PageShell, SectionHeading } from "@experts/ui";

import { AppNav } from "../../../components/app-nav";
import { OpportunityScreeningForm } from "../../../components/opportunity-screening-form";

export function generateStaticParams() {
  return Object.keys(demoOpportunityDetails).map((id) => ({ id }));
}

export const dynamicParams = false;

export default async function OpportunityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const opportunity = await fetchOpportunityDetail(id);

  return (
    <PageShell
      title={opportunity.title}
      subtitle={opportunity.description}
      accent={<AppNav currentPath="/workspace" />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <OpportunityScreeningForm opportunity={opportunity} />
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Opportunity brief"
            title="Scope and compliance"
            body="The screening flow surfaces payment rate, timing, and restrictions before the expert commits."
          />
          <div className="space-y-3">
            <p className="text-sm text-slate-600">
              Estimated call length: {opportunity.estimatedMinutes} minutes
            </p>
            <p className="text-sm text-slate-600">
              Deadline: {new Date(opportunity.deadlineAt).toLocaleString()}
            </p>
            <div className="flex flex-wrap gap-2">
              {opportunity.complianceFlags.map((flag) => (
                <Badge key={flag} className="bg-amber-100 text-amber-950">
                  {flag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
