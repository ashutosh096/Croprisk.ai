import { type CSSProperties, useEffect, useRef, useState } from "react";
import { CardData, GaugeMetric, HistoricalSeries } from "../data/types";
import { RadialGauge } from "./RadialGauge";
import { HistoricalChart } from "./HistoricalChart";
import { LucideIcon, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface MetricCardProps {
  title: string;
  icon: LucideIcon;
  badgeColor: string;
  badgeBg: string;
  data: CardData;
  isHistorical: boolean;
  delay?: number;
}

export function MetricCard({ title, icon: Icon, badgeColor, badgeBg, data, isHistorical, delay = 0 }: MetricCardProps) {
  const [selectedFilterKey, setSelectedFilterKey] = useState(data.filters[0].key);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentMetric = data.filters.find(f => f.key === selectedFilterKey) || data.filters[0];

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="metric-card group flex flex-col overflow-hidden"
      style={{
        "--card-accent": badgeColor,
        "--card-accent-soft": badgeBg,
      } as CSSProperties}
    >
      <div className="metric-card__glow" style={{ background: badgeColor }} />
      <motion.div
        className="metric-card__sheen"
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.85, ease: "easeOut" }}
      />
      <div className="metric-card__grain" aria-hidden="true" />

      <div className="relative z-40 flex justify-between items-center px-5 pt-4 pb-3.5 metric-card__header">
        <div className="flex items-center gap-2.5">
          <motion.div
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 metric-card__badge"
            style={{
              background: `linear-gradient(145deg, ${badgeBg}, #ffffff 92%)`,
              color: badgeColor,
            }}
            whileHover={{ rotate: -4, scale: 1.06 }}
            transition={{ type: "spring", stiffness: 360, damping: 20 }}
          >
            <Icon size={14} />
          </motion.div>
          <h3
            className="text-[13px] font-semibold text-ink leading-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {title}
          </h3>
        </div>

        <div className="relative z-30" ref={dropdownRef}>
          <button
            type="button"
            className="metric-card__select flex min-w-[150px] items-center justify-between gap-2.5 text-left text-[11px] font-medium pl-3 pr-2.5 py-1.5 cursor-pointer focus:outline-none transition-colors"
            style={{
              color: "#0a5a78",
              fontFamily: "Inter, sans-serif",
            }}
            aria-haspopup="listbox"
            aria-expanded={isFilterOpen}
            onClick={() => setIsFilterOpen(open => !open)}
          >
            <span className="truncate">{currentMetric.label}</span>
            <ChevronDown
              size={12}
              className={`text-accent transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
            />
          </button>

          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                className="metric-card__menu absolute right-0 top-[calc(100%+5px)] w-full overflow-hidden"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                role="listbox"
              >
                {data.filters.map(f => {
                  const isSelected = f.key === selectedFilterKey;

                  return (
                    <button
                      key={f.key}
                      type="button"
                      className={`metric-card__option ${isSelected ? "is-selected" : ""}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        setSelectedFilterKey(f.key);
                        setIsFilterOpen(false);
                      }}
                    >
                      {f.label}
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col justify-center px-5 py-4 min-h-[148px] metric-card__body">
        {isHistorical ? (
          <HistoricalChart series={currentMetric as HistoricalSeries} color={badgeColor} />
        ) : (
          <RadialGauge metric={currentMetric as GaugeMetric} />
        )}
      </div>

      {!isHistorical && (
        <div className="relative z-10 grid grid-cols-3 text-center px-2 py-3 metric-card__footer">
          {[
            { label: "7D Change", value: `${(currentMetric as GaugeMetric).sevenDayChange > 0 ? "+" : ""}${(currentMetric as GaugeMetric).sevenDayChange.toFixed(1)}` },
            { label: "7D Avg", value: `${(currentMetric as GaugeMetric).sevenDayAvg.toFixed(1)}` },
            { label: "Threshold", value: `${(currentMetric as GaugeMetric).threshold}` },
          ].map((stat, i) => (
            <div key={stat.label} className={i > 0 ? "border-l border-[#d9edf8]" : ""}>
              <p className="text-[9px] font-semibold uppercase tracking-wider text-ink-faint mb-0.5">{stat.label}</p>
              <p
                className="text-[13px] font-bold text-ink"
                style={{ fontFamily: "JetBrains Mono, monospace" }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
