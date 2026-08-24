import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { Button } from "@/components/ui/button";
import { ScoreInput } from "@/components/score-input";
import { useAppStore, selectWeek } from "@/lib/store";
import {
  ACADEMIC_MAX,
  ATTENDANCE_LABEL,
  DISCIPLINE_MAX,
  SCORE_FIELDS,
  academicTotal,
  dailyAverage,
} from "@/lib/scoring";
import { formatJalaliWithWeekday } from "@/lib/jalali";
import { formatScore } from "@/lib/utils";
import type { Attendance, ScoreKey } from "@/lib/types";
import { toast } from "sonner";
import { Printer } from "lucide-react";

export const Route = createFileRoute("/entry")({ component: EntryPage });

function EntryPage() {
  const state = useAppStore();
  const week = selectWeek(state);
  const patchDailyScores = useAppStore((s) => s.patchDailyScores);
  const patchDaily = useAppStore((s) => s.patchDaily);
  const dates = week?.sessionDates ?? [];
  const [date, setDate] = useState(dates[0] ?? "");

  useEffect(() => {
    if (!week) return;
    const stored = sessionStorage.getItem("miqat-entry-date");
    if (stored && week.sessionDates.includes(stored)) {
      setDate(stored);
      return;
    }
    const filled = week.sessionDates.find((d) =>
      state.dailies.some(
        (x) => x.weekId === week.id && x.date === d && academicTotal(x.scores) != null,
      ),
    );
    setDate(filled ?? week.sessionDates[0] ?? "");
  }, [week?.id]);

  if (!week) {
    return (
      <AppShell>
        <p>هفته‌ای انتخاب نشده.</p>
      </AppShell>
    );
  }

  const locked = week.status === "complete";
  const rows = state.students.map((s) => {
    const rec = state.dailies.find((d) => d.studentId === s.id && d.weekId === week.id && d.date === date);
    return { student: s, rec };
  });

  return (
    <AppShell>
      <div className="no-print flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">ثبت ارزیابی روزانه</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            فقط خانه‌های نمره را پر کنید — جمع، میانگین و پرونده‌ها همان لحظه به‌روز می‌شوند
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={date}
            onChange={(e) => {
              sessionStorage.setItem("miqat-entry-date", e.target.value);
              setDate(e.target.value);
            }}
            className="h-10 rounded-lg border border-border bg-card px-3 text-sm shadow-sm"
          >
            {dates.map((d) => (
              <option key={d} value={d}>
                {formatJalaliWithWeekday(d)}
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="size-4" />
            چاپ فرم
          </Button>
        </div>
      </div>

      {locked ? (
        <p className="no-print mt-3 rounded-xl bg-muted px-4 py-2 text-sm text-muted-foreground">
          این هفته قفل است. برای ویرایش، از صفحه ارزیابی هفته قفل را باز کنید.
        </p>
      ) : null}

      <div className="mb-4 hidden print:block">
        <h1 className="font-display text-2xl">فرم ارزیابی روزانه حافظان</h1>
        <p className="text-sm">
          {state.settings.className} · {formatJalaliWithWeekday(date)}
        </p>
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl bg-card shadow-border">
        <table className="w-full min-w-[1100px] text-xs">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-muted-foreground">
              <th className="sticky right-0 z-10 bg-muted/90 px-3 py-3 text-right font-medium">نام</th>
              <th className="px-2 py-3 text-right font-medium">حضور</th>
              {SCORE_FIELDS.map((f) => (
                <th key={f.key} className="px-1 py-3 text-center font-medium" title={f.hint}>
                  {f.short}
                  <div className="font-normal text-[10px] opacity-70">{f.max}</div>
                </th>
              ))}
              <th className="px-2 py-3 text-center font-medium">
                جمع
                <div className="font-normal text-[10px] opacity-70">{ACADEMIC_MAX}</div>
              </th>
              <th className="px-2 py-3 text-center font-medium">
                انضباط
                <div className="font-normal text-[10px] opacity-70">{DISCIPLINE_MAX}</div>
              </th>
              <th className="px-3 py-3 text-center font-medium">میانگین ۱۰۰</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ student, rec }, idx) => {
              if (!rec) return null;
              const ac = academicTotal(rec.scores);
              const avg = dailyAverage(ac, rec.discipline);
              return (
                <tr key={student.id} className="border-b border-border/70 last:border-0">
                  <td className="sticky right-0 z-10 bg-card px-3 py-2">
                    <div className="flex items-center gap-2">
                      <span className="w-4 text-muted-foreground">{idx + 1}</span>
                      <StudentAvatar name={student.fullName} photo={student.photo} size={28} />
                      <span className="whitespace-nowrap font-medium">{student.fullName}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2">
                    <select
                      disabled={locked}
                      value={rec.attendance}
                      onChange={(e) => patchDaily(rec.id, { attendance: e.target.value as Attendance })}
                      className="h-9 rounded-md border border-input bg-card px-1 text-xs"
                    >
                      {(Object.keys(ATTENDANCE_LABEL) as Attendance[]).map((k) => (
                        <option key={k} value={k}>
                          {ATTENDANCE_LABEL[k]}
                        </option>
                      ))}
                    </select>
                  </td>
                  {SCORE_FIELDS.map((f) => (
                    <td key={f.key} className="px-1 py-1.5">
                      <ScoreInput
                        value={rec.scores[f.key]}
                        max={f.max}
                        disabled={locked}
                        onChange={(v) =>
                          patchDailyScores(rec.id, { [f.key]: v } as Partial<Record<ScoreKey, number | null>>)
                        }
                      />
                    </td>
                  ))}
                  <td className="px-2 py-2 text-center tabular font-medium">{formatScore(ac)}</td>
                  <td className="w-20 px-1 py-1.5">
                    <ScoreInput
                      value={rec.discipline}
                      max={DISCIPLINE_MAX}
                      disabled={locked}
                      onChange={(v) => patchDaily(rec.id, { discipline: v })}
                    />
                  </td>
                  <td className="px-3 py-2 text-center tabular text-sm font-semibold">{formatScore(avg)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="no-print mt-3 text-xs text-muted-foreground">
        میانگین روز = (جمع علمی از ۱۴۰ + انضباط از ۶۰) ÷ ۲. تغییرات همان لحظه ذخیره می‌شود.{" "}
        <button className="text-primary underline-offset-2 hover:underline" onClick={() => toast.success("نمرات این جلسه ثبت شد")}>
          تأیید ثبت
        </button>
      </p>
    </AppShell>
  );
}
