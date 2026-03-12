"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
  demoAuditEvents,
  demoExpertProfile,
  demoOpportunities,
  demoPayments,
} from "@experts/contracts";
import {
  Badge,
  Button,
  Card,
  MetricCard,
  SectionHeading,
  cn,
} from "@experts/ui";

type OpsEvent = {
  id: string;
  title: string;
  detail: string;
};

export function OpsDashboardClient() {
  const [verificationStatus, setVerificationStatus] = useState("completed");
  const [attestationCaptured, setAttestationCaptured] = useState(false);
  const [opportunityPriority, setOpportunityPriority] =
    useState("live outreach");
  const [paymentStatus, setPaymentStatus] = useState("pending_request");
  const [events, setEvents] = useState<OpsEvent[]>([
    {
      id: "seed-ops-1",
      title: "Expert record opened",
      detail:
        "Ops is reviewing the same expert that appears in the expert workspace demo.",
    },
  ]);

  function addEvent(title: string, detail: string) {
    setEvents((current) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
      },
      ...current,
    ]);
  }

  const outstandingPayments = useMemo(
    () => demoPayments.filter((payment) => payment.status !== "paid").length,
    [],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Verification"
          value={verificationStatus}
          detail="Persona-backed identity state visible to ops"
        />
        <MetricCard
          label="Compliance"
          value={attestationCaptured ? "cleared" : "pending"}
          detail="Scheduling readiness updates as ops records acknowledgements"
        />
        <MetricCard
          label="Priority"
          value={opportunityPriority}
          detail="Associate-facing focus for the active opportunity"
        />
        <MetricCard
          label="Finance queue"
          value={String(outstandingPayments)}
          detail="Seeded outstanding payment items across the network"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading
              eyebrow="Ops control room"
              title="Show the internal side of the product"
              body="This is not just an expert-facing concept. Associates, compliance, and finance each get a clear place to act."
            />
            <Badge className="bg-brand text-white">
              Internal-only workflow
            </Badge>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="space-y-4 bg-fog">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-brand" />
                <p className="font-medium text-slate-950">Verification</p>
              </div>
              <p className="text-sm text-slate-600">
                Current state:{" "}
                <span className="font-medium text-slate-900">
                  {verificationStatus}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setVerificationStatus("completed");
                    addEvent(
                      "Verification approved",
                      "Compliance marks the Persona-backed identity review as completed.",
                    );
                  }}
                  variant="secondary"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => {
                    setVerificationStatus("pending");
                    addEvent(
                      "Verification re-requested",
                      "Ops flags that another identity check or follow-up is required.",
                    );
                  }}
                  variant="ghost"
                >
                  Re-request
                </Button>
              </div>
            </Card>

            <Card className="space-y-4 bg-fog">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <p className="font-medium text-slate-950">Compliance gate</p>
              </div>
              <p className="text-sm text-slate-600">
                {attestationCaptured
                  ? "The expert can proceed to scheduling."
                  : "The annual attestation is still a blocking requirement."}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setAttestationCaptured(true);
                    addEvent(
                      "Attestation recorded",
                      "The blocking compliance acknowledgement is now captured for this engagement.",
                    );
                  }}
                >
                  Record attestation
                </Button>
                <Button
                  onClick={() => {
                    setAttestationCaptured(false);
                    addEvent(
                      "Compliance gate reopened",
                      "Booking is blocked again until the expert completes the acknowledgement.",
                    );
                  }}
                  variant="ghost"
                >
                  Reopen gate
                </Button>
              </div>
            </Card>

            <Card className="space-y-4 bg-fog">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-emerald-700" />
                <p className="font-medium text-slate-950">Finance action</p>
              </div>
              <p className="text-sm text-slate-600">
                Payment status:{" "}
                <span className="font-medium text-slate-900">
                  {paymentStatus.replaceAll("_", " ")}
                </span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setPaymentStatus("approved");
                    addEvent(
                      "Payment approved",
                      "Finance validated the request and advanced it toward payout.",
                    );
                  }}
                  variant="secondary"
                >
                  Approve payout
                </Button>
                <Button
                  onClick={() => {
                    setPaymentStatus("paid");
                    addEvent(
                      "Payment marked paid",
                      "The portal now reflects that the expert has been paid.",
                    );
                  }}
                >
                  Mark paid
                </Button>
              </div>
            </Card>
          </div>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="What to point out"
            title="Leadership narrative"
            body="This screen shows that the portal is also an operations leverage product, not only a nicer expert UI."
          />
          <div className="space-y-3">
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="font-medium text-slate-950">
                One expert record spans multiple teams
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Associate, compliance, and finance all act on the same auditable
                record instead of handoffs by email.
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="font-medium text-slate-950">
                Gating becomes productized
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Verification and attestations are explicit controls, not hidden
                process knowledge.
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="font-medium text-slate-950">
                Payment visibility reduces support noise
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Even before full payout embedding, the internal and external
                payment states stay coordinated.
              </p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Expert queue"
            title={demoExpertProfile.fullName}
            body={demoExpertProfile.headline}
          />
          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">
                    {demoOpportunities[0]?.title ?? "Active opportunity"}
                  </p>
                  <p className="text-sm text-slate-600">
                    Associate priority: {opportunityPriority}
                  </p>
                </div>
                <Badge className="bg-slate-950 text-white">
                  {demoOpportunities[0]?.status.replaceAll("_", " ") ??
                    "invited"}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setOpportunityPriority("screening follow-up");
                    addEvent(
                      "Opportunity reprioritized",
                      "Associate changes the expert outreach focus based on client urgency.",
                    );
                  }}
                  variant="secondary"
                >
                  Prioritize screening
                </Button>
                <Button
                  onClick={() => {
                    setOpportunityPriority("scheduled coordination");
                    addEvent(
                      "Opportunity moved to scheduling",
                      "Ops shifts focus from outreach to slot confirmation.",
                    );
                  }}
                  variant="ghost"
                >
                  Move to scheduling
                </Button>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                Seeded audit baseline
              </p>
              <div className="mt-3 space-y-3">
                {demoAuditEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-[18px] bg-slate-50 p-3"
                  >
                    <p className="text-sm font-medium text-slate-950">
                      {event.action}
                    </p>
                    <p className="text-sm text-slate-600">{event.entityType}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Live audit feed"
            title="What changed as you clicked"
            body="A non-technical audience can still see the operational truth: each action updates the system and leaves a trace."
          />
          <div className="space-y-3">
            {events.map((event, index) => (
              <div
                className={cn(
                  "rounded-[22px] border px-4 py-3",
                  index === 0
                    ? "border-brand bg-brand/5"
                    : "border-slate-200 bg-white",
                )}
                key={event.id}
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-brand" />
                  <p className="font-medium text-slate-950">{event.title}</p>
                </div>
                <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => {
              setVerificationStatus("completed");
              setAttestationCaptured(false);
              setOpportunityPriority("live outreach");
              setPaymentStatus("pending_request");
              setEvents([
                {
                  id: "seed-ops-1",
                  title: "Expert record opened",
                  detail:
                    "Ops is reviewing the same expert that appears in the expert workspace demo.",
                },
              ]);
            }}
            variant="secondary"
          >
            Reset ops walkthrough
          </Button>
        </Card>
      </section>
    </div>
  );
}
