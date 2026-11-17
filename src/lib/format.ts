const idr = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});
const num = new Intl.NumberFormat("id-ID");
const dec1 = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

export const formatIDR = (value: number) => idr.format(Math.round(value)).replace(/\u00a0/g, " ");

/** Compact rupiah: Rp 12,4 jt / Rp 1,2 M / Rp 850 rb */
export function formatCompactIDR(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (abs >= 1_000_000_000) return `${sign}Rp ${dec1.format(abs / 1_000_000_000)} M`;
  if (abs >= 1_000_000) return `${sign}Rp ${dec1.format(abs / 1_000_000)} jt`;
  if (abs >= 1_000) return `${sign}Rp ${dec1.format(abs / 1_000)} rb`;
  return `${sign}Rp ${num.format(Math.round(abs))}`;
}

export const formatNumber = (value: number) => num.format(Math.round(value));

export function formatPercent(value: number, withSign = false): string {
  const s = `${dec1.format(Math.abs(value))}%`;
  if (!withSign) return s;
  return value > 0 ? `+${s}` : value < 0 ? `−${s}` : s;
}
