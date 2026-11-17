/**
 * ⚠️ TEMPORARY MOCK DATA — NOT REAL BUSINESS FIGURES.
 * Generated deterministically for dashboard visualisation only.
 * Replace by connecting the real data source in src/lib/data/dashboard.ts.
 */
import { addDays, dayOfWeek, type DayKey } from "@/lib/dates";
import type { Barber, DailyOutletStat, DashboardDataset, Outlet } from "@/lib/data/types";

export const MOCK_OUTLETS: Outlet[] = [
  { id: "out-1", name: "Haipapa Panakkukang", city: "Makassar", active: true },
  { id: "out-2", name: "Haipapa Pettarani", city: "Makassar", active: true },
  { id: "out-3", name: "Haipapa Renon", city: "Denpasar", active: true },
  { id: "out-4", name: "Haipapa Kemang", city: "Jakarta Selatan", active: true },
];

export const MOCK_BARBERS: Barber[] = [
  { id: "b-1", name: "Andi Saputra", outletId: "out-1", share: 0.4 },
  { id: "b-2", name: "Fajar Ramadhan", outletId: "out-1", share: 0.33 },
  { id: "b-3", name: "Ilham Nur", outletId: "out-1", share: 0.27 },
  { id: "b-4", name: "Rizal Hakim", outletId: "out-2", share: 0.38 },
  { id: "b-5", name: "Yoga Pratama", outletId: "out-2", share: 0.34 },
  { id: "b-6", name: "Arif Kurnia", outletId: "out-2", share: 0.28 },
  { id: "b-7", name: "Bayu Wirawan", outletId: "out-3", share: 0.42 },
  { id: "b-8", name: "Galih Putra", outletId: "out-3", share: 0.3 },
  { id: "b-9", name: "Tegar Mahesa", outletId: "out-3", share: 0.28 },
  { id: "b-10", name: "Dimas Aditya", outletId: "out-4", share: 0.37 },
  { id: "b-11", name: "Reza Firmansyah", outletId: "out-4", share: 0.35 },
  { id: "b-12", name: "Wahyu Setiawan", outletId: "out-4", share: 0.28 },
];

const OUTLET_PROFILE: Record<string, { base: number; ticket: number; fixedCost: number }> = {
  "out-1": { base: 6_400_000, ticket: 78_000, fixedCost: 650_000 },
  "out-2": { base: 4_700_000, ticket: 68_000, fixedCost: 520_000 },
  "out-3": { base: 5_500_000, ticket: 82_000, fixedCost: 600_000 },
  "out-4": { base: 7_300_000, ticket: 95_000, fixedCost: 900_000 },
};

export const MOCK_COMMISSION_RATE = 0.35;
const HISTORY_DAYS = 400;

/** Small deterministic hash -> [0, 1). */
function seeded(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  h ^= h >>> 13;
  h = Math.imul(h, 0x5bd1e995);
  h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}

const WEEKDAY_FACTOR = [1.32, 0.82, 0.86, 0.9, 0.95, 1.14, 1.42]; // Sun..Sat

export function buildMockDataset(today: DayKey): DashboardDataset {
  const daily: DailyOutletStat[] = [];
  for (let offset = HISTORY_DAYS - 1; offset >= 0; offset--) {
    const date = addDays(today, -offset);
    const trend = 1 + ((HISTORY_DAYS - offset) / HISTORY_DAYS) * 0.18;
    for (const outlet of MOCK_OUTLETS) {
      const p = OUTLET_PROFILE[outlet.id];
      const noise = 0.84 + seeded(`${date}:${outlet.id}`) * 0.32;
      const revenue = Math.round((p.base * WEEKDAY_FACTOR[dayOfWeek(date)] * trend * noise) / 1000) * 1000;
      const transactions = Math.max(1, Math.round(revenue / p.ticket));
      const customers = Math.round(transactions * (0.9 + seeded(`c:${date}:${outlet.id}`) * 0.06));
      const expenses = Math.round(p.fixedCost + revenue * (0.16 + seeded(`e:${date}:${outlet.id}`) * 0.06));
      daily.push({ date, outletId: outlet.id, revenue, transactions, customers, expenses });
    }
  }
  return {
    source: "mock",
    today,
    commissionRate: MOCK_COMMISSION_RATE,
    outlets: MOCK_OUTLETS,
    barbers: MOCK_BARBERS,
    daily,
  };
}
