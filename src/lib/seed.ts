import type {
  AppState,
  ClassSettings,
  DailyRecord,
  Level,
  PointsEvent,
  ScoreMap,
  ScoreKey,
  Student,
  Week,
  WeeklyRecord,
} from "./types";
import { SCORE_FIELDS } from "./scoring";

const SETTINGS: ClassSettings = {
  institution: "دارالقرآن",
  className: "طرح صبحگاهی حافظان",
  teacherName: "",
  levelA: 85,
  levelB: 75,
  pointsHigh: 400,
  pointsMid: 250,
  pointsLow: 100,
  ethicsBonus: 1000,
  promotionBonus: 200,
  bronzeAt: 500,
  silverAt: 750,
  goldAt: 2000,
};

const KEYS: ScoreKey[] = SCORE_FIELDS.map((f) => f.key);

function scores(vals: number[]): ScoreMap {
  const s = {} as ScoreMap;
  KEYS.forEach((k, i) => {
    s[k] = vals[i] ?? null;
  });
  return s;
}

function emptyScores(): ScoreMap {
  const s = {} as ScoreMap;
  KEYS.forEach((k) => {
    s[k] = null;
  });
  return s;
}

const STUDENTS: Student[] = [
  {
    id: "s01",
    fullName: "محمد طه زارعیان",
    shortName: "محمدطه زارعیان",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "C",
    totalPoints: 500,
  },
  {
    id: "s02",
    fullName: "محمد طه میرشکار",
    shortName: "محمدطه میرشکار",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "B",
    totalPoints: 0,
  },
  {
    id: "s03",
    fullName: "سید محمدطه حسینی",
    shortName: "سیدمحمدطه حسینی",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "B",
    totalPoints: 200,
  },
  {
    id: "s04",
    fullName: "ابوالفضل دهقانیزاده",
    shortName: "دهقانیزاده",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "B",
    totalPoints: 750,
  },
  {
    id: "s05",
    fullName: "محمدمهدی زارعیان",
    shortName: "محمدمهدی زارعیان",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
  {
    id: "s06",
    fullName: "بهنام بیک",
    shortName: "بهنام بیک",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
  {
    id: "s07",
    fullName: "محمد امین زارع",
    shortName: "محمدامین زارع",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "B",
    totalPoints: 2000,
  },
  {
    id: "s08",
    fullName: "سیدمصطفی طباطبایی‌نسب",
    shortName: "طباطبایی‌نسب",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
  {
    id: "s09",
    fullName: "ابوالفضل پورصباغ",
    shortName: "پورصباغ",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
  {
    id: "s10",
    fullName: "بهزاد بیک",
    shortName: "بهزاد بیک",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "",
    photo: null,
    currentLevel: "B",
    totalPoints: 750,
  },
  {
    id: "s11",
    fullName: "سیدعلی حسینی‌مهر",
    shortName: "حسینی‌مهر",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "غیبت موجه در بخشی از هفته ۲۲ مرداد — نمره پایه",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
  {
    id: "s12",
    fullName: "محمدرضا زارع بیدکی",
    shortName: "محمدرضا زارع",
    fatherName: "",
    phone: "",
    birthYear: "",
    joinDate: "1404/7/1",
    city: "",
    currentJuz: "",
    notes: "غیبت موجه در بخشی از هفته ۲۲ مرداد — نمره پایه",
    photo: null,
    currentLevel: "C",
    totalPoints: 0,
  },
];

const WEEKS: Week[] = [
  {
    id: "w08",
    startDate: "1405/5/3",
    endDate: "1405/5/7",
    evalDate: "1405/5/8",
    sessionDates: ["1405/5/3", "1405/5/4", "1405/5/5", "1405/5/6", "1405/5/7"],
    label: "هفته ۸ مرداد ۱۴۰۵",
    status: "complete",
  },
  {
    id: "w15",
    startDate: "1405/5/10",
    endDate: "1405/5/14",
    evalDate: "1405/5/15",
    sessionDates: ["1405/5/10", "1405/5/11", "1405/5/12", "1405/5/13", "1405/5/14"],
    label: "هفته ۱۵ مرداد ۱۴۰۵",
    status: "complete",
  },
  {
    id: "w22",
    startDate: "1405/5/17",
    endDate: "1405/5/21",
    evalDate: "1405/5/22",
    sessionDates: ["1405/5/17", "1405/5/18", "1405/5/19", "1405/5/20", "1405/5/21"],
    label: "هفته ۲۲ مرداد ۱۴۰۵",
    status: "complete",
  },
  {
    id: "w29",
    startDate: "1405/5/24",
    endDate: "1405/5/28",
    evalDate: "1405/5/29",
    sessionDates: ["1405/5/24", "1405/5/25", "1405/5/26", "1405/5/27", "1405/5/28"],
    label: "هفته ۲۹ مرداد ۱۴۰۵",
    status: "open",
  },
];

type DaySpec = {
  date: string
  vals: number[]
  disc: number
  att?: DailyRecord["attendance"]
};

function daysFor(studentId: string, weekId: string, specs: DaySpec[]): DailyRecord[] {
  return specs.map((sp, i) => ({
    id: `${studentId}-${weekId}-${i}`,
    studentId,
    weekId,
    date: sp.date,
    attendance: sp.att ?? "present",
    scores: scores(sp.vals),
    discipline: sp.disc,
    notes: sp.att === "excused" ? "غیبت موجه — نمره پایه" : "",
  }));
}

function emptyWeekDays(studentId: string, week: Week): DailyRecord[] {
  return week.sessionDates.map((date, i) => ({
    id: `${studentId}-${week.id}-${i}`,
    studentId,
    weekId: week.id,
    date,
    attendance: "present",
    scores: emptyScores(),
    discipline: null,
    notes: "",
  }));
}

/** Real daily scores from the class Excel — week of 22 Mordad 1405. */
const W22_DAYS: Record<string, DaySpec[]> = {
  s01: [
    { date: "1405/5/17", vals: [38, 23, 5, 0, 10, 7, 8, 0, 10], disc: 60 },
    { date: "1405/5/18", vals: [19, 37, 5, 5, 10, 2, 2, 0, 0], disc: 50 },
    { date: "1405/5/19", vals: [21, 21, 0, 5, 5, 3, 2, 5, 5], disc: 60 },
    { date: "1405/5/20", vals: [20, 40, 5, 5, 5, 1, 4, 0, 10], disc: 40 },
    { date: "1405/5/21", vals: [39, 26, 0, 5, 0, 2, 2, 5, 0], disc: 40 },
  ],
  s02: [
    { date: "1405/5/17", vals: [38, 28, 10, 0, 10, 6, 6, 0, 0], disc: 60 },
    { date: "1405/5/18", vals: [30, 28, 5, 0, 0, 7, 4, 10, 0], disc: 45 },
    { date: "1405/5/19", vals: [30, 39, 10, 5, 5, 7, 8, 0, 10], disc: 60 },
    { date: "1405/5/20", vals: [28, 30, 10, 5, 0, 7, 4, 7, 5], disc: 55 },
    { date: "1405/5/21", vals: [39, 26, 0, 5, 0, 2, 2, 5, 0], disc: 40 },
  ],
  s03: [
    { date: "1405/5/17", vals: [35, 33, 10, 5, 0, 7, 8, 5, 10], disc: 60 },
    { date: "1405/5/18", vals: [40, 34, 5, 5, 5, 5, 6, 0, 5], disc: 50 },
    { date: "1405/5/19", vals: [31, 26, 5, 2.5, 5, 7, 4, 5, 7], disc: 60 },
    { date: "1405/5/20", vals: [40, 31, 5, 5, 0, 4, 4, 0, 5], disc: 35 },
    { date: "1405/5/21", vals: [40, 26, 10, 5, 0, 7, 2, 0, 0], disc: 50 },
  ],
  s04: [
    { date: "1405/5/17", vals: [22, 35, 5, 0, 10, 5, 8, 0, 10], disc: 60 },
    { date: "1405/5/18", vals: [37, 33, 10, 0, 5, 6, 8, 10, 10], disc: 55 },
    { date: "1405/5/19", vals: [40, 20, 10, 5, 5, 4, 8, 5, 5], disc: 60 },
    { date: "1405/5/20", vals: [28, 16, 0, 5, 0, 5, 6, 5, 10], disc: 60 },
    { date: "1405/5/21", vals: [38, 21, 5, 5, 0, 2, 6, 0, 5], disc: 60 },
  ],
  s05: [
    { date: "1405/5/17", vals: [23, 29, 5, 0, 0, 0, 8, 5, 10], disc: 45 },
    { date: "1405/5/18", vals: [10, 33, 0, 0, 5, 0, 6, 0, 5], disc: 50 },
    { date: "1405/5/19", vals: [0, 0, 0, 5, 5, 2, 6, 0, 5], disc: 60 },
    { date: "1405/5/20", vals: [22, 29, 5, 0, 5, 3, 6, 10, 5], disc: 60 },
    { date: "1405/5/21", vals: [25, 26, 5, 0, 0, 5, 2, 0, 10], disc: 60 },
  ],
  s06: [
    { date: "1405/5/17", vals: [20, 20, 2.5, 5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/18", vals: [28, 34, 10, 5, 10, 4, 8, 5, 5], disc: 50 },
    { date: "1405/5/19", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/20", vals: [35, 39, 10, 0, 5, 5, 8, 0, 0], disc: 50 },
    { date: "1405/5/21", vals: [37, 26, 10, 0, 5, 7, 4, 10, 5], disc: 55 },
  ],
  s07: [
    { date: "1405/5/17", vals: [20, 38, 5, 5, 0, 6, 6, 0, 10], disc: 60 },
    { date: "1405/5/18", vals: [35, 35, 0, 5, 0, 0, 2, 5, 0], disc: 60 },
    { date: "1405/5/21", vals: [34, 40, 0, 5, 5, 7, 5, 5, 10], disc: 60 },
    { date: "1405/5/19", vals: [22, 40, 0, 0, 5, 5, 8, 10, 0], disc: 60 },
    { date: "1405/5/20", vals: [40, 40, 10, 0, 5, 4, 0, 0, 5], disc: 60 },
  ],
  s08: [
    { date: "1405/5/17", vals: [38, 35, 0, 5, 0, 2, 6, 5, 10], disc: 55 },
    { date: "1405/5/18", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/19", vals: [28, 26, 10, 0, 0, 0, 8, 10, 0], disc: 60 },
    { date: "1405/5/20", vals: [38, 11, 0, 0, 0, 3, 8, 0, 10], disc: 40 },
    { date: "1405/5/21", vals: [21, 40, 5, 0, 0, 3, 6, 0, 10], disc: 55 },
  ],
  s09: [
    { date: "1405/5/17", vals: [39, 21, 10, 0, 0, 5, 8, 5, 5], disc: 60 },
    { date: "1405/5/18", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/19", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/20", vals: [31, 38, 5, 5, 5, 5, 2, 5, 5], disc: 50 },
    { date: "1405/5/21", vals: [30, 36, 10, 0, 5, 4, 2, 5, 10], disc: 60 },
  ],
  s10: [
    { date: "1405/5/17", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/18", vals: [37, 38, 10, 5, 5, 2, 8, 5, 5], disc: 50 },
    { date: "1405/5/19", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30 },
    { date: "1405/5/20", vals: [25, 23, 10, 5, 10, 6, 6, 8, 7.5], disc: 55 },
    { date: "1405/5/21", vals: [39, 18, 10, 5, 10, 6, 6, 10, 10], disc: 60 },
  ],
  s11: [
    { date: "1405/5/17", vals: [25, 38, 5, 5, 10, 7, 8, 5, 10], disc: 45 },
    { date: "1405/5/18", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/19", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/20", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/21", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
  ],
  s12: [
    { date: "1405/5/17", vals: [0, 21, 10, 0, 0, 4, 6, 0, 5], disc: 50 },
    { date: "1405/5/18", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/19", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/20", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
    { date: "1405/5/21", vals: [20, 20, 5, 2.5, 5, 3.5, 4, 5, 5], disc: 30, att: "excused" },
  ],
};

function mulberry32(seed: number) {
  return function rand() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function around(rng: () => number, target: number, max: number, spread: number): number {
  const v = target + (rng() - 0.5) * 2 * spread;
  const stepped = Math.round(v * 2) / 2;
  return Math.min(max, Math.max(0, stepped));
}

/** Synthetic but consistent dailies for prior weeks so trend charts have history. */
function syntheticDays(
  studentId: string,
  week: Week,
  academicTarget: number,
  discTarget: number,
  seed: number,
): DailyRecord[] {
  const rng = mulberry32(seed);
  const ratios = SCORE_FIELDS.map((f) => f.max / 140);
  return week.sessionDates.map((date, i) => {
    const dayAc = around(rng, academicTarget, 140, 18);
    const vals = SCORE_FIELDS.map((f, idx) => {
      const t = dayAc * ratios[idx];
      return around(rng, t, f.max, f.max * 0.25);
    });
    return {
      id: `${studentId}-${week.id}-${i}`,
      studentId,
      weekId: week.id,
      date,
      attendance: "present" as const,
      scores: scores(vals),
      discipline: around(rng, discTarget, 60, 8),
      notes: "",
    };
  });
}

type Hist = {
  oral: number
  written: number
  level: Level
  change: WeeklyRecord["levelChange"]
  ethics: boolean
  points: number
  notes: string
  acTarget: number
  discTarget: number
};

const HIST: Record<string, { w08: Hist; w15: Hist; w22: Omit<Hist, "acTarget" | "discTarget"> }> = {
  s01: {
    w08: { oral: 32, written: 41, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 100, discTarget: 54 },
    w15: { oral: 30, written: 40, level: "B", change: "stay", ethics: false, points: 500, notes: "۵۰۰ امتیاز عملکرد هفته", acTarget: 98, discTarget: 52 },
    w22: { oral: 27.75, written: 39.5, level: "C", change: "demote", ethics: false, points: 0, notes: "نزول به سطح ج" },
  },
  s02: {
    w08: { oral: 36, written: 45, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 102, discTarget: 50 },
    w15: { oral: 36, written: 46, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 104, discTarget: 51 },
    w22: { oral: 37, written: 47.5, level: "B", change: "stay", ethics: false, points: 0, notes: "ابقاء در سطح ب" },
  },
  s03: {
    w08: { oral: 34, written: 40, level: "C", change: "stay", ethics: false, points: 0, notes: "", acTarget: 88, discTarget: 48 },
    w15: { oral: 35, written: 42, level: "C", change: "stay", ethics: false, points: 0, notes: "", acTarget: 92, discTarget: 49 },
    w22: { oral: 38, written: 45, level: "B", change: "promote", ethics: false, points: 200, notes: "ارتقاء به سطح ب" },
  },
  s04: {
    w08: { oral: 33, written: 44, level: "B", change: "stay", ethics: false, points: 750, notes: "کارت نقره‌ای", acTarget: 108, discTarget: 58 },
    w15: { oral: 34, written: 44, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 106, discTarget: 58 },
    w22: { oral: 34, written: 44, level: "B", change: "stay", ethics: false, points: 0, notes: "ابقاء در سطح ب" },
  },
  s05: {
    w08: { oral: 31, written: 40, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 96, discTarget: 54 },
    w15: { oral: 30, written: 39, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 94, discTarget: 55 },
    w22: { oral: 29.25, written: 38, level: "C", change: "demote", ethics: false, points: 0, notes: "نزول به سطح ج" },
  },
  s06: {
    w08: { oral: 26, written: 40, level: "C", change: "stay", ethics: false, points: 0, notes: "", acTarget: 86, discTarget: 42 },
    w15: { oral: 27, written: 41, level: "C", change: "stay", ethics: false, points: 0, notes: "", acTarget: 88, discTarget: 42 },
    w22: { oral: 27.75, written: 43, level: "C", change: "stay", ethics: false, points: 0, notes: "ابقاء در سطح ج" },
  },
  s07: {
    w08: { oral: 32, written: 43, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 104, discTarget: 60 },
    w15: { oral: 33, written: 44, level: "B", change: "stay", ethics: true, points: 1000, notes: "مرد اخلاق", acTarget: 106, discTarget: 60 },
    w22: { oral: 33, written: 44, level: "B", change: "stay", ethics: true, points: 1000, notes: "مرد اخلاق — ابقاء در سطح ب" },
  },
  s08: {
    w08: { oral: 28, written: 48, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 98, discTarget: 50 },
    w15: { oral: 29, written: 49, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 96, discTarget: 49 },
    w22: { oral: 29, written: 50, level: "C", change: "demote", ethics: false, points: 0, notes: "نزول به سطح ج" },
  },
  s09: {
    w08: { oral: 35, written: 44, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 100, discTarget: 48 },
    w15: { oral: 36, written: 44, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 98, discTarget: 47 },
    w22: { oral: 36.25, written: 45, level: "C", change: "demote", ethics: false, points: 0, notes: "نزول به سطح ج" },
  },
  s10: {
    w08: { oral: 39, written: 46, level: "B", change: "stay", ethics: false, points: 750, notes: "کارت نقره‌ای", acTarget: 102, discTarget: 46 },
    w15: { oral: 40, written: 46, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 100, discTarget: 45 },
    w22: { oral: 40.5, written: 47, level: "B", change: "stay", ethics: false, points: 0, notes: "ابقاء در سطح ب" },
  },
  s11: {
    w08: { oral: 30, written: 38, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 94, discTarget: 44 },
    w15: { oral: 28, written: 36, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 90, discTarget: 40 },
    w22: { oral: 25, written: 25, level: "C", change: "demote", ethics: false, points: 0, notes: "غیبت موجه — نمره پایه؛ نزول به سطح ج" },
  },
  s12: {
    w08: { oral: 29, written: 37, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 90, discTarget: 42 },
    w15: { oral: 27, written: 35, level: "B", change: "stay", ethics: false, points: 0, notes: "", acTarget: 86, discTarget: 38 },
    w22: { oral: 25, written: 25, level: "C", change: "demote", ethics: false, points: 0, notes: "غیبت موجه — نمره پایه؛ نزول به سطح ج" },
  },
};

function weeklyRec(
  studentId: string,
  weekId: string,
  h: { oral: number; written: number; level: Level; change: WeeklyRecord["levelChange"]; ethics: boolean; points: number; notes: string },
  locked: boolean,
): WeeklyRecord {
  return {
    id: `${studentId}-${weekId}`,
    studentId,
    weekId,
    oralExam: h.oral,
    writtenExam: h.written,
    notes: h.notes,
    locked,
    isEthicsMan: h.ethics,
    pointsAwarded: h.points,
    levelAfter: h.level,
    levelChange: h.change,
  };
}

function buildDailies(): DailyRecord[] {
  const out: DailyRecord[] = [];
  const w08 = WEEKS[0];
  const w15 = WEEKS[1];
  const w29 = WEEKS[3];
  for (const s of STUDENTS) {
    const hist = HIST[s.id];
    out.push(...syntheticDays(s.id, w08, hist.w08.acTarget, hist.w08.discTarget, hash(s.id + "w08")));
    out.push(...syntheticDays(s.id, w15, hist.w15.acTarget, hist.w15.discTarget, hash(s.id + "w15")));
    out.push(...daysFor(s.id, "w22", W22_DAYS[s.id]));
    out.push(...emptyWeekDays(s.id, w29));
  }
  return out;
}

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function buildWeeklies(): WeeklyRecord[] {
  const out: WeeklyRecord[] = [];
  for (const s of STUDENTS) {
    const h = HIST[s.id];
    out.push(weeklyRec(s.id, "w08", h.w08, true));
    out.push(weeklyRec(s.id, "w15", h.w15, true));
    out.push(weeklyRec(s.id, "w22", h.w22, true));
    out.push({
      id: `${s.id}-w29`,
      studentId: s.id,
      weekId: "w29",
      oralExam: null,
      writtenExam: null,
      notes: "",
      locked: false,
      isEthicsMan: false,
      pointsAwarded: 0,
      levelAfter: null,
      levelChange: null,
    });
  }
  return out;
}

function buildPoints(): PointsEvent[] {
  const events: PointsEvent[] = [];
  let n = 0;
  const add = (e: Omit<PointsEvent, "id">) => {
    events.push({ ...e, id: `p${++n}` });
  };
  add({ studentId: "s01", weekId: "w15", date: "1405/5/15", amount: 500, reason: "عملکرد هفته ۱۵ مرداد", kind: "weekly" });
  add({ studentId: "s04", weekId: "w08", date: "1405/5/8", amount: 750, reason: "کارت نقره‌ای", kind: "card" });
  add({ studentId: "s07", weekId: "w15", date: "1405/5/15", amount: 1000, reason: "مرد اخلاق هفته ۱۵ مرداد", kind: "ethics" });
  add({ studentId: "s07", weekId: "w22", date: "1405/5/22", amount: 1000, reason: "مرد اخلاق هفته ۲۲ مرداد", kind: "ethics" });
  add({ studentId: "s03", weekId: "w22", date: "1405/5/22", amount: 200, reason: "ارتقاء به سطح ب", kind: "promotion" });
  add({ studentId: "s10", weekId: "w08", date: "1405/5/8", amount: 750, reason: "کارت نقره‌ای", kind: "card" });
  return events;
}

export function createSeedState(): AppState {
  return {
    students: STUDENTS,
    weeks: WEEKS,
    dailies: buildDailies(),
    weeklies: buildWeeklies(),
    points: buildPoints(),
    settings: SETTINGS,
    activeWeekId: "w22",
  };
}

export const SEED_VERSION = 3;
