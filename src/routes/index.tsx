import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentAvatar } from "@/components/avatar";
import { ChangeBadge, LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { CategoryRadar } from "@/components/charts";
import { ExcelButton } from "@/components/excel-button";
import {
  useAppStore,
  selectWeek,
  studentWeeklyComputed,
  selectWeekDailies,
  previousLevelFor,
} from "@/lib/store";
import {
  classCategoryAverages,
  fieldLeadersForPeriod,
  topPerformersOfWeek,
  PERIOD_LABEL,
  type Period,
} from "@/lib/analysis";
import { buildFollowingWeek } from "@/lib/week-utils";
import { compareJalali, formatJalaliShort } from "@/lib/jalali";
import { formatScore, formatInt } from "@/lib/utils";
import { LEVEL_LABEL, mean } from "@/lib/scoring";
import {
  AlertTriangle,
  Award,
  CalendarPlus,
  ClipboardPen,
  Crown,
  Medal,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const state = useAppStore();
  const navigate = useNavigate();
  const addWeek = useAppStore((s) => s.addWeek);
  const week = selectWeek(state);
  const students = state.students;
  const [period, setPeriod] = useState<Period>("week");

  const rows = students
    .map((s) => {
      const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
      const weekly = state.weeklies.find((w) => w.studentId === s.id && w.weekId === state.activeWeekId);
      const prev = previousLevelFor(state, s.id, state.activeWeekId);
      return { student: s, c, weekly, prev };
    })
    .sort((a, b) => (b.c.weekTotal ?? -1) - (a.c.weekTotal ?? -1));

  const classAvg = mean(rows.map((r) => r.c.weekTotal));
  const ethics =
    rows.find((r) => r.weekly?.isEthicsMan) ??
    rows.slice().sort((a, b) => (b.c.disciplineAvg ?? 0) - (a.c.disciplineAvg ?? 0))[0];
  const levels = { A: 0, B: 0, C: 0 };
  for (const r of rows) {
    levels[r.c.nextLevel] += 1;
  }
  const promoted = rows.filter((r) => r.c.change === "promote");
  const demoted = rows.filter((r) => r.c.change === "demote");
  const weeklyCards = rows.filter((r) => r.c.card != null);
  const suspended = rows.filter((r) => r.c.suspended);

  const weekDays = selectWeekDailies(state, state.activeWeekId).filter(
    (d) => d.attendance === "present" || d.attendance === "late",
  );
  const radar = classCategoryAverages(weekDays)
    .filter((c) => c.key !== "discipline")
    .map((c) => ({ subject: c.label.replace(" ", "‌"), درصد: c.percent ?? 0 }));

  const tops = topPerformersOfWeek(
    rows.map((r) => ({
      student: r.student,
      weekTotal: r.c.weekTotal,
      dailyAvg: r.c.dailyAvg,
      disciplineAvg: r.c.disciplineAvg,
      isEthicsMan: !!r.weekly?.isEthicsMan,
    })),
    3,
  );

  const weekTotalByStudent = useMemo(() => {
    const map = new Map<string, number | null>();
    const periodWeekIds = new Set(
      state.weeks
        .filter((w) => {
          if (period === "week") return w.id === state.activeWeekId;
          if (period === "month") {
            const active = state.weeks.find((x) => x.id === state.activeWeekId);
            if (!active) return false;
            const [y1, m1] = active.evalDate.split("/").map(Number);
            const [y2, m2] = w.evalDate.split("/").map(Number);
            return y1 === y2 && m1 === m2;
          }
          return true;
        })
        .map((w) => w.id),
    );
    for (const s of students) {
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
  }, [state, students, period]);

  const fieldLeaders = fieldLeadersForPeriod({
    students,
    weeks: state.weeks,
    dailies: state.dailies,
    weeklies: state.weeklies,
    activeWeekId: state.activeWeekId,
    period,
    weekTotalByStudent,
  });

  const handleAddWeek = () => {
    const last = [...state.weeks].sort((a, b) => compareJalali(a.evalDate, b.evalDate)).at(-1);
    if (!last) {
      toast.error("هفته‌ای برای ادامه وجود ندارد");
      return;
    }
    const next = buildFollowingWeek(last);
    if (state.weeks.some((w) => w.id === next.id)) {
      toast.message("این هفته از قبل ساخته شده؛ از فهرست هفته انتخابش کنید");
      return;
    }
    addWeek(next);
    toast.success(`«${next.label}» ساخته شد — ${next.sessionDates.length} روز جلسه آماده ثبت است`);
  };

  return (
    <AppShell>
      <div className="stagger-in space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{state.settings.institution}</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{state.settings.className}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {week?.label} · ارزیابی {week?.evalDate}
              {week?.sessionDates?.length ? (
                <span className="text-muted-foreground">
                  {" · "}
                  {week.sessionDates.map((d) => formatJalaliShort(d)).join("، ")}
                </span>
              ) : null}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleAddWeek}>
              <CalendarPlus className="size-4" />
              هفته بعد
            </Button>
            <Button variant="outline" onClick={() => void navigate({ to: "/entry" })}>
              <ClipboardPen className="size-4" />
              ثبت جلسه
            </Button>
            <ExcelButton />
          </div>
        </header>

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Kpi label="میانگین کلاس" value={formatScore(classAvg)} hint="از ۱۰۰" />
          <Kpi label="تعداد حافظان" value={formatInt(students.length)} hint="پرونده فعال" icon={<Users className="size-4" />} />
          <Kpi
            label="مرد اخلاق"
            value={ethics?.student.shortName ?? "—"}
            hint={ethics ? `انضباط ${formatScore(ethics.c.disciplineAvg)} از ۶۰` : ""}
            icon={<Award className="size-4" />}
          />
          <div className="rounded-2xl bg-card p-4 shadow-border">
            <div className="text-xs text-muted-foreground">توزیع سطح</div>
            <div className="mt-3 flex items-end gap-2">
              {(["A", "B", "C"] as const).map((lv) => (
                <div key={lv} className="flex-1 text-center">
                  <div
                    className="mx-auto w-full rounded-md bg-primary/15"
                    style={{ height: 8 + levels[lv] * 10 }}
                  />
                  <div className="mt-1 text-xs text-muted-foreground">{LEVEL_LABEL[lv]}</div>
                  <div className="tabular text-sm font-medium">{formatInt(levels[lv])}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Crown className="size-5 text-primary" />
              برترین‌های این هفته
            </CardTitle>
            <span className="text-xs text-muted-foreground">بر اساس نمره ارزیابی کل</span>
          </CardHeader>
          <CardContent>
            {tops.length === 0 ? (
              <p className="text-sm text-muted-foreground">هنوز نمره‌ای برای رتبه‌بندی ثبت نشده.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-3">
                {tops.map((t) => (
                  <Link
                    key={t.studentId}
                    to="/students/$id"
                    params={{ id: t.studentId }}
                    className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-3 transition-colors hover:bg-muted/60"
                  >
                    <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                      {formatInt(t.rank)}
                    </div>
                    <StudentAvatar name={t.fullName} photo={t.photo} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{t.fullName}</div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
                        <span className="tabular font-semibold text-foreground">{formatScore(t.weekTotal)}</span>
                        {t.isEthicsMan ? <Badge variant="ethics">مرد اخلاق</Badge> : null}
                      </div>
                    </div>
                    {t.rank === 1 ? <Medal className="size-5 shrink-0 text-primary" /> : null}
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              کارت‌های هفتگی (دکتر میربلوک)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              طلایی ۹۰+ · نقره‌ای ۸۵–۸۹ · برنزی ۸۱–۸۴ — امتیاز بسته به سطح A/B/C
            </p>
          </CardHeader>
          <CardContent>
            {weeklyCards.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                هنوز کارتی صادر نشده. پس از ثبت نمره ارزیابی هفته، کارت‌ها اینجا نمایش داده می‌شوند.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {weeklyCards.map((r) => (
                  <Link
                    key={r.student.id}
                    to="/students/$id"
                    params={{ id: r.student.id }}
                    className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-3 py-3"
                  >
                    <StudentAvatar name={r.student.fullName} photo={r.student.photo} size={40} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{r.student.fullName}</div>
                      <div className="text-xs text-muted-foreground">سطح {r.student.currentLevel}</div>
                    </div>
                    <div className="text-left">
                      <Badge variant={r.c.card!.type}>{r.c.card!.label}</Badge>
                      <div className="mt-1 text-xs tabular text-muted-foreground">
                        +{formatInt(r.c.card!.points)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {suspended.length > 0 ? (
          <Card className="border-amber-500/40">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <AlertTriangle className="size-5" />
                هشدار تعلیق (دو روز ضعیف زیر ۷۰)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {suspended.map((r) => (
                <Link
                  key={r.student.id}
                  to="/students/$id"
                  params={{ id: r.student.id }}
                  className="rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-900"
                >
                  {r.student.fullName} ({r.c.lowDays} روز)
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <Card>
          <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>بهترین عملکرد هر بخش</CardTitle>
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
              {fieldLeaders.map((f) => (
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
                  <div className="text-left tabular text-sm font-semibold">
                    {formatScore(f.value)}
                    <span className="text-xs font-normal text-muted-foreground">/{formatInt(f.max)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="min-w-0 overflow-hidden lg:col-span-2">
            <CardHeader className="flex-row items-baseline justify-between">
              <CardTitle>رتبه‌بندی هفته</CardTitle>
              <span className="text-xs text-muted-foreground">بر اساس نمره ارزیابی کل</span>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr className="border-b border-border">
                      <th className="px-4 py-2 text-right font-medium">رتبه</th>
                      <th className="px-2 py-2 text-right font-medium">نام</th>
                      <th className="px-2 py-2 text-right font-medium">میانگین هفته</th>
                      <th className="px-2 py-2 text-right font-medium">شفاهی</th>
                      <th className="px-2 py-2 text-right font-medium">کتبی</th>
                      <th className="px-2 py-2 text-right font-medium">انضباط</th>
                      <th className="px-2 py-2 text-right font-medium">نمره کل</th>
                      <th className="px-4 py-2 text-right font-medium">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.student.id} className="border-b border-border/70 last:border-0 hover:bg-muted/40">
                        <td className="px-4 py-2.5 tabular text-muted-foreground">{formatInt(i + 1)}</td>
                        <td className="px-2 py-2.5">
                          <Link to="/students/$id" params={{ id: r.student.id }} className="flex items-center gap-2">
                            <StudentAvatar name={r.student.fullName} photo={r.student.photo} size={32} />
                            <span className="font-medium">{r.student.fullName}</span>
                            {r.weekly?.isEthicsMan ? (
                              <Badge variant="ethics" className="hidden sm:inline">مرد اخلاق</Badge>
                            ) : null}
                          </Link>
                        </td>
                        <td className="px-2 py-2.5 tabular">{formatScore(r.c.dailyAvg)}</td>
                        <td className="px-2 py-2.5 tabular">{formatScore(r.c.oralExam)}</td>
                        <td className="px-2 py-2.5 tabular">{formatScore(r.c.writtenExam)}</td>
                        <td className="px-2 py-2.5 tabular">{formatScore(r.c.disciplineAvg)}</td>
                        <td className="px-2 py-2.5 tabular font-semibold">{formatScore(r.c.weekTotal)}</td>
                        <td className="px-4 py-2.5">
                          <div className="flex flex-wrap items-center gap-1">
                            <LevelBadge level={r.c.nextLevel} />
                            <ChangeBadge change={r.c.change} from={r.prev} to={r.c.nextLevel} />
                            {r.c.card ? <Badge variant={r.c.card.type}>{r.c.card.label}</Badge> : null}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>نیمرخ مهارت کلاس</CardTitle>
              </CardHeader>
              <CardContent>
                <CategoryRadar data={radar} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>جابه‌جایی سطح</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {promoted.length === 0 && demoted.length === 0 ? (
                  <p className="text-muted-foreground">در این هفته جابه‌جایی سطح ثبت نشده.</p>
                ) : null}
                {promoted.map((r) => (
                  <div key={r.student.id} className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-primary" />
                    <span>{r.student.shortName}</span>
                    <ChangeBadge change="promote" from={r.prev} to={r.c.nextLevel} />
                  </div>
                ))}
                {demoted.map((r) => (
                  <div key={r.student.id} className="flex items-center gap-2">
                    <TrendingDown className="size-4 text-destructive" />
                    <span>{r.student.shortName}</span>
                    <ChangeBadge change="demote" from={r.prev} to={r.c.nextLevel} />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function Kpi({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-border">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        {icon}
      </div>
      <div className="mt-1 font-display text-2xl font-bold tabular">{value}</div>
      {hint ? <div className="mt-0.5 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
