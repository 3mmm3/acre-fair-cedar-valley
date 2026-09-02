// src/lib/scoring.ts
export const LEVEL_THRESHOLDS = {
  A: { bronze: 81, silver: 85, gold: 90 },
  B: { bronze: 71, silver: 75, gold: 80 },
  C: { bronze: 61, silver: 65, gold: 70 },
};

export function getCards(total: number, level: 'A' | 'B' | 'C') {
  const t = LEVEL_THRESHOLDS[level];
  if (total >= t.gold) return { type: 'طلایی', points: level === 'A' ? 2000 : level === 'B' ? 1000 : 500 };
  if (total >= t.silver) return { type: 'نقره‌ای', points: level === 'A' ? 1500 : level === 'B' ? 750 : 400 };
  if (total >= t.bronze) return { type: 'برنزی', points: level === 'A' ? 1000 : level === 'B' ? 500 : 300 };
  return null;
}

export function calculateWeeklyScore(
  scores: any,
  absences: { nonExcused?: number; excused?: number } = {},
  discipline = 0,
  level: 'A' | 'B' | 'C' = 'B',
  lowDays = 0
) {
  // محاسبه نمره علمی (اگر فیلدهای واقعی شما متفاوت است بعداً تنظیم می‌کنیم)
  let academic =
    ((scores?.خواندنی1 || 0) + (scores?.خواندنی2 || 0)) * 0.5 +
    ((scores?.شماره_صفحه || 0) * 10 + (scores?.شماره_آیه || 0) * 5) * 0.15 +
    ((scores?.تشخیص_عبارت || 0) * 10) * 0.1 +
    ((scores?.ترتیب_آیه || 0) * 7 + (scores?.ترتیب_صفحه || 0) * 8) * 0.1 +
    ((scores?.اول_وآخر_آیه || 0) * 10) * 0.1 +
    ((scores?.شمارشي || 0) * 10) * 0.05;

  let total = academic + discipline;

  // تنبیه غیبت
  if (absences.nonExcused) total -= absences.nonExcused * 1000;
  if (absences.excused) total -= absences.excused * 500;

  // تعلیق (دو روز ضعیف)
  if (lowDays >= 2) total -= 1000;

  const levelFinal = total >= 90 ? 'A' : total >= 85 ? 'B' : 'C';
  const cards = getCards(total, levelFinal);

  return {
    total: Math.round(total),
    level: levelFinal,
    cards,
    suspended: lowDays >= 2,
    previousLevel: level,
  };
}
