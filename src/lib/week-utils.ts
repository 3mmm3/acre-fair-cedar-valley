import type { Week } from "./types";
import { addJalaliDays, formatJalaliLong, parseJalali, monthName } from "./jalali";

export function buildFollowingWeek(prev: Week): Week {
  const startDate = addJalaliDays(prev.startDate, 7);
  const endDate = addJalaliDays(prev.endDate, 7);
  const evalDate = addJalaliDays(prev.evalDate, 7);
  const sessionDates = prev.sessionDates.map((d) => addJalaliDays(d, 7));
  const { y, m, d } = parseJalali(evalDate);
  return {
    id: `w${y}-${m}-${d}`,
    startDate,
    endDate,
    evalDate,
    sessionDates,
    label: `هفته ${d} ${monthName(m)} ${y}`,
    status: "open",
  };
}

export function weekCaption(week: Week): string {
  return `${week.label} · ارزیابی ${formatJalaliLong(week.evalDate)}`;
}
