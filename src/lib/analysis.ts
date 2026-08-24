import type { DailyRecord, ScoreKey, Student, WeeklyRecord } from "./types";
import {
  ACADEMIC_MAX,
  DISCIPLINE_MAX,
  SCORE_FIELDS,
  academicTotal,
  dailyAverage,
  fieldAverage,
  fieldPercent,
  mean,
} from "./scoring";

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
