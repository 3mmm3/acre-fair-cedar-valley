import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AppState,
  ClassSettings,
  DailyRecord,
  ScoreMap,
  Student,
  Week,
  WeeklyRecord,
} from "./types";
import { createSeedState, SEED_VERSION } from "./seed";
import { computeWeekly, performancePoints, absencePenalty, EMPTY_SCORES } from "./scoring";
import { compareJalali } from "./jalali";

type Actions = {
  hydrated: boolean
  setHydrated: (v: boolean) => void
  setActiveWeek: (id: string) => void
  updateStudent: (id: string, patch: Partial<Student>) => void
  addStudent: (student: Student) => void
  removeStudent: (id: string) => void
  upsertDaily: (record: DailyRecord) => void
  patchDaily: (id: string, patch: Partial<DailyRecord>) => void
  patchDailyScores: (id: string, scores: Partial<ScoreMap>, extra?: Partial<DailyRecord>) => void
  upsertWeekly: (record: WeeklyRecord) => void
  patchWeekly: (id: string, patch: Partial<WeeklyRecord>) => void
  lockWeek: (weekId: string) => void
  unlockWeek: (weekId: string) => void
  addWeek: (week: Week) => void
  updateSettings: (patch: Partial<ClassSettings>) => void
  resetToSeed: () => void
  loadBackup: (data: Partial<AppState>) => void
  addPoints: (studentId: string, amount: number, reason: string) => void
};

const seed = createSeedState();

function emptyDaily(studentId: string, week: Week, date: string, i: number): DailyRecord {
  return {
    id: `${studentId}-${week.id}-${i}`,
    studentId,
    weekId: week.id,
    date,
    attendance: "present",
    scores: { ...EMPTY_SCORES },
    discipline: null,
    notes: "",
  };
}

function emptyWeekly(studentId: string, week: Week): WeeklyRecord {
  return {
    id: `${studentId}-${week.id}`,
    studentId,
    weekId: week.id,
    oralExam: null,
    writtenExam: null,
    notes: "",
    locked: week.status === "complete",
    isEthicsMan: false,
    pointsAwarded: 0,
    levelAfter: null,
    levelChange: null,
  };
}

