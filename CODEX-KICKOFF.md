# ShelterShield Kickoff

## Expected Work Package

Copy `project-1-sheltershield-PRD-and-codex-package.md` into this repo root as:

```text
WORKPACKAGE.md
```

## Kickoff Command

```text
Read WORKPACKAGE.md in full — it is the complete PRD + Codex implementation package for ShelterShield,
a census-tract displacement-risk composite index + capital-prioritization product for community-development capital.

Execute tickets SS-01 through SS-16 in order. Start now with SS-01 (repo scaffold, tooling: Next.js 15 + TS strict +
Tailwind + Radix/shadcn, ESLint/Prettier, Vitest/Playwright, GitHub Actions) and SS-02/SS-03 (Python pipeline: ingest
NYC Open Data — Evictions 6z8x-wfk4, PLUTO 64uk-42ks, 2020 Census Tracts geometry 63ge-mke6 — plus the Census ACS 5-year
and HUD CHAS/LIHTC/FMR ingestion scripts that run from a CENSUS_API_KEY / documented download).

Build the composite index exactly as the Analytical Methodology section specifies: four domains (affordability, displacement
pressure, housing distress, market heat), percentile normalization, three weighting variants (equal / theory / PCA), weighted
geometric-mean aggregation to 0–100, and the validation suite (Cronbach's alpha, Monte Carlo weight sensitivity, predictive
back-test, NYC face validity). Export validated GeoJSON/JSON via Zod-checked contracts.

Then build the app: Landing, Executive Overview (national + NYC toggle), Neighborhood/Tract Explorer with score-decomposition
small-multiples + building drill-down, Capital Prioritization / Target List (Preserve/Produce/Protect/Monitor 2×2 + ranked
TanStack table + budget what-if), Methodology & Data, About. MapLibre choropleth hero; ShelterShield teal #0d9488 + the
diverging teal→amber→clay risk ramp per the design system.

Honor the Eviction Lab non-commercial flag and the HUD license-assumption note. After each ticket, run the tests and commit
with the ticket's exact commit message on a feature branch. Ask me before any step that needs GitHub push or Vercel deploy
credentials. Confirm your plan, then begin with SS-01.
```
