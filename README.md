# Expert Portal MVP

Monorepo starter for an expert-facing portal and a separate ops console. The MVP centers on expert self-service for profile upkeep, opportunity screening, availability rules, compliance gating, project visibility, and payment status, while keeping high-risk identity and payout flows conservative.

The repository now includes a GitHub Pages-ready static demo aimed at product leadership conversations. The root route is an executive showcase, with clickable expert and ops surfaces behind it.

## Demo Narrative

- `/` is the executive showcase for a CPO conversation.
- `/workspace` is the expert-facing walkthrough.
- `/ops-demo` is the internal ops, compliance, and finance control room.
- `/ops-demo/experts/4dd4d84f-33fd-476f-b814-5cc6d55f32a9` is the detailed expert record view.

## Stack

- `pnpm + Turborepo`
- `Next.js App Router + TypeScript` for `apps/expert-portal-web` and `apps/ops-console-web`
- `NestJS` for `services/api` and `services/worker`
- `Prisma + Postgres` schema in `services/api/prisma/schema.prisma`
- `Redis + SQS + AWS` baseline captured in `infra/terraform`
- `OpenAPI 3.1` contract in `packages/contracts/openapi/openapi.yaml`

## Monorepo Layout

```text
apps/
  expert-portal-web/
  ops-console-web/
services/
  api/
  worker/
packages/
  config/
  contracts/
  ui/
docs/
  adr/
  runbooks/
infra/
  terraform/
tests/
  e2e/
```

## Implemented v1 Surface

- Expert dashboard with profile freshness, opportunity inbox, project pipeline, and payment status
- Profile, availability, project, and opportunity response routes in the expert app
- Separate ops console for verification, compliance, payment status, and audit visibility
- REST API under `/api/v1` for expert and ops flows
- In-memory demo store seeded from shared contracts so the repo is immediately runnable
- Prisma schema, audit taxonomy, Persona webhook worker skeleton, and domain tests

## Quick Start

1. Copy `.env.example` to `.env`.
2. Start local dependencies:

   ```bash
   docker compose up -d
   ```

3. Install dependencies and generate artifacts:

   ```bash
   pnpm install
   pnpm gen:contracts
   pnpm db:generate
   ```

4. Start the workspace:

   ```bash
   pnpm dev
   ```

5. Open:
   - Executive showcase: `http://localhost:3000`
   - Expert workspace: `http://localhost:3000/workspace`
   - Ops demo: `http://localhost:3000/ops-demo`
   - Ops console: `http://localhost:3001`
   - API health: `http://localhost:4000/api/v1/health`

## GitHub Pages Demo

The expert app is configured for static export and deployment through GitHub Pages. The workflow lives at `.github/workflows/pages.yml` and publishes the exported Next.js app from `apps/expert-portal-web/out`.

Expected production URL after the workflow runs on `main`:

```text
https://zsoist.github.io/Experts-Portal---V1.0/
```

The Pages build applies the repository name as `basePath`, so the static artifact matches the final hosted URL shape.

## Core Scripts

- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm gen:contracts`
- `pnpm db:generate`
- `pnpm db:migrate:dev`

## Contracts and APIs

- Contract source: [`packages/contracts/openapi/openapi.yaml`](packages/contracts/openapi/openapi.yaml)
- Generated types: [`packages/contracts/src/generated.ts`](packages/contracts/src/generated.ts)
- Shared demo data and typed fetchers: [`packages/contracts/src/mock-data.ts`](packages/contracts/src/mock-data.ts)

Primary expert endpoints:

- `GET/PATCH /api/v1/experts/me`
- `GET /api/v1/experts/me/opportunities`
- `GET /api/v1/opportunities/:id`
- `POST /api/v1/opportunities/:id/accept`
- `POST /api/v1/opportunities/:id/decline`
- `POST /api/v1/opportunities/:id/screening-answers`
- `GET/POST/PATCH /api/v1/availability-rules`
- `GET /api/v1/bookings`
- `POST /api/v1/bookings/:id/ics`
- `GET/POST /api/v1/compliance/attestations`
- `GET /api/v1/payments`
- `POST /api/v1/payments/:engagementId/external-link`

Primary ops endpoints:

- `POST/PATCH /api/v1/ops/opportunities`
- `POST /api/v1/ops/opportunities/:id/candidates`
- `PATCH /api/v1/ops/verification/:expertId`
- `POST/PATCH /api/v1/ops/compliance-rules`
- `PATCH /api/v1/ops/payments/:paymentId/status`
- `GET /api/v1/ops/audit-events`

## Delivery Notes

- Identity verification is metadata-light and assumes Persona remains the source of truth for sensitive artifacts.
- Payments are intentionally modeled as internal status plus an external secure link rather than embedded provider onboarding.
- The current API services are wired against a shared in-memory store to keep local bootstrapping simple. The Prisma schema and module boundaries are already in place for Postgres-backed repositories.

## Documentation

- ADRs: [`docs/adr`](docs/adr)
- Threat model: [`docs/threat-model.md`](docs/threat-model.md)
- Runbooks: [`docs/runbooks`](docs/runbooks)
- Terraform baseline: [`infra/terraform`](infra/terraform)
