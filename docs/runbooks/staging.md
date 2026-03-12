# Staging Runbook

## Goals

- verify expert and ops builds against a staging API
- validate Persona webhook signature handling and idempotency
- confirm payment-link creation and ops status updates
- confirm audit events are emitted for profile, opportunity, compliance, and payment mutations

## Staging Checklist

1. Apply Terraform changes for ECS, RDS, Redis, SQS, and secrets.
2. Inject WorkOS, Persona, and AWS secrets through the environment store.
3. Run database migrations before promoting API tasks.
4. Smoke test `/api/v1/health`.
5. Validate the expert dashboard and ops console route loads.
6. Send a signed Persona webhook fixture and verify only one event is processed.
7. Execute the opportunity -> compliance -> booking -> payment status flow.
8. Review audit events for each state change.

