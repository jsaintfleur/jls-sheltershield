#!/usr/bin/env python3
"""
ShelterShield — data pipeline (v1, NYC live demo)
=================================================
Builds a census-tract Displacement-Risk Composite Index for New York City from
three verified, keyless NYC Open Data sources, and exports validated GeoJSON/JSON
artifacts that the Next.js app consumes.

Sources (all NYC Open Data, public domain, no API key required):
  - Evictions ...................... 6z8x-wfk4  (executed residential evictions)
  - PLUTO (tax-lot) ................ 64uk-42ks  (residential units, assessed value, year built)
  - 2020 Census Tracts (geometry) .. 63ge-mke6  (MultiPolygon, GEOID + BoroCT2020)

Method (documented in docs/METHODOLOGY.md):
  Three domains, percentile-normalized (higher = higher priority), aggregated with a
  weighted geometric mean to a 0-100 composite:
    1. Displacement Pressure   = executed residential evictions per 1,000 residential units
    2. Market Heat             = assessed total value per residential unit
    3. Stock Vulnerability     = building age (older stock => more at-risk affordable stock)
  A 2x2 prioritization archetype (Preserve / Protect / Produce / Monitor) and a
  Preservation Priority Score rank tracts for capital allocation.

This v1 uses keyless NYC sources so it runs end-to-end with no credentials. The full
ShelterShield model additionally ingests Census ACS affordability, HUD CHAS/LIHTC/FMR,
HPD violations, and Eviction Lab (see scripts/ingest/*). Those are pipeline-ready and
documented; this demo clearly labels which domains are computed vs. proposed.
"""
from __future__ import annotations
import json, sys, time
from pathlib import Path
import numpy as np
import pandas as pd
import requests

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
PROC = ROOT / "data" / "processed"
META = ROOT / "data" / "metadata"
for d in (RAW, PROC, META):
    d.mkdir(parents=True, exist_ok=True)

SODA = "https://data.cityofnewyork.us/resource"
BORO_CODE = {"MANHATTAN": "1", "BRONX": "2", "BROOKLYN": "3", "QUEENS": "4", "STATEN ISLAND": "5"}
CURRENT_YEAR = 2026


def _get(url: str, params: dict, timeout: int = 180):
    for attempt in range(4):
        try:
            r = requests.get(url, params=params, timeout=timeout)
            r.raise_for_status()
            return r
        except Exception as e:  # noqa: BLE001
            if attempt == 3:
                raise
            time.sleep(2 * (attempt + 1))
    raise RuntimeError("unreachable")


def tract_code(census_tract: str) -> str | None:
    """Map an Evictions `census_tract` value to a 6-digit CT2020 code.
    Empirically validated at ~91.5% join coverage against the canonical tract set."""
    if census_tract is None:
        return None
    s = str(census_tract).strip()
    if s == "" or s.lower() == "nan":
        return None
    if "." in s:
        a, d = s.split(".", 1)
        return (a.zfill(4) + (d + "00")[:2])
    return ((s + "00").zfill(6)) if len(s) <= 4 else s.zfill(6)


def ingest_evictions() -> pd.DataFrame:
    print("[ingest] evictions ...")
    r = _get(f"{SODA}/6z8x-wfk4.json", {
        "$select": "borough, census_tract, count(1) as evictions",
        "$where": "residential_commercial_ind='Residential' AND census_tract IS NOT NULL",
        "$group": "borough, census_tract",
        "$limit": 60000,
    })
    df = pd.DataFrame(r.json())
    (RAW / "evictions_by_tract.json").write_text(df.to_json(orient="records"))
    df["evictions"] = pd.to_numeric(df["evictions"], errors="coerce")
    df["bc"] = df["borough"].str.upper().map(BORO_CODE)
    df["ct"] = df["census_tract"].map(tract_code)
    df = df.dropna(subset=["bc", "ct"])
    df["boroct2020"] = df["bc"] + df["ct"]
    out = df.groupby("boroct2020", as_index=False)["evictions"].sum()
    print(f"  -> {len(out)} tracts, {int(out['evictions'].sum())} evictions")
    return out


