import { fetchExpertProfile, fetchPayments } from "@experts/contracts";
import { Badge, Card, PageShell, SectionHeading } from "@experts/ui";

import { OpsNav } from "../../../components/ops-nav";

export default async function ExpertDetailPage({
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
      accent={<OpsNav currentPath={`/experts/${id}`} />}
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
        </Card>
        <Card className="space-y-4">
          <SectionHeading
            eyebrow="Finance queue"
            title="Payment status controls"
            body="The MVP exposes internal statuses while redirecting payout setup and submission to an external secure link."
          />
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="rounded-[24px] bg-slate-50 p-4">
                <p className="font-medium text-slate-950">
                  ${payment.amountUsd}
                </p>
                <p className="text-sm text-slate-600">
                  {payment.status.replaceAll("_", " ")}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
