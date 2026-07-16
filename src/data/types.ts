export type DashboardQuery = {
  stateId: string;
  districtId: string;
  blockId: string;
  crop: "Paddy" | "Wheat" | "Corn" | "Maize" | "Rice" | "";
  period: "historical" | "present" | "future" | "";
  year: number;
  ssp?: "SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "";
};

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type GaugeMetric = {
  key: string;
  label: string;
  value: number;        // 0–100
  level: RiskLevel;
  stats: { label: string; value: string }[];
  sevenDayChange: number;
  sevenDayAvg: number;
  threshold: number;
};

export type HistoricalSeries = {
  key: string;
  label: string;
  years: number[];
  values: number[];
};

export type CardData = {
  cardId: "risk_profile" | "climate_hazards" | "water_availability" | "agri_stability";
  filters: (GaugeMetric | HistoricalSeries)[];
};

export type PanelSeries = { labels: string[]; values: number[] };

export type DashboardResponse = {
  cards: CardData[];
  totalCropArea: PanelSeries;
  cropRotationIndex: PanelSeries;
  averageYield: PanelSeries;
};