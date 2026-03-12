# ADR-004: Payment Boundary for v1

## Status
Accepted

## Decision

- v1 shows payment history and internal statuses in the portal.
- Payout setup and payment submission happen through a secure external link owned by ops or finance.
- The product does not embed provider onboarding or process payout webhooks in v1.

## Rationale

- The MVP still removes support burden by making status visible.
- High-risk payout logic stays outside the product until provider contracts, regional coverage, and compliance policy are locked.
- The `PaymentRecord` model and ops status controls preserve a clean path to a provider adapter in v2.

