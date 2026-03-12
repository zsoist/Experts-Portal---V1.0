"use client";

import { CheckCircle2, Circle, Clock3, Sparkles } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  demoBookings,
  demoExpertProfile,
  demoOpportunityDetails,
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

type DemoStep =
  | "respond"
  | "screening"
  | "attestation"
  | "slot"
  | "complete"
  | "payment";

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
};

const featuredOpportunity =
  demoOpportunityDetails["772af0ea-44fc-42e5-aec7-214db3fdbdbd"] ??
  Object.values(demoOpportunityDetails)[0];

const scheduledBooking = demoBookings[0];
const samplePayment = demoPayments[0];

const journeySteps: Array<{
  key: DemoStep;
  label: string;
  detail: string;
}> = [
  {
    key: "respond",
    label: "Open the opportunity",
    detail: "Expert sees scope, rate, restrictions, and deadline in one place.",
  },
  {
    key: "screening",
    label: "Submit screening",
    detail: "Expert answers screeners and accepts without email ping-pong.",
  },
  {
    key: "attestation",
    label: "Complete compliance",
    detail: "Required attestation stays in the same flow before booking.",
  },
  {
    key: "slot",
    label: "Confirm the slot",
    detail:
      "Availability rules and booking proposal convert to a scheduled call.",
  },
  {
    key: "complete",
    label: "Complete the consultation",
    detail:
      "Project moves from scheduled to completed with a clear next action.",
  },
  {
    key: "payment",
    label: "Request payment",
    detail:
      "Expert opens the secure external payout flow and sees status here.",
  },
];

function buildNextAction(step: DemoStep) {
  switch (step) {
    case "respond":
      return {
        title: "Start response",
        body: "Open the opportunity and show the expert that all context is present immediately.",
        button: "Start opportunity response",
      };
    case "screening":
      return {
        title: "Submit screeners",
        body: "The expert provides short answers and accepts the opportunity in-product.",
        button: "Submit screening and accept",
      };
    case "attestation":
      return {
        title: "Clear compliance gate",
        body: "The expert acknowledges the annual attestation before scheduling proceeds.",
        button: "Complete attestation",
      };
    case "slot":
      return {
        title: "Lock the booking",
        body: "Ops proposes a compliant slot and the expert confirms it from the same workspace.",
        button: "Confirm proposed slot",
      };
    case "complete":
      return {
        title: "Finish the engagement",
        body: "After the call, the project state advances and unlocks payment action.",
        button: "Mark consultation complete",
      };
    case "payment":
      return {
        title: "Open secure payment flow",
        body: "Expert requests payout through a secure external link while status remains visible here.",
        button: "Request payment",
      };
    default:
      return {
        title: "Reset walkthrough",
        body: "Replay the demo from the start.",
        button: "Reset demo",
      };
  }
}

