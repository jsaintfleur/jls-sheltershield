# ShelterShield — Product Requirements Document & Codex Implementation Package

**Portfolio of Jean-Luc Saint-Fleur — Product Strategist + Analytics Lead**
**Project 1 of 5 · Flagship Package · Sector: Government / Housing / Community Development**

> *"See displacement before it happens. Put capital where it holds communities."*

---

## Reading guide

This document is the complete, buildable specification for ShelterShield. It is organized in five parts:

1. **Product one-pager** — the executive framing.
2. **Full PRD** — 22 numbered sections, the authoritative product contract.
3. **Codex implementation package** — repository, architecture, and build plan for an autonomous coding agent.
4. **Implementation tickets** — 16 sequenced tickets (SS-01 … SS-16), start-to-deploy.
5. **Go-to-market** — recruiter description, resume bullets, launch post.

**A note on integrity that governs the entire document.** Everything below separates *calculated findings* (things the pipeline will compute from public data) from *proposed future capabilities* (things the design intends but that are not yet built or measured). No user counts, adoption numbers, dollar impact, or testimonials are asserted anywhere, because none exist yet — this is a portfolio build on public data. Two licensing flags are carried throughout and must survive to production: **Eviction Lab data is non-commercial, attribution-required**, and **HUD datasets carry no explicitly posted open-data license, so we operate under the public-federal-data assumption and state it plainly** rather than claiming a license we cannot cite.

---

# PART 1 — PRODUCT ONE-PAGER

**Product name:** ShelterShield

**Tagline:** *See displacement before it happens. Put capital where it holds communities.*

**Sector:** Government / Housing / Community Development — specifically the community-development finance and housing-preservation ecosystem.

**Target employers.** CDFIs and community lenders (LISC, Enterprise Community Partners, Low Income Investment Fund, Reinvestment Fund, NCRC), CDFI Fund grantees, municipal and state housing finance agencies (NYC HPD, NYC HDC, state HFAs), housing research shops (Furman Center-type academic/policy centers), housing philanthropy (Ford Foundation, Robin Hood, community foundations), and mission-driven lending fintechs.

**Target users.** CDFI capital-deployment and underwriting teams; city housing-agency policy and planning staff; community-development lenders; philanthropy program officers; preservation developers; tenant-advocacy and legal-aid organizations; elected-official policy shops.

**Business problem.** Community-development capital is scarce and lumpy, and the hardest question a deployment team faces is *where* to place preservation versus production dollars **before** a neighborhood tips into displacement. Move too early and subsidy is wasted on a market that would have held anyway; move too late and affordable stock — and the community it houses — is irreversibly lost. Descriptive dashboards narrate what already happened. Underwriters and program officers need something forward-looking, defensible, and auditable: a reproducible way to rank census tracts by near-term displacement risk and by community-impact-per-dollar, that survives an investment-committee cross-examination.

**Five decisions ShelterShield supports.**
1. **Target this cycle** — which tracts to prioritize for acquisition/preservation versus new production.
2. **Early warning** — which currently-affordable tracts face the highest near-term displacement risk.
3. **Pipeline ranking** — how to rank candidate deals by community-impact-per-dollar.
4. **Instrument choice** — where market conditions justify anti-displacement / tenant-protection funding versus bricks-and-mortar capital projects.
5. **Defensible allocation** — how to justify allocations to a board or investment committee with a reproducible, documented score.

**Value proposition.** ShelterShield converts eight public datasets into a single validated, transparent, census-tract **Displacement-Risk Composite Index** and pairs it with a **prioritization engine** that sorts every tract into a Preserve / Produce / Protect / Monitor archetype and ranks deals by impact-per-dollar. Every score decomposes back to its inputs; every weight choice is shown with a sensitivity analysis; every allocation is reproducible from raw data. It is an early-warning and capital-allocation instrument, not a rear-view dashboard.

