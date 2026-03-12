"use client";

import { AlertTriangle, CheckCircle2, ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

import {
  demoAuditEvents,
  demoExpertProfile,
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

const controlCards = [
  {
    key: "verification",
    icon: ShieldCheck,
    title: "Verification",
    summary:
      "Persona-backed identity outcome is visible to ops without exposing raw documents.",
  },
  {
    key: "compliance",
    icon: AlertTriangle,
    title: "Compliance gate",
    summary:
      "Scheduling only clears when the required acknowledgement is present.",
  },
  {
    key: "finance",
    icon: Wallet,
    title: "Finance action",
    summary:
      "Payment status remains visible while payout execution stays in a secure external flow.",
  },
] as const;

export function OpsDemoClient() {
  const [verificationStatus, setVerificationStatus] = useState("completed");
  const [attestationCaptured, setAttestationCaptured] = useState(false);
  const [opportunityPriority] = useState("live outreach");
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
            {controlCards.map((card) => {
              const Icon = card.icon;

              return (
                <Card key={card.key} className="space-y-4 bg-fog">
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "h-5 w-5",
                        card.key === "verification"
                          ? "text-brand"
                          : card.key === "compliance"
                            ? "text-amber-600"
                            : "text-emerald-700",
                      )}
                    />
                    <p className="font-medium text-slate-950">{card.title}</p>
                  </div>
                  <p className="text-sm text-slate-600">{card.summary}</p>

                  {card.key === "verification" ? (
                    <>
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
                    </>
                  ) : null}

                  {card.key === "compliance" ? (
                    <>
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
                    </>
                  ) : null}

                  {card.key === "finance" ? (
                    <>
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
                    </>
                  ) : null}
                </Card>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Leadership narrative"
            title="What this screen proves"
            body="The portal is also an operations leverage product. It cuts coordination work while keeping approval, compliance, and finance actions controlled."
          />
          <div className="space-y-3">
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                One expert record drives multiple teams
              </p>
              <p className="mt-1 text-sm text-slate-600">
                Product, ops, compliance, and finance all act against the same
                system-of-record concept.
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                Manual overrides become explicit
              </p>
              <p className="mt-1 text-sm text-slate-600">
                The high-risk steps are visible and controlled instead of hiding
                inside inboxes and spreadsheets.
              </p>
            </div>
            <div className="rounded-[22px] bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-950">
                The architecture is ready for real integrations later
              </p>
              <p className="mt-1 text-sm text-slate-600">
                This demo keeps WorkOS, Persona, and payments conservative while
                still proving the product value.
              </p>
            </div>
          </div>
          <Link href={`/ops-demo/experts/${demoExpertProfile.id}`}>
            <Button className="w-full">Open expert detail record</Button>
          </Link>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <Card className="space-y-5">
          <SectionHeading
            eyebrow="Activity stream"
            title="Demo audit and workflow feed"
            body="Every action should leave a clear trail. This lets you tell the story of accountability without diving into backend diagrams."
          />
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="rounded-[24px] border border-slate-200 px-4 py-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand" />
                  <p className="font-medium text-slate-950">{event.title}</p>
                </div>
                <p className="mt-2 text-sm text-slate-600">{event.detail}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-5 bg-slate-950 text-white">
          <SectionHeading
            eyebrow="Seeded audit events"
            title="The product captures state changes explicitly"
            body="This is the same audit model that underpins verification, opportunity actions, compliance gating, and payment status updates."
          />
          <div className="space-y-3">
            {demoAuditEvents.map((event) => (
              <div key={event.id} className="rounded-[22px] bg-white/10 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-medium">{event.action}</p>
                  <Badge className="bg-white/15 text-white">
                    {event.entityType}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-white/75">
                  {new Date(event.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