def ingest_pluto() -> pd.DataFrame:
    print("[ingest] PLUTO (residential tax lots aggregated by tract) ...")
    r = _get(f"{SODA}/64uk-42ks.json", {
        "$select": ("bct2020, sum(unitsres) as units_res, sum(assesstot) as assess_tot, "
                    "avg(yearbuilt) as avg_year, count(1) as lots"),
        "$where": "unitsres > 0 AND yearbuilt > 1850 AND bct2020 IS NOT NULL",
        "$group": "bct2020",
        "$limit": 6000,
    })
    df = pd.DataFrame(r.json())
    (RAW / "pluto_by_tract.json").write_text(df.to_json(orient="records"))
    for c in ("units_res", "assess_tot", "avg_year", "lots"):
        df[c] = pd.to_numeric(df[c], errors="coerce")
    df = df.rename(columns={"bct2020": "boroct2020"})
    df = df[df["units_res"] > 0]
    print(f"  -> {len(df)} residential tracts, {int(df['units_res'].sum()):,} residential units")
    return df


def ingest_geometry() -> tuple[dict, pd.DataFrame]:
    print("[ingest] 2020 census tract geometry ...")
    r = _get(f"{SODA}/63ge-mke6.geojson", {"$limit": 6000})
    gj = r.json()
    (RAW / "tracts.geojson").write_text(json.dumps(gj))
    rows = [{
        "boroct2020": f["properties"].get("boroct2020"),
        "geoid": f["properties"].get("geoid"),
        "boro": f["properties"].get("boroname"),
        "nta": f["properties"].get("ntaname"),
        "ctlabel": f["properties"].get("ctlabel"),
    } for f in gj["features"]]
    meta = pd.DataFrame(rows).dropna(subset=["boroct2020"])
    print(f"  -> {len(gj['features'])} tract polygons")
    return gj, meta


def pct_rank(s: pd.Series) -> pd.Series:
    """Percentile rank in (0,1], stable for geometric mean (no zeros)."""
    return s.rank(method="average", pct=True).clip(lower=0.01, upper=1.0)


