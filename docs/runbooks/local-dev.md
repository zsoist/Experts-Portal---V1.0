# Local Development Runbook

## Prerequisites

- Node 20+
- pnpm 10+
- Docker

## Steps

1. Copy `.env.example` to `.env`.
2. Start Postgres and Redis with `docker compose up -d`.
3. Install packages with `pnpm install`.
4. Generate OpenAPI types with `pnpm gen:contracts`.
5. Generate Prisma client with `pnpm db:generate`.
6. Start all services with `pnpm dev`.

## Default Ports

- `3000` expert portal
- `3001` ops console
- `4000` API

## Useful Checks

- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