**Measurable success framework.** Because there are no users yet, success is defined against *capability and rigor* targets, not adoption:
- **Analytical validity:** composite index passes internal-consistency (Cronbach's alpha reported), sensitivity (Monte Carlo over weight schemes), and a predictive back-test (earlier-vintage index ranks tracts by later eviction/rent-burden movement, rank-correlation + AUC on a holdout).
- **Reproducibility:** a cold-checkout of the repo rebuilds every published artifact with one command.
- **Transparency:** 100% of displayed scores decompose to sub-index and indicator contributions in the UI.
- **Engineering quality:** Lighthouse performance and accessibility ≥ 90, axe with zero serious violations, LCP < 2.5s, CI green on lint/typecheck/unit/data-validation/e2e.
- **Coverage:** national tract method with a fully worked NYC deep-dive including building-level (BBL) drill-down.

**Distinct visual identity.** Civic-serious, not corporate-flashy. Accent **teal `#0d9488`**; a colorblind-safe diverging risk ramp running **calm-teal → amber → clay-red**; a slate-and-ivory base for a governmental, trustworthy tone; humanist sans typography (**Inter / Public Sans**). The interface is **choropleth-first**, anchored by a national/NYC map hero, and every risk score is accompanied by a **score-decomposition small-multiples panel** so no number is ever a black box.

**Why this belongs in JLS's portfolio.** This is the flagship because it is where Jean-Luc's real community-development domain expertise — the LISC/NYCHA world of preservation-versus-production tradeoffs, subsidy timing, and displacement literacy — is visible in every design decision, while using **only public data** (no confidential employer or partner information). The preservation/production/protection framing, the deliberate choice to penalize domain compensation with a geometric mean, and the insistence on a back-test rather than a pretty map are the kinds of judgment calls that distinguish a practitioner who has actually sat in an investment committee from a generic data-app builder. It signals: *this person understands the decision, not just the dataset.*

---

# PART 2 — FULL PRODUCT REQUIREMENTS DOCUMENT

## 1. Product name & tagline

**ShelterShield.** *See displacement before it happens. Put capital where it holds communities.*

ShelterShield is a decision-support instrument for community-development capital allocation. It answers a single forward-looking question — *where is affordable housing most at risk of loss, and where does a dollar of preservation or production capital protect the most community?* — with a validated, auditable, census-tract composite index and a prioritization engine.

## 2. Industry & target employers

**Industry.** Community-development finance and housing preservation, sitting at the intersection of government housing policy, mission-driven lending, and place-based philanthropy.

**Target employers.** LISC; Enterprise Community Partners; Low Income Investment Fund (LIIF); Reinvestment Fund; National Community Reinvestment Coalition (NCRC); CDFI Fund grantees; NYC HPD and NYC HDC; state housing finance agencies; Furman Center-type research shops; housing philanthropy (Ford Foundation, Robin Hood, community foundations); mission-lending fintechs.

These organizations share a common operating reality: a fixed pool of below-market capital, a mandate to protect low-income households in place, and an investment or grant committee that demands defensible reasoning. ShelterShield is built to their workflow.

## 3. Target users

| User | What they need from ShelterShield |
|---|---|
| CDFI capital-deployment / underwriting teams | A ranked, defensible tract and deal pipeline; impact-per-dollar sorting; committee-ready score provenance. |
| City housing-agency policy / planning staff | Early warning on currently-affordable tracts; instrument choice (capital vs. tenant protection) by market condition. |
| Community-development lenders | Where preservation acquisition beats new production this cycle. |
| Philanthropy program officers | Where anti-displacement grants have the highest marginal community value. |
| Preservation developers | Which at-risk affordable tracts and buildings to source acquisitions in. |
| Tenant-advocacy / legal-aid orgs | Eviction-pressure and code-distress hotspots for outreach and organizing. |
| Elected-official policy shops | A neutral, reproducible evidence base for district-level housing decisions. |

## 4. Business problem

Community-development capital is **scarce and lumpy**. A CDFI or housing agency deploys a finite pool across a cycle, and the marginal dollar has a real opportunity cost. The central allocation problem is *timing against a moving market*:

- **Too early** (deploying preservation subsidy into a stable, affordable market that would have held on its own) wastes scarce capital that another neighborhood needed.
- **Too late** (arriving after a tract has already tipped — rents have run, affordable buildings have traded to market-rate owners, tenants have been displaced) means the loss is largely irreversible; you cannot un-gentrify a block.

Existing tools are **descriptive and backward-looking**: dashboards that map what already happened. The people deploying capital need something different — a **forward-looking, defensible, auditable** prioritization of tracts and deals that (a) flags neighborhoods approaching the tipping point while intervention is still cheap and effective, (b) distinguishes preservation opportunities from production opportunities from protection needs, and (c) produces a score they can defend line-by-line to a board. ShelterShield is that instrument.

## 5. User needs

- **Forward-looking risk, not history.** An early-warning signal on currently-affordable tracts, before displacement is locked in.
- **Defensibility.** Every score must decompose to its inputs and its weighting choices; nothing opaque survives an investment-committee challenge.
- **Reproducibility.** The same raw data must always produce the same score; an auditor must be able to rebuild it.
- **Actionability.** Risk must connect to a decision — Preserve / Produce / Protect / Monitor — not just a color on a map.
- **Impact discipline.** A way to rank a pipeline by community-impact-per-dollar under a real budget constraint.
- **Domain honesty.** Respect for the preservation-vs-production distinction, the limits of the underlying data, and the difference between what is measured and what is proposed.
- **Geographic drill-down.** National comparability with the ability to drop into a tract and, in NYC, an individual building (BBL).

## 6. Primary decisions supported

1. **Cycle targeting:** acquisition/preservation vs. new production, by tract.
2. **Early warning:** highest near-term displacement risk among currently-affordable tracts.
3. **Pipeline ranking:** candidate deals ordered by community-impact-per-dollar.
4. **Instrument choice:** anti-displacement/tenant-protection funding vs. capital projects, by market condition.
5. **Board defense:** a reproducible, decomposable score to justify allocations.

## 7. Dataset inventory

All eight sources are public. **Two licensing flags are carried through the whole build:** Eviction Lab is **non-commercial, attribution-required**; HUD datasets carry **no explicitly posted open-data license**, so we operate under a **public-federal-data assumption** and state it as an assumption rather than a claimed license.

| # | Dataset | Source / URL | License (or assumption) | Cadence | Geography | Time coverage | Key fields | Limitations & data-quality risks | Why it fits |
|---|---|---|---|---|---|---|---|---|---|
| 1 | **HUD CHAS** (Comprehensive Housing Affordability Strategy) | HUD USER PD&R — huduser.gov/portal/datasets/cp.html · API: huduser.gov/portal/dataset/chas-api.html | Public federal data; **no explicit license posted — assumption stated** | Annual (tabulated from ACS 5-yr) | State / county / place / **census tract** / some block group | Through 2018–2022 (latest released Dec 2025) | HUD income buckets (30/50/80% AMI), cost burden (>30%, >50%), tenure, household type, units-vs-need | 5-yr smoothing lag; tract-level margins of error; custom HUD income definitions differ from raw ACS | Defines the *affordable stock and need* denominator; anchors "currently-affordable" classification |
| 2 | **NYC Evictions** | NYC DoI via NYC Open Data (Socrata) — data.cityofnewyork.us/City-Government/Evictions/6z8x-wfk4 | **NYC Open Data — public domain** | Refreshed regularly | Geocoded lat/long, **BBL**, census tract, community district, BIN | 2017–present | Executed eviction events, address, marshal, geo keys | **Executed evictions only — undercount total displacement** (many households leave before execution); NYC-only | Direct displacement-pressure signal for the NYC deep-dive |
| 3 | **Eviction Lab** (Princeton) | data-downloads.evictionlab.org · evictionlab.org | **Non-commercial, attribution-required** (custom aggregates via data request) — **FLAG** | Periodic; ETS recent for select metros | Tract / county / city | National panel 2000–2018; ETS recent for select metros | Eviction filings & judgments, rates | Non-commercial license constrains use; coverage/vintage varies by place | National eviction-pressure backbone outside NYC; back-test target |
| 4 | **NYC HPD Housing Maintenance Code Violations** | NYC Open Data — data.cityofnewyork.us/Housing-Development/Housing-Maintenance-Code-Violations/wvxf-dwi5 | **NYC Open Data — public domain** | Daily | BBL / BIN / borough → tract | Multi-year to present | Violation class A/B/C, dates, status | Reflects complaints/inspection activity, **not total physical conditions**; millions of rows (filter via Socrata API) | Housing-distress signal; slumlord/disinvestment pattern detection |
| 5 | **NYC PLUTO / MapPLUTO** | NYC DCP — nyc.gov/site/planning/data-maps/open-data/dwn-pluto-mappluto.page · tabular: data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks | **NYC Open Data — public domain** | Several releases/yr | **BBL** key + geometry | Current + historical releases | Land use, residential/total units, year built, assessed value, lot area, owner | **Assessed values lag market**; large geometry (~hundreds of MB) | Building stock, unit counts, and land-use context for BBL→tract rollups |
| 6 | **HUD LIHTC** (property-level) | HUD USER — huduser.gov/portal/datasets/lihtc/property.html | Public federal data; **no explicit license — assumption stated** | ~Annual | National, lat/long → tract | Multi-decade | Units, low-income units, placed-in-service year, credit type | **No reliable affordability-expiration date**; some geocode gaps | Locates existing subsidized affordable stock (the thing worth preserving) |
| 7 | **HUD Fair Market Rents / SAFMR** | huduser.gov/portal/datasets/fmr.html · SAFMR: /fmr/smallarea · API: /dataset/fmr-api.html | Public federal data; **no explicit license — assumption stated** | Annual (FY2026 available) | Metro/county FMR + **ZIP-level SAFMR** | FY series incl. FY2026 | FMR by bedroom, SAFMR by ZIP | Needs **ZIP→tract crosswalk** (HUD USPS crosswalk); FMR is administrative, not observed market | Cost proxy for affordability gap and impact-per-dollar denominator |
| 8 | **Census ACS 5-Year** | census.gov/data/developers/data-sets/acs-5year.html · api.census.gov/data/2023/acs/acs5 | **Public domain** | Annual (5-yr) | National → tract / block group | 2009–2024 (5-yr) | Median rent, rent burden, income, tenure, race/ethnicity, recent-mover mobility, home value | Tract MOE; **2010 vs 2020 tract boundary changes** | Affordability, rent-growth, and market-heat backbone nationally |

**Optional extension — HMDA** (ffiec.cfpb.gov/data-browser). If added, it is framed strictly **place-based** (tract-level lending activity as a market-heat signal), never consumer-credit, to remain distinct from the separate PulseCredit portfolio project.

**Join spine.** Every source resolves to the **11-digit census-tract GEOID**. NYC building data (Evictions, HPD, PLUTO) joins on **BBL**, then aggregates to tract. ZIP-level FMR/SAFMR joins via the **HUD ZIP↔tract crosswalk**. All series are normalized to **2020 tract boundaries**; pre-2020 vintages are relationship-file crosswalked and documented.

## 8. Data model

A conventional raw → staging → marts lakehouse pattern, executed locally with DuckDB + Parquet (no server database in v1).

**Layers.**
- **Raw (`data/raw/`)** — immutable pulls exactly as retrieved: Census API JSON, HUD CHAS/FMR/LIHTC downloads and API responses, NYC Socrata extracts, Eviction Lab bulk files, PLUTO tabular + geometry. Never edited; each carries a fetch manifest (URL, params, timestamp, row count, checksum).
- **Staging (`data/processed/staging/`)** — typed, cleaned, deduplicated, one table per source at its native grain, boundary-vintage tagged. BBL-keyed NYC tables live here before rollup.
- **Marts (`data/processed/marts/`)** — analysis-ready, **all keyed to 2020 tract GEOID**:
  - `mart_tract_indicators` — one row per tract per vintage, every normalized indicator.
  - `mart_tract_index` — composite score, four sub-index scores, per-domain contributions, all weight-scheme variants.
  - `mart_tract_priority` — archetype assignment, impact-per-dollar, rank within archetype, at-risk affordable units.
  - `mart_nyc_bbl` — building-level NYC drill-down, keyed BBL, with its parent tract GEOID.
  - `mart_geo` — simplified tract geometry (GeoJSON/vector tiles) joined to index for the map.

**Grain.**
- National marts: **one row per census tract per data vintage.**
- NYC drill-down: **one row per BBL**, with a `tract_geoid` foreign key.

**The tract GEOID spine.** The 11-digit GEOID is the single primary key across national marts. All indicator, index, and priority tables share it, guaranteeing lossless joins and one canonical unit of analysis.

**BBL→tract aggregation.** NYC Evictions, HPD violations, and PLUTO are BBL-grained. Each BBL is assigned its tract via PLUTO's authoritative BBL→tract mapping (with a point-in-polygon fallback for gaps). Building events are then aggregated to tract as rates and densities (e.g., executed evictions per 1,000 renter households; class-C violations per 1,000 residential units) so NYC signals are comparable to national tract indicators.

**Crosswalks (`crosswalks/`).**
- HUD **ZIP↔tract** crosswalk for FMR/SAFMR (residential-ratio weighted).
- **2010↔2020 tract** relationship crosswalk (population/housing-unit weighted) for pre-2020 series.
- PLUTO **BBL↔tract** mapping for NYC rollups.

**Boundary-vintage normalization.** 2020 tract boundaries are the canonical geography. Any pre-2020 series (older ACS vintages, Eviction Lab historical panel) is crosswalked forward with documented apportionment weights; every mart row carries a `boundary_vintage` and `crosswalk_method` field so normalization is auditable, never silent.

## 9. KPI definitions — KPI dictionary

Each KPI below carries: name, business definition, formula, data source, grain, time period, inclusion rules, exclusion rules, limitations, display format, and interpretation guidance. All are **calculated** by the pipeline unless explicitly marked *proposed*.

### 9.1 Displacement-Risk Composite Score
- **Business definition:** A 0–100 index of a tract's near-term risk that currently-affordable housing and low-income residents are displaced.
- **Formula:** Weighted **geometric mean** of four sub-index scores (Affordability stress, Displacement pressure, Housing distress, Market heat), each 0–100, rescaled to 0–100. Geometric mean chosen so a low score in one domain cannot be fully compensated by a high score in another.
- **Data source:** All eight datasets (via `mart_tract_index`).
- **Grain:** Tract (GEOID) per vintage.
- **Time period:** Latest available aligned vintage; back-test uses earlier vintages.
- **Inclusion rules:** Tracts with ≥ minimum renter-occupied households and non-null in ≥3 of 4 domains.
- **Exclusion rules:** Non-residential/zero-population tracts; tracts failing the minimum-coverage rule (shown as "insufficient data," never as low risk).
- **Limitations:** Inherits ACS/CHAS MOE and 5-yr lag; weighting is a modeling choice (mitigated by sensitivity analysis).
- **Display format:** 0–100 integer, on the diverging teal→amber→clay-red ramp, with a decomposition panel.
- **Interpretation:** Higher = greater near-term displacement risk. Read *with* the affordable-stock axis before acting — high risk + high affordable stock is a Preserve signal; high risk + low stock is a Protect signal.

### 9.2 Rent-Burden Rate
- **Business definition:** Share of renter households paying more than 30% of income on gross rent (severe: >50%).
- **Formula:** `cost_burdened_renter_households / total_renter_households` (30% and 50% thresholds reported separately).
- **Data source:** HUD CHAS (primary), ACS 5-Year (cross-check).
- **Grain:** Tract per vintage. **Time period:** Latest CHAS (through 2018–2022).
- **Inclusion:** Renter-occupied households with computable rent-to-income. **Exclusion:** Zero/negative-income and no-cash-rent households per CHAS convention.
- **Limitations:** 5-yr smoothing; CHAS custom income definitions.
- **Display:** Percentage, one decimal. **Interpretation:** Higher = deeper affordability stress; a core input to the Affordability sub-index.

### 9.3 Eviction Pressure Index
- **Business definition:** Standardized measure of displacement pressure from eviction activity.
- **Formula (NYC):** Executed evictions per 1,000 renter households, percentile-ranked within reference geography. **Formula (national):** Eviction filing/judgment rate from Eviction Lab, percentile-ranked. Combined into a single directional sub-signal.
- **Data source:** NYC Evictions (NYC); Eviction Lab (national) — **non-commercial license flag applies**.
- **Grain:** Tract per vintage. **Time period:** NYC 2017–present; Eviction Lab through 2018 (panel) / ETS recent where available.
- **Inclusion:** Residential eviction events. **Exclusion:** Commercial/non-residential; duplicate filings collapsed to events.
- **Limitations:** **Executed evictions undercount total displacement** (pre-execution moves invisible); NYC vs. national data are different instruments and are labeled as such.
- **Display:** 0–100 percentile. **Interpretation:** Higher = greater realized displacement pressure; treat as a floor, not a ceiling, on actual displacement.

### 9.4 Preservation Priority Score
- **Business definition:** How much preservation capital deployed to a tract is expected to protect community per dollar.
- **Formula:** `(at_risk_affordable_units × displacement_risk_score) / fmr_based_cost_proxy` — a documented impact-per-dollar **heuristic**, then rank-normalized within the Preserve archetype.
- **Data source:** LIHTC + CHAS (affordable units), composite index (risk), FMR/SAFMR (cost proxy).
- **Grain:** Tract (and candidate deal, *proposed*, when a deal pipeline is supplied). **Time period:** Latest aligned vintage.
- **Inclusion:** Tracts classified with existing affordable stock at risk. **Exclusion:** Tracts with no identifiable affordable stock (routed to Produce/Monitor instead).
- **Limitations:** FMR is administrative, not observed market cost; LIHTC lacks reliable expiration dates, so "at-risk" affordable units are an estimate, not a certainty.
- **Display:** Rank + normalized 0–100 within archetype. **Interpretation:** Higher = more community protected per preservation dollar; a prioritization aid, not an appraisal.

### 9.5 Market-Heat Sub-Index
- **Business definition:** Degree of upward market pressure signaling gentrification/appreciation risk.
- **Formula:** Directionality-aligned composite of home-value and rent appreciation (ACS vintages) and development activity (PLUTO units/land-use change; permits where available), normalized 0–100.
- **Data source:** ACS 5-Year, PLUTO.
- **Grain:** Tract per vintage. **Time period:** Multi-vintage change windows.
- **Inclusion:** Tracts with computable appreciation over the window. **Exclusion:** Tracts lacking two comparable vintages (flagged, not zeroed).
- **Limitations:** ACS MOE on change estimates; PLUTO assessed values lag the market.
- **Display:** 0–100. **Interpretation:** Higher = hotter market; high heat + affordable stock is the classic pre-displacement tipping signal.

### 9.6 At-Risk Affordable Units
- **Business definition:** Estimated count of affordable/subsidized units in a tract exposed to near-term displacement risk.
- **Formula:** Affordable units (LIHTC low-income units + CHAS-derived affordable stock, de-duplicated) restricted to tracts above a risk threshold.
- **Data source:** HUD LIHTC, HUD CHAS.
- **Grain:** Tract. **Time period:** Latest LIHTC + CHAS.
- **Inclusion:** Identifiable income-restricted or affordable units in above-threshold-risk tracts. **Exclusion:** Market-rate units; units in below-threshold tracts.
- **Limitations:** LIHTC expiration is unknown, so exposure is an estimate; CHAS and LIHTC overlap is de-duplicated heuristically.
- **Display:** Integer count with an uncertainty note. **Interpretation:** The stakes term — how much affordable stock a preservation intervention could protect.

## 10. Analytical methodology

The analytical core is a **validated composite index**, a **prioritization/recommendation engine**, and a **geospatial layer**. All index computation happens in the Python pipeline and is precomputed; the app consumes clean artifacts.

### 10.1 Composite Displacement-Risk Index

**Four domains, aligned to the decision.**
1. **Affordability stress** — cost-burden %, rent-to-income, FMR-vs-ACS-rent gap.
2. **Displacement pressure** — eviction filing/execution rate, rent growth.
3. **Housing distress** — HPD violation density, code-complaint rate.
4. **Market heat** — home-value/rent appreciation, permit/PLUTO development activity.

**Construction steps (OECD/JRC composite-indicator handbook discipline).**
1. **Indicator selection** — theory-driven, one decision per indicator, documented rationale and directionality.
2. **Normalization** — percentile-rank or z-score within a reference geography (national, or metro for the NYC deep-dive), with **directionality alignment** so every indicator points "more risk = higher." Both normalization methods computed; choice documented.
3. **Weighting — three schemes, all reported:**
   - **Equal-weight baseline** (transparent default).
   - **Expert/theory weights** (domain judgment reflecting preservation practice).
   - **Data-driven weights** via PCA / factor analysis.
   The published default is documented and justified; the others are available in the sensitivity panel so no single weighting is presented as truth.
4. **Aggregation** — **weighted geometric mean** across sub-indices, deliberately penalizing compensation between domains (a tract cannot hide severe distress behind a calm market), rescaled to 0–100.

**Validation (the part that separates this from a dashboard).**
- **Internal consistency** — **Cronbach's alpha** across the sub-indices, reported.
- **Sensitivity analysis** — **Monte Carlo** over weight schemes (sampling plausible weight vectors), reporting how tract ranks move; stability of the top-risk set is the headline. Follows the OECD/JRC uncertainty-and-sensitivity approach.
- **Predictive back-test** — does an earlier-vintage index predict *later* eviction-rate / rent-burden movement? Reported as **rank correlation** and **AUC on a holdout**, so the index earns the word "forward-looking."
- **Face validity** — cross-check against known gentrifying NYC tracts to confirm the index flags what practitioners already recognize.

*Calculated vs. proposed boundary:* the index, all three weight schemes, Cronbach's alpha, the Monte Carlo sensitivity, and the back-test are **calculated** deliverables. Real-time refresh and additional-metro back-tests are **proposed future** capabilities.

### 10.2 Prioritization / recommendation engine

- **2×2 archetype** — **displacement risk (index)** × **current affordable-stock presence (LIHTC/CHAS)**:
  - High risk × high stock → **Preserve** (acquire/recapitalize before loss).
  - High risk × low stock → **Protect** (tenant protection / anti-displacement funding).
  - Low risk × low stock → **Produce** (new production opportunity).
  - Low risk × high stock → **Monitor** (stable; watch).
- **Rank within archetype** by the impact-per-dollar heuristic: `at_risk_affordable_units × risk_score ÷ fmr_based_cost_proxy`.
- **Constrained optimization (stretch):** a **knapsack** "maximize protected affordable units under a budget" view, exposed as an optional what-if.

### 10.3 Geospatial analysis

- **Tract-GEOID choropleths** on the diverging risk ramp (national + NYC).
- **Hot-spot analysis** — **Getis-Ord Gi\*** and **LISA** clusters (via `libpysal` + `esda`) to surface *contiguous risk corridors*, not just isolated tracts — the scale at which displacement actually moves.
- **NYC BBL→tract building drill-down** for on-the-ground validation and deal sourcing.

Method is **national**; the **NYC deep-dive** is the fully worked showcase (adds Evictions, HPD, PLUTO, and building drill-down).

## 11. Planned pages & navigation

1. **Landing** — concept, tagline, the five decisions, method credibility, license flags, primary CTA into the Executive Overview.
2. **Executive Overview** — national choropleth hero with a **national ↔ NYC toggle**, KPI cards, top-risk and top-priority tract lists.
3. **Neighborhood / Tract Explorer** — search/select a tract; **score-decomposition small multiples**; sub-index breakdown; **NYC building (BBL) drill-down**.
4. **Capital Prioritization / Target List** — **2×2 archetype quadrant**, ranked target table (TanStack Table), and the **budget what-if** (knapsack, stretch).
5. **Methodology & Data** — full index construction, validation results, dataset inventory, **license flags**, crosswalk documentation.
6. **About** — project intent, portfolio context, JLS domain positioning, honest calculated-vs-proposed boundary.

**Navigation:** persistent top nav (Overview · Explorer · Prioritization · Methodology · About), with the map view as the app's center of gravity.

## 12. Required visualizations

- **National/NYC choropleth hero** — composite score on the diverging ramp.
- **Bivariate map** — risk × affordable-stock, encoding the archetype directly.
- **Score-decomposition small multiples** — per-domain sub-index contributions for a selected tract.
- **Gi\*/LISA hotspot map** — statistically significant risk corridors.
- **2×2 archetype quadrant** — Preserve / Produce / Protect / Monitor scatter.
- **Ranked target-list table** — sortable/filterable, impact-per-dollar and at-risk units.
- **Sensitivity / weights panel** — how ranks shift across weight schemes (Monte Carlo summary).
- **KPI cards** — the six dictionary KPIs, with interpretation tooltips.

## 13. Filtering & interaction behavior

- **Global filters:** geography scope (national / metro / NYC), archetype, risk band, affordable-stock band, data vintage.
- **Map ↔ table ↔ cards are linked:** selecting a tract on the map filters the table and populates the decomposition panel; selecting a table row highlights the map.
- **Weight-scheme switcher:** equal / expert / PCA, updating scores live from precomputed variants (no recomputation in the browser).
- **Search:** by tract GEOID, place name, or (NYC) BBL/address.
- **Hover:** tract tooltip with score, archetype, and top contributing domain.
- **Reset** returns to national default. All filter state is URL-encoded for shareable, reproducible views.

## 14. Responsive behavior

- **Desktop (≥1024px):** map + side panel + table simultaneously; small-multiples in a grid.
- **Tablet (768–1023px):** map primary; panel/table collapse into tabs.
- **Mobile (<768px):** **map degrades gracefully** to a lighter simplified-geometry view with a prominent **ranked-list/data-table fallback** as the primary interaction; decomposition stacks vertically; filters move into a sheet. The data-table fallback is always reachable, which doubles as the accessibility fallback for the map.

## 15. Accessibility requirements (WCAG 2.1 AA)

- **Contrast:** all text and UI meet AA; the **diverging risk ramp is validated colorblind-safe** (teal→amber→clay-red chosen and tested for deuteranopia/protanopia) and never encodes meaning by color alone — patterns/labels/rank accompany it.
- **Map accessibility:** MapLibre canvas carries **ARIA roles/labels**, and every map has an equivalent **data-table fallback** conveying the same information for screen-reader and keyboard users.
- **Keyboard:** full keyboard operability for nav, filters, table sorting, tract selection; visible focus states.
- **Reduced motion:** honor `prefers-reduced-motion`; disable non-essential transitions/animation.
- **Semantics:** proper headings, landmarks, labelled controls; charts have text/table alternatives.
- **Testing:** axe automated checks in CI with zero serious/critical violations; manual keyboard and screen-reader pass documented.

## 16. Performance requirements

- **LCP < 2.5s** on the Overview (mid-tier hardware, throttled network).
- **Precomputed index:** zero heavy computation in the browser; the app reads finished Parquet-derived JSON and simplified GeoJSON / vector tiles.
- **Geometry budget:** tract geometry simplified (topology-preserving) and/or served as vector tiles; initial map payload kept small, detail loaded on zoom.
- **Data payload budget:** initial route JSON kept lean (target < ~500KB gzipped for the Overview data); large marts split by scope and lazy-loaded.
- **Rendering:** virtualized tables (TanStack) for large tract lists; memoized chart data.
- **Lighthouse performance ≥ 90** enforced in CI (Lighthouse CI).

## 17. Testing requirements

- **Unit (Vitest):** index math — normalization, directionality, geometric-mean aggregation, archetype assignment, impact-per-dollar — tested against fixtures with known expected outputs.
- **Data-validation (Zod):** every data artifact consumed by the app validated against a Zod schema/data contract at build and in CI; schema drift fails the build.
- **Integration:** mart join integrity (no orphan GEOIDs; BBL→tract completeness; crosswalk coverage).
- **E2E (Playwright):** core journeys — load Overview, toggle national/NYC, select a tract, view decomposition, switch weight scheme, sort the target list, run the budget what-if.
- **Accessibility:** axe in CI; keyboard-path smoke in Playwright.
- **Lighthouse CI:** performance and a11y budgets enforced per PR.

## 18. Deployment requirements

- **Host:** Vercel — **preview deploy per PR**, **production from `main`**.
- **Data build step:** the Python pipeline runs as a documented, reproducible **build/prebuild step** producing the static artifacts the Next.js app consumes; artifacts are versioned. The app build fails if data contracts (Zod) fail.
- **Environment variables:** `CENSUS_API_KEY`, `HUD_API_KEY`, `NYC_APP_TOKEN` (Socrata), plus any Eviction Lab access parameters — all documented in `.env.example`, never committed.
- **Static-first:** v1 ships static artifacts; the optional knapsack what-if is a Next.js route handler (see stretch).

## 19. GitHub documentation requirements

- **README.md** — what it is, the five decisions, quickstart, architecture diagram, license flags up top.
- **METHODOLOGY.md** — full index construction, weighting variants, validation (Cronbach's alpha, Monte Carlo, back-test), geospatial methods.
- **DATA_SOURCES.md** — every dataset with URL, **license or the stated public-federal-data assumption**, cadence, geography, limitations; **Eviction Lab non-commercial flag prominent**.
- **DATA_DICTIONARY.md** — every mart field and KPI (mirrors Section 9).
- **Reproducible-pipeline docs** — exact steps to rebuild all artifacts from raw (`docs/PIPELINE.md`).
- **CONTRIBUTING.md** — branch strategy, commit conventions, test gates.
- **LICENSE** — repository code license, with an explicit note that **data licenses differ per source** and are governed by DATA_SOURCES.md.

## 20. Acceptance criteria

- [ ] Pipeline rebuilds every published artifact from raw with a single documented command.
- [ ] Composite index computed for all qualifying tracts, with all three weight schemes.
- [ ] Validation deliverables produced: Cronbach's alpha, Monte Carlo sensitivity summary, back-test rank-correlation + AUC.
- [ ] Every displayed score decomposes to sub-index and indicator contributions in the UI.
- [ ] 2×2 archetype and impact-per-dollar ranking populate the prioritization view.
- [ ] NYC deep-dive includes BBL→tract drill-down.
- [ ] All data artifacts pass Zod contracts in CI.
- [ ] Lighthouse performance ≥ 90 and a11y ≥ 90; axe zero serious violations; LCP < 2.5s.
- [ ] Playwright core journeys pass.
- [ ] License flags (Eviction Lab non-commercial; HUD assumption) present in README, DATA_SOURCES, and Methodology page.
- [ ] Calculated-vs-proposed boundary stated in About and Methodology.
- [ ] Vercel preview per PR and production from `main` both green.

## 21. Stretch features

- **Knapsack budget optimizer** — Next.js route handler solving "maximize protected affordable units under budget B," exposed as an interactive what-if in the Prioritization view.
- **National expansion** beyond the NYC building-level deep-dive (add other metros' eviction/violation building data as it becomes available).
- **Time-slider vintages** — scrub the index across data vintages to watch corridors emerge.
- **PDF export of a tract brief** — one-page, committee-ready brief (score, decomposition, archetype, at-risk units, method note).

## 22. Risks & mitigations

| Risk | Mitigation | Calculated vs. proposed |
|---|---|---|
| **Executed-eviction undercount** (many displace before execution) | Label the Eviction Pressure Index as a *floor*; triangulate with rent-burden and market-heat; never present it as total displacement | Calculated signal, honestly bounded |
| **Eviction Lab non-commercial license** | Attribution + non-commercial use documented in DATA_SOURCES and Methodology; use only permitted aggregates; flag persists to production | Governance, not a calculation |
| **HUD no-explicit-license assumption** | State the public-federal-data *assumption* explicitly wherever HUD data appears; do not claim a license we cannot cite | Governance |
| **Tract MOE propagation** | Report indicators as smoothed estimates; enforce minimum-coverage inclusion rule; flag low-reliability tracts rather than scoring them confidently | Calculated, with uncertainty surfaced |
| **Boundary-vintage drift (2010 vs 2020)** | Normalize all series to 2020 tracts with documented crosswalk weights; carry `boundary_vintage` on every row | Calculated + documented |
| **Index-weighting subjectivity** | Publish three weight schemes; Monte Carlo sensitivity showing rank stability; document the default choice | Calculated (the whole point of the sensitivity analysis) |
| **NYC-only building data generalizability** | Present national tract method as the core; treat NYC building drill-down as an explicitly-scoped deep-dive, not a national claim | Boundary stated |

**Calculated-vs-proposed boundary (global).** *Calculated:* the eight-source pipeline, the composite index and its three weight schemes, Cronbach's alpha, Monte Carlo sensitivity, predictive back-test, archetype assignment, impact-per-dollar ranking, Gi\*/LISA hotspots, NYC BBL drill-down. *Proposed future:* real-time refresh, national building-level expansion, time-slider, PDF tract brief, and the knapsack optimizer (stretch). Nothing in the "calculated" column asserts adoption, users, or dollar impact — only analytical outputs of public data.

---

# PART 3 — CODEX IMPLEMENTATION PACKAGE

**Repository name:** `jls-sheltershield`

**Product objective.** Ship a reproducible pipeline that joins eight public datasets to a census-tract Displacement-Risk Composite Index (validated with Cronbach's alpha, Monte Carlo weight sensitivity, and a predictive back-test), plus a prioritization engine and a choropleth-first Next.js app that lets community-development capital teams see displacement risk and rank preservation/production/protection targets — all auditable, all decomposable, all from public data.

## Proposed technical architecture

**Three stages, cleanly separated:**
1. **Python pipeline** (`scripts/` + `notebooks/`) — ingest → transform → index → validate → export. Uses Polars/Pandas + DuckDB for tabular, GeoPandas/Shapely + libpysal/esda for spatial, scikit-learn for PCA/factor. Outputs Parquet + simplified GeoJSON + Zod-validated JSON.
2. **Static data artifacts** (`data/processed/` + `public/data/`) — the app never touches raw sources at runtime; it consumes precomputed, contract-checked JSON/GeoJSON/vector tiles.
3. **Next.js 15 app** (`app/`, `components/`, `features/`, `lib/`) — App Router, TS strict, Tailwind + Radix/shadcn, MapLibre GL, Recharts + ECharts, TanStack Table, Zod runtime validation of the artifacts it loads.

## Folder structure

```
jls-sheltershield/
├─ app/                      # Next.js 15 App Router
│  ├─ (marketing)/page.tsx           # Landing
│  ├─ overview/page.tsx              # Executive Overview (national/NYC)
│  ├─ explorer/page.tsx              # Tract Explorer + BBL drill-down
│  ├─ prioritization/page.tsx        # 2x2 + target list + budget what-if
│  ├─ methodology/page.tsx
│  ├─ about/page.tsx
│  ├─ api/allocate/route.ts          # knapsack what-if (stretch)
│  └─ layout.tsx
├─ components/               # Reusable UI (map, table, cards, charts, shell)
├─ features/                # Feature modules (index-decomposition, archetype, prioritization)
├─ lib/                     # data-loading, Zod schemas, formatting, color ramp, hooks
├─ data/
│  ├─ raw/                  # immutable source pulls + fetch manifests
│  ├─ processed/            # staging/ + marts/ (Parquet, DuckDB)
│  └─ metadata/             # schemas, data dictionary, run manifests
├─ scripts/
│  ├─ ingest/               # one script per source
│  ├─ transform/            # BBL→tract, crosswalks, indicators, index, geospatial
│  └─ validate/             # data-contract + validation-output checks
├─ crosswalks/              # ZIP↔tract, 2010↔2020 tract, BBL↔tract
├─ public/
│  └─ data/                 # published JSON + simplified GeoJSON / vector tiles
├─ tests/
│  ├─ unit/                 # index math, formatting
│  ├─ integration/          # mart join integrity, contracts
│  └─ e2e/                  # Playwright journeys
├─ notebooks/               # exploratory + validation notebooks
├─ docs/                    # METHODOLOGY.md, DATA_SOURCES.md, DATA_DICTIONARY.md, PIPELINE.md
├─ .github/workflows/       # ci.yml (lint, typecheck, unit, data-validation, build, playwright, lighthouse, axe)
├─ README.md
├─ CONTRIBUTING.md
└─ LICENSE
```

## Database / local-data strategy

- **v1: no server database.** DuckDB + Parquet for the pipeline; static GeoJSON/JSON (and optional vector tiles) served by the app. This keeps the whole project reproducible from a clean checkout and free to host.
- **When Neon/Supabase would be justified (proposed):** only when moving from precomputed vintages to *user-submitted deal pipelines*, saved scenarios, or authenticated multi-tenant workspaces — i.e., when write-paths and per-user state appear. v1 has neither, so a server DB is deliberately out of scope.

## Data ingestion plan (per source)

- **Census ACS 5-Year** — `scripts/ingest/census_acs.py`: pull needed variables at tract grain via the ACS 5-year API (`CENSUS_API_KEY`), for the vintages used in the back-test; store raw JSON + manifest.
- **HUD CHAS** — `scripts/ingest/hud_chas.py`: CHAS API / bulk download at tract grain (through 2018–2022); capture income buckets, cost burden, tenure.
- **HUD FMR / SAFMR** — `scripts/ingest/hud_fmr.py`: FMR + ZIP-level SAFMR via FMR API (FY2026); pull the HUD USPS ZIP↔tract crosswalk.
- **HUD LIHTC** — `scripts/ingest/hud_lihtc.py`: property-level download; keep lat/long, units, low-income units, placed-in-service year.
- **NYC Evictions** — `scripts/ingest/nyc_evictions.py`: Socrata SODA API (`NYC_APP_TOKEN`), filtered pulls, BBL/tract/lat-long.
- **NYC HPD Violations** — `scripts/ingest/nyc_hpd.py`: Socrata SODA, **server-side filtered** (class, date window) to avoid pulling millions of rows; BBL/BIN.
- **NYC PLUTO / MapPLUTO** — `scripts/ingest/nyc_pluto.py`: tabular via Socrata + geometry download; BBL key, units, year built, land use, assessed value.
- **Eviction Lab** — `scripts/ingest/eviction_lab.py`: bulk download from data-downloads.evictionlab.org; **record non-commercial attribution in the manifest and DATA_SOURCES.md**.

Every ingest writes a manifest (URL, params, timestamp, row count, checksum) to `data/metadata/`.

## Data transformation plan

1. **BBL→tract aggregation** (`transform/nyc_bbl_to_tract.py`) — assign BBL→tract via PLUTO, aggregate NYC events to tract rates/densities.
2. **Crosswalks** (`transform/crosswalks.py`) — apply ZIP↔tract (FMR), 2010↔2020 tract normalization, with documented weights.
3. **Indicator build** (`transform/indicators.py`) — compute the four-domain indicators; write `mart_tract_indicators`.
4. **Normalization** (`transform/normalize.py`) — percentile-rank and z-score variants, directionality-aligned.
5. **Weighting variants** (`transform/weights.py`) — equal, expert, PCA/factor (scikit-learn).
6. **Geometric-mean aggregation** (`transform/index.py`) — weighted geometric mean → 0–100 composite; write `mart_tract_index` with per-domain contributions.
7. **Index validation outputs** (`transform/validate_index.py`) — Cronbach's alpha, Monte Carlo weight sensitivity, back-test (rank-corr + AUC on holdout); write summary JSON.
8. **Gi\*/LISA** (`transform/geospatial.py`) — Getis-Ord Gi\* and LISA via libpysal/esda; write hotspot classifications.
9. **Prioritization scoring** (`transform/prioritize.py`) — archetype assignment, at-risk affordable units, impact-per-dollar, rank; write `mart_tract_priority`.
10. **Geometry simplification** (`transform/geometry.py`) — topology-preserving simplification / vector tiles; write `mart_geo`.
11. **Zod-checked JSON export** (`transform/export.py` + `validate/contracts.py`) — export `public/data/*.json` + GeoJSON, validated against Zod schemas shared with the app.

## Component list

- `AppShell`, `TopNav`, `Footer`, `LicenseFlagBanner`
- `ChoroplethMap` (MapLibre) + `MapDataTableFallback`
- `BivariateMap`, `HotspotMap`
- `ScoreDecompositionSmallMultiples`, `SubIndexBreakdown`
- `ArchetypeQuadrant` (2×2)
- `TargetListTable` (TanStack, virtualized)
- `KpiCard`, `KpiCardRow`
- `WeightSchemeSwitcher`, `SensitivityPanel`
- `FilterBar`, `GeographyToggle` (national/NYC), `VintageSelect`
- `TractSearch`, `BblDrilldownPanel`
- `BudgetWhatIf` (stretch)
- `RiskRampLegend`, `Tooltip`, `EmptyState`, `InsufficientDataBadge`

## Page list

Landing · Executive Overview · Tract Explorer · Capital Prioritization · Methodology & Data · About. (Routes as in the folder structure.)

## API / route-handler requirements

- **v1:** static-only; no runtime API needed for core pages.
- **`app/api/allocate/route.ts` (stretch):** POST a budget + candidate set → returns knapsack-optimized selection maximizing protected affordable units. Pure function, unit-tested, no persistence.

## Testing plan

- **Unit (Vitest):** normalization, directionality, geometric-mean, archetype, impact-per-dollar, formatting, color-ramp mapping.
- **Integration:** mart join integrity, Zod contracts, crosswalk coverage, no orphan GEOIDs.
- **E2E (Playwright):** Overview load, national/NYC toggle, tract select + decomposition, weight-scheme switch, target-list sort, budget what-if.
- **A11y:** axe in CI (zero serious), keyboard smoke.
- **Lighthouse CI:** perf ≥ 90, a11y ≥ 90 budgets.

## Accessibility checklist

- [ ] AA contrast throughout; ramp validated colorblind-safe; color never the sole encoding.
- [ ] Map ARIA + data-table fallback for every map.
- [ ] Full keyboard operability + visible focus.
- [ ] `prefers-reduced-motion` honored.
- [ ] Charts have text/table alternatives.
- [ ] axe zero serious/critical in CI.

## Performance checklist

- [ ] LCP < 2.5s on Overview.
- [ ] Simplified geometry / vector tiles; detail on zoom.
- [ ] Overview data payload < ~500KB gzipped.
- [ ] Precomputed index (no browser compute).
- [ ] Virtualized tables; memoized charts.
- [ ] Lighthouse perf ≥ 90 in CI.

## Deployment checklist

- [ ] Vercel project linked; preview per PR, prod from `main`.
- [ ] Data build step wired into build; fails on Zod contract failure.
- [ ] Env vars in Vercel + `.env.example` documented, none committed.
- [ ] Artifacts versioned; rebuild command documented in PIPELINE.md.

## Git branch strategy

- **`main`** — always deployable; production on Vercel.
- **`feature/*`** — one branch per ticket; PR into `main` with a Vercel preview.
- CI gates (lint, typecheck, unit, data-validation, build, Playwright, Lighthouse, axe) must pass before merge.

## Commit plan (ordered)

Follows the ticket sequence SS-01 → SS-16, one focused PR each, conventional-commit messages (see tickets). Data-pipeline commits land before app commits so the app always builds against real artifacts.

## Definition of Done

ShelterShield is **done** when: a clean checkout rebuilds every published artifact with one command; the composite index (all three weight schemes) plus Cronbach's alpha, Monte Carlo sensitivity, and back-test AUC/rank-correlation are produced and shown; every displayed score decomposes in the UI; the 2×2 archetype and impact-per-dollar ranking populate the prioritization view; the NYC BBL drill-down works; all artifacts pass Zod contracts; Lighthouse perf & a11y ≥ 90, axe clean, LCP < 2.5s, Playwright journeys pass; the Eviction Lab non-commercial and HUD assumption flags appear in README, DATA_SOURCES, and the Methodology page; the calculated-vs-proposed boundary is stated; and production is live on Vercel from `main` with per-PR previews.

---

# PART 4 — IMPLEMENTATION TICKETS

Sixteen tickets, sequenced so an autonomous agent can execute start-to-deploy. Each is independently reviewable; dependencies are explicit.

### SS-01 — Repository, tooling & CI skeleton
- **Objective:** Scaffold `jls-sheltershield` with Next.js 15 App Router, TS strict, Tailwind, Radix/shadcn, ESLint/Prettier, Vitest, Playwright, and a CI workflow shell.
- **Files:** `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `.eslintrc`, `.prettierrc`, `app/layout.tsx`, `.github/workflows/ci.yml`, `README.md`, `LICENSE`, `CONTRIBUTING.md`, `.env.example`.
- **Dependencies:** none.
- **Instructions:** Init the app; enable TS strict; wire ESLint/Prettier; add Vitest + RTL + Playwright configs; CI runs lint, typecheck, unit, build (data-validation/Playwright/Lighthouse jobs stubbed to be filled later). README states concept + license flags; `.env.example` lists `CENSUS_API_KEY`, `HUD_API_KEY`, `NYC_APP_TOKEN`.
- **Tests:** CI green on an empty passing unit test; typecheck passes.
- **Acceptance:** Clean install builds; CI green; strict mode on.
- **Commit:** `chore: scaffold next.js 15 app with strict ts, tooling, and ci skeleton`

### SS-02 — Python pipeline environment & folder layout
- **Objective:** Establish the reproducible Python 3.12 pipeline environment and the `data/`, `scripts/`, `crosswalks/`, `notebooks/`, `docs/` structure.
- **Files:** `pyproject.toml`/`requirements.txt`, `scripts/__init__`, folder skeleton, `docs/PIPELINE.md` (stub), `data/metadata/` manifest helper.
- **Dependencies:** SS-01.
- **Instructions:** Pin Polars/Pandas, DuckDB, GeoPandas/Shapely, libpysal/esda, scikit-learn. Add a manifest utility (URL, params, timestamp, rows, checksum). Document the one-command rebuild entrypoint in PIPELINE.md.
- **Tests:** `pytest` runs; manifest utility unit-tested.
- **Acceptance:** Env installs cleanly; folders + manifest helper exist.
- **Commit:** `chore: set up python 3.12 pipeline env and data/scripts layout`

### SS-03 — Ingestion: Census ACS + HUD (CHAS, FMR/SAFMR, LIHTC)
- **Objective:** Implement national-source ingestion scripts.
- **Files:** `scripts/ingest/census_acs.py`, `hud_chas.py`, `hud_fmr.py`, `hud_lihtc.py`.
- **Dependencies:** SS-02.
- **Instructions:** Pull tract-grain ACS variables (needed vintages) via API; CHAS via API/bulk; FMR + SAFMR via API plus the USPS ZIP↔tract crosswalk; LIHTC property download. Write raw + manifests. Record the **HUD public-federal-data assumption** in each HUD manifest.
- **Tests:** Schema/row-count assertions on a small fixture pull; manifest written.
- **Acceptance:** Raw files + manifests land in `data/raw/`; assumptions recorded.
- **Commit:** `feat: add census acs and hud (chas/fmr/lihtc) ingestion scripts`

### SS-04 — Ingestion: NYC Socrata + Eviction Lab
- **Objective:** Implement NYC building-data and Eviction Lab ingestion.
- **Files:** `scripts/ingest/nyc_evictions.py`, `nyc_hpd.py`, `nyc_pluto.py`, `eviction_lab.py`.
- **Dependencies:** SS-02.
- **Instructions:** SODA API with `NYC_APP_TOKEN`; **server-side filter HPD violations** by class/date to avoid multi-million-row pulls; PLUTO tabular + geometry. Eviction Lab bulk with the **non-commercial attribution recorded in the manifest**.
- **Tests:** Filtered-pull row-count + schema assertions on fixtures.
- **Acceptance:** NYC + Eviction Lab raw + manifests present; non-commercial flag recorded.
- **Commit:** `feat: add nyc socrata and eviction lab ingestion scripts`

### SS-05 — Crosswalks & staging tables
- **Objective:** Build crosswalks and typed staging tables at native grain.
- **Files:** `crosswalks/` outputs, `scripts/transform/crosswalks.py`, `scripts/transform/staging.py`.
- **Dependencies:** SS-03, SS-04.
- **Instructions:** Materialize ZIP↔tract, 2010↔2020 tract, and BBL↔tract crosswalks with documented weights. Produce cleaned, typed, deduped staging tables tagged with `boundary_vintage`.
- **Tests:** Crosswalk weight sums validated; staging schemas asserted.
- **Acceptance:** Staging marts + crosswalks reproducible from raw.
- **Commit:** `feat: build zip/tract, tract-vintage, and bbl crosswalks with staging tables`

### SS-06 — BBL→tract aggregation & indicator build
- **Objective:** Roll NYC building data to tract and compute the four-domain indicators nationally.
- **Files:** `scripts/transform/nyc_bbl_to_tract.py`, `scripts/transform/indicators.py`, `mart_tract_indicators`.
- **Dependencies:** SS-05.
- **Instructions:** Aggregate NYC events to tract rates/densities; compute affordability, displacement-pressure, housing-distress, market-heat indicators; enforce minimum-coverage inclusion rule (flag, don't zero).
- **Tests:** Fixture tracts produce expected indicator values; coverage rule tested.
- **Acceptance:** `mart_tract_indicators` built for qualifying tracts.
- **Commit:** `feat: aggregate bbl to tract and compute four-domain indicators`

### SS-07 — Normalization, weighting variants & geometric-mean index
- **Objective:** Produce the composite index with all three weight schemes.
- **Files:** `scripts/transform/normalize.py`, `weights.py`, `index.py`, `mart_tract_index`.
- **Dependencies:** SS-06.
- **Instructions:** Percentile-rank + z-score (directionality-aligned); equal/expert/PCA weights (scikit-learn); weighted geometric-mean aggregation → 0–100 with per-domain contributions stored for decomposition.
- **Tests (critical):** Unit-test geometric mean, directionality, and rescale against hand-computed fixtures; PCA path tested on a synthetic matrix.
- **Acceptance:** `mart_tract_index` has composite + sub-indices + contributions for all three schemes.
- **Commit:** `feat: normalize indicators and compute geometric-mean composite index (3 weight schemes)`

### SS-08 — Index validation (alpha, Monte Carlo, back-test)
- **Objective:** Produce the validation deliverables that make the index defensible.
- **Files:** `scripts/transform/validate_index.py`, validation summary JSON in `data/metadata/`.
- **Dependencies:** SS-07.
- **Instructions:** Compute Cronbach's alpha across sub-indices; Monte Carlo over weight vectors reporting top-risk-set stability; predictive back-test (earlier vintage → later eviction/rent-burden movement) with rank correlation + AUC on a holdout; record face-validity check vs. known gentrifying NYC tracts.
- **Tests:** Alpha and AUC computed on fixtures with known values; Monte Carlo determinism via seed.
- **Acceptance:** Validation JSON produced and consumable by the Methodology page.
- **Commit:** `feat: add index validation — cronbach alpha, monte carlo sensitivity, predictive back-test`

### SS-09 — Geospatial (Gi\*/LISA) & prioritization engine
- **Objective:** Compute hotspots and the prioritization marts.
- **Files:** `scripts/transform/geospatial.py`, `prioritize.py`, `geometry.py`, `mart_tract_priority`, `mart_geo`, `mart_nyc_bbl`.
- **Dependencies:** SS-08.
- **Instructions:** Getis-Ord Gi\* + LISA (libpysal/esda); archetype assignment (risk × affordable stock → Preserve/Produce/Protect/Monitor); at-risk affordable units; impact-per-dollar; rank within archetype; simplify geometry / build vector tiles; assemble NYC BBL drill-down mart.
- **Tests:** Archetype and impact-per-dollar unit-tested on fixtures; hotspot classification sanity-checked; geometry validity asserted.
- **Acceptance:** Priority, geo, and BBL marts built.
- **Commit:** `feat: add gi*/lisa hotspots and archetype+impact-per-dollar prioritization`

### SS-10 — Zod data contracts & JSON/GeoJSON export
- **Objective:** Export app-ready artifacts under shared Zod schemas.
- **Files:** `scripts/transform/export.py`, `scripts/validate/contracts.py`, `lib/schemas/*.ts`, `public/data/*`.
- **Dependencies:** SS-09.
- **Instructions:** Export composite/priority/geo/validation JSON + simplified GeoJSON; define Zod schemas in `lib/schemas` shared with the app; a validation script fails the build on any contract mismatch. Wire the data-validation CI job.
- **Tests:** Contract check passes on real exports; a deliberately-broken fixture fails.
- **Acceptance:** `public/data/` validated; CI data-validation job green.
- **Commit:** `feat: export zod-validated json/geojson artifacts and wire data-validation ci`

### SS-11 — Design system, tokens & app shell
- **Objective:** Implement the visual identity and navigation shell.
- **Files:** `tailwind.config.ts` (tokens), `lib/colorRamp.ts`, `components/AppShell.tsx`, `TopNav.tsx`, `Footer.tsx`, `LicenseFlagBanner.tsx`, `RiskRampLegend.tsx`.
- **Dependencies:** SS-01.
- **Instructions:** Teal `#0d9488` accent; colorblind-safe diverging ramp teal→amber→clay-red (validated); slate+ivory base; Inter/Public Sans. Shell with persistent nav and a license-flag banner. Ramp legend never encodes by color alone.
- **Tests:** Unit-test ramp mapping; a11y smoke on shell (axe).
- **Acceptance:** Shell renders; tokens applied; ramp validated.
- **Commit:** `feat: add design tokens, colorblind-safe risk ramp, and app shell`

### SS-12 — Landing + Methodology + About pages
- **Objective:** Ship the narrative pages, including validation results and license flags.
- **Files:** `app/(marketing)/page.tsx`, `app/methodology/page.tsx`, `app/about/page.tsx`, `docs/METHODOLOGY.md`, `docs/DATA_SOURCES.md`, `docs/DATA_DICTIONARY.md`.
- **Dependencies:** SS-08, SS-11.
- **Instructions:** Landing = concept, five decisions, CTA. Methodology renders index construction + validation JSON (alpha, sensitivity, back-test). About states the **calculated-vs-proposed boundary**. All three docs carry the **Eviction Lab non-commercial** and **HUD assumption** flags.
- **Tests:** Playwright smoke: pages load, flags present; axe clean.
- **Acceptance:** Pages live; flags and boundary visible.
- **Commit:** `feat: add landing, methodology (with validation), and about pages`

### SS-13 — Executive Overview + choropleth map
- **Objective:** Build the map hero with national/NYC toggle, KPI cards, and top lists.
- **Files:** `app/overview/page.tsx`, `components/ChoroplethMap.tsx`, `MapDataTableFallback.tsx`, `KpiCard.tsx`, `GeographyToggle.tsx`, `lib/data.ts`.
- **Dependencies:** SS-10, SS-11.
- **Instructions:** MapLibre choropleth on the ramp; national↔NYC toggle; six KPI cards; top-risk/top-priority lists; ARIA + data-table fallback; Zod-validate loaded artifacts.
- **Tests:** Playwright: load, toggle, fallback reachable; axe clean; Lighthouse budget.
- **Acceptance:** Overview interactive; LCP < 2.5s; fallback works.
- **Commit:** `feat: add executive overview with choropleth, national/nyc toggle, and kpi cards`

### SS-14 — Tract Explorer with decomposition & BBL drill-down
- **Objective:** Per-tract exploration with score decomposition and NYC building drill-down.
- **Files:** `app/explorer/page.tsx`, `components/ScoreDecompositionSmallMultiples.tsx`, `SubIndexBreakdown.tsx`, `BblDrilldownPanel.tsx`, `TractSearch.tsx`, `features/index-decomposition/*`.
- **Dependencies:** SS-13.
- **Instructions:** Search by GEOID/place/BBL; small-multiples of per-domain contributions; sub-index breakdown; NYC BBL drill-down from `mart_nyc_bbl`; linked map↔panel selection.
- **Tests:** Playwright: select tract → decomposition renders; BBL drill-down loads; axe clean.
- **Acceptance:** Every displayed score decomposes; NYC drill-down works.
- **Commit:** `feat: add tract explorer with score decomposition and nyc bbl drill-down`

### SS-15 — Capital Prioritization: 2×2, target table, weight/sensitivity, budget what-if
- **Objective:** Build the decision view.
- **Files:** `app/prioritization/page.tsx`, `components/ArchetypeQuadrant.tsx`, `TargetListTable.tsx`, `WeightSchemeSwitcher.tsx`, `SensitivityPanel.tsx`, `BudgetWhatIf.tsx`, `app/api/allocate/route.ts` (stretch), `features/prioritization/*`.
- **Dependencies:** SS-09, SS-10, SS-13.
- **Instructions:** 2×2 Preserve/Produce/Protect/Monitor quadrant; virtualized TanStack target table (impact-per-dollar, at-risk units, archetype), sortable/filterable; weight-scheme switcher reading precomputed variants; sensitivity panel from validation JSON; knapsack budget what-if via the route handler (pure, tested).
- **Tests:** Unit-test knapsack; Playwright: sort table, switch weights, run what-if; axe clean.
- **Acceptance:** Archetypes + ranking populate; what-if returns valid allocation.
- **Commit:** `feat: add capital prioritization with 2x2, ranked target list, sensitivity, and budget what-if`

### SS-16 — Full test/a11y/Lighthouse gates & Vercel deploy
- **Objective:** Close all quality gates and ship to production.
- **Files:** `.github/workflows/ci.yml` (complete), `tests/e2e/*`, `tests/integration/*`, `playwright.config.ts`, Vercel project config, `docs/PIPELINE.md` (final).
- **Dependencies:** SS-12, SS-14, SS-15.
- **Instructions:** Complete Playwright journeys, integration join-integrity tests, axe, and Lighthouse CI budgets (perf & a11y ≥ 90). Wire the data build step into the Vercel build (fails on Zod contract failure); configure preview-per-PR and prod-from-`main`; finalize PIPELINE.md one-command rebuild.
- **Tests:** Full CI matrix green; production preview verified.
- **Acceptance:** All Definition-of-Done criteria met; production live on Vercel.
- **Commit:** `ci: complete test/a11y/lighthouse gates and configure vercel deploy`

---

# PART 5 — GO-TO-MARKET

### Recruiter-facing description (3–4 sentences)
ShelterShield is a decision-support tool for community-development capital teams that turns eight public housing datasets into a validated, census-tract Displacement-Risk Composite Index and a preservation-vs-production prioritization engine. It helps CDFIs, housing agencies, and philanthropy answer the field's hardest question — *where to deploy capital before a neighborhood tips into displacement* — with a score that decomposes to its inputs, publishes three weighting schemes with a Monte Carlo sensitivity analysis, and is validated with a predictive back-test. Built on a reproducible Python pipeline (DuckDB, GeoPandas, scikit-learn) feeding a choropleth-first Next.js 15 app, it demonstrates both community-development domain judgment and full-stack analytics engineering. It uses only public data and clearly separates what is calculated from what is proposed.

### Resume bullets (honest, capability-framed)
- Engineered a reproducible Python pipeline joining **8 public datasets** (Census ACS, HUD CHAS/FMR/LIHTC, NYC Evictions/HPD/PLUTO, Eviction Lab) to an **11-digit census-tract composite index**, validated with **Cronbach's alpha**, **Monte Carlo weight sensitivity**, and a **predictive back-test** (rank-correlation + AUC on a holdout).
- Designed a preservation-vs-production **prioritization engine** — a risk × affordable-stock 2×2 archetype (Preserve/Produce/Protect/Monitor) with an impact-per-dollar ranking and an optional knapsack budget optimizer — to make community-development capital allocation defensible to an investment committee.
- Built a choropleth-first **Next.js 15 / TypeScript** app (MapLibre, TanStack Table, Zod-validated data contracts) with Getis-Ord Gi\*/LISA hotspot analysis, WCAG 2.1 AA accessibility, and CI-enforced Lighthouse/axe budgets, deployed on Vercel.

### LinkedIn launch post (~170 words)
Community-development capital is scarce and lumpy, and the hardest question a deployment team faces isn't *what happened* — it's *where to put the next dollar before a neighborhood tips into displacement.* Too early wastes subsidy; too late is irreversible. Most tools are rear-view dashboards. So I built ShelterShield: *see displacement before it happens.*

ShelterShield joins eight public datasets — Census ACS, HUD CHAS/FMR/LIHTC, NYC Evictions/HPD/PLUTO, and Eviction Lab — into a validated, census-tract Displacement-Risk Composite Index. It's not just a map. Every score decomposes to its inputs. I publish three weighting schemes, run a Monte Carlo sensitivity analysis, and back-test whether an earlier index actually predicts later eviction and rent-burden movement. A prioritization engine sorts every tract into Preserve / Produce / Protect / Monitor and ranks deals by community-impact-per-dollar.

Built with a reproducible Python pipeline (DuckDB, GeoPandas, scikit-learn) and a Next.js 15 app with Gi\*/LISA hotspot analysis. Public data only; calculated findings kept honestly separate from proposed features.

Feedback from folks in the CDFI / housing-preservation world especially welcome. #CommunityDevelopment #AffordableHousing #CDFI #DataForGood #HousingPolicy

---

*ShelterShield · Project 1 of 5 · Portfolio of Jean-Luc Saint-Fleur · Built on public data · Eviction Lab data used under non-commercial, attribution-required terms · HUD datasets used under a stated public-federal-data assumption (no explicit license posted).*
