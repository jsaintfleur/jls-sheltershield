import React from "react";

import { getSources, getSummary } from "@/lib/data";

export const metadata = { title: "Methodology & Data — ShelterShield" };

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold tracking-tight text-[var(--text-primary)]">{title}</h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-[var(--text-secondary)]">{children}</div>
    </section>
  );
}

export default function MethodologyPage() {
  const meta = getSources();
  const summary = getSummary();
  return (
    <div className="mx-auto max-w-4xl px-6 pb-12 pt-12">
      <p className="text-sm font-semibold uppercase tracking-wider text-[var(--accent-text)]">Methodology and data</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">A defensible screen for housing capital decisions.</h1>
      <p className="mt-3 max-w-3xl text-lg leading-relaxed text-[var(--text-secondary)]">
        ShelterShield is built for screening and prioritization. It helps teams decide where to investigate, not where to commit capital without underwriting.
      </p>

      <Section title="Data sources and license flags">
        <div className="overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--bg-inset)] text-left text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
                <th className="px-4 py-2.5 font-medium">Source</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">License</th>
              </tr>
            </thead>
            <tbody>
              {meta.sources.map((s) => (
                <tr key={s.id} className="border-t border-[var(--border-subtle)]">
                  <td className="px-4 py-2.5">
                    <a href={s.url} className="font-medium text-[var(--accent-text)] underline-offset-2 hover:underline" target="_blank" rel="noreferrer">
                      {s.name}
                    </a>
                    <span className="block text-xs text-[var(--text-tertiary)]">{s.id}</span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{s.role}</td>
                  <td className="px-4 py-2.5 text-[var(--text-secondary)]">{s.license}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-[var(--text-tertiary)]">{meta.join_note}</p>
      </Section>

      <Section title="Composite index construction">
        <p>The Displacement-Risk Composite Score aggregates the computed domains below. Higher values mean higher priority for review.</p>
        <ol className="ml-5 list-decimal space-y-2">
          <li><b>Displacement pressure</b> — executed residential evictions per 1,000 residential units.</li>
          <li><b>Market heat</b> — assessed total value per residential unit, a directional proxy for market pressure.</li>
          <li><b>Stock vulnerability</b> — building age, used as a proxy for older and potentially more at-risk affordable stock.</li>
          {summary.acs_affordability.status === "computed" ? <li><b>ACS affordability</b> — rent burden and median household income.</li> : null}
        </ol>
        <p>
          Each domain is percentile-ranked and combined with a weighted geometric mean, then re-ranked to a 0-100 score. The geometric mean reduces the chance that one extreme domain dominates the result.
        </p>
      </Section>

      <Section title="Computed validation and sensitivity">
        <p>
          The Monte-Carlo sensitivity analysis runs {summary.sensitivity.iterations} weight samples. The median top-100 retention is{" "}
          <b>{Math.round(summary.sensitivity.top_100_retention_median * 100)}%</b>, with a p10 retention of{" "}
          <b>{Math.round(summary.sensitivity.top_100_retention_p10 * 100)}%</b>. This means the top target list is directionally stable under reasonable weight changes.
        </p>
        <p>
          The back-test builds an earlier signal from {summary.backtest.period_train} and tests against {summary.backtest.period_test}. Earlier top-quartile risk tracts have{" "}
          <b>{summary.backtest.lift_vs_bottom_quartile}x</b> the later eviction pressure of bottom-quartile tracts. This is useful directional validation, not causal proof.
        </p>
      </Section>

      <Section title="Prioritization archetypes">
        <p>
          Tracts are placed in a 2x2 of displacement risk by residential-stock presence: <b>Preserve</b> for high-risk substantial stock,{" "}
          <b>Protect</b> for high-risk thinner stock, <b>Produce</b> for lower-risk stock capacity, and <b>Monitor</b> where risk is lower today.
        </p>
      </Section>

      <Section title="Limits before acting">
        <ul className="ml-5 list-disc space-y-2">
          {meta.caveats.map((c, i) => <li key={i}>{c}</li>)}
          <li><b>ACS is gated.</b> Without <code className="rounded bg-[var(--bg-inset)] px-1.5 py-0.5 text-[13px]">CENSUS_API_KEY</code>, ACS affordability remains proposed and is not included in the score.</li>
          <li><b>License flags remain active.</b> Eviction Lab is non-commercial and attribution-required if used later; HUD license assumptions must stay explicit.</li>
        </ul>
      </Section>
    </div>
  );
}
