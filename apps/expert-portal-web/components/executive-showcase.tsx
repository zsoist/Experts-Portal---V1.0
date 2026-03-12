"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  demoAuditEvents,
  demoBookings,
  demoComplianceRules,
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

const steps = [
  {
    key: "opportunity",
    label: "1. Opportunity lands",
    title:
      "Expert receives a high-context opportunity instead of a scattered email chain",
    summary:
      "Maria sees topic, rate, deadlines, and restrictions in one place, so response time drops and ops follow-up drops with it.",
    expertTitle:
      demoOpportunities[0]?.title ?? "Investor diligence opportunity",
    expertNotes: [
      "Deadline and compensation are visible immediately.",
      "Compliance flags appear before the expert commits.",
      "Screening is attached to the same workflow.",
    ],
    opsNotes: [
      "Associate can track invited vs accepted state.",
      "No manual forwarding of screening documents.",
      "Same opportunity record feeds bookings and payments.",
    ],
    outcome:
      "Expected impact: faster first response and fewer coordination touches.",
  },
  {
    key: "freshness",
    label: "2. Profile stays fresh",
    title:
      "Recency and experience are self-confirmed before associates have to chase for updates",
    summary:
      "The portal keeps role history and last-hands-on dates current, which improves matching quality and reduces manual screening loops.",
    expertTitle: demoExpertProfile.fullName,
    expertNotes: demoExpertProfile.recencySignals.map(
      (signal) =>
        `${signal.topic}: last hands-on ${new Date(signal.lastHandsOnDate).toLocaleDateString()}`,
    ),
    opsNotes: [
      "Profile freshness is visible without leaving the workflow.",
      "Ops can trust what was recently confirmed.",
      "The same data can later power AI-assisted screening.",
    ],
    outcome:
      "Expected impact: better expert matching and fewer stale profiles in the network.",
  },
  {
    key: "gating",
    label: "3. Scheduling is gated",
    title:
      "Availability, verification, and compliance block risky bookings before they happen",
    summary:
      "The product does not let ops or experts glide past required attestations. That means lower compliance risk without adding more spreadsheet control points.",
    expertTitle: demoBookings[0]?.title ?? "Scheduled consultation",
    expertNotes: [
      "Availability windows and blackout dates are explicit.",
      `Verification status: ${demoExpertProfile.verification.status.replaceAll("_", " ")}.`,
      `${demoComplianceRules[0]?.name ?? "Annual attestation"} is visible as a booking prerequisite.`,
    ],
    opsNotes: [
      "Manual overrides move into a controlled ops surface.",
      "Audit events record why a booking was allowed or blocked.",
      "The model is ready for Google/Microsoft sync in v2.",
    ],
    outcome:
      "Expected impact: fewer reschedules and a stronger compliance posture.",
  },
  {
    key: "payment",
    label: "4. Payment is visible",
    title:
      "Experts no longer email finance for status updates after a completed call",
    summary:
      "v1 keeps payout processing conservative, but the portal still makes payment status and next actions visible enough to reduce support load.",
    expertTitle: `$${demoPayments[0]?.amountUsd ?? 500} engagement payment`,
    expertNotes: [
      `Status: ${demoPayments[0]?.status.replaceAll("_", " ") ?? "pending request"}.`,
      "External secure link handles payout setup and submission.",
      "Experts can see when finance is holding, approving, or paying.",
    ],
    opsNotes: [
      "Finance updates status in a dedicated queue.",
      `Audit trail includes ${demoAuditEvents[0]?.action ?? "payment updates"}.`,
      "Provider integration can be added later without redesigning the UX.",
    ],
    outcome:
      "Expected impact: fewer payment support tickets and clearer expert trust.",
  },
] as const;

const beforeAfterRows = [
  {
    before: "Email outreach, doc attachments, and manual reminders",
    after:
      "One opportunity inbox with deadlines, screening, compliance flags, and rate",
  },
  {
    before: "Associate reconstructs profile recency by phone or email",
    after: "Expert confirms profile freshness directly in the portal",
  },
  {
    before: "Scheduling depends on one-off calendar links and human memory",
    after:
      "Availability rules and compliance gates are explicit and enforceable",
  },
  {
    before: "Payment follow-up is opaque and support-heavy",
    after:
      "Portal shows status and next action, even before full provider embedding",
  },
] as const;

