import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../store/filterStore";
import { locations } from "../data/locations.mock";
import { LogOut, X, Search, ChevronDown } from "lucide-react";

const upState = locations.find(s => s.id === "up")!;
const ALL_DISTRICTS = upState.districts.slice().sort((a, b) => a.name.localeCompare(b.name));

/* ── Tiny helpers ─────────────────────────────────────────────── */

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold tracking-[0.14em] uppercase mb-2.5" style={{ color: "#60cbb7" }}>
      {children}
    </p>
  );
}

function FieldLabel({ children, count, onClear }: {
  children: React.ReactNode; count?: number; onClear?: () => void;
}) {
  return (
    <div className="flex items-center justify-between mb-1">
      <p className="text-[9px] font-semibold uppercase tracking-[0.1em]" style={{ color: "#8aabbf" }}>
        {children}{count !== undefined && ` (${count})`}
      </p>
      {onClear && (
        <button onClick={onClear} className="text-[10px] font-semibold hover:opacity-70" style={{ color: "#60cbb7" }}>
          Clear
        </button>
      )}
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl px-3.5 py-3 mb-2" style={{ background: "#ffffff", border: "1px solid #d8edf7" }}>
      {children}
    </div>
  );
}

/* ── Click-to-open searchable dropdown ───────────────────────── */

interface ComboboxProps {
  items: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  onClear: () => void;
  placeholder: string;
  count: number;
  label: string;
}

interface SimpleDropdownProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  placeholder: string;
}

