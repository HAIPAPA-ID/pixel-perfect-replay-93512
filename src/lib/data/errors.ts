/** Turns Supabase/PostgREST errors into plain Indonesian text for staff. */
export function dataErrorMessage(error: unknown): string {
  const e = (error ?? {}) as { code?: string; message?: string };
  const message = (e.message ?? "").toLowerCase();
  if (e.code === "42501" || message.includes("permission denied")) {
    return "Akun Anda tidak memiliki izin untuk membaca data ini.";
  }
  if (e.code === "PGRST301" || message.includes("jwt")) {
    return "Sesi login sudah berakhir. Silakan masuk kembali.";
  }
  if (message.includes("fetch") || message.includes("network")) {
    return "Tidak dapat terhubung ke server. Periksa koneksi internet.";
  }
  return e.message ? `Data gagal dimuat: ${e.message}` : "Data gagal dimuat. Silakan coba lagi.";
}
