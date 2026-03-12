# ADR-002: Authentication and RBAC Boundary

## Status
Accepted

## Decision

- Use `WorkOS OIDC` as the hosted identity boundary.
- Validate bearer tokens in the API through JWKS-backed verification.
- Enforce application roles in the API: `expert`, `ops_admin`, `compliance_admin`, `finance_admin`.
- Keep the ops console as a separate web app rather than admin routes inside the expert app.

## Rationale

- The API remains the single authorization boundary regardless of which web app calls it.
- WorkOS keeps SSO/OIDC concerns outside the business domain.
- A separate ops surface reduces accidental role leakage into the expert experience.

