import React from "react";
import Link from "next/link";

import { getSources, getSummary } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { KpiCard } from "@/components/KpiCard";
import { RiskMap } from "@/components/RiskMap";
import { ArchetypeLegend } from "@/components/ArchetypeLegend";
import { TopTracksTable } from "@/components/TopTracksTable";
import { LicenseFlagBanner } from "@/components/LicenseFlagBanner";
import { ExportActions } from "@/components/ExportActions";
import { CapitalWhatIf } from "@/components/CapitalWhatIf";

export default function OverviewPage() {
  const s = getSummary();
  const meta = getSources();
  const freshness = new Date(s.generated_utc).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const boroughs = Object.entries(s.borough_avg_risk).sort((a, b) => b[1] - a[1]);
  const maxBoro = Math.max(...boroughs.map(([, v]) => v));
  const topTract = s.top_risk_tracts[0];
  const protectPreserve = (s.archetype_counts.Preserve ?? 0) + (s.archetype_counts.Protect ?? 0);
  const acsComputed = s.acs_affordability.status === "computed";

  return (
    <div className="mx-auto max-w-7xl px-6 pb-12">
      <div className="pt-6">
        <LicenseFlagBanner />
      </div>

      <section className="grid gap-8 pb-8 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)] lg:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">
            Community development · capital prioritization · NYC tracts
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl">
            See displacement before capital arrives too late.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            ShelterShield ranks NYC census tracts by displacement pressure, market heat, and stock vulnerability so housing teams can target preservation, protection, and production dollars.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            <Link
              href="/methodology"
              className="ds-focus-ring rounded-lg bg-[var(--accent-600)] px-4 py-2 font-semibold text-white transition-colors hover:bg-[var(--accent-700)]"
            >
              How the index works
            </Link>
            <span className="inline-flex items-center gap-1.5 text-[var(--text-tertiary)]">
              <span className="h-2 w-2 rounded-full bg-[var(--accent-500)]" />
              Data rebuilt {freshness}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--chrome-border)] bg-[#0a0a0a] p-5 text-white shadow-[var(--shadow-2)]">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--accent-300)]">Executive summary</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-200">
            <li><b className="text-white">{fmtInt(protectPreserve)} tracts</b> fall into Preserve or Protect; make these the first underwriting and tenant-stability review queue.</li>
            <li><b className="text-white">{topTract.borough} tract {topTract.tract}</b> is the highest-risk signal; validate parcel ownership and subsidy status before committing capital.</li>
            <li><b className="text-white">{Math.round(s.sensitivity.top_100_retention_median * 100)}%</b> of the top-100 list survives typical weight changes; the target queue is directionally stable.</li>
            <li><b className="text-white">{s.backtest.lift_vs_bottom_quartile}x</b> later eviction-pressure lift in earlier top-quartile risk tracts; the index has useful directional signal, not causal proof.</li>
          </ul>
        </div>
      </section>

      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tracts scored" value={fmtInt(s.tracts_scored)} sub="NYC 2020 census tracts" hint="Residential tracts with computable PLUTO stock data and a composite displacement-risk score." />
        <KpiCard label="Residential units" value={fmtInt(s.total_residential_units)} sub="in scored tracts" hint="Sum of residential units from PLUTO across scored tracts." />
        <KpiCard label="Executed evictions" value={fmtInt(s.total_executed_evictions)} sub="residential, 2017-present" hint="Marshal-executed residential evictions. This undercounts displacement because many households leave before execution." />
        <KpiCard label="Back-test lift" value={`${s.backtest.lift_vs_bottom_quartile}x`} sub="top vs bottom quartile" hint="Later eviction pressure in earlier high-risk tracts compared with earlier low-risk tracts. Directional validation, not causal proof." />
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--accent-border)] bg-[var(--accent-badge-bg)] p-5">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">So what should a housing planner do first?</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            Start with Preserve and Protect tracts where eviction pressure and vulnerable stock overlap, then use the tract profile to decide whether the next action is acquisition, refinancing, tenant protection, or production planning.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Export for the capital memo</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-tertiary)]">Print the current page as a tract target-list brief or download the ranked CSV.</p>
          <div className="mt-4"><ExportActions /></div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">Displacement-risk map</h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Load the map for spatial review, then click a tract for the score decomposition and building-stock detail.
          </p>
        </div>
        <RiskMap />
        <div className="mt-6">
          <ArchetypeLegend counts={s.archetype_counts} />
        </div>
      </section>

      <section className="mt-12">
        <CapitalWhatIf rows={s.top_risk_tracts} />
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)]">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-1)]">
          <h2 className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">Average risk by borough</h2>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">Mean composite risk score of scored tracts.</p>
          <div className="mt-5 space-y-3">
            {boroughs.map(([name, v]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-[var(--text-secondary)]">{name}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-[var(--bg-inset)]">
                  <div
                    className="flex h-full items-center justify-end rounded bg-[var(--accent-600)] pr-2 text-xs font-medium text-white"
                    style={{ width: `${(v / maxBoro) * 100}%` }}
                  >
                    {v}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-[var(--text-primary)]">Highest-risk tracts</h2>
          <TopTracksTable rows={s.top_risk_tracts.slice(0, 15)} />
        </div>
      </section>

      <section className="mt-12 grid gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-text)]">How to use this</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            For a CDFI underwriter or city housing planner: use the ranked list as a screening queue, then validate owner, subsidy, code, and tenant-risk facts before term-sheet or program design.
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-[var(--accent-text)]">Freshness and uncertainty</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
            NYC Open Data feeds are public and keyless. ACS affordability is {acsComputed ? "computed" : "gated and proposed until CENSUS_API_KEY is set"}. {meta.caveats[0]}
          </p>
        </div>
        <div className="rounded-xl border border-amber-300 bg-amber-50/80 p-6 dark:border-amber-700 dark:bg-amber-950/40">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800 dark:text-amber-200">Computed vs. proposed</h2>
          <p className="mt-2 text-sm leading-6 text-amber-950/90 dark:text-amber-100/90">
            Computed today: {meta.computed_domains.join(", ")}; {meta.computed_analytics.join(", ")}. Proposed, not scored here: {meta.proposed_future_domains.join("; ")}.
          </p>
        </div>
      </section>
    </div>
  );
}
