import React from "react";

import { ARCHETYPE_META, fmtInt } from "@/lib/format";
import type { Summary } from "@/lib/types";

export function TopTracksTable({ rows }: { rows: Summary["top_risk_tracts"] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-panel shadow-card">
      <table className="w-full text-sm">
        <caption className="sr-only">
          Highest displacement-risk census tracts with borough, neighborhood, risk score, archetype, evictions, and residential units.
        </caption>
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-ink-muted">
            <th scope="col" className="px-4 py-2.5 font-medium">Tract</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Neighborhood</th>
            <th scope="col" className="px-4 py-2.5 font-medium">Archetype</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Risk</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Evictions</th>
            <th scope="col" className="px-4 py-2.5 text-right font-medium">Units</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60">
              <td className="px-4 py-2.5 font-medium text-ink">
                {r.borough} · {r.tract}
              </td>
              <td className="px-4 py-2.5 text-ink-soft">{r.nta}</td>
              <td className="px-4 py-2.5">
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                  style={{ background: `${ARCHETYPE_META[r.archetype].color}18`, color: ARCHETYPE_META[r.archetype].color }}
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: ARCHETYPE_META[r.archetype].color }} />
                  {r.archetype}
                </span>
              </td>
              <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-ink">{r.risk_score}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-ink-soft">{fmtInt(r.evictions)}</td>
              <td className="px-4 py-2.5 text-right tabular-nums text-ink-soft">{fmtInt(r.units_res)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
