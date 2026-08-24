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
import { round1, round2 } from "./utils";

export const SCORE_FIELDS: {
  key: ScoreKey
  label: string
  short: string
  max: number
  questions: number
  hint: string
}[] = [
  { key: "reading1", label: "خواندنی ۱", short: "خواندنی۱", max: 40, questions: 1, hint: "تلاوت و ارائه حفظ — ۴۰ نمره" },
  { key: "reading2", label: "خواندنی ۲", short: "خواندنی۲", max: 40, questions: 1, hint: "تلاوت دوم — ۴۰ نمره" },
  { key: "pageNumber", label: "شماره صفحه", short: "صفحه", max: 10, questions: 2, hint: "۲ سؤال، ۱۰ نمره" },
  { key: "verseNumber", label: "شماره آیه", short: "آیه", max: 5, questions: 1, hint: "۱ سؤال رند، ۵ نمره" },
  { key: "phraseRecognition", label: "تشخیص عبارت", short: "عبارت", max: 10, questions: 2, hint: "۲ سؤال، ۱۰ نمره" },
  { key: "verseOrder", label: "ترتیب آیه", short: "ترتیب‌آیه", max: 7, questions: 1, hint: "۱ سؤال، ۷ نمره" },
  { key: "pageOrder", label: "ترتیب صفحه", short: "ترتیب‌صفحه", max: 8, questions: 1, hint: "۱ سؤال، ۸ نمره" },
  { key: "firstLastVerse", label: "اول و آخر آیه", short: "اول‌آخر", max: 10, questions: 2, hint: "۲ سؤال، ۱۰ نمره" },
  { key: "counting", label: "شمارشی", short: "شمارشی", max: 10, questions: 2, hint: "۲ سؤال، ۱۰ نمره" },
];

export const ACADEMIC_MAX = SCORE_FIELDS.reduce((s, f) => s + f.max, 0); // 140
export const DISCIPLINE_MAX = 60;
export const ORAL_MAX = 50;
export const WRITTEN_MAX = 50;
export const EXAM_MAX = ORAL_MAX + WRITTEN_MAX; // 100
export const DAILY_AVG_MAX = 100;

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

export const ATTENDANCE_LABEL: Record<Attendance, string> = {
  present: "حاضر",
  late: "تأخیر",
  excused: "غیبت موجه",
  absent: "غیبت",
};

export const LEVEL_LABEL: Record<Level, string> = {
  A: "سطح الف",
  B: "سطح ب",
  C: "سطح ج",
};

export const LEVEL_CHANGE_LABEL: Record<LevelChange, string> = {
  promote: "ارتقاء",
  stay: "ابقاء",
  demote: "نزول",
};

export function academicTotal(scores: ScoreMap): number | null {
  const vals = SCORE_FIELDS.map((f) => scores[f.key]);
  if (vals.every((v) => v == null)) return null;
  return round1(vals.reduce<number>((a, b) => a + (b ?? 0), 0));
}

export function dailyAverage(academic: number | null, discipline: number | null): number | null {
  if (academic == null && discipline == null) return null;
  return round1(((academic ?? 0) + (discipline ?? 0)) / 2);
}

export function mean(nums: Array<number | null | undefined>): number | null {
  const xs = nums.filter((n): n is number => n != null && !Number.isNaN(n));
  if (xs.length === 0) return null;
  return round2(xs.reduce((a, b) => a + b, 0) / xs.length);
}

export function examTotal(oral: number | null, written: number | null): number | null {
  if (oral == null && written == null) return null;
  return round1((oral ?? 0) + (written ?? 0));
}

/** نمره ارزیابی کل هفته = میانگین (میانگین روزهای هفته ، جمع شفاهی و کتبی) */
export function weekTotalScore(
  weekDailyAvg: number | null,
  exam: number | null,
): number | null {
  if (weekDailyAvg == null && exam == null) return null;
  return round2(((weekDailyAvg ?? 0) + (exam ?? 0)) / 2);
}

export function levelFromScore(score: number | null, settings: ClassSettings): Level {
  if (score == null) return "C";
  if (score >= settings.levelA) return "A";
  if (score >= settings.levelB) return "B";
  return "C";
}

export function levelChange(from: Level, to: Level): LevelChange {
  const rank: Record<Level, number> = { A: 3, B: 2, C: 1 };
  if (rank[to] > rank[from]) return "promote";
  if (rank[to] < rank[from]) return "demote";
  return "stay";
}

export function levelChangePhrase(from: Level, to: Level): string {
  const change = levelChange(from, to);
  if (change === "promote") return `ارتقاء به ${LEVEL_LABEL[to]}`;
  if (change === "demote") return `نزول به ${LEVEL_LABEL[to]}`;
  return `ابقاء در ${LEVEL_LABEL[to]}`;
}

export function cardForPoints(points: number, settings: ClassSettings): "gold" | "silver" | "bronze" | null {
  if (points >= settings.goldAt) return "gold";
  if (points >= settings.silverAt) return "silver";
  if (points >= settings.bronzeAt) return "bronze";
  return null;
}

export const CARD_LABEL = {
  gold: "کارت طلایی",
  silver: "کارت نقره‌ای",
  bronze: "کارت برنزی",
} as const;

export function performancePoints(score: number | null, settings: ClassSettings): number {
  if (score == null) return 0;
  if (score >= settings.levelA) return settings.pointsHigh;
  if (score >= settings.levelB) return settings.pointsMid;
  if (score >= 65) return settings.pointsLow;
  return 0;
}

export function summarizeDailies(dailies: DailyRecord[]) {
  const present = dailies.filter((d) => d.attendance === "present" || d.attendance === "late");
  const avgs = present.map((d) => dailyAverage(academicTotal(d.scores), d.discipline));
  const discs = present.map((d) => d.discipline);
  const academics = present.map((d) => academicTotal(d.scores));
  return {
    dailyAvg: mean(avgs),
    disciplineAvg: mean(discs),
    academicAvg: mean(academics),
    presentCount: present.length,
    excusedCount: dailies.filter((d) => d.attendance === "excused").length,
    absentCount: dailies.filter((d) => d.attendance === "absent").length,
  };
}

export function fieldAverage(dailies: DailyRecord[], key: ScoreKey): number | null {
  return mean(dailies.map((d) => d.scores[key]));
}

export function fieldPercent(value: number | null, max: number): number | null {
  if (value == null) return null;
  return round1((value / max) * 100);
}

export function computeWeekly(
  dailies: DailyRecord[],
  weekly: WeeklyRecord | undefined,
  prevLevel: Level,
  settings: ClassSettings,
) {
  const summary = summarizeDailies(dailies);
  const exam = examTotal(weekly?.oralExam ?? null, weekly?.writtenExam ?? null);
  const total = weekTotalScore(summary.dailyAvg, exam);
  const nextLevel = levelFromScore(total, settings);
  const change = levelChange(prevLevel, nextLevel);
  return {
    ...summary,
    examTotal: exam,
    oralExam: weekly?.oralExam ?? null,
    writtenExam: weekly?.writtenExam ?? null,
    weekTotal: total,
    nextLevel,
    change,
    phrase: levelChangePhrase(prevLevel, nextLevel),
  };
}
