"use client";

import React from "react";
import { useEffect, useRef, useState } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import { RISK_STOPS } from "@/lib/format";

type Mode = "risk_score" | "priority_score";

const MODES: { key: Mode; label: string }[] = [
  { key: "risk_score", label: "Displacement risk" },
  { key: "priority_score", label: "Preservation priority" },
];

export function RiskMap() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const [mode, setMode] = useState<Mode>("risk_score");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
            layers: [{ id: "bg", type: "background", paint: { "background-color": "#eef2f4" } }],
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
            paint: {
              "fill-color": colorExpr("risk_score"),
              "fill-opacity": 0.82,
            },
          });
          map.addLayer({
            id: "tracts-line",
            type: "line",
            source: "tracts",
            paint: { "line-color": "#ffffff", "line-width": 0.3, "line-opacity": 0.5 },
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
                   <div style="margin-top:6px">Risk score <b>${p.risk_score}</b> · Priority <b>${p.priority_score}</b></div>
                   <div>Archetype: <b>${p.archetype}</b></div>
                   <div style="color:#64748b">${Number(p.units_res).toLocaleString()} units · ${Number(p.evictions).toLocaleString()} evictions</div>
                 </div>`
              )
              .addTo(map);
          });
          map.on("mouseleave", "tracts-fill", () => {
            map.getCanvas().style.cursor = "";
            map.setFilter("tracts-hover", ["==", "boroct2020", ""]);
            popup.remove();
          });

          setReady(true);
        });

        map.on("error", (e: any) => {
          // Ignore missing-glyph noise; surface real failures only.
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
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (map && ready && map.getLayer("tracts-fill")) {
      map.setPaintProperty("tracts-fill", "fill-color", colorExpr(mode));
    }
  }, [mode, ready]);

  return (
    <div className="relative">
      <div
        className="absolute left-3 top-3 z-10 flex rounded-lg border border-slate-200 bg-white/95 p-0.5 shadow-card"
        role="group"
        aria-label="Map metric"
      >
        {MODES.map((m) => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            aria-pressed={mode === m.key}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === m.key ? "bg-brand-700 text-white" : "text-ink-soft hover:bg-slate-100"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={`Choropleth map of NYC census tracts by ${mode === "risk_score" ? "displacement risk" : "preservation priority"}. A ranked data table is provided below for non-visual access.`}
        className="h-[560px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
      />
      {error ? (
        <div className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-md bg-red-50 px-3 py-1.5 text-xs text-red-700">
          Map failed to load: {error}
        </div>
      ) : null}
      <MapLegend />
    </div>
  );
}

function colorExpr(field: Mode): any {
  const stops = RISK_STOPS.flatMap(([v, c]) => [v, c]);
  return ["interpolate", ["linear"], ["coalesce", ["get", field], 0], ...stops];
}

function MapLegend() {
  return (
    <div className="mt-3 flex items-center gap-3 text-xs text-ink-muted">
      <span>Lower</span>
      <div
        className="h-2.5 flex-1 rounded-full"
        style={{ background: `linear-gradient(90deg, ${RISK_STOPS.map(([, c]) => c).join(",")})` }}
        aria-hidden
      />
      <span>Higher</span>
    </div>
  );
}