function DemoFlowPanel({
  activeStep,
  onSelectStep,
}: {
  activeStep: number;
  onSelectStep: (index: number) => void;
}) {
  const step = steps[activeStep] ?? steps[0];

  return (
    <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
      <Card className="space-y-6 overflow-hidden bg-[linear-gradient(160deg,#ffffff_0%,#f3f7f4_100%)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading
            eyebrow="Guided walkthrough"
            title={step.title}
            body={step.summary}
          />
          <Badge className="bg-brand text-white">Executive demo mode</Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {steps.map((item, index) => (
            <button
              key={item.key}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                index === activeStep
                  ? "bg-slate-950 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200",
              )}
              onClick={() => onSelectStep(index)}
              type="button"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_20px_45px_rgba(15,23,42,0.22)]">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  Expert view
                </p>
                <h3 className="text-2xl font-semibold">{step.expertTitle}</h3>
              </div>
              <Badge className="bg-white/10 text-white">Maria Fischer</Badge>
            </div>
            <div className="mt-6 space-y-3">
              {step.expertNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/85"
                >
                  {note}
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[24px] bg-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                What the expert feels
              </p>
              <p className="mt-2 text-sm text-white/85">
                “I know what I’m being asked, whether I’m compliant to join,
                when I’m available, and what happens after the call.”
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Card className="space-y-4 bg-slate-50">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Ops and finance view
              </p>
              {step.opsNotes.map((note) => (
                <div
                  key={note}
                  className="rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
                >
                  {note}
                </div>
              ))}
            </Card>
            <Card className="space-y-3 bg-brand text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                Business outcome
              </p>
              <p className="text-lg font-medium">{step.outcome}</p>
            </Card>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={() => onSelectStep(Math.max(0, activeStep - 1))}
            variant="secondary"
          >
            Previous step
          </Button>
          <Button
            onClick={() =>
              onSelectStep(Math.min(steps.length - 1, activeStep + 1))
            }
          >
            Next step
          </Button>
          <Link href="/workspace">
            <Button variant="ghost">Open expert workspace</Button>
          </Link>
        </div>
      </Card>

      <Card className="space-y-5">
        <SectionHeading
          eyebrow="Leadership lens"
          title="Why this is worth building"
          body="This demo is intentionally product-first: it shows the supply-side moat, not just the system architecture."
        />
        <div className="space-y-3">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              Reduce associate coordination load
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Opportunity intake, recency upkeep, scheduling readiness, and
              payment follow-up move into self-service.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              Improve expert responsiveness
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Experts see clearer scope, faster actions, and fewer contextless
              requests.
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-900">
              Strengthen compliance visibility
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Verification, restrictions, and attestations become visible gates
              instead of side processes.
            </p>
          </div>
        </div>
        <Link href="/ops-demo">
          <Button className="w-full">Open internal ops demo</Button>
        </Link>
      </Card>
    </section>
  );
}

export function ExecutiveShowcase() {
  const [activeStep, setActiveStep] = useState(0);

  const outstandingPayments = useMemo(
    () => demoPayments.filter((payment) => payment.status !== "paid").length,
    [],
  );

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Response speed"
          value="< 5 min"
          detail="What the demo optimizes for once experts can respond in-product"
        />
        <MetricCard
          label="Profile freshness"
          value="90 days"
          detail="Target cadence for self-confirmed expertise recency"
        />
        <MetricCard
          label="Compliance gate"
          value="100%"
          detail="No booking should bypass verification or required attestations"
        />
        <MetricCard
          label="Payment visibility"
          value={String(outstandingPayments)}
          detail="Current seeded items still needing action or status clarity"
        />
      </section>

      <DemoFlowPanel activeStep={activeStep} onSelectStep={setActiveStep} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Current state vs future state"
            title="The product story in one comparison"
            body="This is the simplest way to explain the portal to a product leader: less email choreography, more controlled self-service."
          />
          <div className="space-y-3">
            {beforeAfterRows.map((row) => (
              <div
                key={row.before}
                className="grid gap-3 rounded-[24px] border border-slate-200 p-4 md:grid-cols-2"
              >
                <div className="rounded-[20px] bg-rose-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-rose-700">
                    Today
                  </p>
                  <p className="mt-2 text-sm text-rose-950">{row.before}</p>
                </div>
                <div className="rounded-[20px] bg-emerald-50 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-emerald-700">
                    With portal
                  </p>
                  <p className="mt-2 text-sm text-emerald-950">{row.after}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5 bg-slate-950 text-white">
          <SectionHeading
            eyebrow="What’s real in this demo"
            title="Prototype, but credible"
            body="This is not a slide-only concept. It is a runnable product prototype with seeded workflows, a typed API contract, an ops console, and validated builds/tests."
          />
          <div className="grid gap-3">
            <div className="rounded-[22px] bg-white/10 p-4">
              <p className="text-sm font-medium">
                Expert workspace is clickable
              </p>
              <p className="mt-1 text-sm text-white/75">
                Profile, opportunities, availability, projects, and payment
                states all have rendered surfaces.
              </p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-4">
              <p className="text-sm font-medium">Ops controls are separated</p>
              <p className="mt-1 text-sm text-white/75">
                Verification, compliance, payment, and audit visibility live in
                a distinct internal UI.
              </p>
            </div>
            <div className="rounded-[22px] bg-white/10 p-4">
              <p className="text-sm font-medium">Integrations are emulated</p>
              <p className="mt-1 text-sm text-white/75">
                WorkOS, Persona, and external payments are intentionally mocked
                where production connections are not needed for the demo.
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Link href="/workspace">
              <Button className="w-full">Show expert workspace</Button>
            </Link>
            <Link href="/ops-demo">
              <Button className="w-full" variant="secondary">
                Show ops console
              </Button>
            </Link>
          </div>
        </Card>
      </section>
    </div>
  );
}
