import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/lib/store";
import { CARD_LABEL, cardForPoints } from "@/lib/scoring";
import { formatInt } from "@/lib/utils";
import { Award } from "lucide-react";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

function RewardsPage() {
  const state = useAppStore();
  const ranked = [...state.students].sort((a, b) => b.totalPoints - a.totalPoints);
  const ethics = state.weeklies.filter((w) => w.isEthicsMan && w.weekId === state.activeWeekId);

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

      {ethics.length > 0 ? (
        <Card className="mt-6">
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
