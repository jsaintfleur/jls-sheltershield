import React from "react";

import { ARCHETYPE_META, fmtInt } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function TopTracksTable({ rows }: { rows: Summary["top_risk_tracts"] }) {
  return (
    <div
      className="overflow-x-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] shadow-[var(--shadow-1)]"
      tabIndex={0}
      role="region"
      aria-label="Scrollable highest-risk tracts table"
    >
      <table className="min-w-[48rem] w-full text-sm">
        <caption className="sr-only">
          Highest displacement-risk census tracts with borough, neighborhood, risk score, archetype, evictions, and residential units.
        </caption>
        <thead>
          <tr className="border-b border-[var(--border-default)] bg-[var(--bg-inset)] text-left text-xs uppercase tracking-wide text-[var(--text-tertiary)]">
            <th scope="col" className="px-4 py-2.5 font-medium">Tract</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Neighborhood</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Archetype</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Risk</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Priority</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Evictions</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Units</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">At risk</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-inset)]">
              <td className="px-4 py-2.5 font-medium text-[var(--text-primary)]">
                {r.borough} · {r.tract}
              </td>
              <td className="px-4 py-2.5 text-[var(--text-secondary)]">{r.nta}</td>
              <td className="px-4 py-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${ARCHETYPE_META[r.archetype].color}18`, color: ARCHETYPE_META[r.archetype].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ARCHETYPE_META[r.archetype].color }} />
                  {r.archetype}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-[var(--text-primary)]">{r.risk_score}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{r.priority_score}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{fmtInt(r.evictions)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{fmtInt(r.units_res)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-[var(--text-secondary)]">{fmtInt(r.at_risk_units)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
