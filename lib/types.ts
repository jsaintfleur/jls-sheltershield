export type Archetype = "Preserve" | "Protect" | "Produce" | "Monitor";

export interface TractProps {
  boroct2020: string;
  geoid: string;
  boro: string;
  nta: string | null;
  ctlabel: string;
  risk_score: number;
  priority_score: number;
  archetype: Archetype;
  units_res: number;
  evictions: number;
  displacement_pressure_raw: number;
  market_heat_raw: number;
  stock_vuln_raw: number;
  p_displacement: number;
  p_market_heat: number;
  p_stock_vuln: number;
  at_risk_units: number;
  avg_year: number;
}

export interface Summary {
  generated_utc: string;
  geography: string;
  tracts_scored: number;
  total_residential_units: number;
  total_executed_evictions: number;
  archetype_counts: Record<Archetype, number>;
  borough_avg_risk: Record<string, number>;
  weights: Record<string, number>;
  top_risk_tracts: {
    tract: string;
    borough: string;
    nta: string;
    risk_score: number;
    archetype: Archetype;
    evictions: number;
    units_res: number;
  }[];
}

export interface SourcesMeta {
  sources: { name: string; id: string; license: string; url: string; role: string }[];
  join_note: string;
  computed_domains: string[];
  proposed_future_domains: string[];
}
