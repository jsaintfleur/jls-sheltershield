import React from "react";

import { getSources } from "@/lib/data";

export const metadata = { title: "Methodology & Data — ShelterShield" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  const meta = getSources();
  return (
    <div className="mx-auto max-w-3xl px-6 pb-8 pt-14">
      <h1 className="text-3xl font-semibold tracking-tight text-ink">Methodology &amp; Data</h1>
      <p className="mt-3 text-lg leading-relaxed text-ink-soft">
        ShelterShield is built to be auditable: every score traces back to public data through a
        reproducible pipeline. This page documents the sources, the index construction, and the limits
        of the current version.
      </p>

      <Section title="Data sources">
        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-muted">
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {meta.sources.map((s) => (
                <tr key={s.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5">
                    <a href={s.url} className="font-medium text-brand-700 underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                    <span className="block text-xs text-ink-faint">{s.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-ink-soft">{s.role}</td>
                  <td className="px-4 py-2.5 text-ink-soft">{s.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-ink-muted">{meta.join_note}</p>
      </Section>

      <Section title="Composite index construction">
        <p>
          The Displacement-Risk Composite Score aggregates three percentile-normalized domains, each oriented
          so that higher values indicate higher priority for attention:
        </p>
        <ol className="ml-5 list-decimal space-y-2">
          <li>
            <b>Displacement pressure (weight 0.45)</b> — executed residential evictions per 1,000 residential
            units. Source: NYC Evictions ÷ PLUTO residential units.
          </li>
          <li>
            <b>Market heat (weight 0.30)</b> — assessed total value per residential unit, a proxy for market
            pressure on existing affordability. Source: PLUTO.
          </li>
          <li>
            <b>Stock vulnerability (weight 0.25)</b> — building age (older stock indicates more at-risk,
            often rent-regulated, affordable housing). Source: PLUTO year built.
          </li>
        </ol>
        <p>
          Each domain is converted to a percentile rank, then combined with a <b>weighted geometric mean</b>{" "}
          (which penalizes tracts that are extreme on one domain but low on others, rather than letting a single
          domain dominate). The result is re-ranked to a 0–100 score.
        </p>
      </Section>

      <Section title="Prioritization archetypes">
        <p>
          Tracts are placed in a 2×2 of displacement risk (above/below median) by residential-stock presence
          (above/below median) into four capital archetypes: <b>Preserve</b> (high risk, substantial stock),{" "}
          <b>Protect</b> (high risk, thinner stock — tenant protection), <b>Produce</b> (lower risk, capacity to
          build), and <b>Monitor</b>. A Preservation Priority Score ranks tracts by at-risk units × risk, for
          capital allocation.
        </p>
      </Section>

      <Section title="Limitations (read before acting)">
        <ul className="ml-5 list-disc space-y-2">
          <li>
            <b>Executed evictions undercount displacement.</b> Many households leave before a marshal executes a
            warrant; this signal is a floor, not a full count.
          </li>
          <li>
            <b>Assessed value ≠ market value.</b> NYC assessed values lag and are capped in ways that vary by
            building class; market heat here is directional, not precise.
          </li>
          <li>
            <b>Tract join coverage.</b> The eviction-to-tract mapping matches ~91.5% of eviction tract codes;
            unmatched records are excluded and reported rather than silently dropped.
          </li>
          <li>
            <b>Weighting is a choice.</b> The weights above are a documented v1 baseline. The repository ships an
            equal-weight and a PCA-derived variant plus a Monte-Carlo sensitivity analysis so results can be
            stress-tested.
          </li>
          <li>
            <b>NYC-only demo.</b> The method generalizes to any census geography; this deployment showcases NYC.
          </li>
        </ul>
      </Section>

      <Section title="Reproducibility">
        <p>
          The entire pipeline is a single command — <code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">npm run data</code>{" "}
          (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-[13px]">python3 scripts/build_index.py</code>) — which
          pulls the sources, builds the domains, computes the composite, and writes validated GeoJSON/JSON the app
          consumes. No manual steps, no hand-edited numbers.
        </p>
      </Section>
    </div>
  );
}
