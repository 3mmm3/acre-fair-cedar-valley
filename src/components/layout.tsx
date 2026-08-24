import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  ClipboardPen,
  CalendarCheck,
  LineChart,
  Award,
  Settings,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/store";

const NAV = [
  { to: "/", label: "داشبورد", icon: LayoutDashboard },
  { to: "/students", label: "پرونده‌ها", icon: Users },
  { to: "/entry", label: "ثبت روزانه", icon: ClipboardPen },
  { to: "/weekly", label: "ارزیابی هفته", icon: CalendarCheck },
  { to: "/analysis", label: "تحلیل عملکرد", icon: LineChart },
  { to: "/rewards", label: "امتیاز و کارت", icon: Award },
  { to: "/settings", label: "تنظیمات", icon: Settings },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const settings = useAppStore((s) => s.settings);
  const weeks = useAppStore((s) => s.weeks);
  const activeWeekId = useAppStore((s) => s.activeWeekId);
  const setActiveWeek = useAppStore((s) => s.setActiveWeek);
  const week = weeks.find((w) => w.id === activeWeekId);

  return (
    <div className="min-h-dvh bg-background pattern-paper">
      <aside className="no-print pattern-khatam fixed inset-y-0 right-0 z-30 hidden w-60 flex-col text-ink-foreground lg:flex">
        <div className="flex items-center gap-3 px-5 pt-6 pb-5">
          <Mark />
          <div>
            <div className="font-display text-2xl leading-none">میقات</div>
            <div className="mt-1 text-[11px] tracking-wide text-ink-foreground/60">ارزیابی حافظان</div>
          </div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3">
          {NAV.map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150",
                  active
                    ? "bg-ink-foreground/10 text-ink-foreground"
                    : "text-ink-foreground/70 hover:bg-ink-foreground/6 hover:text-ink-foreground",
                )}
              >
                <Icon className="size-4 shrink-0 opacity-80" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 pb-6 pt-4 text-[11px] leading-relaxed text-ink-foreground/45">
          <div className="flex items-center gap-1.5">
            <BookOpen className="size-3" />
            {settings.institution}
          </div>
          <div className="mt-0.5">{settings.className}</div>
        </div>
      </aside>

      <div className="min-w-0 lg:pr-60">
        <header className="no-print sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md">
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex min-w-0 items-center gap-3 lg:hidden">
              <Mark small />
              <span className="font-display text-xl">میقات</span>
            </div>
            <div className="hidden min-w-0 lg:block">
              <div className="text-xs text-muted-foreground">{settings.className}</div>
              <div className="font-medium">{week?.label ?? "هفته جاری"}</div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-muted-foreground sm:inline">هفته</span>
              <select
                value={activeWeekId}
                onChange={(e) => setActiveWeek(e.target.value)}
                className="h-10 max-w-[220px] rounded-lg border border-border bg-card px-3 text-sm shadow-sm"
              >
                {weeks.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.label}
                    {w.status === "open" ? " — باز" : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <main className="mx-auto w-full min-w-0 max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:py-8 lg:pb-10">{children}</main>
      </div>

      <nav className="no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {NAV.slice(0, 5).map((item) => {
            const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px]",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

function Mark({ small }: { small?: boolean }) {
  const s = small ? 32 : 40;
  return (
    <svg width={s} height={s} viewBox="0 0 40 40" aria-hidden className="shrink-0">
      <rect width="40" height="40" rx="10" fill="#f4f1ea" />
      <polygon points="20,4 23,16 36,20 23,24 20,36 17,24 4,20 17,16" fill="#1e4d3a" />
      <polygon points="20,12 21.5,18 28,20 21.5,22 20,28 18.5,22 12,20 18.5,18" fill="#f4f1ea" />
    </svg>
  );
}
