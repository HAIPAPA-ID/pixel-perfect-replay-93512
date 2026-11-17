/** Pure dashboard calculations — shared by mock and live data. */
import {
  addDays,
  diffDays,
  formatMonth,
  formatShortDay,
  monthStartKey,
  weekStartKey,
  type DayKey,
} from "@/lib/dates";
import type { Barber, DailyBarberStat, DailyOutletStat, Outlet } from "@/lib/data/types";

export interface DateRange {
  from: DayKey;
  to: DayKey;
}

export interface Totals {
  revenue: number;
  transactions: number;
  customers: number;
  expenses: number;
}

const ZERO: Totals = { revenue: 0, transactions: 0, customers: 0, expenses: 0 };

const inRange = (d: DayKey, r: DateRange) => d >= r.from && d <= r.to;

export function sumTotals(
  daily: DailyOutletStat[],
  range: DateRange,
  outletIds: readonly string[],
): Totals {
  const ids = new Set(outletIds);
  return daily.reduce<Totals>((acc, row) => {
    if (!ids.has(row.outletId) || !inRange(row.date, range)) return acc;
    return {
      revenue: acc.revenue + row.revenue,
      transactions: acc.transactions + row.transactions,
      customers: acc.customers + row.customers,
      expenses: acc.expenses + row.expenses,
    };
  }, { ...ZERO });
}

