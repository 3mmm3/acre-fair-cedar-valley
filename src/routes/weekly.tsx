import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { ChangeBadge, LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScoreInput } from "@/components/score-input";
import { useAppStore, selectWeek, studentWeeklyComputed, previousLevelFor } from "@/lib/store";
import { ORAL_MAX, WRITTEN_MAX } from "@/lib/scoring";
import { formatScore, formatInt } from "@/lib/utils";
import { toast } from "sonner";
import { ExcelButton } from "@/components/excel-button";
import { Lock, LockOpen, Printer } from "lucide-react";

export const Route = createFileRoute("/weekly")({ component: WeeklyPage });

function WeeklyPage() {
  const state = useAppStore();
  const week = selectWeek(state);
  const patchWeekly = useAppStore((s) => s.patchWeekly);
  const lockWeek = useAppStore((s) => s.lockWeek);
  const unlockWeek = useAppStore((s) => s.unlockWeek);

  if (!week) {
    return (
      <AppShell>
        <p>هفته‌ای انتخاب نشده.</p>
      </AppShell>
    );
  }

  const locked = week.status === "complete";
  const rows = state.students.map((s) => {
    const rec = state.weeklies.find((w) => w.studentId === s.id && w.weekId === week.id);
    const c = studentWeeklyComputed(state, s.id, week.id);
    const prev = previousLevelFor(state, s.id, week.id);
    return { student: s, rec, c, prev };
  });

  return (
    <AppShell>
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">ارزیابی پایان هفته</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {week.label} · تاریخ ارزیابی {week.evalDate} — شفاهی و کتبی را وارد کنید؛ بقیه خودکار است
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExcelButton />
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            چاپ خلاصه هفته
          </Button>
          {locked ? (
            <Button
              variant="secondary"
              onClick={() => {
                unlockWeek(week.id);
                toast.message("قفل هفته باز شد؛ امتیازها و سطح به قبل برگشت.");
              }}
            >
              <LockOpen className="size-4" />
              باز کردن قفل
            </Button>
          ) : (
            <Button
              onClick={() => {
                lockWeek(week.id);
                toast.success("هفته قفل شد؛ سطح‌ها و امتیازها به‌روز شدند");
              }}
            >
              <Lock className="size-4" />
              نهایی‌کردن هفته
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4 hidden print:block">
        <h1 className="font-display text-2xl">ارزیابی {week.label}</h1>
        <p className="text-sm">
          {state.settings.institution} · {state.settings.className}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl bg-card shadow-border">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
              <th className="px-3 py-3 text-right font-medium">ردیف</th>
              <th className="px-2 py-3 text-right font-medium">نام</th>
              <th className="px-2 py-3 text-center font-medium">میانگین هفته</th>
              <th className="px-2 py-3 text-center font-medium">شفاهی ۵۰</th>
              <th className="px-2 py-3 text-center font-medium">کتبی ۵۰</th>
              <th className="px-2 py-3 text-center font-medium">جمع آزمون</th>
              <th className="px-2 py-3 text-center font-medium">انضباط ۶۰</th>
              <th className="px-2 py-3 text-center font-medium">نمره کل ۱۰۰</th>
              <th className="px-2 py-3 text-right font-medium">توضیحات</th>
              <th className="px-3 py-3 text-right font-medium">امتیاز</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.student.id} className="border-b border-border/70 last:border-0">
                <td className="px-3 py-2 tabular text-muted-foreground">{formatInt(i + 1)}</td>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <StudentAvatar name={r.student.fullName} photo={r.student.photo} size={28} />
                    <div>
                      <div className="whitespace-nowrap font-medium">{r.student.fullName}</div>
                      <div className="mt-0.5 flex flex-wrap gap-1">
                        <LevelBadge level={r.c.nextLevel} />
                        {r.rec?.isEthicsMan ? <Badge variant="ethics">مرد اخلاق</Badge> : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-2 text-center tabular">{formatScore(r.c.dailyAvg)}</td>
                <td className="w-24 px-1 py-1.5">
                  <ScoreInput
                    value={r.rec?.oralExam ?? null}
                    max={ORAL_MAX}
                    disabled={locked || !r.rec}
                    onChange={(v) => r.rec && patchWeekly(r.rec.id, { oralExam: v })}
                  />
                </td>
                <td className="w-24 px-1 py-1.5">
                  <ScoreInput
                    value={r.rec?.writtenExam ?? null}
                    max={WRITTEN_MAX}
                    disabled={locked || !r.rec}
                    onChange={(v) => r.rec && patchWeekly(r.rec.id, { writtenExam: v })}
                  />
                </td>
                <td className="px-2 py-2 text-center tabular">{formatScore(r.c.examTotal)}</td>
                <td className="px-2 py-2 text-center tabular">{formatScore(r.c.disciplineAvg)}</td>
                <td className="px-2 py-2 text-center tabular font-semibold">{formatScore(r.c.weekTotal)}</td>
                <td className="px-2 py-2">
                  <div className="flex flex-col gap-1">
                    <ChangeBadge change={r.c.change} from={r.prev} to={r.c.nextLevel} />
                    <input
                      disabled={locked || !r.rec}
                      value={r.rec?.notes ?? ""}
                      onChange={(e) => r.rec && patchWeekly(r.rec.id, { notes: e.target.value })}
                      placeholder="یادداشت…"
                      className="h-8 rounded-md border border-input bg-card px-2 text-xs"
                    />
                  </div>
                </td>
                <td className="px-3 py-2 tabular text-muted-foreground">{formatInt(r.rec?.pointsAwarded ?? 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="no-print mt-3 text-xs text-muted-foreground">
        نمره کل هفته = میانگینِ (میانگین روزهای هفته و جمع آزمون شفاهی+کتبی). سطح الف از{" "}
        {state.settings.levelA} و سطح ب از {state.settings.levelB}.
      </p>
    </AppShell>
  );
}
