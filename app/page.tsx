import React from "react";

import { getSummary } from "@/lib/data";
import { fmtInt } from "@/lib/format";
import { KpiCard } from "@/components/KpiCard";
import { RiskMap } from "@/components/RiskMap";
import { ArchetypeLegend } from "@/components/ArchetypeLegend";
import { TopTracksTable } from "@/components/TopTracksTable";
import { LicenseFlagBanner } from "@/components/LicenseFlagBanner";
import Link from "next/link";

export default function OverviewPage() {
  const s = getSummary();
  const freshness = new Date(s.generated_utc).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const boroughs = Object.entries(s.borough_avg_risk).sort((a, b) => b[1] - a[1]);
  const maxBoro = Math.max(...boroughs.map(([, v]) => v));

  return (
    <div className="mx-auto max-w-7xl px-6">
      <div className="pt-6">
        <LicenseFlagBanner />
      </div>
      {/* Hero */}
      <section className="pt-14 pb-10">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">
          Community Development · Capital Prioritization
        </p>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          See displacement before it happens.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">
          ShelterShield scores every New York City census tract on displacement risk and ranks where
          scarce preservation and production capital protects the most affordable housing — using only
          public data, with a transparent, reproducible method.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
          <Link
            href="/methodology"
            className="rounded-lg bg-brand-700 px-4 py-2 font-medium text-white transition-colors hover:bg-brand-800"
          >
            How the index works
          </Link>
          <span className="inline-flex items-center gap-1.5 text-ink-muted">
            <span className="h-2 w-2 rounded-full bg-brand-500" />
            Data current as of {freshness}
          </span>
        </div>
      </section>

      {/* KPI row */}
      <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Tracts scored" value={fmtInt(s.tracts_scored)} sub="NYC 2020 census tracts" hint="Residential tracts with a computable composite score." />
        <KpiCard label="Residential units" value={fmtInt(s.total_residential_units)} sub="in scored tracts" hint="Sum of residential units (PLUTO) across scored tracts." />
        <KpiCard label="Executed evictions" value={fmtInt(s.total_executed_evictions)} sub="residential, 2017–present" hint="Executed residential evictions (NYC Marshals), the displacement-pressure signal." />
        <KpiCard label="Preserve tracts" value={fmtInt(s.archetype_counts.Preserve)} sub="high risk + stock to protect" hint="Tracts flagged for acquisition / preservation capital." />
      </section>

      {/* Map + legend */}
      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Displacement-risk map</h2>
            <p className="mt-1 text-sm text-ink-muted">
              Toggle between displacement risk and preservation priority. Hover a tract for detail.
            </p>
          </div>
        </div>
        <RiskMap />
        <div className="mt-6">
          <ArchetypeLegend counts={s.archetype_counts} />
        </div>
      </section>

      {/* Borough bars + top tracts */}
      <section className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-xl border border-slate-200 bg-panel p-6 shadow-card">
          <h2 className="text-lg font-semibold tracking-tight text-ink">Average risk by borough</h2>
          <p className="mt-1 text-sm text-ink-muted">Mean composite risk score of scored tracts.</p>
          <div className="mt-5 space-y-3">
            {boroughs.map(([name, v]) => (
              <div key={name} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-ink-soft">{name}</span>
                <div className="h-6 flex-1 overflow-hidden rounded bg-slate-100">
                  <div
                    className="flex h-full items-center justify-end rounded bg-brand-600 pr-2 text-xs font-medium text-white"
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
          <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
            Highest-risk tracts
          </h2>
          <TopTracksTable rows={s.top_risk_tracts} />
        </div>
      </section>

      {/* Computed vs proposed */}
      <section className="mt-12 rounded-xl border border-amber-200 bg-amber-50/70 p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          What is computed vs. proposed
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-amber-900/90">
          Every number on this page is computed from public NYC Open Data. This v1 composite blends three
          domains — displacement pressure (evictions), market heat (assessed value), and stock vulnerability
          (building age). The full ShelterShield model adds Census ACS affordability, HUD LIHTC affordable-stock
          presence, HPD housing-distress, and national Eviction Lab data; those ingestion scripts ship in the
          repository and are labeled as planned enhancements, not shown here as results.
        </p>
      </section>
    </div>
  );
}
