import type { DailyRecord, ScoreKey, Student, Week, WeeklyRecord } from "./types";
import {
  DISCIPLINE_MAX,
  SCORE_FIELDS,
  academicTotal,
  dailyAverage,
  fieldAverage,
  fieldPercent,
  mean,
} from "./scoring";
import { parseJalali } from "./jalali";

export type CategoryInsight = {
  key: ScoreKey | "discipline"
  label: string
  max: number
  average: number | null
  percent: number | null
  trend: "up" | "down" | "flat" | "na"
  trendDelta: number | null
};

export type StudentInsight = {
  studentId: string
  strengths: CategoryInsight[]
  weaknesses: CategoryInsight[]
  declining: CategoryInsight[]
  overallTrend: "up" | "down" | "flat" | "na"
  focusTitle: string
  paragraphs: string[]
  plan: string[]
};

export type Period = "week" | "month" | "term";

export type FieldLeader = {
  key: ScoreKey | "discipline" | "weekTotal"
  label: string
  max: number
  studentId: string | null
  studentName: string | null
  shortName: string | null
  photo: string | null
  value: number | null
  percent: number | null
};

export type TopPerformer = {
  rank: number
  studentId: string
  fullName: string
  shortName: string
  photo: string | null
  weekTotal: number | null
  dailyAvg: number | null
  disciplineAvg: number | null
  isEthicsMan: boolean
};

function trendOf(values: Array<number | null>): { dir: "up" | "down" | "flat" | "na"; delta: number | null } {
  const xs = values.filter((v): v is number => v != null);
  if (xs.length < 3) return { dir: "na", delta: null };
  const mid = Math.ceil(xs.length / 2);
  const first = mean(xs.slice(0, mid));
  const second = mean(xs.slice(mid));
  if (first == null || second == null) return { dir: "na", delta: null };
  const delta = Math.round((second - first) * 10) / 10;
  if (delta >= 4) return { dir: "up", delta };
  if (delta <= -4) return { dir: "down", delta };
  return { dir: "flat", delta };
}

export function categoryInsights(dailies: DailyRecord[]): CategoryInsight[] {
  const present = dailies.filter((d) => d.attendance === "present" || d.attendance === "late");
  const cats: CategoryInsight[] = SCORE_FIELDS.map((f) => {
    const avg = fieldAverage(present, f.key);
    const t = trendOf(present.map((d) => d.scores[f.key]));
    return {
      key: f.key,
      label: f.label,
      max: f.max,
      average: avg,
      percent: fieldPercent(avg, f.max),
      trend: t.dir,
      trendDelta: t.delta,
    };
  });
  const discAvg = mean(present.map((d) => d.discipline));
  const discT = trendOf(present.map((d) => d.discipline));
  cats.push({
    key: "discipline",
    label: "انضباط",
    max: DISCIPLINE_MAX,
    average: discAvg,
    percent: fieldPercent(discAvg, DISCIPLINE_MAX),
    trend: discT.dir,
    trendDelta: discT.delta,
  });
  return cats;
}

function pct(c: CategoryInsight): number {
  return c.percent ?? 0;
}

