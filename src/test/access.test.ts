import { describe, expect, it } from "vitest";

import {
  ALL_OUTLETS,
  canAccessPath,
  canChooseAllOutlets,
  outletScope,
  resolveOutletSelection,
  visibleOutletIds,
  type SessionUser,
} from "@/lib/access";

const OUTLETS = ["out-1", "out-2", "out-3"];
const owner: SessionUser = { id: "o", name: "O", role: "owner", outletIds: [] };
const manager: SessionUser = { id: "m", name: "M", role: "manager", outletIds: ["out-2"] };
const cashier: SessionUser = { id: "c", name: "C", role: "cashier", outletIds: ["out-3"] };

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
    expect(visibleOutletIds({ ...manager, outletIds: [] }, OUTLETS)).toEqual([]);
  });
});

describe("outlet selection", () => {
  const two = ["out-1", "out-2"];

  it("owner defaults to all outlets", () => {
    expect(resolveOutletSelection("owner", two, null)).toBe(ALL_OUTLETS);
    expect(outletScope(ALL_OUTLETS, two)).toEqual(two);
  });

  it("owner keeps a stored outlet that still exists", () => {
    expect(resolveOutletSelection("owner", two, "out-2")).toBe("out-2");
  });

  it("a stored outlet the user can no longer access is dropped", () => {
    expect(resolveOutletSelection("cashier", ["out-1"], "out-2")).toBe("out-1");
  });

  it("cashier can never combine outlets", () => {
    expect(canChooseAllOutlets("cashier", 3)).toBe(false);
    expect(resolveOutletSelection("cashier", two, ALL_OUTLETS)).toBe("out-1");
  });

  it("manager may combine only when assigned to more than one outlet", () => {
    expect(canChooseAllOutlets("manager", 1)).toBe(false);
    expect(canChooseAllOutlets("manager", 2)).toBe(true);
  });

  it("an account with no outlets gets an empty scope", () => {
    expect(resolveOutletSelection("manager", [], null)).toBe("");
    expect(outletScope("", [])).toEqual([]);
  });

  it("scope never includes an outlet outside the user's access", () => {
    expect(outletScope("out-9", two)).toEqual([]);
  });
});
