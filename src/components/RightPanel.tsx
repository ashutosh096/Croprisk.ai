import { AlertTriangle, Thermometer, Droplets, Wheat, Activity, Layers, RotateCw, TrendingDown } from "lucide-react";
import { useFilterStore } from "../store/filterStore";
import { useDashboardData } from "../data/useDashboardData";
import { MetricCard } from "./MetricCard";
import {
  AreaChart, Area, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";
import { DashboardResponse } from "../data/types";

/* ── Skeleton / empty states ──────────────────────────────────── */

function Skeleton() {
  return (
    <div className="p-6 w-full animate-pulse">
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[1, 2, 3].map(i => <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl h-36" />)}
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        {[1, 2, 3, 4].map(i => <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl h-64" />)}
      </div>
      <div className="grid grid-cols-2 gap-5 mb-5">
        {[1, 2].map(i => <div key={i} className="bg-gray-50 border border-gray-100 rounded-2xl h-52" />)}
      </div>
      <div className="bg-gray-50 border border-gray-100 rounded-2xl h-64" />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ background: "#e8f4fb" }}>
          <Activity size={28} style={{ color: "#0e7ea4" }} />
        </div>
        <h2 className="text-[18px] font-semibold mb-2" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0d2f3f" }}>
          Ready for Analysis
        </h2>
        <p className="text-[13px] leading-relaxed" style={{ color: "#7a9db5" }}>
          Select location, crop type, and time period from the filters panel, then click <strong>Load Dashboard</strong>.
        </p>
        <div className="mt-6 mx-auto w-2/3 h-px" style={{ background: "linear-gradient(to right, transparent, #c8dff0, transparent)" }} />
        <p className="text-[11px] mt-4" style={{ color: "#a0bfcc" }}>UP · 75 districts · 5 crops · historical / present / future</p>
      </div>
    </div>
  );
}

/* ── KPI summary cards ────────────────────────────────────────── */

function KpiCards({ data }: { data: DashboardResponse }) {
  const cropAreaLast = data.totalCropArea.values[data.totalCropArea.values.length - 1];
  const rotationLast = data.cropRotationIndex.values[data.cropRotationIndex.values.length - 1];
  const yieldLast    = data.averageYield.values[data.averageYield.values.length - 1];

  // Derived display values
  const cropAreaKha  = (cropAreaLast / 2).toFixed(0);       // ~50 thousand ha
  const cropAreaPct  = Math.min(99, Math.round(cropAreaLast / 2.4));
  const rotationIdx  = (rotationLast / 100).toFixed(2);     // normalize to 0–1
  const isOptimal    = rotationLast >= 50 && rotationLast <= 70;
  const isAbove      = rotationLast > 70;
  const rotLabel     = isAbove ? "Above optimal range" : isOptimal ? "In optimal range" : "Below optimal range";
  const yieldVal     = yieldLast.toFixed(1);
  const nationalAvg  = 3.9;
  const yieldDiff    = ((yieldLast - nationalAvg) / nationalAvg * 100);
  const yieldBadge   = `${yieldDiff >= 0 ? "+" : ""}${yieldDiff.toFixed(0)}%`;
  const yieldPositive = yieldDiff >= 0;

  return (
    <div className="grid grid-cols-3 gap-4 mb-5">

      {/* ── Total Crop Area — green ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="rounded-2xl p-4 flex flex-col"
        style={{ background: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)", border: "1px solid #bbf7d0" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#86efac" }}>
            <Layers size={13} style={{ color: "#15803d" }} />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-tight" style={{ color: "#16a34a" }}>
            Total Crop Area
          </p>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[32px] font-bold leading-none" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#14532d" }}>
            {cropAreaKha}
          </span>
          <span className="text-[12px] font-medium" style={{ color: "#166534" }}>Thousand ha</span>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full mb-3 mt-1 overflow-hidden" style={{ background: "#bbf7d0" }}>
          <div className="h-full rounded-full" style={{ width: `${Math.min(100, cropAreaPct)}%`, background: "#22c55e" }} />
        </div>

        {/* Insight text */}
        <p className="text-[11px] font-semibold mt-auto" style={{ color: "#15803d" }}>
          {cropAreaPct}% of total state area
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "#4ade80" }}>Based on current cultivation data</p>
      </motion.div>

      {/* ── Crop Rotation Index — amber ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="rounded-2xl p-4 flex flex-col"
        style={{ background: "linear-gradient(145deg, #fefce8 0%, #fef3c7 100%)", border: "1px solid #fde68a" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#fcd34d" }}>
            <RotateCw size={13} style={{ color: "#92400e" }} />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-tight" style={{ color: "#d97706" }}>
            Crop Rotation Index
          </p>
          <div className="ml-auto w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#f59e0b" }} />
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[32px] font-bold leading-none" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#78350f" }}>
            {rotationIdx}
          </span>
        </div>

        {/* Divider line */}
        <div className="h-0.5 rounded-full my-2" style={{ background: "#f59e0b" }} />

        {/* Insight text */}
        <p className="text-[11px] font-semibold mt-auto" style={{ color: "#b45309" }}>{rotLabel}</p>
        <p className="text-[10px] mt-0.5" style={{ color: "#d97706" }}>Optimal: 0.5 – 0.7</p>
      </motion.div>

      {/* ── Average Yield — blue ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="rounded-2xl p-4 flex flex-col"
        style={{ background: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)", border: "1px solid #bfdbfe" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#93c5fd" }}>
            <TrendingDown size={13} style={{ color: "#1e3a8a" }} />
          </div>
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] leading-tight" style={{ color: "#1d4ed8" }}>
            Average Yield
          </p>
          {/* % change badge */}
          <span
            className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: yieldPositive ? "#dcfce7" : "#fee2e2",
              color: yieldPositive ? "#166534" : "#991b1b",
            }}
          >
            {yieldBadge}
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="text-[32px] font-bold leading-none" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#1e3a8a" }}>
            {yieldVal}
          </span>
          <span className="text-[12px] font-medium" style={{ color: "#1d4ed8" }}>t/ha</span>
        </div>

        {/* Progress bar */}
        <div className="h-0.5 rounded-full my-2" style={{ background: "#93c5fd" }} />

        {/* Insight text */}
        <p className="text-[11px] font-semibold mt-auto" style={{ color: "#1d4ed8" }}>
          vs {nationalAvg} t/ha national avg
        </p>
        <p className="text-[10px] mt-0.5" style={{ color: "#60a5fa" }}>Current performance benchmark</p>
      </motion.div>
    </div>
  );
}

