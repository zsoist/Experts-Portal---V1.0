import type { components } from "./generated";

function must<T>(value: T | undefined, label: string): T {
  if (value === undefined) {
    throw new Error(`Missing mock data: ${label}`);
  }

  return value;
}

export const auditActionCatalog = [
  "auth.login.succeeded",
  "auth.login.failed",
  "expert.profile.updated",
  "expert.profile.confirmed",
  "verification.requested",
  "verification.completed",
  "opportunity.accepted",
  "opportunity.declined",
  "screening.submitted",
  "booking.created",
  "booking.blocked.compliance",
  "attestation.completed",
  "payment.external_link_opened",
  "payment.status.updated",
] as const;

export const demoExpertProfile: components["schemas"]["ExpertProfile"] = {
  id: "4dd4d84f-33fd-476f-b814-5cc6d55f32a9",
  email: "maria.fischer@example.com",
  status: "active",
  verification: {
    status: "completed",
    personaInquiryId: "inq_01EXPERTPORTAL",
    updatedAt: "2026-03-10T15:30:00.000Z",
    outcomeSummary: "Government ID verified via Persona.",
  },
  fullName: "Maria Fischer",
  headline: "Former VP of Revenue Operations, B2B SaaS",
  timezone: "Europe/Berlin",
  expertiseTags: [
    "Revenue Operations",
    "B2B SaaS",
    "Pricing",
    "Sales Enablement",
  ],
  roleHistory: [
    {
      company: "Northstar Cloud",
      title: "VP Revenue Operations",
      startedAt: "2020-02-01",
      endedAt: "2025-12-01",
    },
    {
      company: "ScaleHouse",
      title: "Head of Sales Operations",
      startedAt: "2016-05-01",
      endedAt: "2020-01-01",
    },
  ],
  recencySignals: [
    {
      id: "0fd565f7-dde4-48b3-b6a0-1ab9ce0a6fff",
      topic: "Quote-to-cash redesign",
      lastHandsOnDate: "2025-12-15",
      confidence: 0.95,
      source: "self_confirmed",
    },
    {
      id: "76c4dc7c-3b3a-4824-bab1-3459992224c1",
      topic: "Pricing committee governance",
      lastHandsOnDate: "2025-09-01",
      confidence: 0.83,
      source: "engagement_history",
    },
  ],
  lastConfirmedAt: "2026-03-09T09:00:00.000Z",
};

export const demoOpportunities: components["schemas"]["OpportunitySummary"][] =
  [
    {
      id: "772af0ea-44fc-42e5-aec7-214db3fdbdbd",
      title: "Revenue operations maturity in vertical SaaS",
      topic: "RevOps",
      status: "screening_in_progress",
      deadlineAt: "2026-03-13T14:00:00.000Z",
      rateUsd: 450,
      complianceFlags: ["Client is public company", "No MNPI"],
    },
    {
      id: "2bad8b5d-945f-44dc-9f6d-dd46386bb254",
      title: "Pricing organization design for PLG companies",
      topic: "Pricing",
      status: "slot_proposed",
      deadlineAt: "2026-03-12T18:00:00.000Z",
      rateUsd: 500,
      complianceFlags: ["Current employer restrictions apply"],
    },
  ];

const primaryOpportunity = must(demoOpportunities[0], "primaryOpportunity");
const secondaryOpportunity = must(demoOpportunities[1], "secondaryOpportunity");

export const demoOpportunityDetails: Record<
  string,
  components["schemas"]["OpportunityDetail"]
> = {
  "772af0ea-44fc-42e5-aec7-214db3fdbdbd": {
    ...primaryOpportunity,
    description:
      "Investor diligence call on how RevOps teams evolve after Series C, including territory design, forecasting, and deal desk governance.",
    estimatedMinutes: 60,
    screeningQuestions: [
      {
        id: "1334e53c-b3f0-4e0d-90ad-c41bacb8640c",
        prompt: "How recently have you led forecast process redesign?",
        required: true,
      },
      {
        id: "40ba4d04-cd5c-40ef-a5a3-a0e82c9d8d35",
        prompt:
          "Have you managed RevOps for public-company reporting requirements?",
        required: true,
      },
    ],
  },
  "2bad8b5d-945f-44dc-9f6d-dd46386bb254": {
    ...secondaryOpportunity,
    description:
      "Growth equity diligence focused on pricing architecture and monetization tradeoffs for PLG SaaS businesses moving upmarket.",
    estimatedMinutes: 45,
    screeningQuestions: [
      {
        id: "9b6c457f-96e2-449e-9fe4-53cbb98e7f86",
        prompt: "What pricing ownership model did you use most recently?",
        required: true,
      },
    ],
  },
};

