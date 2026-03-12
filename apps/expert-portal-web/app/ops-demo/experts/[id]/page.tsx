import {
  demoAuditEvents,
  demoExpertProfile,
  fetchExpertProfile,
  fetchPayments,
} from "@experts/contracts";
import { Badge, Card, PageShell, SectionHeading } from "@experts/ui";

import { AppNav } from "../../../../components/app-nav";
import { OpsDemoNav } from "../../../../components/ops-demo-nav";

export function generateStaticParams() {
  return [{ id: demoExpertProfile.id }];
}

export const dynamicParams = false;

export default async function OpsExpertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [profile, payments] = await Promise.all([
    fetchExpertProfile(),
    fetchPayments(),
  ]);

  return (
    <PageShell
      title={`Expert record · ${id.slice(0, 8)}`}
      subtitle="Review verification state, compliance posture, and payment status without crossing into the expert-facing app."
      accent={
        <div className="space-y-3">
          <AppNav currentPath="/ops-demo" />
          <OpsDemoNav currentPath={`/ops-demo/experts/${id}`} />
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Expert summary"
            title={profile.fullName}
            body={profile.headline}
          />
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-brand text-white">{profile.status}</Badge>
            <Badge>{profile.verification.status}</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] bg-fog p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Verification
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {profile.verification.outcomeSummary}
              </p>
            </div>
            <div className="rounded-[24px] bg-fog p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Last confirmed
              </p>
              <p className="mt-2 text-sm text-slate-700">
                {new Date(profile.lastConfirmedAt).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {profile.recencySignals.map((signal) => (
              <div key={signal.id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-medium text-slate-950">{signal.topic}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Last hands-on{" "}
                  {new Date(signal.lastHandsOnDate).toLocaleDateString()} with{" "}
                  {Math.round(signal.confidence * 100)}% confidence.
                </p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4">
            <SectionHeading
              eyebrow="Finance queue"
              title="Payment status controls"
              body="The MVP exposes internal statuses while redirecting payout setup and submission to an external secure link."
            />
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-[24px] bg-slate-50 p-4"
                >
                  <p className="font-medium text-slate-950">
                    ${payment.amountUsd}
                  </p>
                  <p className="text-sm text-slate-600">
                    {payment.status.replaceAll("_", " ")} · due{" "}
                    {new Date(payment.dueAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 bg-slate-950 text-white">
            <SectionHeading
              eyebrow="Audit trail"
              title="Recent expert-side actions"
              body="This gives ops and compliance a clean record of what changed, when, and against which entity."
            />
            <div className="space-y-3">
              {demoAuditEvents.map((event) => (
                <div key={event.id} className="rounded-[22px] bg-white/10 p-4">
                  <p className="text-sm font-medium">{event.action}</p>
                  <p className="mt-1 text-sm text-white/75">
                    {event.entityType} ·{" "}
                    {new Date(event.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
