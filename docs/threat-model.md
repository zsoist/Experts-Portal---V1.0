# Threat Model

## Assets

- Expert identity status and verification references
- Expert profile and recency data
- Opportunity, screening, booking, and payment status records
- Audit events and admin actions
- WorkOS, Persona, and AWS credentials

## Trust Boundaries

- Expert web app to API
- Ops console to API
- API to WorkOS JWKS
- API and worker to AWS services
- Worker to Persona webhook payloads
- API to Postgres and Redis
- External payment link flow to third-party payout surface

## Primary Threats

- RBAC bypass between expert and ops routes
- forged or replayed Persona webhook events
- booking creation without completed verification or required attestations
- leakage of sensitive identity artifacts into application storage
- payment status manipulation by non-finance roles
- audit log tampering or silent deletion
- phishing or scam confusion if portal links do not clearly anchor trust

## Controls in This Repo

- role guard and bearer-token verification at the API boundary
- explicit compliance gate evaluation before booking export
- Persona signature verification and event idempotency logic in the worker
- append-only audit service with stable taxonomy
- separate expert and ops apps with stricter ops-only route grouping
- metadata-light identity design: only Persona reference/outcome data is modeled

## Required Follow-up Before Production

- replace in-memory repositories with Postgres-backed repositories
- add CSRF, rate limiting, and production session policies to the web tier
- wire real WorkOS token claims and org-role mapping
- implement webhook persistence and dead-letter queue handling
- define log retention, redaction, and ops access policy
- add secret rotation and least-privilege IAM validation

