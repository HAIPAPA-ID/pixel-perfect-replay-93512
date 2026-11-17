import { describe, expect, it } from "vitest";

import { canAccessPath, visibleOutletIds, type SessionUser } from "@/lib/access";

const OUTLETS = ["out-1", "out-2", "out-3"];
const owner: SessionUser = { id: "o", name: "O", role: "owner", outletId: null };
const manager: SessionUser = { id: "m", name: "M", role: "manager", outletId: "out-2" };
const cashier: SessionUser = { id: "c", name: "C", role: "cashier", outletId: "out-3" };

describe("role access", () => {
  it("owner sees every outlet", () => {
    expect(visibleOutletIds(owner, OUTLETS)).toEqual(OUTLETS);
  });

  it("owner can open business reports and admin pages", () => {
    expect(canAccessPath("owner", "/laporan")).toBe(true);
    expect(canAccessPath("owner", "/users")).toBe(true);
  });

  it("manager sees only the assigned outlet", () => {
    expect(visibleOutletIds(manager, OUTLETS)).toEqual(["out-2"]);
  });

  it("manager cannot manage outlets, users or settings", () => {
    expect(canAccessPath("manager", "/outlet")).toBe(false);
    expect(canAccessPath("manager", "/users")).toBe(false);
    expect(canAccessPath("manager", "/settings")).toBe(false);
  });

  it("cashier sees only the assigned outlet", () => {
    expect(visibleOutletIds(cashier, OUTLETS)).toEqual(["out-3"]);
  });

  it("cashier is limited to cashier functions", () => {
    expect(canAccessPath("cashier", "/kasir")).toBe(true);
    expect(canAccessPath("cashier", "/")).toBe(false);
    expect(canAccessPath("cashier", "/laporan")).toBe(false);
    expect(canAccessPath("cashier", "/pengeluaran")).toBe(false);
  });

  it("a manager with no assigned outlet sees no outlets", () => {
    expect(visibleOutletIds({ ...manager, outletId: null }, OUTLETS)).toEqual([]);
  });
});
