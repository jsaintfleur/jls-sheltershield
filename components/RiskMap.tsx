"use client";

import React, { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { RISK_STOPS, fmtInt, fmtMoney } from "@/lib/format";
import { ErrorState, Skeleton } from "@/lib/design/primitives";

type Mode = "risk_score" | "priority_score";
type TractProps = Record<string, any>;

const MODES: { key: Mode; label: string }[] = [
  { key: "risk_score", label: "Displacement risk" },
  { key: "priority_score", label: "Preservation priority" },
];

export function RiskMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const selectedRef = useRef<TractProps | null>(null);
  const [mode, setMode] = useState<Mode>("risk_score");
  const [mapEnabled, setMapEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TractProps | null>(null);

  const chooseTract = (tract: TractProps | null) => {
    selectedRef.current = tract;
    setSelected(tract);
  };

  useEffect(() => {
    if (!mapEnabled) return;
    let cancelled = false;
    (async () => {
      try {
        const maplibregl = (await import("maplibre-gl")).default;
        if (cancelled || !containerRef.current) return;

        const map = new maplibregl.Map({
          container: containerRef.current,
          style: {
            version: 8,
            sources: {},
            layers: [{ id: "bg", type: "background", paint: { "background-color": mapBg() } }],
          },
          center: [-73.95, 40.7],
          zoom: 9.4,
          attributionControl: false,
        });
        mapRef.current = map;
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

        map.on("load", () => {
          map.addSource("tracts", { type: "geojson", data: "/data/tracts.geojson" });
          map.addLayer({
            id: "tracts-fill",
            type: "fill",
            source: "tracts",
            paint: { "fill-color": colorExpr("risk_score"), "fill-opacity": 0.82 },
          });
          map.addLayer({
            id: "tracts-line",
            type: "line",
            source: "tracts",
            paint: { "line-color": mapLine(), "line-width": 0.3, "line-opacity": 0.55 },
          });
          map.addLayer({
            id: "tracts-hover",
            type: "line",
            source: "tracts",
            paint: { "line-color": "#0f172a", "line-width": 2 },
            filter: ["==", "boroct2020", ""],
          });

          const popup = new maplibregl.Popup({ closeButton: false, closeOnClick: false });
          map.on("mousemove", "tracts-fill", (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            map.getCanvas().style.cursor = "pointer";
            map.setFilter("tracts-hover", ["==", "boroct2020", f.properties.boroct2020]);
            const p = f.properties;
            popup
              .setLngLat(e.lngLat)
              .setHTML(
                `<div style="font-size:12px;line-height:1.5">
                   <div style="font-weight:600;color:#0f172a">${p.boro} · Tract ${p.ctlabel}</div>
                   <div style="color:#64748b">${p.nta ?? ""}</div>
                   <div style="margin-top:6px">Risk <b>${p.risk_score}</b> · Priority <b>${p.priority_score}</b></div>
                   <div>Action: <b>${p.archetype}</b></div>
                   <div style="color:#64748b">${fmtInt(Number(p.units_res))} units · ${fmtInt(Number(p.evictions))} evictions</div>
                 </div>`,
              )
              .addTo(map);
          });
          map.on("click", "tracts-fill", (e: any) => {
            const f = e.features?.[0];
            if (!f) return;
            chooseTract(f.properties);
            map.setFilter("tracts-hover", ["==", "boroct2020", f.properties.boroct2020]);
          });
          map.on("mouseleave", "tracts-fill", () => {
            map.getCanvas().style.cursor = "";
            if (!selectedRef.current) map.setFilter("tracts-hover", ["==", "boroct2020", ""]);
            popup.remove();
          });
          setReady(true);
        });

        const observer = new MutationObserver(() => {
          if (map.getLayer("bg")) map.setPaintProperty("bg", "background-color", mapBg());
          if (map.getLayer("tracts-line")) map.setPaintProperty("tracts-line", "line-color", mapLine());
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
        map.once("remove", () => observer.disconnect());

        map.on("error", (e: any) => {
          if (e?.error?.message && !/glyph/i.test(e.error.message)) setError(e.error.message);
        });
      } catch (err: any) {
        setError(err?.message ?? "Failed to load map");
      }
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
    };
  }, [mapEnabled]);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready && map.getLayer("tracts-fill")) {
      map.setPaintProperty("tracts-fill", "fill-color", colorExpr(mode));
    }
  }, [mode, ready]);

  const resetView = () => {
    const map = mapRef.current;
    chooseTract(null);
    if (map?.getLayer("tracts-hover")) map.setFilter("tracts-hover", ["==", "boroct2020", ""]);
    map?.easeTo({ center: [-73.95, 40.7], zoom: 9.4, duration: 650 });
  };

  if (!mapEnabled) {
    return (
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-6 shadow-[var(--shadow-1)]">
          <div className="grid min-h-[360px] place-items-center rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-inset)] p-8 text-center">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">Interactive tract map</p>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">Load the drill-down when geography matters.</h3>
              <p className="mt-3 text-sm leading-6 text-[var(--text-tertiary)]">
                The target list is available immediately. Loading the map brings in tract geometry, hover cards, priority layers, and score decomposition.
              </p>
              <button
                type="button"
                onClick={() => setMapEnabled(true)}
                className="ds-focus-ring mt-5 rounded-lg bg-[var(--accent-600)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--accent-700)]"
              >
                Load interactive map
              </button>
            </div>
          </div>
          <MapLegend />
        </div>
        <TractProfile tract={null} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="relative overflow-hidden rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] shadow-[var(--shadow-1)]">
        <div
          className="absolute left-3 top-3 z-10 flex flex-wrap gap-1 rounded-lg border border-[var(--border-default)] bg-[var(--bg-panel)]/95 p-1 shadow-[var(--shadow-1)] backdrop-blur"
          role="group"
          aria-label="Map metric"
        >
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => setMode(m.key)}
              aria-pressed={mode === m.key}
              className={`ds-focus-ring rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === m.key ? "bg-[var(--accent-600)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--bg-inset)]"
              }`}
            >
              {m.label}
            </button>
          ))}
          <button
            type="button"
            onClick={resetView}
            className="ds-focus-ring rounded-md px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-inset)]"
          >
            Reset view
          </button>
        </div>
        <div
          ref={containerRef}
          role="application"
          aria-label={`Choropleth map of NYC census tracts by ${mode === "risk_score" ? "displacement risk" : "preservation priority"}. A ranked data table is provided below for non-visual access.`}
          className="h-[560px] w-full bg-[var(--bg-inset)]"
        />
        {!ready && !error ? (
          <div className="absolute inset-0 grid place-items-center bg-[var(--bg-panel)]/70 backdrop-blur-sm">
            <div className="w-72 space-y-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
        ) : null}
        {error ? (
          <div className="absolute inset-x-4 bottom-4">
            <ErrorState title="Map failed to load">{error}</ErrorState>
          </div>
        ) : null}
        <div className="px-4 pb-4">
          <MapLegend />
          <p className="mt-3 text-xs leading-5 text-[var(--text-tertiary)]">
            Map colors show relative risk from lower to higher. Brand green is reserved for app chrome; the risk ramp stays sequential and colorblind-safer.
          </p>
        </div>
      </div>
      <TractProfile tract={selected} />
    </div>
  );
}

