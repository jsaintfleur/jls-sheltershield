import { describe, expect, it } from "vitest";

import { ARCHETYPE_META, RISK_STOPS, riskColor } from "@/lib/format";

function redChannel(hex: string) {
  return parseInt(hex.slice(1, 3), 16);
}

describe("riskColor", () => {
  it("returns the configured anchor colors", () => {
    for (const [score, color] of RISK_STOPS) {
      expect(riskColor(score)).toBe(color);
    }
  });

  it("clamps scores outside the 0-100 range", () => {
    expect(riskColor(-25)).toBe(riskColor(0));
    expect(riskColor(125)).toBe(riskColor(100));
  });

  it("moves the red channel upward through the low-to-mid risk ramp", () => {
    const sampledReds = [0, 10, 20, 30, 40, 50].map((score) => redChannel(riskColor(score)));

    for (let i = 1; i < sampledReds.length; i += 1) {
      expect(sampledReds[i]).toBeGreaterThanOrEqual(sampledReds[i - 1]);
    }
  });
});

describe("ARCHETYPE_META", () => {
  it("defines metadata for every prioritization archetype", () => {
    expect(Object.keys(ARCHETYPE_META).sort()).toEqual(["Monitor", "Preserve", "Produce", "Protect"]);

    for (const meta of Object.values(ARCHETYPE_META)) {
      expect(meta.color).toMatch(/^#[0-9a-f]{6}$/i);
      expect(meta.blurb.length).toBeGreaterThan(20);
    }
  });
});
