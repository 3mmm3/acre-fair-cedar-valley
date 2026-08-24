import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StudentAvatar } from "@/components/avatar";
import { ChangeBadge, LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { CategoryRadar } from "@/components/charts";
import { ExcelButton } from "@/components/excel-button";
import { useAppStore, selectWeek, studentWeeklyComputed, selectWeekDailies, previousLevelFor } from "@/lib/store";
import { classCategoryAverages } from "@/lib/analysis";
import { formatScore, formatInt } from "@/lib/utils";
import { LEVEL_LABEL, mean } from "@/lib/scoring";
import { Award, ClipboardPen, TrendingDown, TrendingUp, Users } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const state = useAppStore();
  const navigate = useNavigate();
  const week = selectWeek(state);
  const students = state.students;

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

  const weekDays = selectWeekDailies(state, state.activeWeekId).filter(
    (d) => d.attendance === "present" || d.attendance === "late",
  );
  const radar = classCategoryAverages(weekDays)
    .filter((c) => c.key !== "discipline")
    .map((c) => ({ subject: c.label.replace(" ", "‌"), درصد: c.percent ?? 0 }));

  return (
    <AppShell>
      <div className="stagger-in space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">{state.settings.institution}</p>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">{state.settings.className}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {week?.label} · ارزیابی {week?.evalDate}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="min-w-0 overflow-hidden lg:col-span-2">
            <CardHeader className="flex-row items-baseline justify-between">
              <CardTitle>رتبه‌بندی هفته</CardTitle>
              <span className="text-xs text-muted-foreground">بر اساس نمره ارزیابی کل</span>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="divide-y divide-border lg:hidden">
                {rows.map((r, i) => (
                  <li key={r.student.id}>
                    <Link
                      to="/students/$id"
                      params={{ id: r.student.id }}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <span className="w-5 tabular text-xs text-muted-foreground">{formatInt(i + 1)}</span>
                      <StudentAvatar name={r.student.fullName} photo={r.student.photo} size={36} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium">{r.student.fullName}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1">
                          <LevelBadge level={r.c.nextLevel} />
                          {r.weekly?.isEthicsMan ? <Badge variant="ethics">مرد اخلاق</Badge> : null}
                        </div>
                      </div>
                      <div className="tabular text-sm font-semibold">{formatScore(r.c.weekTotal)}</div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="hidden overflow-x-auto lg:block">
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
                            <Badge variant="ethics" className="hidden sm:inline">
                              مرد اخلاق
                            </Badge>
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
  label: string
  value: string
  hint?: string
  icon?: React.ReactNode
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-border">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {label}
        {icon}
      </div>
      <div className="mt-2 font-display text-2xl font-bold leading-tight">{value}</div>
      {hint ? <div className="mt-1 text-xs text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
