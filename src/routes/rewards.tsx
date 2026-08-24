import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore, studentWeeklyComputed } from "@/lib/store";
import { CARD_LABEL, cardForPoints, mean } from "@/lib/scoring";
import {
  fieldLeadersForPeriod,
  topPerformersOfWeek,
  PERIOD_LABEL,
  type Period,
} from "@/lib/analysis";
import { formatInt, formatScore } from "@/lib/utils";
import { Award, Crown, Medal } from "lucide-react";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

function RewardsPage() {
  const state = useAppStore();
  const [period, setPeriod] = useState<Period>("week");
  const ranked = [...state.students].sort((a, b) => b.totalPoints - a.totalPoints);
  const ethics = state.weeklies.filter((w) => w.isEthicsMan && w.weekId === state.activeWeekId);

  const weekRows = state.students.map((s) => {
    const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
    const weekly = state.weeklies.find((w) => w.studentId === s.id && w.weekId === state.activeWeekId);
    return {
      student: s,
      weekTotal: c.weekTotal,
      dailyAvg: c.dailyAvg,
      disciplineAvg: c.disciplineAvg,
      isEthicsMan: !!weekly?.isEthicsMan,
    };
  });
  const tops = topPerformersOfWeek(weekRows, 3);

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

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">امتیاز و کارت‌ها</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        کارت برنزی از {formatInt(state.settings.bronzeAt)}، نقره‌ای از {formatInt(state.settings.silverAt)} و طلایی از{" "}
        {formatInt(state.settings.goldAt)} امتیاز
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Legend title="برنزی" desc={`از ${formatInt(state.settings.bronzeAt)} امتیاز`} variant="bronze" />
        <Legend title="نقره‌ای" desc={`از ${formatInt(state.settings.silverAt)} امتیاز`} variant="silver" />
        <Legend title="طلایی" desc={`از ${formatInt(state.settings.goldAt)} امتیاز`} variant="gold" />
      </div>

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

      {ethics.length > 0 ? (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="size-5" />
              مرد اخلاق این هفته
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {ethics.map((e) => {
              const s = state.students.find((x) => x.id === e.studentId);
              if (!s) return null;
              return (
                <Link key={e.id} to="/students/$id" params={{ id: s.id }} className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2">
                  <StudentAvatar name={s.fullName} photo={s.photo} size={36} />
                  <span className="font-medium">{s.fullName}</span>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      ) : null}

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

      <div className="mt-6 overflow-x-auto rounded-2xl bg-card shadow-border">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-4 py-3 text-right font-medium">رتبه</th>
              <th className="px-2 py-3 text-right font-medium">نام</th>
              <th className="px-2 py-3 text-right font-medium">امتیاز کل</th>
              <th className="px-2 py-3 text-right font-medium">کارت</th>
              <th className="px-4 py-3 text-right font-medium">آخرین رویدادها</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((s, i) => {
              const card = cardForPoints(s.totalPoints, state.settings);
              const events = state.points.filter((p) => p.studentId === s.id).slice(-3).reverse();
              return (
                <tr key={s.id} className="border-b border-border/70 last:border-0">
                  <td className="px-4 py-3 tabular text-muted-foreground">{formatInt(i + 1)}</td>
                  <td className="px-2 py-3">
                    <Link to="/students/$id" params={{ id: s.id }} className="flex items-center gap-2">
                      <StudentAvatar name={s.fullName} photo={s.photo} size={32} />
                      {s.fullName}
                    </Link>
                  </td>
                  <td className="px-2 py-3 tabular font-semibold">{formatInt(s.totalPoints)}</td>
                  <td className="px-2 py-3">{card ? <Badge variant={card}>{CARD_LABEL[card]}</Badge> : "—"}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {events.length === 0
                      ? "بدون امتیاز"
                      : events.map((e) => `${e.reason} (${formatInt(e.amount)})`).join(" · ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function Legend({
  title,
  desc,
  variant,
}: {
  title: string
  desc: string
  variant: "gold" | "silver" | "bronze"
}) {
  return (
    <div className="rounded-2xl bg-card p-4 shadow-border">
      <Badge variant={variant}>کارت {title}</Badge>
      <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
    </div>
  );
}
