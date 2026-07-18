#!/usr/bin/env python3
"""Data-contract validation gate for ShelterShield outputs.
Fails (exit 1) if the pipeline artifacts are missing, malformed, or violate invariants.
Run in CI after `npm run data`."""
from __future__ import annotations
import json, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PROC = ROOT / "data" / "processed"
errors: list[str] = []


def check(cond: bool, msg: str) -> None:
    if not cond:
        errors.append(msg)


def main() -> int:
    geo_p = PROC / "tracts.geojson"
    sum_p = PROC / "summary.json"
    check(geo_p.exists(), "tracts.geojson missing (run `npm run data`)")
    check(sum_p.exists(), "summary.json missing (run `npm run data`)")
    if errors:
        print("\n".join(errors)); return 1

    geo = json.loads(geo_p.read_text())
    check(geo.get("type") == "FeatureCollection", "geojson is not a FeatureCollection")
    feats = geo.get("features", [])
    check(len(feats) > 1500, f"expected >1500 tracts, got {len(feats)}")

    req = {"boroct2020", "risk_score", "priority_score", "archetype", "units_res", "evictions"}
    archetypes = {"Preserve", "Protect", "Produce", "Monitor"}
    bad_score = bad_arch = missing = 0
    for f in feats:
        p = f.get("properties", {})
        if not req.issubset(p):
            missing += 1
        rs = p.get("risk_score")
        if rs is None or not (0 <= rs <= 100):
            bad_score += 1
        if p.get("archetype") not in archetypes:
            bad_arch += 1
        if f.get("geometry", {}).get("type") not in ("Polygon", "MultiPolygon"):
            bad_arch += 1
    check(missing == 0, f"{missing} features missing required properties")
    check(bad_score == 0, f"{bad_score} features with risk_score out of [0,100]")
    check(bad_arch == 0, f"{bad_arch} features with invalid archetype/geometry")

    s = json.loads(sum_p.read_text())
    for k in ("tracts_scored", "total_residential_units", "archetype_counts", "top_risk_tracts"):
        check(k in s, f"summary.json missing key: {k}")
    check(s.get("tracts_scored") == len(feats), "summary tract count != geojson feature count")
    check(sum(s["archetype_counts"].values()) == len(feats), "archetype counts do not sum to tracts")

    if errors:
        print("VALIDATION FAILED:"); print("\n".join(f"  - {e}" for e in errors)); return 1
    print(f"VALIDATION PASSED — {len(feats)} tracts, all invariants hold.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
