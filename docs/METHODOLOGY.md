# ShelterShield — Methodology (v1)

This document is the auditable record of how the Displacement-Risk Composite Index is built. The goal is
that any reviewer can trace a tract's score back to public data and rebuild it with one command.

## 1. Geography & join spine

- Unit of analysis: **NYC 2020 census tract**.
- Join key: `boroct2020` (borough code + 6-digit CT2020), with the full 11-digit `geoid` retained.
- Building-level sources are aggregated to the tract via PLUTO's `bct2020`.
- Eviction records carry a shortened tract code; it is mapped to CT2020 with an empirically validated
  rule that matches **~91.5%** of eviction tract codes. Unmatched records are **excluded and counted**
  (reported in `data/metadata/sources.json`), never silently dropped.

## 2. Domains (raw indicators)

| Domain | Weight | Raw indicator | Source |
|--------|:------:|---------------|--------|
| Displacement pressure | 0.45 | Executed residential evictions per 1,000 residential units | Evictions ÷ PLUTO |
| Market heat | 0.30 | Assessed total value per residential unit | PLUTO |
| Stock vulnerability | 0.25 | Building age (current year − mean year built) | PLUTO |

All three are oriented so that **higher = higher priority for attention**.

## 3. Normalization & aggregation

1. Each raw indicator is converted to a **percentile rank** in `(0, 1]` (ties averaged, values clamped to
   `[0.01, 1.0]` so the geometric mean is well-defined).
2. Domains are combined with a **weighted geometric mean**:
   `composite = exp( Σ wᵢ · ln(pᵢ) / Σ wᵢ )`.
   The geometric mean is deliberate: it penalizes tracts that are extreme on one domain but low on others,
   rather than letting a single domain dominate an additive average.
3. The composite is re-ranked to a **0–100** `risk_score`.

## 4. Prioritization

- **Archetype (2×2):** displacement risk (≥/< median) × residential-stock presence (≥/< median) →
  `Preserve` (high risk, substantial stock), `Protect` (high risk, thinner stock), `Produce` (lower risk,
  capacity), `Monitor`.
- **Preservation Priority Score:** `units_res × (risk_score/100) × p(stock_vulnerability)`, re-ranked 0–100.
  This approximates "at-risk affordable units weighted by risk" for capital allocation.

## 5. Validation (v1 status and roadmap)

Implemented in v1:
- **Output contract validation** (`scripts/validate/validate_outputs.py`): schema, score bounds `[0,100]`,
  valid archetypes/geometry, and cross-consistency between the GeoJSON and the summary.
- **Unit tests** (`tests/unit`): color-scale and formatting logic.

Documented as **proposed** (part of the full model, not shown as results in the v1 UI):
- Internal consistency (Cronbach's alpha across sub-indices).
- **Monte-Carlo weight sensitivity** (OECD/JRC composite-indicator handbook approach) to show how rankings
  move under alternative weights.
- **Predictive back-test**: does an earlier-vintage index predict later eviction-rate movement
  (rank correlation / AUC on a hold-out)?
- Face-validity review against known NYC gentrification corridors.

## 6. Known limitations

- **Executed evictions undercount displacement** — many households leave before a marshal executes a warrant.
- **Assessed value ≠ market value** — NYC assessed values lag and are capped by building class; market heat
  here is directional.
- **Weighting is a modeling choice** — the v1 weights are a documented baseline; equal-weight and
  PCA-derived variants plus sensitivity analysis are the roadmap for defensibility.
- **NYC-only demo** — the method generalizes to any census geography; this deployment showcases NYC.

## 7. Reproducibility

```bash
python3 scripts/build_index.py                 # pull + compute + export
python3 scripts/validate/validate_outputs.py   # gate
```

No manual steps, no hand-edited numbers. Raw pulls are cached under `data/raw/` (git-ignored) and can be
regenerated at any time.
