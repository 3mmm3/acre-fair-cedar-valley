import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore, studentWeeklyComputed } from "@/lib/store";
import { CARD_LABEL, mean } from "@/lib/scoring";
import {
  fieldLeadersForPeriod,
  topPerformersOfWeek,
  PERIOD_LABEL,
  type Period,
} from "@/lib/analysis";
import { formatInt, formatScore } from "@/lib/utils";
import { Award, Crown, Medal, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/")({ component: DashboardPage });

function DashboardPage() {
  const state = useAppStore();
  const [period, setPeriod] = useState<Period>("week");

  const weekRows = state.students.map((s) => {
    const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
    const weekly = state.weeklies.find((w) => w.studentId === s.id && w.weekId === state.activeWeekId);
    return {
      student: s,
      weekTotal: c.weekTotal,
      dailyAvg: c.dailyAvg,
      disciplineAvg: c.disciplineAvg,
      isEthicsMan: !!weekly?.isEthicsMan,
      card: c.card,
      lowDays: c.lowDays,
      suspended: c.suspended,
      nonExcused: c.nonExcused,
      excused: c.excused,
    };
  });

  const tops = topPerformersOfWeek(weekRows, 3);

  const weeklyCards = weekRows
    .filter((r) => r.card != null)
    .sort((a, b) => (b.weekTotal ?? 0) - (a.weekTotal ?? 0));

  const weekTotalByStudent = useMemo(() => {
    const map = new Map<string, number | null>();
    const active = state.weeks.find((w) => w.id === state.activeWeekId);
    const periodWeekIds = state.weeks
      .filter((w) => {
        if (period === "week") return w.id === state.activeWeekId;
        if (period === "month" && active) {
          const [y1, m1] = active.evalDate.split("/").map(Number);
          const [y2, m2] = w.evalDate.split("/").map(Number);
          return y1 === y2 && m1 === m2;
        }
        return true;
      })
      .map((w) => w.id);

    for (const s of state.students) {
      if (period === "week") {
        map.set(s.id, studentWeeklyComputed(state, s.id, state.activeWeekId).weekTotal);
      } else {
        const vals: number[] = [];
        for (const wid of periodWeekIds) {
          const t = studentWeeklyComputed(state, s.id, wid).weekTotal;
          if (t != null) vals.push(t);
        }
        map.set(s.id, vals.length ? mean(vals) : null);
      }
    }
    return map;
  }, [state, period]);

  const leaders = fieldLeadersForPeriod({
    students: state.students,
    weeks: state.weeks,
    dailies: state.dailies,
    weeklies: state.weeklies,
    activeWeekId: state.activeWeekId,
    period,
    weekTotalByStudent,
  });

  const suspendedStudents = weekRows.filter((r) => r.suspended);

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">داشبورد کلاس</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        برترین‌ها، کارت‌های هفتگی (طبق قوانین دکتر میربلوک) و بهترین هر بخش
      </p>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="size-5 text-primary" />
            برترین‌های این هفته
          </CardTitle>
        </CardHeader>
        <CardContent>
          {tops.length === 0 ? (
            <p className="text-sm text-muted-foreground">نمره‌ای برای رتبه‌بندی ثبت نشده.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {tops.map((t) => (
                <Link
                  key={t.studentId}
                  to="/students/$id"
                  params={{ id: t.studentId }}
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3"
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {formatInt(t.rank)}
                  </div>
                  <StudentAvatar name={t.fullName} photo={t.photo} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{t.fullName}</div>
                    <div className="tabular text-sm text-muted-foreground">{formatScore(t.weekTotal)}</div>
                  </div>
                  {t.rank === 1 ? <Medal className="size-5 text-primary" /> : null}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="size-5" />
            کارت‌های هفتگی این هفته
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            طلایی ۹۰+ · نقره‌ای ۸۵–۸۹ · برنزی ۸۱–۸۴ — امتیاز بسته به سطح A/B/C
          </p>
        </CardHeader>
        <CardContent>
          {weeklyCards.length === 0 ? (
            <p className="text-sm text-muted-foreground">هنوز کارتی صادر نشده (نمره ارزیابی هفته باید ثبت شود).</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {weeklyCards.map((r) => (
                <Link
                  key={r.student.id}
                  to="/students/$id"
                  params={{ id: r.student.id }}
                  className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-3"
                >
                  <StudentAvatar name={r.student.fullName} photo={r.student.photo} size={40} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{r.student.fullName}</div>
                    <div className="text-xs text-muted-foreground">سطح {r.student.currentLevel}</div>
                  </div>
                  <div className="text-left">
                    <Badge variant={r.card!.type}>{r.card!.label}</Badge>
                    <div className="mt-1 text-xs tabular text-muted-foreground">
                      +{formatInt(r.card!.points)} امتیاز
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {suspendedStudents.length > 0 && (
        <Card className="mt-4 border-amber-500/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="size-5" />
              هشدار تعلیق (دو روز ضعیف پشت‌سرهم)
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {suspendedStudents.map((r) => (
              <Link
                key={r.student.id}
                to="/students/$id"
                params={{ id: r.student.id }}
                className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-800"
              >
                {r.student.fullName} ({r.lowDays} روز ضعیف)
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mt-4">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>بهترین هر بخش</CardTitle>
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 text-sm">
            {(["week", "month", "term"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={
                  period === p
                    ? "rounded-md bg-card px-3 py-1.5 font-medium shadow-sm"
                    : "px-3 py-1.5 text-muted-foreground"
                }
              >
                {PERIOD_LABEL[p]}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {leaders.map((f) => (
              <div key={f.key} className="flex items-center gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-muted-foreground">{f.label}</div>
                  {f.studentId ? (
                    <Link
                      to="/students/$id"
                      params={{ id: f.studentId }}
                      className="mt-0.5 flex items-center gap-2 font-medium hover:underline"
                    >
                      <StudentAvatar name={f.studentName ?? ""} photo={f.photo} size={24} />
                      <span className="truncate">{f.shortName ?? f.studentName}</span>
                    </Link>
                  ) : (
                    <div className="mt-0.5 text-sm text-muted-foreground">—</div>
                  )}
                </div>
                <div className="tabular text-sm font-semibold">
                  {formatScore(f.value)}
                  <span className="text-xs font-normal text-muted-foreground">/{formatInt(f.max)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
