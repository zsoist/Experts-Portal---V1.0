# ADR-001: Monorepo Stack Choice

## Status
Accepted

## Decision
Use a `pnpm + Turborepo` monorepo with:

- `Next.js App Router` for the expert portal and ops console
- `NestJS` for the API and worker services
- `Prisma + Postgres` for the system-of-record model
- shared UI, config, and contracts packages

## Rationale

- Shared contracts and UI primitives reduce duplication across the two web apps.
- TypeScript across the full stack lowers integration friction for OpenAPI clients and domain enums.
- NestJS provides a clear module boundary for auth, compliance, audit, and background processing.
- Prisma gives a migration path from demo-state repositories to Postgres-backed persistence without redesigning the domain.

