export type Level = "A" | "B" | "C";

export type Attendance = "present" | "late" | "excused" | "absent";

export type LevelChange = "promote" | "stay" | "demote";

export type ScoreKey =
  | "reading1"
  | "reading2"
  | "pageNumber"
  | "verseNumber"
  | "phraseRecognition"
  | "verseOrder"
  | "pageOrder"
  | "firstLastVerse"
  | "counting";

export type ScoreMap = Record<ScoreKey, number | null>;

export type Student = {
  id: string
  fullName: string
  shortName: string
  fatherName: string
  phone: string
  birthYear: string
  joinDate: string
  city: string
  currentJuz: string
  notes: string
  photo: string | null
  currentLevel: Level
  totalPoints: number
};

export type Week = {
  id: string
  startDate: string
  endDate: string
  evalDate: string
  sessionDates: string[]
  label: string
  status: "complete" | "open" | "draft"
};

export type DailyRecord = {
  id: string
  studentId: string
  weekId: string
  date: string
  attendance: Attendance
  scores: ScoreMap
  discipline: number | null
  notes: string
};

export type WeeklyRecord = {
  id: string
  studentId: string
  weekId: string
  oralExam: number | null
  writtenExam: number | null
  notes: string
  locked: boolean
  isEthicsMan: boolean
  pointsAwarded: number
  levelAfter: Level | null
  levelChange: LevelChange | null
};

export type PointsEvent = {
  id: string
  studentId: string
  weekId: string | null
  date: string
  amount: number
  reason: string
  kind: "weekly" | "ethics" | "promotion" | "card" | "manual"
};

export type ClassSettings = {
  institution: string
  className: string
  teacherName: string
  levelA: number
  levelB: number
  pointsHigh: number
  pointsMid: number
  pointsLow: number
  ethicsBonus: number
  promotionBonus: number
  bronzeAt: number
  silverAt: number
  goldAt: number
};

export type AppState = {
  students: Student[]
  weeks: Week[]
  dailies: DailyRecord[]
  weeklies: WeeklyRecord[]
  points: PointsEvent[]
  settings: ClassSettings
  activeWeekId: string
};
