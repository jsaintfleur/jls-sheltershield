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
  p_affordability?: number;
  at_risk_units: number;
  estimated_protected_units_per_1m: number;
  avg_year: number;
  lots: number;
  assess_tot: number;
  evictions_early: number;
  evictions_later: number;
  early_risk_score: number;
  rent_burden_share?: number;
  median_income?: number;
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
  acs_affordability: {
    status: "computed" | "computed_empty" | "proposed_no_key";
    rows: number;
    year: string;
  };
  sensitivity: {
    iterations: number;
    top_100_retention_median: number;
    top_100_retention_p10: number;
    median_rank_shift: number;
    reading: string;
  };
  backtest: {
    period_train: string;
    period_test: string;
    tracts_tested: number;
    spearman_corr: number;
    top_quartile_later_evictions_per_1k: number;
    bottom_quartile_later_evictions_per_1k: number;
    lift_vs_bottom_quartile: number | null;
    reading: string;
  };
  top_risk_tracts: {
    tract: string;
    borough: string;
    nta: string;
    risk_score: number;
    priority_score: number;
    archetype: Archetype;
    evictions: number;
    units_res: number;
    at_risk_units: number;
    estimated_protected_units_per_1m: number;
  }[];
}

export interface SourcesMeta {
  sources: { name: string; id: string; license: string; url: string; role: string }[];
  join_note: string;
  computed_domains: string[];
  computed_analytics: string[];
  proposed_future_domains: string[];
  caveats: string[];
}
