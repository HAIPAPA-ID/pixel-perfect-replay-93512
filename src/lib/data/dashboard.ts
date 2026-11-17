/**
 * Dashboard data access. Components read through these query options only.
 * Today this returns TEMPORARY MOCK DATA (source: "mock"). To go live, replace
 * the body of fetchDashboardDataset with real queries mapped to DashboardDataset
 * and return source: "live" — nothing else needs to change.
 */
import { queryOptions } from "@tanstack/react-query";

import { todayKey } from "@/lib/dates";
import { buildMockDataset } from "@/lib/mock/dashboard-mock";
import type { DashboardDataset } from "./types";

async function fetchDashboardDataset(): Promise<DashboardDataset> {
  return buildMockDataset(todayKey());
}

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard", "dataset"],
    queryFn: fetchDashboardDataset,
    staleTime: 60_000,
  });
