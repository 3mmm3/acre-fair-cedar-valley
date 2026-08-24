import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useRef } from "react";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { ChangeBadge, LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Textarea } from "@/components/ui/input";
import { Meter } from "@/components/meter";
import { CategoryBars, CategoryRadar, DailyLineChart, SkillSmallMultiples, WeekTrend } from "@/components/charts";
import {
  useAppStore,
  selectStudentDailies,
  studentWeeklyComputed,
  previousLevelFor,
} from "@/lib/store";
import { analyzeStudent, categoryInsights } from "@/lib/analysis";
import {
  ATTENDANCE_LABEL,
  CARD_LABEL,
  SCORE_FIELDS,
  academicTotal,
  cardForPoints,
  dailyAverage,
  fieldPercent,
} from "@/lib/scoring";
import { formatJalaliShort, formatJalaliWithWeekday } from "@/lib/jalali";
import { formatInt, formatScore } from "@/lib/utils";
import { resizeImageFile } from "@/lib/photo";
import { toast } from "sonner";
import { ArrowRight, Camera, Printer, Trash2 } from "lucide-react";

export const Route = createFileRoute("/students/$id")({ component: StudentDossier });

function StudentDossier() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const state = useAppStore();
  const updateStudent = useAppStore((s) => s.updateStudent);
  const removeStudent = useAppStore((s) => s.removeStudent);
  const student = state.students.find((s) => s.id === id);
  const fileRef = useRef<HTMLInputElement>(null);

  const weekId = state.activeWeekId;
  const week = state.weeks.find((w) => w.id === weekId);
  const computed = student ? studentWeeklyComputed(state, student.id, weekId) : null;
  const prevLevel = student ? previousLevelFor(state, student.id, weekId) : "C";
  const weekly = state.weeklies.find((w) => w.studentId === id && w.weekId === weekId);

  const allDailies = useMemo(
    () => (student ? selectStudentDailies(state, student.id) : []),
    [state.dailies, student?.id],
  );
  const weekDailies = allDailies.filter((d) => d.weekId === weekId);
  const presentAll = allDailies.filter((d) => d.attendance === "present" || d.attendance === "late");
  const cats = categoryInsights(allDailies);
  const insight = student ? analyzeStudent(student, allDailies, state.weeklies.filter((w) => w.studentId === id)) : null;
  const card = student ? cardForPoints(student.totalPoints, state.settings) : null;

  const weekTrend = state.weeks.map((w) => ({
    label: formatJalaliShort(w.evalDate),
    نمره: studentWeeklyComputed(state, id, w.id).weekTotal,
  }));

  const dailyLine = weekDailies.map((d) => ({
    label: formatJalaliShort(d.date),
    میانگین: dailyAverage(academicTotal(d.scores), d.discipline),
    انضباط: d.discipline,
  }));

  const skillSeries = SCORE_FIELDS.map((f) => ({
    name: f.label,
    data: presentAll.map((d) => ({
      label: formatJalaliShort(d.date),
      درصد: fieldPercent(d.scores[f.key], f.max),
    })),
  }));

  if (!student || !computed) {
    return (
      <AppShell>
        <p className="text-muted-foreground">این پرونده پیدا نشد.</p>
        <Link to="/students" className="mt-3 inline-block text-sm text-primary">
          بازگشت به فهرست
        </Link>
      </AppShell>
    );
  }

  const set = (patch: Partial<typeof student>) => updateStudent(student.id, patch);

  return (
    <AppShell>
      <div className="stagger-in space-y-6">
        <div className="no-print flex flex-wrap items-center justify-between gap-3">
          <Link to="/students" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowRight className="size-4" />
            پرونده‌ها
          </Link>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" />
              چاپ پرونده
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm(`پرونده «${student.fullName}» حذف شود؟`)) {
                  removeStudent(student.id);
                  toast.message("پرونده حذف شد");
                  void navigate({ to: "/students" });
                }
              }}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>

        <section className="rounded-2xl bg-card p-5 shadow-border sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <button
              type="button"
              className="group relative mx-auto sm:mx-0"
              onClick={() => fileRef.current?.click()}
              title="بارگذاری عکس"
            >
              <StudentAvatar name={student.fullName} photo={student.photo} size={96} />
              <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-border">
                <Camera className="size-3.5" />
              </span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                try {
                  const data = await resizeImageFile(file);
                  set({ photo: data });
                  toast.success("عکس پرونده ذخیره شد");
                } catch {
                  toast.error("بارگذاری عکس ممکن نشد");
                }
              }}
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h1 className="font-display text-3xl font-bold leading-tight">{student.fullName}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {state.settings.className} · {week?.label}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <LevelBadge level={student.currentLevel} />
                  <ChangeBadge change={computed.change} from={prevLevel} to={computed.nextLevel} />
                  {card ? <Badge variant={card}>{CARD_LABEL[card]}</Badge> : null}
                  {weekly?.isEthicsMan ? <Badge variant="ethics">مرد اخلاق</Badge> : null}
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Kpi k="نمره هفته" v={formatScore(computed.weekTotal)} />
                <Kpi k="میانگین روز" v={formatScore(computed.dailyAvg)} />
                <Kpi k="انضباط" v={formatScore(computed.disciplineAvg)} />
                <Kpi k="امتیاز کل" v={formatInt(student.totalPoints)} />
              </dl>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>مشخصات پرونده</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <Field label="نام کامل" value={student.fullName} onChange={(v) => set({ fullName: v, shortName: v })} />
              <Field label="نام پدر" value={student.fatherName} onChange={(v) => set({ fatherName: v })} />
              <Field label="تلفن" value={student.phone} onChange={(v) => set({ phone: v })} />
              <Field label="سال تولد" value={student.birthYear} onChange={(v) => set({ birthYear: v })} />
              <Field label="شهر" value={student.city} onChange={(v) => set({ city: v })} />
              <Field label="جزء جاری" value={student.currentJuz} onChange={(v) => set({ currentJuz: v })} />
              <Field label="تاریخ ورود" value={student.joinDate} onChange={(v) => set({ joinDate: v })} />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">یادداشت مربی</label>
                <Textarea value={student.notes} onChange={(e) => set({ notes: e.target.value })} rows={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>آزمون پایان هفته</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row k="شفاهی از ۵۰" v={formatScore(computed.oralExam)} />
              <Row k="کتبی از ۵۰" v={formatScore(computed.writtenExam)} />
              <Row k="جمع آزمون" v={formatScore(computed.examTotal)} />
              <Row k="حضور این هفته" v={`${formatInt(computed.presentCount)} جلسه`} />
              {computed.excusedCount ? <Row k="غیبت موجه" v={formatInt(computed.excusedCount)} /> : null}
              {weekly?.notes ? <p className="pt-2 text-muted-foreground">{weekly.notes}</p> : null}
            </CardContent>
          </Card>
        </section>

        {insight ? (
          <section className="rounded-2xl bg-ink p-5 text-ink-foreground shadow-border sm:p-6">
            <p className="text-xs tracking-wide text-ink-foreground/60">تحلیل پیشرفته</p>
            <h2 className="mt-1 font-display text-2xl font-bold">{insight.focusTitle}</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-ink-foreground/85">
              {insight.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {insight.plan.length ? (
              <ol className="mt-5 space-y-2 text-sm">
                {insight.plan.map((step, i) => (
                  <li key={step} className="flex gap-3">
                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-foreground/10 text-xs tabular">
                      {formatInt(i + 1)}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            ) : null}
            <div className="mt-5 flex flex-wrap gap-2">
              {insight.strengths.map((s) => (
                <Badge key={s.key} variant="a">
                  قوت: {s.label}
                </Badge>
              ))}
              {insight.weaknesses.map((s) => (
                <Badge key={s.key} variant="c">
                  ضعف: {s.label}
                </Badge>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>روند نمره هفته‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <WeekTrend data={weekTrend} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>میانگین روزهای این هفته</CardTitle>
            </CardHeader>
            <CardContent>
              <DailyLineChart data={dailyLine} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>درصد مهارت‌ها نسبت به سقف</CardTitle>
            </CardHeader>
            <CardContent>
              <CategoryBars data={cats.map((c) => ({ name: c.label, درصد: c.percent }))} />
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
        </section>

        <Card>
          <CardHeader>
            <CardTitle>نمودار تک‌تک مهارت‌ها در طول زمان</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillSmallMultiples series={skillSeries} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>جزئیات مهارت‌ها</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {cats.map((c) => (
              <Meter
                key={c.key}
                label={c.label}
                value={c.average}
                max={c.max}
                hint={
                  c.trend === "up"
                    ? `روند صعودی ${formatScore(c.trendDelta)}`
                    : c.trend === "down"
                      ? `روند نزولی ${formatScore(c.trendDelta)}`
                      : undefined
                }
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>کارنامه روزانه این هفته</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[860px] text-xs">
              <thead className="text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-right font-medium">تاریخ</th>
                  <th className="px-2 py-2 text-right font-medium">حضور</th>
                  {SCORE_FIELDS.map((f) => (
                    <th key={f.key} className="px-1 py-2 text-center font-medium">
                      {f.short}
                    </th>
                  ))}
                  <th className="px-2 py-2 text-center font-medium">جمع</th>
                  <th className="px-2 py-2 text-center font-medium">انضباط</th>
                  <th className="px-4 py-2 text-center font-medium">میانگین</th>
                </tr>
              </thead>
              <tbody>
                {weekDailies.map((d) => {
                  const ac = academicTotal(d.scores);
                  return (
                    <tr key={d.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-2 whitespace-nowrap">{formatJalaliWithWeekday(d.date)}</td>
                      <td className="px-2 py-2">{ATTENDANCE_LABEL[d.attendance]}</td>
                      {SCORE_FIELDS.map((f) => (
                        <td key={f.key} className="px-1 py-2 text-center tabular">
                          {formatScore(d.scores[f.key])}
                        </td>
                      ))}
                      <td className="px-2 py-2 text-center tabular font-medium">{formatScore(ac)}</td>
                      <td className="px-2 py-2 text-center tabular">{formatScore(d.discipline)}</td>
                      <td className="px-4 py-2 text-center tabular font-semibold">
                        {formatScore(dailyAverage(ac, d.discipline))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>تاریخچه هفته‌ها</CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-2 text-right font-medium">هفته</th>
                  <th className="px-2 py-2 text-center font-medium">میانگین</th>
                  <th className="px-2 py-2 text-center font-medium">شفاهی</th>
                  <th className="px-2 py-2 text-center font-medium">کتبی</th>
                  <th className="px-2 py-2 text-center font-medium">نمره کل</th>
                  <th className="px-4 py-2 text-right font-medium">وضعیت</th>
                </tr>
              </thead>
              <tbody>
                {state.weeks.map((w) => {
                  const c = studentWeeklyComputed(state, student.id, w.id);
                  const rec = state.weeklies.find((x) => x.studentId === student.id && x.weekId === w.id);
                  const from = previousLevelFor(state, student.id, w.id);
                  return (
                    <tr key={w.id} className="border-b border-border/70 last:border-0">
                      <td className="px-4 py-2">{w.label}</td>
                      <td className="px-2 py-2 text-center tabular">{formatScore(c.dailyAvg)}</td>
                      <td className="px-2 py-2 text-center tabular">{formatScore(c.oralExam)}</td>
                      <td className="px-2 py-2 text-center tabular">{formatScore(c.writtenExam)}</td>
                      <td className="px-2 py-2 text-center tabular font-semibold">{formatScore(c.weekTotal)}</td>
                      <td className="px-4 py-2">
                        <div className="flex flex-wrap gap-1">
                          <LevelBadge level={c.nextLevel} />
                          <ChangeBadge change={c.change} from={from} to={c.nextLevel} />
                          {rec?.isEthicsMan ? <Badge variant="ethics">مرد اخلاق</Badge> : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Kpi({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-muted/70 px-3 py-2">
      <div className="text-[11px] text-muted-foreground">{k}</div>
      <div className="tabular text-lg font-semibold">{v}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{k}</span>
      <span className="tabular font-medium">{v}</span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