export const demoAvailabilityRules: components["schemas"]["AvailabilityRule"][] =
  [
    {
      id: "13c97c6b-cae5-4fe6-88ab-817d7e635124",
      timezone: "Europe/Berlin",
      weekday: 2,
      startTime: "09:00",
      endTime: "12:00",
      leadHours: 24,
      blackoutDates: ["2026-03-18"],
    },
    {
      id: "fe6a0ab5-c4cb-4bb9-b0c6-c452c4e420d2",
      timezone: "Europe/Berlin",
      weekday: 4,
      startTime: "13:00",
      endTime: "17:00",
      leadHours: 24,
      blackoutDates: [],
    },
  ];

export const demoBookings: components["schemas"]["Booking"][] = [
  {
    id: "c4f844d4-35bb-4db8-9f4f-0c1a2480a2fa",
    opportunityId: "2bad8b5d-945f-44dc-9f6d-dd46386bb254",
    expertId: demoExpertProfile.id,
    title: "Pricing organization design for PLG companies",
    startAt: "2026-03-14T15:00:00.000Z",
    endAt: "2026-03-14T15:45:00.000Z",
    status: "scheduled",
    timezone: "Europe/Berlin",
  },
];

const primaryBooking = must(demoBookings[0], "primaryBooking");

export const demoComplianceRules: components["schemas"]["ComplianceRule"][] = [
  {
    id: "2c6147a2-02dd-4eeb-bb9f-03db0b69d0f5",
    name: "Annual expert attestation",
    ruleType: "annual_attestation",
    description:
      "Confirm no confidential or MNPI disclosures and acknowledge terms annually.",
    blocking: true,
  },
  {
    id: "d9b7f173-cd46-4d6d-a9b0-f4183264d9d5",
    name: "Current employer restriction",
    ruleType: "topic_restriction",
    description:
      "Do not discuss pipeline, internal forecasts, or unpublished pricing for the current employer.",
    blocking: true,
  },
];

const primaryRule = must(demoComplianceRules[0], "primaryRule");

export const demoComplianceAttestations: components["schemas"]["ComplianceAttestation"][] =
  [
    {
      id: "828ec734-bfc4-42f7-90ba-2a67c2a1c2b4",
      ruleId: primaryRule.id,
      accepted: true,
      createdAt: "2026-03-01T09:00:00.000Z",
    },
  ];

export const demoPayments: components["schemas"]["PaymentRecord"][] = [
  {
    id: "f5f2c5bf-1ef6-49e8-b505-b2f3ed5a96cf",
    engagementId: primaryBooking.id,
    status: "pending_request",
    amountUsd: 500,
    dueAt: "2026-03-21T00:00:00.000Z",
    payoutLinkIssued: true,
  },
  {
    id: "1cfbaee5-12ab-4774-b607-8179d8d4b78b",
    engagementId: "fbe1b5d7-4d55-4491-9d8a-febcf6427338",
    status: "paid",
    amountUsd: 450,
    dueAt: "2026-02-11T00:00:00.000Z",
    payoutLinkIssued: true,
  },
];

export const demoAuditEvents: components["schemas"]["AuditEvent"][] = [
  {
    id: "23ed8817-11f6-434b-99c6-1ee57a2905f1",
    actorType: "expert",
    actorId: demoExpertProfile.id,
    action: "expert.profile.updated",
    entityType: "expert_profile",
    entityId: demoExpertProfile.id,
    payload: { changedFields: ["headline", "expertiseTags"] },
    createdAt: "2026-03-09T09:05:00.000Z",
  },
  {
    id: "f4e51fe4-b76d-4f52-a299-9a59b6e88d27",
    actorType: "expert",
    actorId: demoExpertProfile.id,
    action: "opportunity.accepted",
    entityType: "opportunity",
    entityId: primaryBooking.opportunityId,
    payload: { status: "slot_proposed" },
    createdAt: "2026-03-10T10:00:00.000Z",
  },
];

export async function fetchExpertProfile() {
  return demoExpertProfile;
}

export async function fetchOpportunities() {
  return demoOpportunities;
}

export async function fetchOpportunityDetail(opportunityId: string) {
  return (
    demoOpportunityDetails[opportunityId] ??
    must(
      demoOpportunityDetails[primaryOpportunity.id],
      "fallbackOpportunityDetail",
    )
  );
}

export async function fetchAvailabilityRules() {
  return demoAvailabilityRules;
}

export async function fetchBookings() {
  return demoBookings;
}

export async function fetchComplianceAttestations() {
  return demoComplianceAttestations;
}

export async function fetchPayments() {
  return demoPayments;
}

export async function fetchAuditEvents() {
  return demoAuditEvents;
}