export function analyzeStudent(
  student: Student,
  dailies: DailyRecord[],
  weeklies: WeeklyRecord[],
): StudentInsight {
  const cats = categoryInsights(dailies).filter((c) => c.average != null);
  const sorted = [...cats].sort((a, b) => pct(b) - pct(a));
  const strengths = sorted.filter((c) => pct(c) >= 70).slice(0, 3);
  const weaknesses = [...sorted].reverse().filter((c) => pct(c) < 70).slice(0, 3);
  const declining = cats.filter((c) => c.trend === "down");

  const weekScores = weeklies
    .filter((w) => w.locked)
    .map((w) => {
      const days = dailies.filter((d) => d.weekId === w.weekId);
      const avgs = days.map((d) => dailyAverage(academicTotal(d.scores), d.discipline));
      return mean(avgs);
    });
  const overall = trendOf(weekScores);

  const weakNames = weaknesses.map((w) => w.label);
  const strongNames = strengths.map((s) => s.label);

  const paragraphs: string[] = [];
  if (strongNames.length) {
    paragraphs.push(
      `نقاط قوت ${student.shortName} در ${joinFa(strongNames)} است. این بخش‌ها را با مرور کوتاه حفظ کنید تا افت نکنند.`,
    );
  }
  if (weakNames.length) {
    paragraphs.push(
      `برای رشد نمره کل، بیشترین بازده از کار روی ${joinFa(weakNames)} به‌دست می‌آید؛ این‌ها پایین‌ترین درصد نمره نسبت به سقف را دارند.`,
    );
  }
  if (declining.length) {
    paragraphs.push(
      `روند نزولی در ${joinFa(declining.map((d) => d.label))} دیده می‌شود. بهتر است این موارد در برنامه هفته بعد اولویت اول باشند تا افت تثبیت نشود.`,
    );
  }

  const disc = cats.find((c) => c.key === "discipline");
  if (disc && (disc.percent ?? 100) < 75) {
    paragraphs.push(
      `میانگین انضباط ${disc.average} از ۶۰ است. ثبات حضور، آمادگی قبل از کلاس و رعایت نظم جلسه، نمره کل را مستقیم بالا می‌برد — چون انضباط نیمی از میانگین روز است.`,
    );
  }

  const oral = weeklies.filter((w) => w.oralExam != null);
  const last = oral[oral.length - 1];
  if (last?.oralExam != null && last.writtenExam != null) {
    if (last.oralExam + 6 < last.writtenExam) {
      paragraphs.push(
        `آزمون شفاهی (${last.oralExam} از ۵۰) از کتبی (${last.writtenExam} از ۵۰) ضعیف‌تر است. تمرین پاسخ‌گویی شفاهی و بازیابی سریع آیات، شکاف را کم می‌کند.`,
      );
    } else if (last.writtenExam + 6 < last.oralExam) {
      paragraphs.push(
        `آزمون کتبی از شفاهی عقب‌تر است. تمرین نوشتن شماره صفحه/آیه و دقت در سؤالات شمارشی و ترتیبی توصیه می‌شود.`,
      );
    }
  }

  if (student.currentLevel === "C") {
    paragraphs.push(
      `برای بازگشت به سطح ب، نمره ارزیابی هفته باید به ۷۵ برسد. تمرکز روی دو ضعف اصلی به‌علاوه ثبات انضباط، کوتاه‌ترین مسیر است.`,
    );
  } else if (student.currentLevel === "B") {
    paragraphs.push(
      `برای رسیدن به سطح الف (۸۵ به بالا) باید هم میانگین روز و هم آزمون پایان هفته هم‌زمان رشد کنند؛ یک جهش در خواندنی کافی نیست.`,
    );
  }

  const plan = buildPlan(weaknesses, declining, disc);

  const focusTitle = weakNames[0]
    ? `تمرکز هفته بعد: ${weakNames[0]}`
    : "حفظ ثبات عملکرد فعلی";

  if (paragraphs.length === 0) {
    paragraphs.push("داده کافی برای تحلیل دقیق‌تر نیست. پس از ثبت چند جلسه، پیشنهادها دقیق‌تر می‌شوند.");
  }

  return {
    studentId: student.id,
    strengths: strengths.slice(0, 3),
    weaknesses: weaknesses.slice(0, 3),
    declining,
    overallTrend: overall.dir,
    focusTitle,
    paragraphs,
    plan,
  };
}

function buildPlan(
  weaknesses: CategoryInsight[],
  declining: CategoryInsight[],
  disc: CategoryInsight | undefined,
): string[] {
  const plan: string[] = [];
  const seen = new Set<string>();
  const add = (key: string, text: string) => {
    if (seen.has(key)) return;
    seen.add(key);
    plan.push(text);
  };

  const ADVICE: Partial<Record<ScoreKey | "discipline", string>> = {
    reading1: "هر روز یک صفحه با صدای بلند برای استاد یا همکلاسی بخواند؛ خطاها را علامت بزند و همان را فردا تکرار کند.",
    reading2: "خواندنی دوم را با فاصله زمانی (بعد از استراحت کوتاه) تمرین کند تا بازیابی حفظ قوی شود.",
    pageNumber: "روی حاشیه هر صفحه شماره را با انگشت نشان کند و از دیگری بپرسد «این کدام صفحه است؟»",
    verseNumber: "۵ آیه رند از صفحه جاری انتخاب شود و شماره آیه بدون نگاه به قرآن گفته شود.",
    phraseRecognition: "عبارات کلیدی صفحه را روی کارت بنویسد و آیهٔ کامل را از روی عبارت پیدا کند.",
    verseOrder: "آیات صفحه را روی کاغذهای جدا بنویسد، قاطی کند و دوباره مرتب کند.",
    pageOrder: "سه صفحه پشت‌سرهم را ببندد و ترتیب آغاز و پایان هر صفحه را بگوید.",
    firstLastVerse: "فقط ابتدا و انتهای هر آیه را جداگانه حفظ کند؛ سپس آیه کامل را وصل کند.",
    counting: "شمارش آیات، کلمات پرتکرار و «قال»های صفحه را با جدول کوچک تمرین کند.",
    discipline: "۵ دقیقه زودتر در کلاس حاضر شود و وسایل را قبل از شروع آماده کند.",
  };

  for (const w of [...declining, ...weaknesses]) {
    const tip = ADVICE[w.key];
    if (tip) add(w.key, tip);
  }
  if (disc && (disc.percent ?? 100) < 80) {
    add("discipline", ADVICE.discipline!);
  }
  if (plan.length < 3) {
    add("review", "مرور ۱۰ دقیقه‌ای شبانه از ضعف‌های علامت‌خورده همان روز، بهتر از مطالعه طولانی بی‌هدف است.");
  }
  return plan.slice(0, 5);
}