export function DashboardClient() {
  const [stepIndex, setStepIndex] = useState(0);
  const [freshnessConfirmed, setFreshnessConfirmed] = useState(false);
  const [activity, setActivity] = useState<ActivityItem[]>([
    {
      id: "seed-1",
      title: "Opportunity delivered",
      detail:
        "Maria was invited to a RevOps diligence call with screening attached.",
    },
  ]);

  const completedDemo = stepIndex >= journeySteps.length;
  const fallbackStep = journeySteps[0]!;
  const currentStep =
    journeySteps[Math.min(stepIndex, journeySteps.length - 1)] ?? fallbackStep;
  const nextAction = completedDemo
    ? {
        title: "Walkthrough complete",
        body: "The expert has gone from invitation to payment request. Replay the sequence or jump into the other product pages.",
        button: "Replay expert walkthrough",
      }
    : buildNextAction(currentStep.key);

  const derived = useMemo(() => {
    const responded = stepIndex >= 1;
    const screeningSubmitted = stepIndex >= 2;
    const attested = stepIndex >= 3;
    const slotConfirmed = stepIndex >= 4;
    const consultationCompleted = stepIndex >= 5;
    const paymentRequested = stepIndex >= journeySteps.length;

    const opportunityStatus = !responded
      ? "invited"
      : !screeningSubmitted
        ? "screening_in_progress"
        : !slotConfirmed
          ? "slot_proposed"
          : !consultationCompleted
            ? "scheduled"
            : "payment_pending";

    const paymentStatus = !consultationCompleted
      ? "not_eligible"
      : !paymentRequested
        ? "pending_request"
        : "requested_external";

    return {
      responded,
      screeningSubmitted,
      attested,
      slotConfirmed,
      consultationCompleted,
      paymentRequested,
      opportunityStatus,
      paymentStatus,
    };
  }, [stepIndex]);

  function pushActivity(title: string, detail: string) {
    setActivity((current) => [
      {
        id: crypto.randomUUID(),
        title,
        detail,
      },
      ...current,
    ]);
  }

  function advanceDemo() {
    const nextStepIndex = Math.min(stepIndex + 1, journeySteps.length);
    const currentKey = currentStep.key;

    if (currentKey === "respond") {
      pushActivity(
        "Opportunity opened",
        "Expert reviews scope, timing, and compliance flags inside the portal.",
      );
    } else if (currentKey === "screening") {
      pushActivity(
        "Screening submitted",
        "Expert answers screening questions and accepts the opportunity.",
      );
    } else if (currentKey === "attestation") {
      pushActivity(
        "Attestation completed",
        "Annual compliance acknowledgement is captured before scheduling.",
      );
    } else if (currentKey === "slot") {
      pushActivity(
        "Booking confirmed",
        "Expert confirms a compliant timeslot from inside the workspace.",
      );
    } else if (currentKey === "complete") {
      pushActivity(
        "Consultation completed",
        "Project moves into payment-ready state with no manual reconciliation step.",
      );
    } else if (currentKey === "payment") {
      pushActivity(
        "External payment flow opened",
        "Expert launches the secure payment action while the portal preserves status visibility.",
      );
    }

    setStepIndex(nextStepIndex);
  }

  function resetDemo() {
    setStepIndex(0);
    setFreshnessConfirmed(false);
    setActivity([
      {
        id: "seed-1",
        title: "Opportunity delivered",
        detail:
          "Maria was invited to a RevOps diligence call with screening attached.",
      },
    ]);
  }

  const featuredPaymentAmount = samplePayment?.amountUsd ?? 500;
  const bookingStart = scheduledBooking?.startAt ?? "2026-03-14T15:00:00.000Z";

  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Demo persona"
          value="Maria"
          detail="Former VP Revenue Operations, B2B SaaS"
        />
        <MetricCard
          label="Opportunity"
          value={derived.opportunityStatus.replaceAll("_", " ")}
          detail="Status updates live as you click through the flow"
        />
        <MetricCard
          label="Compliance"
          value={derived.attested ? "cleared" : "pending"}
          detail="Booking stays blocked until the attestation step is complete"
        />
        <MetricCard
          label="Payments"
          value={derived.paymentStatus.replaceAll("_", " ")}
          detail="Secure external payout request with in-product visibility"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <Card className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <SectionHeading
              eyebrow="Live walkthrough"
              title="Click through the exact expert experience"
              body="This is the product demo surface. Every click below changes the state of the expert journey so you can narrate it like a real prototype."
            />
            <Badge className="bg-brand text-white">Clickable MVP</Badge>
          </div>

          <div className="grid gap-3">
            {journeySteps.map((step, index) => {
              const complete = index < stepIndex;
              const active = index === stepIndex;

              return (
                <button
                  className={cn(
                    "grid gap-2 rounded-[24px] border px-4 py-4 text-left transition",
                    active
                      ? "border-brand bg-brand/5"
                      : complete
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                  )}
                  key={step.key}
                  onClick={() => setStepIndex(index)}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    {complete ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : active ? (
                      <Clock3 className="h-5 w-5 text-brand" />
                    ) : (
                      <Circle className="h-5 w-5 text-slate-400" />
                    )}
                    <p className="font-medium text-slate-950">{step.label}</p>
                  </div>
                  <p className="text-sm text-slate-600">{step.detail}</p>
                </button>
              );
            })}
          </div>

          <Card className="space-y-4 bg-slate-950 text-white">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                  Narration cue
                </p>
                <p className="text-xl font-semibold">{nextAction.title}</p>
              </div>
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <p className="text-sm text-white/80">{nextAction.body}</p>
            <div className="flex flex-wrap gap-3">
              {!completedDemo ? (
                <Button onClick={advanceDemo}>{nextAction.button}</Button>
              ) : (
                <Button onClick={resetDemo}>Replay expert walkthrough</Button>
              )}
              <Button onClick={resetDemo} variant="secondary">
                Reset demo
              </Button>
            </div>
          </Card>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="What to say out loud"
            title="Short executive talk track"
            body="If you need to drive the room, this panel gives the message for the current click."
          />
          <div className="space-y-3">
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                “This replaces email choreography with one expert home.”
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                “The same record drives opportunity, scheduling, compliance, and
                payment status.”
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                “We keep risky integrations conservative in v1, but the product
                value is visible immediately.”
              </p>
            </div>
          </div>
          <Link href="/ops-demo">
            <Button className="w-full" variant="secondary">
              Open the matching ops console
            </Button>
          </Link>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <SectionHeading
              eyebrow="Inbox and screening"
              title={featuredOpportunity?.title ?? "Featured opportunity"}
              body={featuredOpportunity?.description}
            />
            <Badge className="bg-slate-950 text-white">
              {derived.opportunityStatus.replaceAll("_", " ")}
            </Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 rounded-[28px] border border-slate-200 p-5">
              <div className="flex flex-wrap gap-2">
                {(featuredOpportunity?.complianceFlags ?? []).map((flag) => (
                  <span
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-950"
                    key={flag}
                  >
                    {flag}
                  </span>
                ))}
              </div>
              <div className="space-y-3">
                {(featuredOpportunity?.screeningQuestions ?? []).map(
                  (question) => (
                    <div
                      key={question.id}
                      className="rounded-[20px] bg-slate-50 p-4"
                    >
                      <p className="text-sm font-medium text-slate-950">
                        {question.prompt}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {derived.screeningSubmitted
                          ? "Sample answer saved and submitted in-product."
                          : "Answer field appears here during the demo."}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-4 rounded-[28px] bg-slate-950 p-5 text-white">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">
                Expert decision state
              </p>
              <div className="space-y-3">
                <div className="rounded-[20px] bg-white/5 p-4">
                  <p className="text-sm font-medium">Response deadline</p>
                  <p className="mt-1 text-sm text-white/75">
                    {new Date(
                      featuredOpportunity?.deadlineAt ??
                        "2026-03-13T14:00:00.000Z",
                    ).toLocaleString()}
                  </p>
                </div>
                <div className="rounded-[20px] bg-white/5 p-4">
                  <p className="text-sm font-medium">Compensation</p>
                  <p className="mt-1 text-sm text-white/75">
                    ${featuredOpportunity?.rateUsd ?? 450}/hr
                  </p>
                </div>
                <div className="rounded-[20px] bg-white/5 p-4">
                  <p className="text-sm font-medium">Current CTA</p>
                  <p className="mt-1 text-sm text-white/75">
                    {nextAction.button}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Profile and trust"
            title="Expert feels in control"
            body="Freshness, compliance, and timing stay visible inside the same product surface."
          />
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Profile freshness
            </p>
            <p className="mt-2 font-medium text-slate-950">
              {freshnessConfirmed
                ? "Recency confirmed during the demo"
                : "Prompt the expert to reconfirm recent hands-on experience"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Last confirmed{" "}
              {new Date(demoExpertProfile.lastConfirmedAt).toLocaleDateString()}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={() => setFreshnessConfirmed(true)}
                variant="secondary"
              >
                Confirm profile freshness
              </Button>
              <Link href="/profile">
                <Button variant="ghost">Open profile page</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Compliance gate
            </p>
            <p className="mt-2 font-medium text-slate-950">
              {derived.attested
                ? "Attestation completed, booking can proceed"
                : "Booking stays blocked until attestation is completed"}
            </p>
          </div>
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
              Availability
            </p>
            <p className="mt-2 font-medium text-slate-950">
              {derived.slotConfirmed
                ? "Slot confirmed from saved availability rules"
                : "Saved windows are ready for slot proposal"}
            </p>
            <Link className="mt-4 inline-flex" href="/availability">
              <Button variant="ghost">Open availability page</Button>
            </Link>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_1fr]">
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Projects and payments"
            title="The expert can always see what happens next"
            body="The same workspace shows scheduling readiness, live project state, and payout status."
          />
          <div className="space-y-4">
            <div className="rounded-[26px] border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">
                    {scheduledBooking?.title ?? "Pricing organization design"}
                  </p>
                  <p className="text-sm text-slate-600">
                    {new Date(bookingStart).toLocaleString()}
                  </p>
                </div>
                <Badge
                  className={
                    derived.slotConfirmed
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  }
                >
                  {derived.slotConfirmed
                    ? derived.consultationCompleted
                      ? "completed"
                      : "scheduled"
                    : "awaiting confirmation"}
                </Badge>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-200 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-950">
                    Payment for completed consultation
                  </p>
                  <p className="text-sm text-slate-600">
                    ${featuredPaymentAmount} · external secure payout flow
                  </p>
                </div>
                <Badge
                  className={
                    derived.paymentRequested
                      ? "bg-brand text-white"
                      : derived.consultationCompleted
                        ? "bg-amber-200 text-amber-950"
                        : "bg-slate-200 text-slate-700"
                  }
                >
                  {derived.paymentStatus.replaceAll("_", " ")}
                </Badge>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href="/projects">
                  <Button variant="ghost">Open projects page</Button>
                </Link>
                {derived.consultationCompleted ? (
                  <Button
                    onClick={() =>
                      pushActivity(
                        "Secure payment link previewed",
                        "Finance handoff remains external while the expert still sees status in-product.",
                      )
                    }
                    variant="secondary"
                  >
                    Preview secure payout action
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Live activity"
            title="What changed as you clicked"
            body="This is the audit-friendly narrative of the expert journey, presented in plain language."
          />
          <div className="space-y-3">
            {activity.map((item, index) => (
              <div
                className={cn(
                  "rounded-[22px] border px-4 py-3",
                  index === 0
                    ? "border-brand bg-brand/5"
                    : "border-slate-200 bg-white",
                )}
                key={item.id}
              >
                <p className="font-medium text-slate-950">{item.title}</p>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
