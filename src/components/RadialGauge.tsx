import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GaugeMetric, RiskLevel } from "../data/types";

interface RadialGaugeProps {
  metric: GaugeMetric;
}

export function RadialGauge({ metric }: RadialGaugeProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(0);
    const timeout = setTimeout(() => setValue(metric.value), 50);
    return () => clearTimeout(timeout);
  }, [metric.value]);

  const getColor = (level: RiskLevel) => {
    switch (level) {
      case "LOW": return "var(--good)";
      case "MODERATE": return "var(--warn)";
      case "HIGH": return "var(--bad)";
      case "CRITICAL": return "var(--crit)";
      default: return "var(--ink-soft)";
    }
  };

  const color = getColor(metric.level);
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  // Use roughly 210 degrees for the gauge
  const arcLength = circumference * (210 / 360);
  const dashOffset = circumference - arcLength;
  
  // Calculate value offset
  const valueOffset = arcLength - (value / 100) * arcLength;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0 w-32 h-32 flex items-center justify-center">
        {/* Background Arc */}
        <svg className="w-full h-full transform -rotate-[195deg]" viewBox="0 0 160 160">
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke="var(--bg)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
          {/* Foreground Arc */}
          <motion.circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: arcLength }}
            animate={{ strokeDashoffset: dashOffset + valueOffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl font-mono font-bold tracking-tighter" style={{ color }}>
            {Math.round(value)}
          </span>
          <span className="text-[10px] font-semibold tracking-widest text-ink-soft uppercase">
            {metric.level}
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3 flex-1">
        {metric.stats.map((stat, i) => (
          <div key={i} className="flex justify-between items-center border-b border-border-soft pb-1 last:border-0 last:pb-0">
            <span className="text-xs text-ink-soft">{stat.label}</span>
            <span className="text-sm font-mono font-bold text-ink">{stat.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}