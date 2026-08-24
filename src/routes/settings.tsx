import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { AppShell } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExcelButton } from "@/components/excel-button";
import { useAppStore } from "@/lib/store";
import { buildFollowingWeek } from "@/lib/week-utils";
import { compareJalali, formatJalaliWithWeekday } from "@/lib/jalali";
import { toast } from "sonner";
import type { AppState, ClassSettings } from "@/lib/types";
import { CalendarPlus } from "lucide-react";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useAppStore((s) => s.settings);
  const weeks = useAppStore((s) => s.weeks);
  const activeWeekId = useAppStore((s) => s.activeWeekId);
  const setActiveWeek = useAppStore((s) => s.setActiveWeek);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const resetToSeed = useAppStore((s) => s.resetToSeed);
  const addWeek = useAppStore((s) => s.addWeek);
  const loadBackup = useAppStore((s) => s.loadBackup);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof ClassSettings, value: string | number) => {
    updateSettings({ [key]: value } as Partial<ClassSettings>);
  };

  const sortedWeeks = [...weeks].sort((a, b) => compareJalali(a.evalDate, b.evalDate));
  const last = sortedWeeks.at(-1);
  const preview = last ? buildFollowingWeek(last) : null;

  const handleAddWeek = () => {
    if (!last) return;
    const next = buildFollowingWeek(last);
    if (weeks.some((w) => w.id === next.id)) {
      toast.message("این هفته از قبل وجود دارد");
      setActiveWeek(next.id);
      return;
    }
    addWeek(next);
    toast.success(`هفته «${next.label}» ساخته شد و فعال شد`);
  };

  return (
    <AppShell>
      <h1 className="font-display text-3xl font-bold">تنظیمات کلاس</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        نام مؤسسه، آستانه‌های سطح و قوانین امتیاز — محاسبات بلافاصله با این اعداد هماهنگ می‌شوند
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>مشخصات</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Field label="مؤسسه" value={settings.institution} onChange={(v) => set("institution", v)} />
            <Field label="نام کلاس" value={settings.className} onChange={(v) => set("className", v)} />
            <Field label="نام مربی" value={settings.teacherName} onChange={(v) => set("teacherName", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>آستانه سطح</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Num label="سطح الف از نمره" value={settings.levelA} onChange={(v) => set("levelA", v)} />
            <Num label="سطح ب از نمره" value={settings.levelB} onChange={(v) => set("levelB", v)} />
            <p className="text-xs text-muted-foreground">پایین‌تر از سطح ب، سطح ج محسوب می‌شود.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>امتیاز عملکرد</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Num label="امتیاز نمره سطح الف" value={settings.pointsHigh} onChange={(v) => set("pointsHigh", v)} />
            <Num label="امتیاز نمره سطح ب" value={settings.pointsMid} onChange={(v) => set("pointsMid", v)} />
            <Num label="امتیاز نمره ۶۵ به بالا" value={settings.pointsLow} onChange={(v) => set("pointsLow", v)} />
            <Num label="پاداش مرد اخلاق" value={settings.ethicsBonus} onChange={(v) => set("ethicsBonus", v)} />
            <Num label="پاداش ارتقاء سطح" value={settings.promotionBonus} onChange={(v) => set("promotionBonus", v)} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>کارت‌ها</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Num label="برنزی از" value={settings.bronzeAt} onChange={(v) => set("bronzeAt", v)} />
            <Num label="نقره‌ای از" value={settings.silverAt} onChange={(v) => set("silverAt", v)} />
            <Num label="طلایی از" value={settings.goldAt} onChange={(v) => set("goldAt", v)} />
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>هفته‌ها و روزهای جلسه</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            {sortedWeeks.map((w) => (
              <li
                key={w.id}
                className={`rounded-lg px-3 py-2 ${w.id === activeWeekId ? "bg-primary/10 ring-1 ring-primary/30" : "bg-muted/50"}`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button type="button" className="text-right font-medium hover:underline" onClick={() => setActiveWeek(w.id)}>
                    {w.label}
                    {w.id === activeWeekId ? " · فعال" : ""}
                  </button>
                  <span className="text-muted-foreground">{w.status === "complete" ? "نهایی" : "باز"}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  روزهای جلسه:{" "}
                  {w.sessionDates.map((d) => formatJalaliWithWeekday(d)).join(" · ") || "—"}
                </div>
              </li>
            ))}
          </ul>

          {preview ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-sm">
              <div className="font-medium">پیش‌نمایش هفته بعد</div>
              <div className="mt-1 text-muted-foreground">{preview.label}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {preview.sessionDates.map((d) => formatJalaliWithWeekday(d)).join(" · ")}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                با ساخت هفته بعد، برای همه دانش‌آموزان ردیف‌های خالی روزانه و فرم ارزیابی هفته ساخته می‌شود و هفته جدید فعال می‌شود.
              </p>
            </div>
          ) : null}

          <Button onClick={handleAddWeek} disabled={!last}>
            <CalendarPlus className="size-4" />
            ساخت هفته بعد + روزهای جلسه
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>خروجی و پشتیبان</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <ExcelButton variant="default" />
          <Button
            variant="outline"
            onClick={() => {
              const blob = {
                students: useAppStore.getState().students,
                weeks: useAppStore.getState().weeks,
                dailies: useAppStore.getState().dailies,
                weeklies: useAppStore.getState().weeklies,
                points: useAppStore.getState().points,
                settings: useAppStore.getState().settings,
                activeWeekId: useAppStore.getState().activeWeekId,
              };
              const a = document.createElement("a");
              a.href = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" }));
              a.download = "miqat-backup.json";
              a.click();
              toast.success("نسخه پشتیبان دانلود شد");
            }}
          >
            خروجی JSON
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()}>
            بازیابی از JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                const data = JSON.parse(await file.text()) as Partial<AppState>;
                if (!Array.isArray(data.students)) throw new Error("invalid");
                loadBackup(data);
                toast.success("پشتیبان بازیابی شد");
              } catch {
                toast.error("این فایل پشتیبان معتبر نیست");
              }
              e.target.value = "";
            }}
          />
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm("همه تغییرات پاک شود و داده‌های نمونه هفته ۲۲ مرداد برگردد؟")) {
                resetToSeed();
                toast.success("داده‌ها به حالت اولیه برگشت");
              }
            }}
          >
            بازگشت به داده نمونه
          </Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <Input type="number" value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}
