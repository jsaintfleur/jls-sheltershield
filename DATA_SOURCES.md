# Data Sources & Licensing

ShelterShield uses only public data. This document lists every source, its license, and how it is used.
Figures in the product are computed from these sources by `scripts/build_index.py`; none are hand-entered.

## Sources used in the v1 NYC live demo (no API key required)

### 1. NYC Evictions — `6z8x-wfk4`
- **Publisher:** NYC Department of Investigation / NYC Open Data
- **URL:** https://data.cityofnewyork.us/City-Government/Evictions/6z8x-wfk4
- **License:** NYC Open Data — public domain / open use
- **Role:** Displacement-pressure domain (executed residential evictions, aggregated to census tract)
- **Known limits:** *Executed* evictions only — households that leave before a marshal executes a warrant
  are not counted, so this is a floor on displacement. NYC only.

### 2. NYC PLUTO (Primary Land Use Tax Lot Output) — `64uk-42ks`
- **Publisher:** NYC Department of City Planning / NYC Open Data
- **URL:** https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks
- **License:** NYC Open Data — public domain / open use
- **Role:** Residential unit counts (denominator), assessed total value (market-heat domain), year built
  (stock-vulnerability domain), aggregated by `bct2020` tract key.
- **Known limits:** Assessed values lag and are capped differently by building class; a directional market
  proxy, not precise market value.

### 3. NYC 2020 Census Tracts — `63ge-mke6`
- **Publisher:** NYC Department of City Planning / NYC Open Data
- **URL:** https://data.cityofnewyork.us/City-Government/2020-Census-Tracts/63ge-mke6
- **License:** NYC Open Data — public domain / open use
- **Role:** Tract geometry (MultiPolygon) and the `boroct2020` / `geoid` join spine.
- **Known limits:** Eviction `census_tract` codes map to CT2020 at ~91.5% coverage; unmatched records are
  excluded and the count is reported in `data/metadata/sources.json`, never silently dropped.

## Proposed additional domains (ingestion scripts included, NOT shown in the UI as results)

These strengthen the full ShelterShield model. Their ingestion scripts live in `scripts/ingest/` and are
labeled as planned enhancements. Two carry **non-commercial** licenses — flagged here for compliance.

| Source | Publisher | Role | License note |
|--------|-----------|------|--------------|
| Census ACS 5-Year | U.S. Census Bureau | Affordability (rent burden, income, tenure) | Public domain. **Requires a free Census API key.** |
| HUD LIHTC | HUD USER | Affordable-stock presence for the 2×2 | Public federal data (no explicit license posted; treated as public). |
| HUD CHAS / FMR | HUD USER | Cost-burden need; rent standards / cost proxy | Public federal data. |
| NYC HPD Violations | NYC HPD | Housing-distress domain | NYC Open Data (public domain). |
| Eviction Lab | Princeton University | National eviction data (generalizing beyond NYC) | **Non-commercial, attribution required.** Fine for this portfolio with citation; not for commercial use. |

## Attribution

This project and its analyses were produced by Jean-Luc Saint-Fleur for a professional portfolio. NYC Open
Data is used under its open terms. If the Eviction Lab data is enabled, cite: The Eviction Lab at Princeton
University. Nothing in this repository should be construed as investment, legal, or policy advice.
