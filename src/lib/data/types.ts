/**
 * Domain shapes the dashboard consumes. When the real backend is connected,
 * map its rows into these types inside src/lib/data/* — components stay unchanged.
 */
import type { DayKey } from "@/lib/dates";

export type DataSource = "mock" | "live";

export interface Outlet {
  id: string;
  name: string;
  city: string;
  active: boolean;
}

export interface Barber {
  id: string;
  name: string;
  outletId: string;
  /** Share of the outlet's services this barber handles (0–1). Mock-only helper. */
  share: number;
}

/** One outlet's totals for one business day. */
export interface DailyOutletStat {
  date: DayKey;
  outletId: string;
  revenue: number;
  transactions: number;
  customers: number;
  expenses: number;
}

export interface DashboardDataset {
  source: DataSource;
  today: DayKey;
  commissionRate: number;
  outlets: Outlet[];
  barbers: Barber[];
  daily: DailyOutletStat[];
}
