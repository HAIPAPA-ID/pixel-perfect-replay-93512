/**
 * Pure checks applied to a row from the existing `profiles` table after a
 * real Supabase sign-in. Kept free of Supabase imports so it is testable.
 */
import type { Role } from "@/lib/access";

export interface ProfileRow {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

/** Maps the role text stored in `profiles.role` to an app role; unknown values are rejected. */
export function mapProfileRole(dbRole: string | null | undefined): Role | null {
  switch ((dbRole ?? "").trim().toLowerCase()) {
    case "owner":
      return "owner";
    case "manager":
      return "manager";
    case "cashier":
      return "cashier";
    default:
      return null;
  }
}

export type ProfileCheck =
  | { ok: true; role: Role; name: string }
  | { ok: false; reason: string };

export function checkProfile(row: ProfileRow | null | undefined): ProfileCheck {
  if (!row) {
    return { ok: false, reason: "Akun ini belum memiliki profil HAIPAPA. Hubungi Owner." };
  }
  if (!row.is_active) {
    return { ok: false, reason: "Akun Anda sedang tidak aktif. Hubungi Owner untuk mengaktifkan." };
  }
  const role = mapProfileRole(row.role);
  if (!role) {
    return {
      ok: false,
      reason: "Peran akun ini belum didukung di HAIPAPA Barber Management. Hubungi Owner.",
    };
  }
  return { ok: true, role, name: row.full_name?.trim() || "Pengguna HAIPAPA" };
}

/** Friendly Indonesian text for Supabase sign-in errors. */
export function signInErrorMessage(message: string | undefined): string {
  const m = (message ?? "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Email atau kata sandi salah.";
  if (m.includes("email not confirmed")) return "Email belum dikonfirmasi. Periksa kotak masuk Anda.";
  if (m.includes("rate limit") || m.includes("too many")) {
    return "Terlalu banyak percobaan. Coba lagi beberapa saat lagi.";
  }
  if (m.includes("fetch") || m.includes("network")) return "Tidak dapat terhubung. Periksa koneksi internet.";
  return "Login gagal. Silakan coba lagi.";
}
