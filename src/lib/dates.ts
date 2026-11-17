/**
 * Business-day helpers. All dashboard dates are "YYYY-MM-DD" keys in the
 * business timezone so server render and browser hydration agree.
 */
export const BUSINESS_TIMEZONE = "Asia/Makassar";

export type DayKey = string; // YYYY-MM-DD

export function todayKey(now: Date = new Date()): DayKey {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: BUSINESS_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function keyToUTCDate(key: DayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12));
}

export function utcDateToKey(date: Date): DayKey {
  return date.toISOString().slice(0, 10);
}

export function addDays(key: DayKey, days: number): DayKey {
  const d = keyToUTCDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return utcDateToKey(d);
}

export function diffDays(from: DayKey, to: DayKey): number {
  return Math.round((keyToUTCDate(to).getTime() - keyToUTCDate(from).getTime()) / 86_400_000);
}

/** Monday of the week containing `key`. */
export function weekStartKey(key: DayKey): DayKey {
  const dow = keyToUTCDate(key).getUTCDay(); // 0 = Sunday
  return addDays(key, dow === 0 ? -6 : 1 - dow);
}

export function monthStartKey(key: DayKey): DayKey {
  return `${key.slice(0, 7)}-01`;
}

export function dayOfWeek(key: DayKey): number {
  return keyToUTCDate(key).getUTCDay();
}

/** Local calendar Date (from a date picker) -> key, ignoring timezone shifts. */
export function localDateToKey(date: Date): DayKey {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function keyToLocalDate(key: DayKey): Date {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const fmt = (opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("id-ID", { timeZone: "UTC", ...opts });

const shortDay = fmt({ day: "numeric", month: "short" });
const longDay = fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" });
const monthYear = fmt({ month: "short", year: "2-digit" });

export const formatShortDay = (key: DayKey) => shortDay.format(keyToUTCDate(key));
export const formatLongDay = (key: DayKey) => longDay.format(keyToUTCDate(key));
export const formatMonth = (key: DayKey) => monthYear.format(keyToUTCDate(key));
