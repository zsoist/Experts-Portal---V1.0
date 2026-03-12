# ADR-003: Audit Event Model

## Status
Accepted

## Decision

- Every state-changing action emits an append-only audit event.
- Audit events carry `actorType`, `actorId`, `action`, `entityType`, `entityId`, `payload`, and `createdAt`.
- The event taxonomy is stable and human-readable, for example:
  - `expert.profile.updated`
  - `verification.completed`
  - `screening.submitted`
  - `booking.blocked.compliance`
  - `payment.status.updated`

## Rationale

- Compliance gating and finance workflows need non-repudiation.
- The audit stream doubles as the seed for later analytics and ops reporting.
- Event naming is simple enough for product, compliance, and engineering to align on without a translation layer.

