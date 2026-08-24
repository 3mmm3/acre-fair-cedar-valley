import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout";
import { StudentAvatar } from "@/components/avatar";
import { LevelBadge } from "@/components/level-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExcelButton } from "@/components/excel-button";
import { useAppStore, studentWeeklyComputed } from "@/lib/store";
import { CARD_LABEL, cardForPoints } from "@/lib/scoring";
import { formatInt, formatScore } from "@/lib/utils";
import { useState } from "react";
import { Plus, Search } from "lucide-react";

export const Route = createFileRoute("/students/")({ component: StudentsPage });

function StudentsPage() {
  const state = useAppStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const addStudent = useAppStore((s) => s.addStudent);

  const list = state.students.filter((s) => s.fullName.includes(q) || s.shortName.includes(q));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">پرونده دانش‌آموزان</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            عکس، مشخصات و خلاصه عملکرد — برای جزئیات کامل روی هر پرونده بزنید
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ExcelButton />
          <Button onClick={() => setOpen((v) => !v)}>
            <Plus className="size-4" />
            دانش‌آموز جدید
          </Button>
        </div>
      </div>

      {open ? <AddStudentForm onClose={() => setOpen(false)} onAdd={addStudent} count={state.students.length} /> : null}

      <div className="relative mt-5">
        <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی نام…" className="pr-10" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((s) => {
          const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
          const card = cardForPoints(s.totalPoints, state.settings);
          return (
            <Link
              key={s.id}
              to="/students/$id"
              params={{ id: s.id }}
              className="group rounded-2xl bg-card p-4 shadow-border transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-3">
                <StudentAvatar name={s.fullName} photo={s.photo} size={56} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-medium leading-snug">{s.fullName}</h2>
                    <LevelBadge level={s.currentLevel} />
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {card ? <Badge variant={card}>{CARD_LABEL[card]}</Badge> : null}
                    <span className="text-xs text-muted-foreground">{formatInt(s.totalPoints)} امتیاز</span>
                  </div>
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                <Stat k="نمره هفته" v={formatScore(c.weekTotal)} />
                <Stat k="میانگین روز" v={formatScore(c.dailyAvg)} />
                <Stat k="انضباط" v={formatScore(c.disciplineAvg)} />
              </dl>
              <div className="mt-3 text-xs text-primary sm:opacity-0 sm:transition-opacity sm:duration-150 sm:group-hover:opacity-100">
                اطلاعات تکمیلی و نمودارها ←
              </div>
            </Link>
          );
        })}
      </div>
    </AppShell>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-muted/60 px-2 py-2">
      <div className="text-[10px] text-muted-foreground">{k}</div>
      <div className="tabular text-sm font-semibold">{v}</div>
    </div>
  );
}

function AddStudentForm({
  onClose,
  onAdd,
  count,
}: {
  onClose: () => void
  onAdd: (s: import("@/lib/types").Student) => void
  count: number
}) {
  const [name, setName] = useState("");
  const [father, setFather] = useState("");
  return (
    <form
      className="mt-4 flex flex-wrap items-end gap-2 rounded-2xl bg-card p-4 shadow-border"
      onSubmit={(e) => {
        e.preventDefault();
        if (!name.trim()) return;
        const id = `s${String(count + 1).padStart(2, "0")}-${Date.now()}`;
        onAdd({
          id,
          fullName: name.trim(),
          shortName: name.trim(),
          fatherName: father.trim(),
          phone: "",
          birthYear: "",
          joinDate: "",
          city: "",
          currentJuz: "",
          notes: "",
          photo: null,
          currentLevel: "C",
          totalPoints: 0,
        });
        setName("");
        setFather("");
        onClose();
      }}
    >
      <div className="min-w-56 flex-1">
        <label className="mb-1 block text-xs text-muted-foreground">نام و نام خانوادگی</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً علی محمدی" />
      </div>
      <div className="min-w-40 flex-1">
        <label className="mb-1 block text-xs text-muted-foreground">نام پدر</label>
        <Input value={father} onChange={(e) => setFather(e.target.value)} />
      </div>
      <Button type="submit">افزودن</Button>
      <Button type="button" variant="ghost" onClick={onClose}>
        انصراف
      </Button>
    </form>
  );
}
