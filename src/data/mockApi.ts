import { DashboardQuery, DashboardResponse, CardData, RiskLevel, GaugeMetric, HistoricalSeries, PanelSeries } from "./types";

function seededRandom(seedStr: string) {
  let h = 0xdeadbeef;
  for (let i = 0; i < seedStr.length; i++)
    h = Math.imul(h ^ seedStr.charCodeAt(i), 2654435761);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function getRiskLevel(value: number): RiskLevel {
  if (value < 35) return "LOW";
  if (value < 65) return "MODERATE";
  if (value < 85) return "HIGH";
  return "CRITICAL";
}

export async function fetchDashboardData(query: DashboardQuery): Promise<DashboardResponse> {
  const seed = `${query.stateId}-${query.districtId}-${query.blockId}-${query.crop}-${query.period}-${query.year}-${query.ssp}`;
  const rng = seededRandom(seed);
  const rand = () => rng() / 4294967296;

  // Add delay to simulate network
  await new Promise((resolve) => setTimeout(resolve, 800 + rand() * 500));

  let penalty = 0;
  if (query.period === "future") {
    if (query.ssp === "SSP2-4.5") penalty += 15;
    if (query.ssp === "SSP3-7.0") penalty += 30;
    penalty += ((query.year - 2025) / 75) * 20; // worse towards 2100
  }

  const generateGauge = (key: string, label: string, base: number): GaugeMetric => {
    let val = base + (rand() * 20 - 10) + penalty;
    val = Math.max(0, Math.min(100, val));
    return {
      key,
      label,
      value: val,
      level: getRiskLevel(val),
      stats: [
        { label: "Confidence", value: `${(80 + rand() * 15).toFixed(1)}%` },
        { label: "Anomaly", value: `+${(rand() * 2.5).toFixed(1)}σ` }
      ],
      sevenDayChange: (rand() * 10) - 5,
      sevenDayAvg: Math.max(0, Math.min(100, val + (rand() * 10 - 5))),
      threshold: 75,
    };
  };

  const generateHistorical = (key: string, label: string, startVal: number, trend: number): HistoricalSeries => {
    const years = Array.from({ length: 124 }, (_, i) => 1901 + i);
    const values = years.map((y, i) => {
      let v = startVal + (trend * i) + (rand() * 15 - 7.5);
      return Math.max(0, Math.min(100, v));
    });
    return { key, label, years, values };
  };

  const isHist = query.period === "historical";

  const cards: CardData[] = [
    {
      cardId: "risk_profile",
      filters: isHist
        ? [
            generateHistorical("risk_level", "Risk Level", 40, 0.1),
            generateHistorical("observed_yield", "Observed Yield", 20, 0.4),
            generateHistorical("crop_area_risk", "Crop Area Under Risk", 30, 0.2),
            generateHistorical("loss_value", "Loss Value", 10, 0.3),
          ]
        : [
            generateGauge("risk_level", "Risk Level", 45),
            generateGauge("adaptive_capacity", "Adaptive Capacity", 60),
            generateGauge("crop_area_risk", "Crop Area Under Risk", 40),
            generateGauge("major_hazards", "Major Contributing Hazards", 55),
            generateGauge("potential_loss", "Potential Loss", 30),
          ]
    },
    {
      cardId: "climate_hazards",
      filters: isHist
        ? [
            generateHistorical("drought_stress", "Drought Stress Index", 35, 0.15),
            generateHistorical("flood_risk", "Flood Risk Index", 25, 0.1),
            generateHistorical("heat_stress", "Heat Stress Index", 30, 0.25),
          ]
        : [
            generateGauge("drought_stress", "Drought Stress Index", 40),
            generateGauge("flood_risk", "Flood Risk Index", 35),
            generateGauge("heat_stress", "Heat Stress Index", 50),
          ]
    },
    {
      cardId: "water_availability",
      filters: isHist
        ? [
            generateHistorical("water_use_efficiency", "Water Use Efficiency", 40, 0.3),
            generateHistorical("irrigation_deficit", "Irrigation Deficit Index", 50, -0.1),
          ]
        : [
            generateGauge("irrigation_deficit", "Irrigation Deficit Index", 45),
          ]
    },
    {
      cardId: "agri_stability",
      filters: isHist
        ? [
            generateHistorical("yield_stability", "Crop Yield Stability Index", 60, -0.05),
          ]
        : [
            generateGauge("yield_stability", "Crop Yield Stability Index", 55),
          ]
    }
  ];

  const generatePanelSeries = (length: number, base: number, isYield = false): PanelSeries => {
    const labels = isHist 
      ? Array.from({length: 124}, (_, i) => `${1901 + i}`)
      : Array.from({length: 20}, (_, i) => `${query.year - 19 + i}`);
    
    const values = labels.map((_, i) => {
      let v = base + (i * (isHist ? 0.05 : 0.2)) + (rand() * 10 - 5);
      if (isYield) v = v / 10;
      return Math.max(0, v);
    });
    return { labels, values };
  };

  return {
    cards,
    totalCropArea: generatePanelSeries(isHist ? 124 : 20, 100),
    cropRotationIndex: generatePanelSeries(isHist ? 124 : 20, 40),
    averageYield: generatePanelSeries(isHist ? 124 : 20, 25, true),
  };
}