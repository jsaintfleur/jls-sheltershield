# ShelterShield

ShelterShield is a census-tract displacement-risk composite index and capital-prioritization product for community-development capital teams.

> See displacement before it happens. Put capital where it holds communities.

The product helps CDFIs, housing agencies, philanthropy, preservation developers, tenant-advocacy organizations, and policy teams decide where to deploy scarce preservation, production, and tenant-protection capital before a neighborhood tips into displacement.

## Five Decisions Supported

1. Which tracts to target this capital cycle.
2. Which currently-affordable tracts face the highest near-term displacement risk.
3. How to rank candidate deals by community-impact-per-dollar.
4. Where tenant-protection funding is more appropriate than bricks-and-mortar capital.
5. How to defend allocations with a reproducible, decomposable score.

## Data-License Flags

- Eviction Lab data is non-commercial and attribution-required.
- HUD datasets are handled under a public-federal-data assumption because no explicit open-data license is posted.
- Data source licenses differ from the repository code license. See `docs/DATA_SOURCES.md` once SS-12 is complete.

## Current Status

SS-01 scaffold is in progress. The application shell, strict TypeScript, Tailwind, ESLint, Prettier, Vitest, Playwright config, and CI skeleton are established before the Python pipeline tickets begin.

## Quickstart

```bash
npm install
npm run dev
```

Run local quality gates:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill the values available to you:

- `CENSUS_API_KEY`
- `HUD_API_KEY`
- `NYC_APP_TOKEN`
- `EVICTION_LAB_DATA_URL`

No secrets should be committed.

## Architecture

- Next.js 15 App Router + strict TypeScript
- Tailwind + Radix/shadcn-compatible UI primitives
- Vitest + React Testing Library
- Playwright configuration for future E2E journeys
- Python/DuckDB/Parquet pipeline begins in SS-02
- Static, Zod-validated artifacts will be published to `public/data` in SS-10
