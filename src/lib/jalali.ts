const WEEKDAYS = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنجشنبه", "جمعه"] as const;

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
] as const;

/** Parse "1405/5/17" or "1405/05/17". */
export function parseJalali(date: string): { y: number; m: number; d: number } {
  const [y, m, d] = date.split("/").map((x) => Number(x));
  return { y, m, d };
}

export function padJalali(date: string): string {
  const { y, m, d } = parseJalali(date);
  return `${y}/${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}`;
}

export function monthName(m: number): string {
  return MONTHS[m - 1] ?? "";
}

export function formatJalaliLong(date: string): string {
  const { y, m, d } = parseJalali(date);
  return `${d} ${monthName(m)} ${y}`;
}

export function formatJalaliShort(date: string): string {
  const { y, m, d } = parseJalali(date);
  return `${d} ${monthName(m)}`;
}

function daysInJalaliMonth(m: number): number {
  if (m <= 6) return 31;
  if (m <= 11) return 30;
  return 29;
}

export function addJalaliDays(date: string, delta: number): string {
  const p = parseJalali(date);
  let y = p.y;
  let m = p.m;
  let d = p.d + delta;
  if (delta >= 0) {
    while (d > daysInJalaliMonth(m)) {
      d -= daysInJalaliMonth(m);
      m += 1;
      if (m > 12) {
        m = 1;
        y += 1;
      }
    }
  } else {
    while (d < 1) {
      m -= 1;
      if (m < 1) {
        m = 12;
        y -= 1;
      }
      d += daysInJalaliMonth(m);
    }
  }
  return `${y}/${m}/${d}`;
}

/**
 * Weekday for Jalali dates in Mordad 1405 (known mapping):
 * 1405/5/17 = Saturday. Formula uses a linear day index from that epoch.
 */
export function weekdayIndex(date: string): number {
  const { y, m, d } = parseJalali(date);
  const epoch = jalaliDayNumber(1405, 5, 17);
  const n = jalaliDayNumber(y, m, d);
  const diff = n - epoch;
  return ((diff % 7) + 7) % 7;
}

function jalaliDayNumber(y: number, m: number, d: number): number {
  const md = [0, 31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  let n = y * 365 + Math.floor((y - 1) / 4);
  for (let i = 1; i < m; i++) n += md[i];
  return n + d;
}

export function weekdayName(date: string): string {
  return WEEKDAYS[weekdayIndex(date)];
}

export function formatJalaliWithWeekday(date: string): string {
  return `${weekdayName(date)} ${formatJalaliLong(date)}`;
}

export function compareJalali(a: string, b: string): number {
  const pa = parseJalali(a);
  const pb = parseJalali(b);
  return pa.y - pb.y || pa.m - pb.m || pa.d - pb.d;
}