/* ── Main component ───────────────────────────────────────────── */

export function RightPanel() {
  const { isLoaded, loadedQuery } = useFilterStore();
  const { data, isLoading, isError } = useDashboardData(loadedQuery!, isLoaded && !!loadedQuery);

  const darkTooltip = (bg: string, accent: string) => ({
    contentStyle: { borderRadius: "10px", border: "none", background: bg, color: "#fff", fontSize: "11px" },
    itemStyle: { color: accent },
  });

  const isHist = loadedQuery?.period === "historical";
  const getCard = (id: string) => data?.cards.find(c => c.cardId === id)!;
  const transformPanelData = (series: any) =>
    series.labels.map((l: string, i: number) => ({ name: l, value: series.values[i] }));

  return (
    <div className="flex flex-col h-full">

      {/* ── Scrollable content area ── */}
      <div className="flex-1 overflow-y-auto">
        {!isLoaded && <EmptyState />}
        {isLoaded && isLoading && <Skeleton />}
        {isLoaded && (isError || !data) && !isLoading && (
          <div className="p-8 text-[13px]" style={{ color: "#c0392b" }}>Failed to load. Please try again.</div>
        )}

        {isLoaded && !isLoading && data && (
          <div className="p-5">

            {/* 3 KPI summary cards */}
            <KpiCards data={data} />

            {/* 2×2 Metric Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-5">
              <MetricCard title="Risk Profile" icon={AlertTriangle} badgeColor="#e05c3a" badgeBg="#fdf0ec"
                data={getCard("risk_profile")} isHistorical={isHist!} delay={0.08} />
              <MetricCard title="Climate Hazards & Stress" icon={Thermometer} badgeColor="#d08b25" badgeBg="#fdf6e8"
                data={getCard("climate_hazards")} isHistorical={isHist!} delay={0.15} />
              <MetricCard title="Water Availability" icon={Droplets} badgeColor="#0e7ea4" badgeBg="#e6f4fb"
                data={getCard("water_availability")} isHistorical={isHist!} delay={0.22} />
              <MetricCard title="Agriculture Stability" icon={Wheat} badgeColor="#1a9e6c" badgeBg="#e8f8f2"
                data={getCard("agri_stability")} isHistorical={isHist!} delay={0.29} />
            </div>


          </div>
        )}
      </div>
    </div>
  );
}
