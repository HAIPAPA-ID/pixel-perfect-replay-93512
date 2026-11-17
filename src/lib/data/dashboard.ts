/**
 * Live dashboard data access.
 * All business dates use Asia/Makassar; only completed, paid transactions count.
 */
import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { addDays, todayKey, type DayKey } from "@/lib/dates";
import type {
  Barber,
  DailyBarberStat,
  DailyOutletStat,
  DashboardDataset,
  Outlet,
} from "./types";

const BUSINESS_OFFSET = "+08:00";
const PAGE_SIZE = 500;

function startOfBusinessDay(key: DayKey): string {
  return new Date(`${key}T00:00:00${BUSINESS_OFFSET}`).toISOString();
}

function endExclusiveOfBusinessDay(key: DayKey): string {
  return new Date(`${addDays(key, 1)}T00:00:00${BUSINESS_OFFSET}`).toISOString();
}

async function fetchAllTransactions(from: string, to: string) {
  const rows: Array<{
    id: string;
    outlet_id: string;
    customer_id: string;
    total_amount: number;
    created_at: string;
    status: string;
    payment_status: string;
  }> = [];
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("transactions")
      .select("id, outlet_id, customer_id, total_amount, created_at, status, payment_status")
      .gte("created_at", from)
      .lt("created_at", to)
      .eq("status", "completed")
      .eq("payment_status", "paid")
      .order("created_at", { ascending: true })
      .range(offset, offset + PAGE_SIZE - 1);
    if (error) throw error;
    rows.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  return rows;
}

function businessDay(timestamp: string): DayKey {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(timestamp));
}

async function fetchDashboardDataset(): Promise<DashboardDataset> {
  const today = todayKey();
  // Covers the 12-month dashboard preset and the preceding comparison period.
  const fromKey = addDays(today, -400);
  const from = startOfBusinessDay(fromKey);
  const to = endExclusiveOfBusinessDay(today);

  const [outletResult, barberResult, transactionRows, expenseResult, settingsResult] =
    await Promise.all([
      supabase.from("outlets").select("id, name, address, is_active").order("name"),
      supabase.from("barbers").select("id, full_name, outlet_id, is_active").eq("is_active", true).order("full_name"),
      fetchAllTransactions(from, to),
      supabase.from("expenses").select("outlet_id, amount, expense_date").gte("expense_date", fromKey).lte("expense_date", today),
      supabase.from("commission_settings").select("commission_rate").eq("is_active", true),
    ]);

  if (outletResult.error) throw outletResult.error;
  if (barberResult.error) throw barberResult.error;
  if (expenseResult.error) throw expenseResult.error;
  if (settingsResult.error) throw settingsResult.error;

  const outlets: Outlet[] = (outletResult.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    city: row.address ?? "",
    active: row.is_active,
  }));
  const barbers: Barber[] = (barberResult.data ?? []).map((row) => ({
    id: row.id,
    name: row.full_name,
    outletId: row.outlet_id,
    share: 0,
  }));

  const dailyMap = new Map<string, DailyOutletStat>();
  const ensureDaily = (date: DayKey, outletId: string) => {
    const key = `${date}:${outletId}`;
    let row = dailyMap.get(key);
    if (!row) {
      row = { date, outletId, revenue: 0, transactions: 0, customers: 0, expenses: 0 };
      dailyMap.set(key, row);
    }
    return row;
  };

  const transactionById = new Map<string, { date: DayKey; outletId: string }>();
  const customerSets = new Map<string, Set<string>>();
  for (const tx of transactionRows) {
    const date = businessDay(tx.created_at);
    const row = ensureDaily(date, tx.outlet_id);
    row.revenue += Number(tx.total_amount) || 0;
    row.transactions += 1;
    const key = `${date}:${tx.outlet_id}`;
    let customers = customerSets.get(key);
    if (!customers) {
      customers = new Set<string>();
      customerSets.set(key, customers);
    }
    customers.add(tx.customer_id);
    transactionById.set(tx.id, { date, outletId: tx.outlet_id });
  }
  for (const [key, customers] of customerSets) {
    const row = dailyMap.get(key);
    if (row) row.customers = customers.size;
  }

  for (const expense of expenseResult.data ?? []) {
    ensureDaily(expense.expense_date, expense.outlet_id).expenses += Number(expense.amount) || 0;
  }

  const barberDailyMap = new Map<string, DailyBarberStat>();
  const transactionIds = [...transactionById.keys()];
  // Chunk the IN filter to stay within practical PostgREST URL limits.
  for (let i = 0; i < transactionIds.length; i += 100) {
    const ids = transactionIds.slice(i, i + 100);
    const { data, error } = await supabase
      .from("transaction_items")
      .select("transaction_id, barber_id, quantity, line_total, commission_amount")
      .in("transaction_id", ids);
    if (error) throw error;
    for (const item of data ?? []) {
      const tx = transactionById.get(item.transaction_id);
      if (!tx) continue;
      const key = `${tx.date}:${tx.outletId}:${item.barber_id}`;
      let row = barberDailyMap.get(key);
      if (!row) {
        row = {
          date: tx.date,
          outletId: tx.outletId,
          barberId: item.barber_id,
          haircuts: 0,
          revenue: 0,
          commission: 0,
        };
        barberDailyMap.set(key, row);
      }
      row.haircuts += Number(item.quantity) || 0;
      row.revenue += Number(item.line_total) || 0;
      row.commission += Number(item.commission_amount) || 0;
    }
  }

  const barberDaily: DailyBarberStat[] = [...barberDailyMap.values()];
  const barberRevenue = barberDaily.reduce((sum, row) => sum + row.revenue, 0);
  const barberCommission = barberDaily.reduce((sum, row) => sum + row.commission, 0);
  const commissionRate = barberRevenue > 0
    ? barberCommission / barberRevenue
    : (settingsResult.data ?? []).reduce((sum, row) => sum + Number(row.commission_rate), 0) /
      Math.max((settingsResult.data ?? []).length, 1) / 100;

  return {
    source: "live",
    today,
    commissionRate,
    outlets,
    barbers,
    daily: [...dailyMap.values()],
    barberDaily,
  };
}

export const dashboardQueryOptions = () =>
  queryOptions({
    queryKey: ["dashboard", "dataset", "live"],
    queryFn: fetchDashboardDataset,
    staleTime: 60_000,
  });
