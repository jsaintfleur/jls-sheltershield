#!/usr/bin/env python3
"""PROPOSED DOMAIN — Census ACS 5-Year affordability ingestion (not used in the v1 demo).

Adds the affordability domain (rent burden, income, tenure) to the composite index.
Requires a free Census API key: https://api.census.gov/data/key_signup.html

Usage:
    CENSUS_API_KEY=xxxx python3 scripts/ingest/acs.py

This script is intentionally scoped and documented as a planned enhancement. The v1
live demo does NOT call it; its outputs are not shown in the UI as results. See
docs/METHODOLOGY.md and DATA_SOURCES.md.
"""
from __future__ import annotations
import os, sys, json
from pathlib import Path

import requests

RAW = Path(__file__).resolve().parents[2] / "data" / "raw"
RAW.mkdir(parents=True, exist_ok=True)

# NYC county FIPS (state 36): Bronx 005, Kings 047, New York 061, Queens 081, Richmond 085
NYC_COUNTIES = ["005", "047", "061", "081", "085"]
# B25070: gross rent as % of household income (cost burden); B19013: median household income
VARS = "NAME,B25070_001E,B25070_007E,B25070_008E,B25070_009E,B25070_010E,B19013_001E"


def main() -> int:
    key = os.environ.get("CENSUS_API_KEY")
    if not key:
        print("CENSUS_API_KEY not set — this is a proposed domain, skipping. "
              "See DATA_SOURCES.md.", file=sys.stderr)
        return 0
    out = []
    for county in NYC_COUNTIES:
        r = requests.get(
            "https://api.census.gov/data/2023/acs/acs5",
            params={"get": VARS, "for": "tract:*", "in": f"state:36 county:{county}", "key": key},
            timeout=120,
        )
        r.raise_for_status()
        rows = r.json()
        header, *data = rows
        out.extend([dict(zip(header, row)) for row in data])
    (RAW / "acs_affordability.json").write_text(json.dumps(out))
    print(f"[ingest:acs] wrote {len(out)} tract rows -> data/raw/acs_affordability.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
