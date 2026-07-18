export const nf = new Intl.NumberFormat("en-US");
export const fmtInt = (n: number) => nf.format(Math.round(n));
export const fmtMoney = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

/** Diverging risk ramp: calm teal -> amber -> clay-red (colorblind-safe, WCAG-checked). */
export const RISK_STOPS: [number, string][] = [
  [0, "#0f766e"],
  [25, "#5eead4"],
  [50, "#fde68a"],
  [75, "#f59e0b"],
  [100, "#b91c1c"],
];

function hexToRgb(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
}

export function riskColor(score: number): string {
  const s = Math.max(0, Math.min(100, score));
  for (let i = 1; i < RISK_STOPS.length; i++) {
    const [s0, c0] = RISK_STOPS[i - 1];
    const [s1, c1] = RISK_STOPS[i];
    if (s <= s1) {
      const t = (s - s0) / (s1 - s0);
      const a = hexToRgb(c0);
      const b = hexToRgb(c1);
      return rgbToHex(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t);
    }
  }
  return RISK_STOPS[RISK_STOPS.length - 1][1];
}

export const ARCHETYPE_META: Record<string, { color: string; blurb: string }> = {
  Preserve: { color: "#0b7a3b", blurb: "High risk + substantial residential stock — preserve existing affordability." },
  Protect: { color: "#92400e", blurb: "High risk + thinner stock — tenant protection and anti-displacement funding." },
  Produce: { color: "#2563eb", blurb: "Lower risk + stock capacity — evaluate new affordable production." },
  Monitor: { color: "#64748b", blurb: "Lower risk today — monitor for emerging pressure." },
};
