// src/lib/scoring.ts
import type {
  Attendance,
  ClassSettings,
  DailyRecord,
  Level,
  LevelChange,
  ScoreKey,
  ScoreMap,
  WeeklyRecord,
} from "./types";

export const DISCIPLINE_MAX = 60;

export const SCORE_FIELDS: Array<{ key: ScoreKey; label: string; max: number }> = [
  { key: "reading1", label: "خواندنی ۱", max: 20 },
  { key: "reading2", label: "خواندنی ۲", max: 20 },
  { key: "pageNumber", label: "شماره صفحه", max: 10 },
  { key: "verseNumber", label: "شماره آیه", max: 10 },
  { key: "phraseRecognition", label: "تشخیص عبارت", max: 10 },
  { key: "verseOrder", label: "ترتیب آیه", max: 10 },
  { key: "pageOrder", label: "ترتیب صفحه", max: 10 },
  { key: "firstLastVerse", label: "اول و آخر آیه", max: 10 },
  { key: "counting", label: "شمارشی", max: 10 },
];

export const EMPTY_SCORES: ScoreMap = {
  reading1: null,
  reading2: null,
  pageNumber: null,
  verseNumber: null,
  phraseRecognition: null,
  verseOrder: null,
  pageOrder: null,
  firstLastVerse: null,
  counting: null,
};

export function mean(values: Array<number | null | undefined>): number | null {
  const xs = values.filter((v): v is number => typeof v === "number" && !Number.isNaN(v));
  if (xs.length === 0) return null;
  return Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10;
}

export function academicTotal(scores: ScoreMap): number | null {
  const keys = SCORE_FIELDS.map((f) => f.key);
  const vals = keys.map((k) => scores[k]);
  if (vals.every((v) => v == null)) return null;
  return vals.reduce<number>((sum, v) => sum + (v ?? 0), 0);
}

export function dailyAverage(academic: number | null, discipline: number | null): number | null {
  if (academic == null && discipline == null) return null;
  const a = academic ?? 0;
  const d = discipline ?? 0;
  // میانگین روز = (نمره علمی + انضباط) / 2  → سقف حدود ۱۰۰
  return Math.round(((a + d) / 2) * 10) / 10;
}

export function fieldAverage(dailies: DailyRecord[], key: ScoreKey): number | null {
  return mean(dailies.map((d) => d.scores[key]));
}

export function fieldPercent(avg: number | null, max: number): number | null {
  if (avg == null || max <= 0) return null;
  return Math.round((avg / max) * 1000) / 10;
}

/** کارت بر اساس امتیاز کل انباشته (تنظیمات کلاس) */
export type CardType = "gold" | "silver" | "bronze";

export const CARD_LABEL: Record<CardType, string> = {
  gold: "طلایی",
  silver: "نقره‌ای",
  bronze: "برنزی",
};

export function cardForPoints(totalPoints: number, settings: ClassSettings): CardType | null {
  if (totalPoints >= settings.goldAt) return "gold";
  if (totalPoints >= settings.silverAt) return "silver";
  if (totalPoints >= settings.bronzeAt) return "bronze";
  return null;
}

/**
 * کارت هفتگی طبق قوانین دکتر میربلوک (بر اساس نمره ارزیابی هفته + سطح فعلی)
 * حد نصاب مشترک: طلایی ۹۰+ | نقره‌ای ۸۵–۸۹ | برنزی ۸۱–۸۴
 * امتیاز کارت بسته به سطح A/B/C متفاوت است.
 */
export function weeklyCardForScore(
  weekTotal: number | null,
  level: Level,
): { type: CardType; label: string; points: number } | null {
  if (weekTotal == null) return null;
  let type: CardType | null = null;
  if (weekTotal >= 90) type = "gold";
  else if (weekTotal >= 85) type = "silver";
  else if (weekTotal >= 81) type = "bronze";
  if (!type) return null;

  const pointsTable: Record<Level, Record<CardType, number>> = {
    A: { gold: 2000, silver: 1500, bronze: 1000 },
    B: { gold: 1000, silver: 750, bronze: 500 },
    C: { gold: 500, silver: 400, bronze: 300 },
  };
  return {
    type,
    label: CARD_LABEL[type],
    points: pointsTable[level][type],
  };
}

/** امتیاز عملکرد هفته بر اساس نمره کل (تنظیمات کلاس) */
export function performancePoints(weekTotal: number | null, settings: ClassSettings): number {
  if (weekTotal == null) return 0;
  if (weekTotal >= settings.levelA) return settings.pointsHigh;
  if (weekTotal >= settings.levelB) return settings.pointsMid;
  return settings.pointsLow;
}

/**
 * محاسبه کامل هفته برای یک دانش‌آموز
 */
export function computeWeekly(
  days: DailyRecord[],
  weekly: WeeklyRecord | undefined,
  prevLevel: Level,
  settings: ClassSettings,
) {
  const presentDays = days.filter((d) => d.attendance === "present" || d.attendance === "late");
  const academicAvgs = presentDays.map((d) => academicTotal(d.scores));
  const disciplineAvgs = presentDays.map((d) => d.discipline);
  const dailyAvgs = presentDays.map((d) => dailyAverage(academicTotal(d.scores), d.discipline));

  const academicAvg = mean(academicAvgs);
  const disciplineAvg = mean(disciplineAvgs);
  const dailyAvg = mean(dailyAvgs);

  // نمره ارزیابی هفته = میانگین روز + نیمی از آزمون شفاهی و کتبی (هر کدام از ۵۰)
  let weekTotal: number | null = null;
  if (dailyAvg != null || weekly?.oralExam != null || weekly?.writtenExam != null) {
    const oral = weekly?.oralExam ?? 0;
    const written = weekly?.writtenExam ?? 0;
    const base = dailyAvg ?? 0;
    weekTotal = Math.round((base * 0.6 + (oral + written) * 0.4) * 10) / 10;
  }

  // سطح بعدی
  let nextLevel: Level = prevLevel;
  let change: LevelChange = "stay";
  if (weekTotal != null) {
    if (weekTotal >= settings.levelA) {
      nextLevel = "A";
      if (prevLevel !== "A") change = "promote";
    } else if (weekTotal >= settings.levelB) {
      nextLevel = "B";
      if (prevLevel === "C") change = "promote";
      else if (prevLevel === "A") change = "demote";
    } else {
      nextLevel = "C";
      if (prevLevel !== "C") change = "demote";
    }
  }

  // کارت هفتگی طبق قوانین جدید
  const card = weeklyCardForScore(weekTotal, prevLevel);

  // شمارش روزهای ضعیف (نمره روز زیر ۷۰)
  const lowDays = presentDays.filter((d) => {
    const avg = dailyAverage(academicTotal(d.scores), d.discipline);
    return avg != null && avg < 70;
  }).length;

  // غیبت‌ها
  const nonExcused = days.filter((d) => d.attendance === "absent").length;
  const excused = days.filter((d) => d.attendance === "excused").length;

  return {
    academicAvg,
    disciplineAvg,
    dailyAvg,
    weekTotal,
    nextLevel,
    change,
    card,
    lowDays,
    nonExcused,
    excused,
    suspended: lowDays >= 2,
  };
}

/** جریمه امتیاز بابت غیبت (طبق دستور دکتر میربلوک) */
export function absencePenalty(nonExcused: number, excused: number): number {
  return nonExcused * 1000 + excused * 500;
}
