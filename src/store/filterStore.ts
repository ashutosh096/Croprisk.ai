import { create } from "zustand";
import { DashboardQuery } from "../data/types";

interface FilterState {
  // Authentication
  session: boolean;
  setSession: (val: boolean) => void;

  // Current Selections — stateId is fixed to "up"
  stateId: string;
  districtId: string;
  blockId: string;
  crop: "Paddy" | "Wheat" | "Corn" | "Maize" | "Rice" | "";
  period: "historical" | "present" | "future";
  year: number;
  ssp: "SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "";

  // State setters
  setDistrictId: (val: string) => void;
  setBlockId: (val: string) => void;
  setCrop: (val: "Paddy" | "Wheat" | "Corn" | "Maize" | "Rice" | "") => void;
  setPeriod: (val: "historical" | "present" | "future") => void;
  setSsp: (val: "SSP1-2.6" | "SSP2-4.5" | "SSP3-7.0" | "") => void;

  // Load state
  isLoaded: boolean;
  loadedQuery: DashboardQuery | null;
  loadDashboard: () => void;
  resetLoaded: () => void;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  session: false,
  setSession: (session) => set({ session }),

  // State is fixed to Uttar Pradesh
  stateId: "up",
  districtId: "",
  blockId: "",
  crop: "",
  period: "present",
  year: 2026,
  ssp: "",

  setDistrictId: (districtId) => set({ districtId, blockId: "", isLoaded: false }),
  setBlockId: (blockId) => set({ blockId, isLoaded: false }),
  setCrop: (crop) => set({ crop, isLoaded: false }),
  setPeriod: (period) => {
    if (period === "present") set({ period, year: 2026, ssp: "", isLoaded: false });
    else if (period === "historical") set({ period, year: 2024, ssp: "", isLoaded: false });
    else if (period === "future") set({ period, year: 2050, ssp: "SSP2-4.5", isLoaded: false });
  },
  setSsp: (ssp) => set({ ssp, isLoaded: false }),

  isLoaded: false,
  loadedQuery: null,
  loadDashboard: () => {
    const { stateId, districtId, blockId, crop, period, year, ssp } = get();
    const futureReady = period !== "future" || !!ssp;
    if (stateId && districtId && blockId && crop && period && year && futureReady) {
      set({
        isLoaded: true,
        loadedQuery: { stateId, districtId, blockId, crop, period, year, ssp } as DashboardQuery,
      });
    }
  },
  resetLoaded: () => set({ isLoaded: false, loadedQuery: null }),
}));
