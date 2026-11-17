import { describe, expect, it } from "vitest";

import { buildFinancials, growth, sumTotals } from "@/lib/dashboard/metrics";

describe("dashboard metrics", () => {
  it("net profit is revenue minus operational expenses minus barber commissions", () => {
    const f = buildFinancials(10_000_000, 2_500_000, 3_500_000);
    expect(f.netProfit).toBe(4_000_000);
    expect(f.margin).toBe(40);
  });

  it("growth has no value when there is nothing to compare against", () => {
    expect(growth(500, 0)).toBeNull();
    expect(growth(150, 100)).toBe(50);
  });

  it("totals only include the selected outlets and dates", () => {
    const daily = [
      { date: "2026-01-01", outletId: "a", revenue: 100, transactions: 1, customers: 1, expenses: 10 },
      { date: "2026-01-02", outletId: "a", revenue: 200, transactions: 2, customers: 2, expenses: 20 },
      { date: "2026-01-02", outletId: "b", revenue: 999, transactions: 9, customers: 9, expenses: 99 },
    ];
    const t = sumTotals(daily, { from: "2026-01-02", to: "2026-01-02" }, ["a"]);
    expect(t.revenue).toBe(200);
  });
});
