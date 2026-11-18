/**
 * Role-based access rules for HAIPAPA.
 * - Owner: every outlet and every module, including business reports.
 * - Manager: only the assigned outlet; operational modules, no company admin.
 * - Cashier: only the assigned outlet and cashier functions.
 */
export type Role = "owner" | "manager" | "cashier";

export const ROLE_LABEL: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  cashier: "Kasir",
};

export const APP_PATHS = [
  "/",
  "/kasir",
  "/transaksi",
  "/pelanggan",
  "/capster",
  "/booking",
  "/produk",
  "/pengeluaran",
  "/laporan",
  "/outlet",
  "/users",
  "/settings",
] as const;

export type AppPath = (typeof APP_PATHS)[number];

export const ROLE_ACCESS: Record<Role, readonly AppPath[]> = {
  owner: APP_PATHS,
  manager: [
    "/",
    "/kasir",
    "/transaksi",
    "/pelanggan",
    "/capster",
    "/booking",
    "/produk",
    "/pengeluaran",
    "/laporan",
  ],
  cashier: ["/kasir", "/transaksi", "/pelanggan", "/booking"],
};

/** Where each role lands after sign-in. */
export const ROLE_HOME: Record<Role, AppPath> = {
  owner: "/",
  manager: "/",
  cashier: "/kasir",
};

export function canAccessPath(role: Role, pathname: string): boolean {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const allowed = ROLE_ACCESS[role];
  return allowed.some((p) =>
    p === "/" ? normalized === "/" : normalized === p || normalized.startsWith(`${p}/`),
  );
}

export function canViewAllOutlets(role: Role): boolean {
  return role === "owner";
}

export interface SessionUser {
  id: string;
  name: string;
  role: Role;
  /**
   * Outlets the database lets this user access (read from `outlets` under RLS).
   * Ignored for owner, who sees every outlet.
   */
  outletIds: string[];
}

/** Outlet ids this user may see, given every outlet in the business. */
export function visibleOutletIds(user: SessionUser, allOutletIds: readonly string[]): string[] {
  if (canViewAllOutlets(user.role)) return [...allOutletIds];
  return allOutletIds.filter((id) => user.outletIds.includes(id));
}

/** Selection value meaning "every outlet this user may access". */
export const ALL_OUTLETS = "all";

/** Owner always may combine outlets; a manager only when assigned to more than one; a cashier never. */
export function canChooseAllOutlets(role: Role, accessibleCount: number): boolean {
  if (role === "owner") return true;
  if (role === "manager") return accessibleCount > 1;
  return false;
}

/**
 * Picks the active outlet selection from a stored preference.
 * Falls back to "all" when allowed, otherwise the first accessible outlet, otherwise "".
 */
export function resolveOutletSelection(
  role: Role,
  accessibleIds: readonly string[],
  stored: string | null | undefined,
): string {
  const allowAll = canChooseAllOutlets(role, accessibleIds.length);
  if (stored === ALL_OUTLETS && allowAll) return ALL_OUTLETS;
  if (stored && accessibleIds.includes(stored)) return stored;
  if (allowAll) return ALL_OUTLETS;
  return accessibleIds[0] ?? "";
}

/** Outlet ids covered by a selection; never wider than what the user may access. */
export function outletScope(selection: string, accessibleIds: readonly string[]): string[] {
  if (selection === ALL_OUTLETS) return [...accessibleIds];
  return accessibleIds.includes(selection) ? [selection] : [];
}
