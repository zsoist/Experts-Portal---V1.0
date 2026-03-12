# Expert Portal — Product Concept Demo

A product concept demo that explains how a unified expert-facing portal could consolidate workflow visibility, compliance gating, scheduling, and payment clarity for Dialectica's expert network.

## What this is

This is an interactive product explanation experience — not a production application. It demonstrates the product logic, workflow design, and strategic rationale behind a Dialectica-style Expert Portal.

All data is seeded. Integrations are emulated. The purpose is comprehension and strategic persuasion, not infrastructure demonstration.

## What the portal centralizes

| Surface | Purpose |
|---------|---------|
| **Opportunity inbox** | Experts see scope, deadlines, screening, compliance flags, and compensation in one view |
| **Profile & recency** | Experts maintain role history and freshness signals without associate intervention |
| **Availability** | Rule-based scheduling with timezone ownership, lead-time constraints, blackout dates |
| **Compliance** | Verification, attestations, and employer restrictions surface before scheduling |
| **Project pipeline** | Clear lifecycle from invitation through payment |
| **Payment status** | Payout visibility reduces support friction after completed engagements |
| **Ops control** | Internal teams retain governance, override paths, and audit visibility |

## Pages

| Route | Description |
|-------|-------------|
| `/` | Product overview — what, why, and how the portal works |
| `/workspace/` | Expert operational cockpit with active opportunities and status |
| `/profile/` | Profile management and expertise recency signals |
| `/availability/` | Rule-based availability and scheduling readiness |
| `/projects/` | Project pipeline with engagement lifecycle and payment status |
| `/ops-demo/` | Internal operations command center (verification, compliance, finance) |
| `/ops-demo/experts/[id]/` | Individual expert record in the ops console |
| `/opportunities/[id]/` | Opportunity detail with screening questions |

## Design direction

- Dark premium enterprise aesthetic aligned with Dialectica's public visual tone
- Crisp typography with Inter
- Confident but restrained copy — no hype, no startup clichés
- Trust-first positioning with explicit decision rationale throughout
- Ops surface visually distinct (purple accents) from expert surface (blue accents)

## What is mocked

- **Authentication**: WorkOS SSO emulated
- **Identity verification**: Persona integration emulated
- **Payment processing**: Provider not connected
- **Calendar sync**: Rule-based only (two-way sync planned for v2)
- **Notifications**: Email/push delivery not connected
- **Real-time updates**: Static seeded data

## Technical notes

- Static HTML + CSS (no build system required)
- Hosted on GitHub Pages
- CSS design system at `assets/style.css`
- All pages are self-contained HTML files
- No JavaScript framework dependencies

## Live demo

[https://zsoist.github.io/Experts-Portal---V1.0/](https://zsoist.github.io/Experts-Portal---V1.0/)
