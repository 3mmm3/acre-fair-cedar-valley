import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StudentAvatar } from "@/components/avatar";
import { CategoryBars, CategoryRadar } from "@/components/charts";
import { useAppStore, selectWeekDailies, studentWeeklyComputed } from "@/lib/store";
import { analyzeStudent, classCategoryAverages } from "@/lib/analysis";
import { formatScore } from "@/lib/utils";
import { SCORE_FIELDS } from "@/lib/scoring";
import { ExcelButton } from "@/components/excel-button";

export const Route = createFileRoute("/analysis")({ component: AnalysisPage });

function AnalysisPage() {
  const state = useAppStore();
  const weekDays = selectWeekDailies(state, state.activeWeekId).filter(
    (d) => d.attendance === "present" || d.attendance === "late",
  );
  const cats = classCategoryAverages(weekDays);
  const weakest = [...cats].sort((a, b) => (a.percent ?? 100) - (b.percent ?? 100))[0];

  const insights = state.students.map((s) => {
    const dailies = state.dailies.filter((d) => d.studentId === s.id);
    const weeklies = state.weeklies.filter((w) => w.studentId === s.id);
    return { student: s, insight: analyzeStudent(s, dailies, weeklies), c: studentWeeklyComputed(state, s.id, state.activeWeekId) };
  });

  const needsHelp = insights
    .filter((x) => x.insight.weaknesses.length > 0)
    .sort((a, b) => (a.c.weekTotal ?? 0) - (b.c.weekTotal ?? 0));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">تحلیل عملکرد کلاس</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            بر اساس نمرات ثبت‌شده، ضعف‌های مشترک و برنامه فردی هر حافظ مشخص می‌شود
          </p>
        </div>
        <ExcelButton />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>میانگین مهارت‌های کلاس</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryBars data={cats.map((c) => ({ name: c.label, درصد: c.percent }))} />
            {weakest ? (
              <p className="mt-2 text-sm text-muted-foreground">
                ضعیف‌ترین بخش کلاس: <span className="font-medium text-foreground">{weakest.label}</span> با میانگین{" "}
                {formatScore(weakest.percent)}٪ از سقف. بهتر است جلسه گروهی روی همین مهارت طراحی شود.
              </p>
            ) : null}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>نیمرخ راداری</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryRadar
              data={cats
                .filter((c) => c.key !== "discipline")
                .map((c) => ({ subject: c.label, درصد: c.percent ?? 0 }))}
            />
          </CardContent>
        </Card>
      </div>

      <h2 className="mt-8 font-display text-2xl font-bold">پیشنهاد فردی هفته بعد</h2>
      <div className="mt-4 grid gap-3">
        {needsHelp.map(({ student, insight, c }) => (
          <Link
            key={student.id}
            to="/students/$id"
            params={{ id: student.id }}
            className="rounded-2xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <StudentAvatar name={student.fullName} photo={student.photo} size={44} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium">{student.fullName}</h3>
                  <span className="text-xs text-muted-foreground">نمره هفته {formatScore(c.weekTotal)}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-primary">{insight.focusTitle}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{insight.paragraphs[0]}</p>
                {insight.plan[0] ? (
                  <p className="mt-2 text-sm">
                    <span className="text-muted-foreground">تمرین پیشنهادی: </span>
                    {insight.plan[0]}
                  </p>
                ) : null}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>راهنمای مهارت‌ها</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {SCORE_FIELDS.map((f) => (
            <div key={f.key} className="rounded-xl bg-muted/50 px-3 py-2 text-sm">
              <div className="font-medium">
                {f.label} <span className="text-xs font-normal text-muted-foreground">از {f.max}</span>
              </div>
              <div className="text-xs text-muted-foreground">{f.hint}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