function SimpleDropdown<T extends string>({ value, options, onChange, placeholder }: SimpleDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find(option => option.value === value);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors"
        style={{
          border: `1.5px solid ${open || value ? "#60cbb7" : "#d4e8f4"}`,
          background: "#fff",
          borderRadius: "999px",
          color: value ? "#0d2f3f" : "#b0cdd9",
        }}
      >
        <span className="text-[12px] font-medium truncate">{selected?.label ?? placeholder}</span>
        <ChevronDown
          size={12}
          style={{
            color: open || value ? "#60cbb7" : "#b0cdd9",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.15s",
          }}
        />
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-50 overflow-hidden mt-1"
          style={{
            border: "1px solid #60cbb7",
            background: "#fbfeff",
            borderRadius: "14px",
            boxShadow: "0 10px 22px rgba(96,203,183,0.14)",
          }}
        >
          {options.map((option, idx) => {
            const isSelected = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onMouseDown={e => {
                  e.preventDefault();
                  onChange(option.value);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-[12px] transition-colors"
                style={{
                  color: isSelected ? "#ffffff" : "#0d5f72",
                  background: isSelected ? "#60cbb7" : "transparent",
                  borderBottom: idx < options.length - 1 ? "1px solid #edf7fa" : "none",
                }}
                onMouseEnter={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = "#eaf8f5";
                }}
                onMouseLeave={e => {
                  if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SearchCombobox({ items, value, onChange, onClear, placeholder, count, label }: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selected = items.find(i => i.id === value);
  const filtered = items.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  /* Close dropdown when clicking outside */
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    if (open) document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open]);

  /* Focus search input when dropdown opens */
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 30);
  }, [open]);

  function handleSelect(id: string) {
    onChange(id);
    setOpen(false);
    setSearch("");
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onClear();
    setOpen(false);
    setSearch("");
  }

  return (
    <div className="mb-2.5 relative" ref={containerRef}>
      <FieldLabel count={count} onClear={value ? onClear : undefined}>{label}</FieldLabel>

      {/* ── Trigger field ── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-3 py-1.5 text-left transition-colors"
        style={{
          border: `1.5px solid ${open || selected ? "#60cbb7" : "#d4e8f4"}`,
          background: "#fff",
          borderRadius: "999px",
        }}
      >
        {selected ? (
          <>
            <span className="text-[12px] font-medium truncate" style={{ color: "#0d2f3f" }}>
              {selected.name}
            </span>
            <span className="flex items-center gap-1.5 ml-1 flex-shrink-0">
              <span
                onClick={handleClear}
                className="opacity-35 hover:opacity-70 cursor-pointer"
              >
                <X size={12} style={{ color: "#0d2f3f" }} />
              </span>
              <ChevronDown
                size={12}
                style={{
                  color: "#8aabbf",
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.15s",
                }}
              />
            </span>
          </>
        ) : (
          <>
            <span className="text-[12px]" style={{ color: "#b0cdd9" }}>{placeholder}</span>
            <ChevronDown
              size={12}
              style={{
                color: "#b0cdd9",
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s",
              }}
            />
          </>
        )}
      </button>

      {/* ── Dropdown panel ── */}
      {open && (
        <div
          className="absolute left-0 right-0 z-50 rounded-xl overflow-hidden mt-1"
          style={{
            border: "1px solid #60cbb7",
            background: "#fbfeff",
            borderRadius: "14px",
            boxShadow: "0 10px 22px rgba(96,203,183,0.14)",
          }}
        >
          {/* Search row */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-2"
            style={{ borderBottom: "1px solid #e8f3fb" }}
          >
            <Search size={11} style={{ color: "#b0cdd9" }} className="flex-shrink-0" />
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex-1 text-[11px] outline-none bg-transparent"
              style={{ color: "#0d2f3f" }}
            />
            {search && (
              <button onClick={() => setSearch("")}>
                <X size={10} style={{ color: "#b0cdd9" }} />
              </button>
            )}
          </div>

          {/* Scrollable list */}
          <div className="overflow-y-auto" style={{ maxHeight: "160px" }}>
            {filtered.length === 0 ? (
              <p className="text-[11px] text-center py-3" style={{ color: "#b0cdd9" }}>No results</p>
            ) : (
              filtered.map((item, idx) => (
                <button
                  key={item.id}
                  onMouseDown={e => { e.preventDefault(); handleSelect(item.id); }}
                  className="w-full text-left px-3 py-2 text-[12px] transition-colors"
                  style={{
                    color: item.id === value ? "#ffffff" : "#0d2f3f",
                    background: item.id === value ? "#60cbb7" : "transparent",
                    fontWeight: item.id === value ? 700 : 400,
                    borderBottom: idx < filtered.length - 1 ? "1px solid #f4fafd" : "none",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#f0faff"; }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = item.id === value ? "#60cbb7" : "transparent";
                  }}
                >
                  {item.name}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Period badge ─────────────────────────────────────────────── */

function PeriodBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2 mt-2" style={{ background: "#e6faf5", border: "1px solid #b2e8d8" }}>
      <p className="text-[8px] font-bold uppercase tracking-[0.12em] mb-0.5" style={{ color: "#60cbb7" }}>
        {label}
      </p>
      <p className="text-[15px] font-bold" style={{ color: "#0d2f3f", fontFamily: "Space Grotesk, sans-serif" }}>
        {value}
      </p>
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────── */

export function LeftPanel() {
  const {
    districtId, blockId, crop, period, ssp,
    setDistrictId, setBlockId, setCrop, setPeriod, setSsp,
    loadDashboard, setSession,
  } = useFilterStore();

  const selectedDistrict = upState.districts.find(d => d.id === districtId);
  const blocks = selectedDistrict?.blocks.slice().sort((a, b) => a.name.localeCompare(b.name)) ?? [];
  const canLoad = !!(districtId && blockId && crop && period && (period !== "future" || ssp));

  return (
    <div className="flex flex-col h-full">

      {/* ── "Filters" title ── */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0" style={{ borderBottom: "1px solid #ddeef8" }}>
        <h2 className="text-[18px] font-bold" style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0d2f3f" }}>
          Filters
        </h2>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto px-3 pt-3 pb-3 min-h-0">

        {/* WHEN card */}
        <SectionCard>
          <SectionHead>When</SectionHead>

          <FieldLabel>Period</FieldLabel>
          <div
            className="flex rounded-lg overflow-hidden"
            style={{ border: "1px solid #d4e8f4", background: "#f7fbfd" }}
          >
            {(["historical", "present", "future"] as const).map((p, i) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="flex-1 py-1.5 text-[10px] font-semibold transition-all"
                style={{
                  background: period === p ? "#60cbb7" : "transparent",
                  color: period === p ? "#ffffff" : "#7a9db5",
                  borderRight: i < 2 ? "1px solid #d4e8f4" : "none",
                }}
              >
                {p === "historical" ? "Hist." : p === "present" ? "Present" : "Future"}
              </button>
            ))}
          </div>

          <PeriodBadge
            label={period === "historical" ? "Reference Period" : period === "present" ? "Forecast Year" : "Projection Period"}
            value={period === "historical" ? "1901 – 2024" : period === "present" ? "2026" : "2025 – 2100"}
          />

          {period === "future" && (
            <div className="mt-2">
              <FieldLabel>Climate Scenario (SSP)</FieldLabel>
              <SimpleDropdown
                value={ssp}
                onChange={setSsp}
                placeholder="Select scenario"
                options={[
                  { value: "" as const, label: "Select scenario" },
                  { value: "SSP1-2.6" as const, label: "SSP1 - 2.6 Sustainability" },
                  { value: "SSP2-4.5" as const, label: "SSP2 - 4.5 Middle road" },
                  { value: "SSP3-7.0" as const, label: "SSP3 - 7.0 Regional rivalry" },
                ]}
              />
            </div>
          )}
        </SectionCard>

        {/* WHERE card */}
        <SectionCard>
          <SectionHead>Where</SectionHead>

          {/* State — fixed */}
          <div className="mb-2.5">
            <FieldLabel>State</FieldLabel>
            <div
              className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
              style={{ border: "1px solid #d8edf7", background: "#f7fbfd" }}
            >
              <span className="text-[12px] font-medium" style={{ color: "#0d2f3f" }}>Uttar Pradesh</span>
              <span
                className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                style={{ background: "#e0eef7", color: "#7a9db5" }}
              >
                Fixed
              </span>
            </div>
          </div>

          {/* District */}
          <SearchCombobox
            label="District" count={ALL_DISTRICTS.length}
            items={ALL_DISTRICTS} value={districtId}
            onChange={setDistrictId}
            onClear={() => { setDistrictId(""); setBlockId(""); }}
            placeholder="No district selected"
          />

          {/* Block — only after district chosen */}
          {districtId && (
            <SearchCombobox
              label="Block" count={blocks.length}
              items={blocks} value={blockId}
              onChange={setBlockId}
              onClear={() => setBlockId("")}
              placeholder="No block selected"
            />
          )}
        </SectionCard>

        {/* CROP card */}
        <SectionCard>
          <SectionHead>Crop</SectionHead>
          <FieldLabel>Crop Type</FieldLabel>
          <SimpleDropdown
            value={crop}
            onChange={setCrop}
            placeholder="Select crop"
            options={[
              { value: "" as const, label: "Select crop" },
              { value: "Paddy" as const, label: "Paddy" },
              { value: "Wheat" as const, label: "Wheat" },
              { value: "Corn" as const, label: "Corn" },
              { value: "Maize" as const, label: "Maize" },
              { value: "Rice" as const, label: "Rice" },
            ]}
          />
        </SectionCard>

        {/* Load button */}
        <button
          onClick={loadDashboard}
          disabled={!canLoad}
          className="w-full py-2 rounded-xl text-[12px] font-semibold transition-all mb-1"
          style={{
            background: canLoad ? "#60cbb7" : "#cce0ec",
            color: canLoad ? "#ffffff" : "#8ab4c8",
            cursor: canLoad ? "pointer" : "not-allowed",
            boxShadow: canLoad ? "0 2px 8px rgba(96,203,183,0.22)" : "none",
            fontFamily: "Space Grotesk, sans-serif",
          }}
        >
          {canLoad ? "Load Dashboard →" : "Complete selection above"}
        </button>

        {!canLoad && (
          <p className="text-center text-[10px] mt-1" style={{ color: "#b0cdd9" }}>
            {!districtId ? "Select a district to begin"
              : !blockId ? "Select a block"
              : !crop ? "Select a crop"
              : period === "future" && !ssp ? "Select a climate scenario"
              : ""}
          </p>
        )}
      </div>

      {/* ── User footer ── */}
      <div
        className="px-3 py-2.5 flex items-center justify-between gap-2 flex-shrink-0"
        style={{ borderTop: "1px solid #ddeef8" }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ background: "#60cbb7" }}
          >
            DU
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold truncate" style={{ color: "#0d2f3f" }}>Demo User</p>
            <p className="text-[9px] truncate" style={{ color: "#8aabbf" }}>AgriCorp Analytics</p>
          </div>
        </div>
        <button
          onClick={() => setSession(false)}
          title="Sign out"
          className="p-1.5 rounded-lg transition-colors flex-shrink-0"
          style={{ color: "#b0cdd9" }}
          onMouseEnter={e => (e.currentTarget.style.background = "#edf5fb")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <LogOut size={13} />
        </button>
      </div>
    </div>
  );
}
