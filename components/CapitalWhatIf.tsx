"use client";

import React, { useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { fmtInt } from "@/lib/format";
import type { Summary } from "@/lib/types";

type Row = Summary["top_risk_tracts"][number];

const ARCHETYPES = ["All", "Preserve", "Protect", "Produce", "Monitor"] as const;

export function CapitalWhatIf({ rows }: { rows: Row[] }) {
  const [budget, setBudget] = useState(10);
  const [filter, setFilter] = useState<(typeof ARCHETYPES)[number]>("All");
  const [sorting, setSorting] = useState<SortingState>([{ id: "priority_score", desc: true }]);
  const budgetRows = useMemo(
    () => rows.filter((r) => filter === "All" || r.archetype === filter).sort((a, b) => b.priority_score - a.priority_score),
    [rows, filter],
  );
  const fundedCount = Math.max(1, Math.min(budgetRows.length, Math.round(budget / 2)));
  const funded = budgetRows.slice(0, fundedCount);
  const protectedUnits = funded.reduce((sum, r) => sum + r.estimated_protected_units_per_1m * budget, 0);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "borough", header: "Borough" },
      { accessorKey: "tract", header: "Tract" },
      { accessorKey: "nta", header: "Neighborhood" },
      { accessorKey: "archetype", header: "Action" },
      { accessorKey: "priority_score", header: "Priority", cell: (info) => Number(info.getValue()).toFixed(1) },
      { accessorKey: "risk_score", header: "Risk", cell: (info) => Number(info.getValue()).toFixed(1) },
      { accessorKey: "at_risk_units", header: "At-risk units", cell: (info) => fmtInt(Number(info.getValue())) },
      { accessorKey: "estimated_protected_units_per_1m", header: "Units / $1M", cell: (info) => fmtInt(Number(info.getValue())) },
    ],
    [],
  );

  const table = useReactTable({
    data: budgetRows,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-1)]">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">Capital prioritization</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Allocate a budget and see the first target list.</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--text-tertiary)]">
            This what-if ranks tracts by the computed preservation priority score. Protected units are an estimate, not a guarantee of acquisition or tenant outcome.
          </p>
          <label className="mt-5 block text-sm font-semibold text-[var(--text-primary)]" htmlFor="budget">
            Budget: ${budget}M
          </label>
          <input
            id="budget"
            type="range"
            min="1"
            max="50"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--accent-600)]"
          />
          <div className="mt-4 grid grid-cols-2 gap-3">
            <Metric label="Funded tracts" value={fmtInt(funded.length)} />
            <Metric label="Protected units" value={fmtInt(protectedUnits)} />
          </div>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter target list by action">
            {ARCHETYPES.map((a) => (
              <button
                type="button"
                key={a}
                onClick={() => setFilter(a)}
                className={`ds-focus-ring rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  filter === a
                    ? "bg-[var(--accent-600)] text-white"
                    : "border border-[var(--border-default)] bg-[var(--bg-panel)] text-[var(--text-secondary)] hover:bg-[var(--bg-inset)]"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
          <p className="mt-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-badge-bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">
            So what? Use Preserve and Protect as the first underwriting queue; use Produce where public land, zoning, or acquisition capacity makes new affordability feasible.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--border-default)]">
          <table className="min-w-[52rem] w-full text-sm">
            <caption className="sr-only">Sortable tract target list for capital allocation</caption>
            <thead className="bg-[var(--bg-inset)] text-left text-xs uppercase tracking-[0.12em] text-[var(--text-tertiary)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="px-3 py-3 font-semibold">
                      <button
                        type="button"
                        onClick={header.column.getToggleSortingHandler()}
                        className="ds-focus-ring rounded-sm text-left"
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() ? (header.column.getIsSorted() === "desc" ? " ↓" : " ↑") : ""}
                      </button>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.slice(0, 12).map((row) => (
                <tr key={row.id} className="border-t border-[var(--border-subtle)] hover:bg-[var(--bg-inset)]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 text-[var(--text-secondary)]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--bg-inset)] p-3">
      <p className="text-xs text-[var(--text-tertiary)]">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
