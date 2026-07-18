from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from build_index import tract_code  # noqa: E402


class TractCodeTests(unittest.TestCase):
    def test_padding_rules(self) -> None:
        cases = {
            None: None,
            "": None,
            "nan": None,
            "1": "000100",
            "12": "001200",
            "123": "012300",
            "1234": "123400",
            "12345": "012345",
            "1.2": "000120",
            "12.34": "001234",
            "123.4": "012340",
            "1234.56": "123456",
        }

        for raw, expected in cases.items():
            with self.subTest(raw=raw):
                self.assertEqual(tract_code(raw), expected)


class IndexInvariantTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        with (ROOT / "data" / "processed" / "tracts.geojson").open() as f:
            cls.tracts = json.load(f)
        with (ROOT / "data" / "processed" / "summary.json").open() as f:
            cls.summary = json.load(f)

    def test_risk_scores_are_bounded(self) -> None:
        scores = [feature["properties"]["risk_score"] for feature in self.tracts["features"]]

        self.assertTrue(scores)
        self.assertTrue(all(0 <= score <= 100 for score in scores))

    def test_archetype_counts_sum_to_scored_tracts(self) -> None:
        counts = self.summary["archetype_counts"]

        self.assertEqual(sum(counts.values()), self.summary["tracts_scored"])
        self.assertEqual(self.summary["tracts_scored"], len(self.tracts["features"]))


if __name__ == "__main__":
    unittest.main()