/** Percentage change; null when there is no previous value to compare. */
export function growth(current: number, previous: number): number | null {
  if (previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

/** The equally long period immediately before `range`. */
export function previousRange(range: DateRange): DateRange {
  const len = diffDays(range.from, range.to) + 1;
  return { from: addDays(range.from, -len), to: addDays(range.from, -1) };
}

export interface KpiValue {
  value: number;
  growth: number | null;
}

export interface Overview {
  today: KpiValue;
  week: KpiValue;
  month: KpiValue;
  transactions: KpiValue;
  customers: KpiValue;
}

/**
 * Today vs yesterday; week-to-date vs same days last week;
 * month-to-date (incl. transactions & customers) vs same days last month.
 */
export function buildOverview(
  daily: DailyOutletStat[],
  today: DayKey,
  outletIds: readonly string[],
): Overview {
  const t = sumTotals(daily, { from: today, to: today }, outletIds);
  const y = sumTotals(daily, { from: addDays(today, -1), to: addDays(today, -1) }, outletIds);

  const weekFrom = weekStartKey(today);
  const wtd = sumTotals(daily, { from: weekFrom, to: today }, outletIds);
  const lastWeek = sumTotals(daily, { from: addDays(weekFrom, -7), to: addDays(today, -7) }, outletIds);

  const monthFrom = monthStartKey(today);
  const elapsed = diffDays(monthFrom, today);
  const prevMonthFrom = monthStartKey(addDays(monthFrom, -1));
  const prevMonthTo = addDays(prevMonthFrom, elapsed);
  const mtd = sumTotals(daily, { from: monthFrom, to: today }, outletIds);
  const lastMonth = sumTotals(
    daily,
    { from: prevMonthFrom, to: prevMonthTo < monthFrom ? prevMonthTo : addDays(monthFrom, -1) },
    outletIds,
  );

  return {
    today: { value: t.revenue, growth: growth(t.revenue, y.revenue) },
    week: { value: wtd.revenue, growth: growth(wtd.revenue, lastWeek.revenue) },
    month: { value: mtd.revenue, growth: growth(mtd.revenue, lastMonth.revenue) },
    transactions: { value: mtd.transactions, growth: growth(mtd.transactions, lastMonth.transactions) },
    customers: { value: mtd.customers, growth: growth(mtd.customers, lastMonth.customers) },
  };
}

export type Granularity = "daily" | "weekly" | "monthly";

export interface SeriesPoint {
  key: DayKey;
  label: string;
  revenue: number;
  transactions: number;
}

export function buildRevenueSeries(
  daily: DailyOutletStat[],
  range: DateRange,
  outletIds: readonly string[],
  granularity: Granularity,
): SeriesPoint[] {
  const ids = new Set(outletIds);
  const bucketOf = (d: DayKey) =>
    granularity === "daily" ? d : granularity === "weekly" ? weekStartKey(d) : monthStartKey(d);
  const buckets = new Map<DayKey, SeriesPoint>();

  // Seed every bucket so empty days still render.
  for (let d = range.from; d <= range.to; d = addDays(d, 1)) {
    const k = bucketOf(d);
    if (!buckets.has(k)) {
      const label =
        granularity === "monthly"
          ? formatMonth(k)
          : granularity === "weekly"
            ? `Mg ${formatShortDay(k < range.from ? range.from : k)}`
            : formatShortDay(k);
      buckets.set(k, { key: k, label, revenue: 0, transactions: 0 });
    }
  }
  for (const row of daily) {
    if (!ids.has(row.outletId) || !inRange(row.date, range)) continue;
    const b = buckets.get(bucketOf(row.date));
    if (b) {
      b.revenue += row.revenue;
      b.transactions += row.transactions;
    }
  }
  return [...buckets.values()];
}

export interface OutletPerformance {
  outlet: Outlet;
  revenue: number;
  customers: number;
  transactions: number;
  share: number;
  growth: number | null;
}

export function buildOutletPerformance(
  daily: DailyOutletStat[],
  range: DateRange,
  outlets: Outlet[],
): OutletPerformance[] {
  const prev = previousRange(range);
  const rows = outlets.map((outlet) => {
    const cur = sumTotals(daily, range, [outlet.id]);
    const before = sumTotals(daily, prev, [outlet.id]);
    return {
      outlet,
      revenue: cur.revenue,
      customers: cur.customers,
      transactions: cur.transactions,
      share: 0,
      growth: growth(cur.revenue, before.revenue),
    };
  });
  const total = rows.reduce((s, r) => s + r.revenue, 0);
  return rows
    .map((r) => ({ ...r, share: total ? r.revenue / total : 0 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export interface BarberPerformance {
  barber: Barber;
  outlet: Outlet | undefined;
  haircuts: number;
  revenue: number;
  commission: number;
}

export function buildBarberRanking(
  daily: DailyOutletStat[],
  range: DateRange,
  barbers: Barber[],
  outlets: Outlet[],
  outletIds: readonly string[],
  commissionRate: number,
  barberDaily?: DailyBarberStat[],
): BarberPerformance[] {
  const ids = new Set(outletIds);
  if (barberDaily) {
    const totals = new Map<string, { haircuts: number; revenue: number; commission: number }>();
    for (const row of barberDaily) {
      if (!ids.has(row.outletId) || !inRange(row.date, range)) continue;
      const current = totals.get(row.barberId) ?? { haircuts: 0, revenue: 0, commission: 0 };
      current.haircuts += row.haircuts;
      current.revenue += row.revenue;
      current.commission += row.commission;
      totals.set(row.barberId, current);
    }
    return barbers
      .filter((barber) => ids.has(barber.outletId))
      .map((barber) => {
        const total = totals.get(barber.id) ?? { haircuts: 0, revenue: 0, commission: 0 };
        return {
          barber,
          outlet: outlets.find((outlet) => outlet.id === barber.outletId),
          haircuts: total.haircuts,
          revenue: total.revenue,
          commission: total.commission,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }

  // Backward-compatible mock-only distribution.
  return barbers
    .filter((barber) => ids.has(barber.outletId))
    .map((barber) => {
      const totals = sumTotals(daily, range, [barber.outletId]);
      const revenue = Math.round(totals.revenue * barber.share);
      return {
        barber,
        outlet: outlets.find((outlet) => outlet.id === barber.outletId),
        haircuts: Math.round(totals.transactions * barber.share),
        revenue,
        commission: Math.round(revenue * commissionRate),
      };
    })
    .sort((a, b) => b.revenue - a.revenue);
}

export interface Financials {
  revenue: number;
  expenses: number;
  commissions: number;
  netProfit: number;
  margin: number;
}

/** Net profit = revenue − operational expenses − barber commissions. */
export function buildFinancials(revenue: number, expenses: number, commissions: number): Financials {
  const netProfit = revenue - expenses - commissions;
  return {
    revenue,
    expenses,
    commissions,
    netProfit,
    margin: revenue ? (netProfit / revenue) * 100 : 0,
  };
}