function joinFa(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} و ${items[1]}`;
  return `${items.slice(0, -1).join("، ")} و ${items[items.length - 1]}`;
}

export function classCategoryAverages(dailies: DailyRecord[]): CategoryInsight[] {
  return categoryInsights(dailies);
}

/** هفته / ماه (همان ماه شمسی تاریخ ارزیابی) / ترم (همه هفته‌ها) */
export function weeksInPeriod(weeks: Week[], activeWeekId: string, period: Period): Week[] {
  const active = weeks.find((w) => w.id === activeWeekId);
  if (!active) return [];
  if (period === "week") return [active];
  if (period === "month") {
    const { y, m } = parseJalali(active.evalDate);
    return weeks.filter((w) => {
      const p = parseJalali(w.evalDate);
      return p.y === y && p.m === m;
    });
  }
  return [...weeks];
}

export const PERIOD_LABEL: Record<Period, string> = {
  week: "هفته",
  month: "ماه",
  term: "ترم",
};

/**
 * برترین هر فیلد در بازه انتخابی — بر اساس میانگین نمرات حضور در روزهای آن بازه.
 * برای weekTotal از میانگین نمره ارزیابی هفته‌های داخل بازه استفاده می‌شود.
 */
export function fieldLeadersForPeriod(args: {
  students: Student[]
  weeks: Week[]
  dailies: DailyRecord[]
  weeklies: WeeklyRecord[]
  activeWeekId: string
  period: Period
  weekTotalByStudent: Map<string, number | null>
}): FieldLeader[] {
  const { students, weeks, dailies, activeWeekId, period, weekTotalByStudent } = args;
  const periodWeeks = weeksInPeriod(weeks, activeWeekId, period);
  const weekIds = new Set(periodWeeks.map((w) => w.id));
  const presentDays = dailies.filter(
    (d) => weekIds.has(d.weekId) && (d.attendance === "present" || d.attendance === "late"),
  );

  const leaders: FieldLeader[] = [];

  for (const f of SCORE_FIELDS) {
    let bestId: string | null = null;
    let bestVal: number | null = null;
    for (const s of students) {
      const avg = fieldAverage(
        presentDays.filter((d) => d.studentId === s.id),
        f.key,
      );
      if (avg == null) continue;
      if (bestVal == null || avg > bestVal) {
        bestVal = avg;
        bestId = s.id;
      }
    }
    const st = students.find((x) => x.id === bestId) ?? null;
    leaders.push({
      key: f.key,
      label: f.label,
      max: f.max,
      studentId: bestId,
      studentName: st?.fullName ?? null,
      shortName: st?.shortName ?? null,
      photo: st?.photo ?? null,
      value: bestVal,
      percent: fieldPercent(bestVal, f.max),
    });
  }

  // انضباط
  {
    let bestId: string | null = null;
    let bestVal: number | null = null;
    for (const s of students) {
      const avg = mean(presentDays.filter((d) => d.studentId === s.id).map((d) => d.discipline));
      if (avg == null) continue;
      if (bestVal == null || avg > bestVal) {
        bestVal = avg;
        bestId = s.id;
      }
    }
    const st = students.find((x) => x.id === bestId) ?? null;
    leaders.push({
      key: "discipline",
      label: "انضباط",
      max: DISCIPLINE_MAX,
      studentId: bestId,
      studentName: st?.fullName ?? null,
      shortName: st?.shortName ?? null,
      photo: st?.photo ?? null,
      value: bestVal,
      percent: fieldPercent(bestVal, DISCIPLINE_MAX),
    });
  }

  // نمره کل ارزیابی هفته
  {
    let bestId: string | null = null;
    let bestVal: number | null = null;
    for (const s of students) {
      // برای هفته: همان weekTotal؛ برای ماه/ترم: میانگین weekTotalهای موجود در map (فراخوان‌کننده پر می‌کند)
      const v = weekTotalByStudent.get(s.id) ?? null;
      if (v == null) continue;
      if (bestVal == null || v > bestVal) {
        bestVal = v;
        bestId = s.id;
      }
    }
    const st = students.find((x) => x.id === bestId) ?? null;
    leaders.push({
      key: "weekTotal",
      label: "نمره کل ارزیابی",
      max: 100,
      studentId: bestId,
      studentName: st?.fullName ?? null,
      shortName: st?.shortName ?? null,
      photo: st?.photo ?? null,
      value: bestVal,
      percent: fieldPercent(bestVal, 100),
    });
  }

  return leaders;
}

/** سه نفر برتر هفته فعال بر اساس نمره ارزیابی کل */
export function topPerformersOfWeek(
  rows: Array<{
    student: Student
    weekTotal: number | null
    dailyAvg: number | null
    disciplineAvg: number | null
    isEthicsMan: boolean
  }>,
  limit = 3,
): TopPerformer[] {
  return [...rows]
    .filter((r) => r.weekTotal != null)
    .sort((a, b) => (b.weekTotal ?? -1) - (a.weekTotal ?? -1))
    .slice(0, limit)
    .map((r, i) => ({
      rank: i + 1,
      studentId: r.student.id,
      fullName: r.student.fullName,
      shortName: r.student.shortName,
      photo: r.student.photo,
      weekTotal: r.weekTotal,
      dailyAvg: r.dailyAvg,
      disciplineAvg: r.disciplineAvg,
      isEthicsMan: r.isEthicsMan,
    }));
}
