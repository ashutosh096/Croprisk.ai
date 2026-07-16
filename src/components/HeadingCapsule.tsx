import { useFilterStore } from "../store/filterStore";
import { locations } from "../data/locations.mock";

export function HeadingCapsule() {
  const { loadedQuery } = useFilterStore();
  if (!loadedQuery) return null;

  const state = locations.find(s => s.id === loadedQuery.stateId);
  const district = state?.districts.find(d => d.id === loadedQuery.districtId);
  const locationStr = `${district?.name}, ${state?.name}`;
  const cropStr = loadedQuery.crop;

  let badgeBg = "", badgeColor = "", periodText = "";

  if (loadedQuery.period === "present") {
    badgeBg = "#d1fae5"; badgeColor = "#065f46";
    periodText = `Present (${loadedQuery.year})`;
  } else if (loadedQuery.period === "future") {
    badgeBg = "#ede9fe"; badgeColor = "#4c1d95";
    periodText = `Future (${loadedQuery.year}) · ${loadedQuery.ssp}`;
  } else {
    badgeBg = "#fef3c7"; badgeColor = "#78350f";
    periodText = `Historical (1901–${loadedQuery.year})`;
  }

  return (
    <div
      className="inline-flex items-center gap-2.5 rounded-full px-4 py-1.5"
      style={{
        background: "#ffffff",
        border: "1.5px solid #ddeef8",
        boxShadow: "0 1px 4px rgba(15,126,163,0.08)",
      }}
    >
      {/* Crop */}
      <span className="text-[13px] font-bold" style={{ color: "#0d2f3f", fontFamily: "Space Grotesk, sans-serif" }}>
        {cropStr}
      </span>

      {/* Dot */}
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#c8dff0" }} />

      {/* Location */}
      <span className="text-[13px] font-medium" style={{ color: "#7a9db5" }}>
        {locationStr}
      </span>

      {/* Dot */}
      <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "#c8dff0" }} />

      {/* Period badge — capsule inside capsule */}
      <span
        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
        style={{ background: badgeBg, color: badgeColor }}
      >
        {periodText}
      </span>
    </div>
  );
}
