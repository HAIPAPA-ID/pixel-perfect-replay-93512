import {
  BarChart3,
  CalendarClock,
  LayoutDashboard,
  Package,
  ReceiptText,
  Scissors,
  Settings,
  ShieldCheck,
  Store,
  Users,
  Wallet,
  WalletCards,
  type LucideIcon,
} from "lucide-react";

import type { AppPath } from "@/lib/access";

export interface NavItem {
  title: string;
  path: AppPath;
  icon: LucideIcon;
  group: "utama" | "operasional" | "keuangan" | "admin";
}

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", path: "/", icon: LayoutDashboard, group: "utama" },
  { title: "Kasir / POS", path: "/kasir", icon: WalletCards, group: "utama" },
  { title: "Transaksi", path: "/transaksi", icon: ReceiptText, group: "operasional" },
  { title: "Pelanggan", path: "/pelanggan", icon: Users, group: "operasional" },
  { title: "Capster", path: "/capster", icon: Scissors, group: "operasional" },
  { title: "Booking", path: "/booking", icon: CalendarClock, group: "operasional" },
  { title: "Produk & Treatment", path: "/produk", icon: Package, group: "operasional" },
  { title: "Pengeluaran", path: "/pengeluaran", icon: Wallet, group: "keuangan" },
  { title: "Laporan Keuangan", path: "/laporan", icon: BarChart3, group: "keuangan" },
  { title: "Outlet", path: "/outlet", icon: Store, group: "admin" },
  { title: "User Management", path: "/users", icon: ShieldCheck, group: "admin" },
  { title: "Settings", path: "/settings", icon: Settings, group: "admin" },
];

export const NAV_GROUP_LABEL: Record<NavItem["group"], string> = {
  utama: "Utama",
  operasional: "Operasional",
  keuangan: "Keuangan",
  admin: "Administrasi",
};

export function navItemFor(pathname: string): NavItem | undefined {
  if (pathname === "/") return NAV_ITEMS[0];
  return NAV_ITEMS.find((i) => i.path !== "/" && pathname.startsWith(i.path));
}