function colorExpr(field: Mode): any {
  const stops = RISK_STOPS.flatMap(([v, c]) => [v, c]);
  return ["interpolate", ["linear"], ["coalesce", ["get", field], 0], ...stops];
}

function mapBg() {
  return document.documentElement.classList.contains("dark") ? "#111827" : "#eef2f4";
}

function mapLine() {
  return document.documentElement.classList.contains("dark") ? "#334155" : "#ffffff";
}

function MapLegend() {
  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
      <span>Lower risk</span>
      <div
        className="h-2.5 flex-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${RISK_STOPS.map(([, c]) => c).join(",")})` }}
        aria-hidden
      />
      <span>Higher risk</span>
    </div>
  );
}

function TractProfile({ tract }: { tract: TractProps | null }) {
  const domains = tract
    ? [
        ["Displacement pressure", tract.p_displacement],
        ["Market heat", tract.p_market_heat],
        ["Stock vulnerability", tract.p_stock_vuln],
        ["ACS affordability", tract.p_affordability],
      ].filter(([, value]) => value != null)
    : [];
  return (
    <aside id="tract-profile" className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-panel)] p-5 shadow-[var(--shadow-1)]">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-text)]">Tract profile</p>
      {tract ? (
        <>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
            {tract.boro} · Tract {tract.ctlabel}
          </h3>
          <p className="mt-1 text-sm text-[var(--text-tertiary)]">
            Risk <b className="tabular-nums text-[var(--text-primary)]">{tract.risk_score}</b> · Priority{" "}
            <b className="tabular-nums text-[var(--text-primary)]">{tract.priority_score}</b> · {tract.archetype}
          </p>
          <div className="mt-5 space-y-3">
            {domains.map(([label, value]) => (
              <div key={label as string}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-medium text-[var(--text-secondary)]">{label}</span>
                  <span className="tabular-nums text-[var(--text-tertiary)]">{Math.round(Number(value) * 100)}th pct.</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-inset)]">
                  <div className="h-full rounded-full bg-[var(--accent-600)]" style={{ width: `${Number(value) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <Metric label="Residential units" value={fmtInt(Number(tract.units_res))} />
            <Metric label="At-risk units" value={fmtInt(Number(tract.at_risk_units))} />
            <Metric label="Executed evictions" value={fmtInt(Number(tract.evictions))} />
            <Metric label="Avg. year built" value={fmtInt(Number(tract.avg_year))} />
            <Metric label="Tax lots" value={fmtInt(Number(tract.lots))} />
            <Metric label="Assessed value" value={fmtMoney(Number(tract.assess_tot))} />
          </dl>
          <p className="mt-4 rounded-lg border border-[var(--accent-border)] bg-[var(--accent-badge-bg)] p-3 text-xs leading-5 text-[var(--text-secondary)]">
            So what? Use this decomposition to decide whether the tract belongs in preservation underwriting, tenant protection, production planning, or monitoring.
          </p>
          <p className="mt-3 text-xs leading-5 text-[var(--text-tertiary)]">
            Building detail is summarized from PLUTO tax lots in the tract. Validate parcel-level ownership, subsidy status, and physical condition before committing capital.
          </p>
        </>
      ) : (
        <div className="mt-4 rounded-lg border border-dashed border-[var(--border-default)] bg-[var(--bg-inset)] p-5 text-sm leading-6 text-[var(--text-tertiary)]">
          Click a tract on the map to see the domain decomposition and building-stock detail. The ranked table below remains the keyboard-accessible fallback.
        </div>
      )}
    </aside>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--bg-inset)] p-3">
      <dt className="text-xs text-[var(--text-tertiary)]">{label}</dt>
      <dd className="mt-1 font-semibold tabular-nums text-[var(--text-primary)]">{value}</dd>
    </div>
  );
}
