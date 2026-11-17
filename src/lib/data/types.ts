/**
 * Domain shapes consumed by the dashboard.
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
  /** Mock-only distribution helper; live ranking uses actual item rows. */
  share: number;
}

export interface DailyOutletStat {
  date: DayKey;
  outletId: string;
  revenue: number;
  transactions: number;
  customers: number;
  expenses: number;
}

export interface DailyBarberStat {
  date: DayKey;
  outletId: string;
  barberId: string;
  haircuts: number;
  revenue: number;
  commission: number;
}

export interface DashboardDataset {
  source: DataSource;
  today: DayKey;
  commissionRate: number;
  outlets: Outlet[];
  barbers: Barber[];
  daily: DailyOutletStat[];
  /** Actual transaction-item totals, grouped by business day and barber. */
  barberDaily?: DailyBarberStat[];
}