export const useAppStore = create<AppState & Actions>()(
  persist(
    (set, get) => ({
      ...seed,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setActiveWeek: (id) => set({ activeWeekId: id }),
      updateStudent: (id, patch) =>
        set({
          students: get().students.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        }),
      addStudent: (student) => {
        const { weeks, dailies, weeklies } = get();
        const newDailies: DailyRecord[] = [];
        const newWeeklies: WeeklyRecord[] = [];
        for (const w of weeks) {
          w.sessionDates.forEach((date, i) => {
            newDailies.push(emptyDaily(student.id, w, date, i));
          });
          newWeeklies.push(emptyWeekly(student.id, w));
        }
        set({
          students: [...get().students, student],
          dailies: [...dailies, ...newDailies],
          weeklies: [...weeklies, ...newWeeklies],
        });
      },
      removeStudent: (id) =>
        set({
          students: get().students.filter((s) => s.id !== id),
          dailies: get().dailies.filter((d) => d.studentId !== id),
          weeklies: get().weeklies.filter((w) => w.studentId !== id),
          points: get().points.filter((p) => p.studentId !== id),
        }),
      upsertDaily: (record) => {
        const dailies = get().dailies;
        const idx = dailies.findIndex((d) => d.id === record.id);
        if (idx >= 0) {
          const next = dailies.slice();
          next[idx] = record;
          set({ dailies: next });
        } else {
          set({ dailies: [...dailies, record] });
        }
      },
      patchDaily: (id, patch) =>
        set({
          dailies: get().dailies.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        }),
      patchDailyScores: (id, scores, extra) =>
        set({
          dailies: get().dailies.map((d) =>
            d.id === id ? { ...d, ...extra, scores: { ...d.scores, ...scores } } : d,
          ),
        }),
      upsertWeekly: (record) => {
        const weeklies = get().weeklies;
        const idx = weeklies.findIndex((w) => w.id === record.id);
        if (idx >= 0) {
          const next = weeklies.slice();
          next[idx] = record;
          set({ weeklies: next });
        } else {
          set({ weeklies: [...weeklies, record] });
        }
      },
      patchWeekly: (id, patch) =>
        set({
          weeklies: get().weeklies.map((w) => (w.id === id ? { ...w, ...patch } : w)),
        }),
      lockWeek: (weekId) => {
        const state = get();
        const settings = state.settings;
        const week = state.weeks.find((w) => w.id === weekId);
        if (!week) return;
        if (week.status === "complete") return;

        const prevWeek = [...state.weeks]
          .filter((w) => w.evalDate < week.evalDate && w.status === "complete")
          .sort((a, b) => a.evalDate.localeCompare(b.evalDate))
          .at(-1);

        const discByStudent = new Map<string, number>();
        for (const s of state.students) {
          const days = state.dailies.filter((d) => d.studentId === s.id && d.weekId === weekId);
          const prevLevel =
            (prevWeek
              ? state.weeklies.find((w) => w.studentId === s.id && w.weekId === prevWeek.id)?.levelAfter
              : null) ?? s.currentLevel;
          const weekly = state.weeklies.find((w) => w.studentId === s.id && w.weekId === weekId);
          const computed = computeWeekly(days, weekly, prevLevel, settings);
          if (computed.disciplineAvg != null) discByStudent.set(s.id, computed.disciplineAvg);
        }
        const maxDisc = Math.max(0, ...discByStudent.values());

        let weeklies = state.weeklies.slice();
        let students = state.students.slice();
        let points = state.points.filter((p) => p.weekId !== weekId);

        for (const s of state.students) {
          const days = state.dailies.filter((d) => d.studentId === s.id && d.weekId === weekId);
          const prevLevel =
            (prevWeek
              ? state.weeklies.find((w) => w.studentId === s.id && w.weekId === prevWeek.id)?.levelAfter
              : null) ?? s.currentLevel;
          const weekly = weeklies.find((w) => w.studentId === s.id && w.weekId === weekId);
          const computed = computeWeekly(days, weekly, prevLevel, settings);
          const isEthics = computed.disciplineAvg != null && computed.disciplineAvg === maxDisc && maxDisc > 0;

          // امتیاز پایه عملکرد
          let awarded = performancePoints(computed.weekTotal, settings);
          if (isEthics) awarded += settings.ethicsBonus;
          if (computed.change === "promote") awarded += settings.promotionBonus;

          // کارت هفتگی (دکتر میربلوک)
          if (computed.card) {
            awarded += computed.card.points;
          }

          // جریمه غیبت
          const penalty = absencePenalty(computed.nonExcused, computed.excused);
          awarded -= penalty;

          weeklies = weeklies.map((w) =>
            w.studentId === s.id && w.weekId === weekId
              ? {
                  ...w,
                  locked: true,
                  isEthicsMan: isEthics,
                  pointsAwarded: awarded,
                  levelAfter: computed.nextLevel,
                  levelChange: computed.change,
                }
              : w,
          );
          students = students.map((st) =>
            st.id === s.id
              ? {
                  ...st,
                  currentLevel: computed.nextLevel,
                  totalPoints: Math.max(0, st.totalPoints + awarded),
                }
              : st,
          );

          // ثبت رویدادها
          const reasonParts: string[] = ["عملکرد هفته"];
          if (isEthics) reasonParts.push("مرد اخلاق");
          if (computed.change === "promote") reasonParts.push("ارتقاء");
          if (computed.card) reasonParts.push(`کارت ${computed.card.label}`);
          if (penalty > 0) reasonParts.push(`جریمه غیبت (-${penalty})`);

          if (awarded !== 0 || penalty > 0 || computed.card) {
            points.push({
              id: `p-${s.id}-${weekId}-${Date.now()}`,
              studentId: s.id,
              weekId,
              date: week.evalDate,
              amount: awarded,
              reason: reasonParts.join(" + "),
              kind: computed.card ? "card" : isEthics ? "ethics" : computed.change === "promote" ? "promotion" : "weekly",
            });
          }
        }

        set({
          weeklies,
          students,
          points,
          weeks: state.weeks.map((w) => (w.id === weekId ? { ...w, status: "complete" } : w)),
        });
      },
      unlockWeek: (weekId) => {
        const state = get();
        const week = state.weeks.find((w) => w.id === weekId);
        if (!week || week.status !== "complete") {
          set({
            weeks: state.weeks.map((w) => (w.id === weekId ? { ...w, status: "open" } : w)),
            weeklies: state.weeklies.map((w) =>
              w.weekId === weekId
                ? { ...w, locked: false, isEthicsMan: false, pointsAwarded: 0 }
                : w,
            ),
          });
          return;
        }

        const awarded = new Map(
          state.weeklies.filter((w) => w.weekId === weekId).map((w) => [w.studentId, w.pointsAwarded]),
        );

        set({
          students: state.students.map((s) => ({
            ...s,
            currentLevel: previousLevelFor(state, s.id, weekId),
            totalPoints: Math.max(0, s.totalPoints - (awarded.get(s.id) ?? 0)),
          })),
          points: state.points.filter((p) => p.weekId !== weekId),
          weeklies: state.weeklies.map((w) =>
            w.weekId === weekId
              ? {
                  ...w,
                  locked: false,
                  isEthicsMan: false,
                  pointsAwarded: 0,
                  levelAfter: null,
                  levelChange: null,
                }
              : w,
          ),
          weeks: state.weeks.map((w) => (w.id === weekId ? { ...w, status: "open" } : w)),
        });
      },
      addWeek: (week) => {
        const { students, dailies, weeklies, weeks } = get();
        if (weeks.some((w) => w.id === week.id)) return;
        const newDailies: DailyRecord[] = [];
        const newWeeklies: WeeklyRecord[] = [];
        for (const s of students) {
          week.sessionDates.forEach((date, i) => {
            newDailies.push(emptyDaily(s.id, week, date, i));
          });
          newWeeklies.push(emptyWeekly(s.id, week));
        }
        set({
          weeks: [...weeks, week],
          dailies: [...dailies, ...newDailies],
          weeklies: [...weeklies, ...newWeeklies],
          activeWeekId: week.id,
        });
      },
      updateSettings: (patch) => set({ settings: { ...get().settings, ...patch } }),
      resetToSeed: () => {
        const fresh = createSeedState();
        set({ ...fresh });
      },
      loadBackup: (data) => {
        set({
          students: data.students ?? get().students,
          weeks: data.weeks ?? get().weeks,
          dailies: data.dailies ?? get().dailies,
          weeklies: data.weeklies ?? get().weeklies,
          points: data.points ?? get().points,
          settings: data.settings ?? get().settings,
          activeWeekId: data.activeWeekId ?? get().activeWeekId,
        });
      },
      addPoints: (studentId, amount, reason) => {
        const state = get();
        set({
          students: state.students.map((s) =>
            s.id === studentId ? { ...s, totalPoints: s.totalPoints + amount } : s,
          ),
          points: [
            ...state.points,
            {
              id: `p-manual-${studentId}-${Date.now()}`,
              studentId,
              weekId: state.activeWeekId,
              date: state.weeks.find((w) => w.id === state.activeWeekId)?.evalDate ?? "",
              amount,
              reason,
              kind: "manual",
            },
          ],
        });
      },
    }),
    {
      name: `miqat-hifz-v${SEED_VERSION}`,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        students: s.students,
        weeks: s.weeks,
        dailies: s.dailies,
        weeklies: s.weeklies,
        points: s.points,
        settings: s.settings,
        activeWeekId: s.activeWeekId,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);

export function selectWeek(state: AppState, weekId?: string): Week | undefined {
  const id = weekId ?? state.activeWeekId;
  return state.weeks.find((w) => w.id === id);
}

export function selectStudentDailies(state: AppState, studentId: string, weekId?: string): DailyRecord[] {
  return state.dailies
    .filter((d) => d.studentId === studentId && (weekId ? d.weekId === weekId : true))
    .sort((a, b) => compareJalali(a.date, b.date));
}

export function selectWeekDailies(state: AppState, weekId: string): DailyRecord[] {
  return state.dailies.filter((d) => d.weekId === weekId).sort((a, b) => compareJalali(a.date, b.date));
}

export function previousLevelFor(state: AppState, studentId: string, weekId: string): import("./types").Level {
  const week = state.weeks.find((w) => w.id === weekId);
  if (!week) return state.students.find((s) => s.id === studentId)?.currentLevel ?? "C";
  const prev = [...state.weeks]
    .filter((w) => w.evalDate < week.evalDate)
    .sort((a, b) => a.evalDate.localeCompare(b.evalDate))
    .at(-1);
  if (!prev) return "C";
  return (
    state.weeklies.find((w) => w.studentId === studentId && w.weekId === prev.id)?.levelAfter ??
    state.students.find((s) => s.id === studentId)?.currentLevel ??
    "C"
  );
}

export function studentWeeklyComputed(state: AppState, studentId: string, weekId: string) {
  const days = selectStudentDailies(state, studentId, weekId);
  const weekly = state.weeklies.find((w) => w.studentId === studentId && w.weekId === weekId);
  const prev = previousLevelFor(state, studentId, weekId);
  return computeWeekly(days, weekly, prev, state.settings);
}

export { performancePoints };