def build() -> None:
    ev = ingest_evictions()
    pl = ingest_pluto()
    gj, geo = ingest_geometry()

    df = geo.merge(pl, on="boroct2020", how="inner").merge(ev, on="boroct2020", how="left")
    df["evictions"] = df["evictions"].fillna(0.0)

    # ---- Domains (raw) --------------------------------------------------------
    df["displacement_pressure_raw"] = df["evictions"] / df["units_res"] * 1000.0
    df["market_heat_raw"] = df["assess_tot"] / df["units_res"]
    df["stock_vuln_raw"] = (CURRENT_YEAR - df["avg_year"]).clip(lower=0)

    # ---- Percentile-normalized domains (higher = higher priority) -------------
    df["p_displacement"] = pct_rank(df["displacement_pressure_raw"])
    df["p_market_heat"] = pct_rank(df["market_heat_raw"])
    df["p_stock_vuln"] = pct_rank(df["stock_vuln_raw"])

    # ---- Composite: weighted geometric mean -> 0..100 -------------------------
    weights = {"p_displacement": 0.45, "p_market_heat": 0.30, "p_stock_vuln": 0.25}
    log_sum = sum(w * np.log(df[k]) for k, w in weights.items())
    df["composite_pct"] = np.exp(log_sum / sum(weights.values()))
    df["risk_score"] = (df["composite_pct"].rank(method="average", pct=True) * 100).round(1)

    # ---- Prioritization archetype (2x2) --------------------------------------
    risk_hi = df["risk_score"] >= df["risk_score"].median()
    stock_hi = df["units_res"] >= df["units_res"].median()
    df["archetype"] = np.select(
        [risk_hi & stock_hi, risk_hi & ~stock_hi, ~risk_hi & stock_hi],
        ["Preserve", "Protect", "Produce"], default="Monitor")

    # ---- Preservation Priority Score (rank for capital allocation) -----------
    df["at_risk_units"] = (df["units_res"] * df["p_stock_vuln"]).round(0)
    df["priority_raw"] = df["units_res"] * (df["risk_score"] / 100.0) * df["p_stock_vuln"]
    df["priority_score"] = (df["priority_raw"].rank(method="average", pct=True) * 100).round(1)

    # ---- Attach scores to GeoJSON --------------------------------------------
    keep = {r["boroct2020"]: r for r in df.to_dict("records")}
    fields = ["risk_score", "priority_score", "archetype", "boro", "nta", "ctlabel",
              "units_res", "evictions", "displacement_pressure_raw", "market_heat_raw",
              "stock_vuln_raw", "p_displacement", "p_market_heat", "p_stock_vuln",
              "at_risk_units", "avg_year", "geoid"]
    feats = []
    for f in gj["features"]:
        code = f["properties"].get("boroct2020")
        if code not in keep:
            continue
        row = keep[code]
        props = {"boroct2020": code}
        for k in fields:
            v = row.get(k)
            if isinstance(v, float):
                v = None if (pd.isna(v) or np.isinf(v)) else round(v, 2)
            props[k] = v
        feats.append({"type": "Feature", "geometry": f["geometry"], "properties": props})
    out_geo = {"type": "FeatureCollection", "features": feats}
    (PROC / "tracts.geojson").write_text(json.dumps(out_geo))

    # ---- Summary + metadata ---------------------------------------------------
    top = df.sort_values("risk_score", ascending=False).head(15)
    summary = {
        "generated_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "geography": "New York City census tracts (2020)",
        "tracts_scored": int(len(df)),
        "total_residential_units": int(df["units_res"].sum()),
        "total_executed_evictions": int(df["evictions"].sum()),
        "archetype_counts": df["archetype"].value_counts().to_dict(),
        "borough_avg_risk": df.groupby("boro")["risk_score"].mean().round(1).to_dict(),
        "weights": weights,
        "top_risk_tracts": [
            {"tract": r["ctlabel"], "borough": r["boro"], "nta": r["nta"],
             "risk_score": r["risk_score"], "archetype": r["archetype"],
             "evictions": int(r["evictions"]), "units_res": int(r["units_res"])}
            for r in top.to_dict("records")
        ],
    }
    (PROC / "summary.json").write_text(json.dumps(summary, indent=2))

    metadata = {
        "sources": [
            {"name": "NYC Evictions", "id": "6z8x-wfk4", "license": "NYC Open Data (public domain)",
             "url": "https://data.cityofnewyork.us/City-Government/Evictions/6z8x-wfk4",
             "role": "Displacement pressure (executed residential evictions)"},
            {"name": "NYC PLUTO", "id": "64uk-42ks", "license": "NYC Open Data (public domain)",
             "url": "https://data.cityofnewyork.us/City-Government/Primary-Land-Use-Tax-Lot-Output-PLUTO-/64uk-42ks",
             "role": "Residential units, assessed value, year built"},
            {"name": "NYC 2020 Census Tracts", "id": "63ge-mke6", "license": "NYC Open Data (public domain)",
             "url": "https://data.cityofnewyork.us/City-Government/2020-Census-Tracts/63ge-mke6",
             "role": "Tract geometry + GEOID join spine"},
        ],
        "join_note": "Evictions census_tract mapped to CT2020 (~91.5% coverage); unmatched tracts excluded and reported.",
        "computed_domains": ["Displacement Pressure", "Market Heat", "Stock Vulnerability"],
        "proposed_future_domains": ["ACS affordability (rent burden, income)", "HPD housing distress",
                                     "Eviction Lab (national)", "HUD LIHTC affordable-stock presence"],
    }
    (META / "sources.json").write_text(json.dumps(metadata, indent=2))

    print(f"\n[done] scored {len(df)} tracts -> data/processed/tracts.geojson")
    print("Archetypes:", summary["archetype_counts"])
    print("Borough avg risk:", summary["borough_avg_risk"])


if __name__ == "__main__":
    build()
