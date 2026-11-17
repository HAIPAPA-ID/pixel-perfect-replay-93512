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
  /** Assigned outlet. Required for manager and cashier; ignored for owner. */
  outletId: string | null;
}

/** Outlet ids this user may see, given every outlet in the business. */
export function visibleOutletIds(user: SessionUser, allOutletIds: readonly string[]): string[] {
  if (canViewAllOutlets(user.role)) return [...allOutletIds];
  return user.outletId && allOutletIds.includes(user.outletId) ? [user.outletId] : [];
}
