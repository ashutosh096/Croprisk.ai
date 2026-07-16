import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { HistoricalSeries } from "../data/types";
import { linearRegression } from "../utils/regression";
import { motion } from "framer-motion";

interface HistoricalChartProps {
  series: HistoricalSeries;
  color?: string;
}

export function HistoricalChart({ series, color = "var(--accent)" }: HistoricalChartProps) {
  const [showTrend, setShowTrend] = useState(false);

  const data = series.years.map((y, i) => ({
    year: y,
    value: series.values[i],
  }));

  const { line } = linearRegression(series.years, series.values);
  const trendData = data.map((d, i) => ({
    ...d,
    trend: line[i],
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="w-full flex flex-col gap-2"
    >
      <div className="flex justify-end items-center mb-1">
        <label className="flex items-center gap-2 text-xs text-ink cursor-pointer">
          <input 
            type="checkbox" 
            checked={showTrend} 
            onChange={(e) => setShowTrend(e.target.checked)}
            className="accent-accent"
          />
          Show trend line
        </label>
      </div>
      
      <div className="h-32 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 10, fill: "var(--ink-soft)", fontFamily: "var(--font-mono)" }} 
              axisLine={false} 
              tickLine={false}
              minTickGap={20}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "var(--ink-soft)", fontFamily: "var(--font-mono)" }} 
              axisLine={false} 
              tickLine={false}
              domain={['auto', 'auto']}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}
              labelStyle={{ color: 'var(--ink-soft)', marginBottom: '4px' }}
              itemStyle={{ color: 'var(--ink)' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2} 
              dot={false}
              isAnimationActive={true}
            />
            {showTrend && (
              <Line 
                type="linear" 
                dataKey="trend" 
                stroke="var(--ink-faint)" 
                strokeWidth={1.5} 
                strokeDasharray="4 4" 
                dot={false}
                isAnimationActive={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}