import { useQuery } from "@tanstack/react-query";
import { fetchDashboardData } from "./mockApi";
import { DashboardQuery } from "./types";

export function useDashboardData(query: DashboardQuery, enabled: boolean) {
  return useQuery({
    queryKey: ["dashboard", query],
    queryFn: () => fetchDashboardData(query),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}