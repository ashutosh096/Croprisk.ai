import { LeftPanel } from "../components/LeftPanel";
import { RightPanel } from "../components/RightPanel";
import { HeadingCapsule } from "../components/HeadingCapsule";
import { useFilterStore } from "../store/filterStore";

export default function DashboardPage() {
  const { isLoaded, loadedQuery } = useFilterStore();
  return (
    /* h-screen + flex-col = the page never grows beyond the viewport */
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#e8f2f9" }}>

      {/* ── Top header bar ── */}
      <header
        className="flex items-center justify-between px-5 py-1 flex-shrink-0"
        style={{
          background: "#ffffff",
          borderBottom: "1px solid #cde3f2",
          boxShadow: "0 1px 4px rgba(15,126,163,0.07)",
        }}
      >
        {/* Left Side: Logo and Title */}
        <div className="flex items-center gap-3 w-1/3 min-w-[320px] flex-shrink-0">
          <img 
            src="/climagro-logo.png" 
            alt="Climagro Analytics" 
            className="w-10 h-10 object-contain flex-shrink-0"
          />
          <span
            className="text-[17px] font-bold leading-none"
            style={{ fontFamily: "Space Grotesk, sans-serif", color: "#0e3d52" }}
          >
            CropRisk.ai <span className="font-extrabold text-[#036468] ml-1">Powered by Climagro Analytics</span>
          </span>
        </div>

        {/* Middle: Heading Capsule (centered) */}
        <div className="flex justify-center flex-1 min-w-[200px]">
          {isLoaded && loadedQuery && <HeadingCapsule />}
        </div>

        {/* Right Side: Agriculture Risk Intelligence */}
        <div className="flex justify-end w-1/3 min-w-[220px] flex-shrink-0">
          <span
            className="text-[10px] px-2.5 py-1 rounded-full font-medium tracking-wide uppercase"
            style={{ background: "#dff0f9", color: "#0e7ea4" }}
          >
            Agriculture Risk Intelligence
          </span>
        </div>
      </header>

      {/* ── Panels row — flex-1 + min-h-0 fills remaining height exactly ── */}
      <div className="flex flex-1 gap-3 p-3 min-h-0">

        {/* Left panel — fixed height, never scrolls as a whole */}
        <div
          className="flex-shrink-0 w-[268px] rounded-xl flex flex-col overflow-hidden"
          style={{
            background: "#f4f9fd",
            border: "1.5px solid #c8dff0",
            boxShadow: "0 2px 12px rgba(15,126,163,0.08)",
          }}
        >
          <LeftPanel />
        </div>

        {/* Right panel — flex-1 + overflow-y-auto scrolls independently */}
        <div
          className="flex-1 rounded-xl flex flex-col overflow-hidden min-w-0"
          style={{
            background: "#ffffff",
            border: "1.5px solid #c8dff0",
            boxShadow: "0 2px 12px rgba(15,126,163,0.08)",
          }}
        >
          <RightPanel />
        </div>
      </div>
    </div>
  );
}
