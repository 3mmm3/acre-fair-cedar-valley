import { S as require_jsx_runtime, f as useRouterState, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { b as Award, f as LayoutDashboard, h as ChartLine, m as ClipboardPen, o as Settings, t as Users, v as CalendarCheck, y as BookOpen } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/layout-DmJiP8F_.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function round1(n) {
	return Math.round(n * 10) / 10;
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function formatScore(n, digits = 1) {
	if (n == null || Number.isNaN(n)) return "—";
	return n.toLocaleString("fa-IR", {
		minimumFractionDigits: Number.isInteger(n) ? 0 : digits,
		maximumFractionDigits: digits
	});
}
function formatInt(n) {
	if (n == null || Number.isNaN(n)) return "—";
	return Math.round(n).toLocaleString("fa-IR");
}
var SCORE_FIELDS = [
	{
		key: "reading1",
		label: "خواندنی ۱",
		short: "خواندنی۱",
		max: 40,
		questions: 1,
		hint: "تلاوت و ارائه حفظ — ۴۰ نمره"
	},
	{
		key: "reading2",
		label: "خواندنی ۲",
		short: "خواندنی۲",
		max: 40,
		questions: 1,
		hint: "تلاوت دوم — ۴۰ نمره"
	},
	{
		key: "pageNumber",
		label: "شماره صفحه",
		short: "صفحه",
		max: 10,
		questions: 2,
		hint: "۲ سؤال، ۱۰ نمره"
	},
	{
		key: "verseNumber",
		label: "شماره آیه",
		short: "آیه",
		max: 5,
		questions: 1,
		hint: "۱ سؤال رند، ۵ نمره"
	},
	{
		key: "phraseRecognition",
		label: "تشخیص عبارت",
		short: "عبارت",
		max: 10,
		questions: 2,
		hint: "۲ سؤال، ۱۰ نمره"
	},
	{
		key: "verseOrder",
		label: "ترتیب آیه",
		short: "ترتیب‌آیه",
		max: 7,
		questions: 1,
		hint: "۱ سؤال، ۷ نمره"
	},
	{
		key: "pageOrder",
		label: "ترتیب صفحه",
		short: "ترتیب‌صفحه",
		max: 8,
		questions: 1,
		hint: "۱ سؤال، ۸ نمره"
	},
	{
		key: "firstLastVerse",
		label: "اول و آخر آیه",
		short: "اول‌آخر",
		max: 10,
		questions: 2,
		hint: "۲ سؤال، ۱۰ نمره"
	},
	{
		key: "counting",
		label: "شمارشی",
		short: "شمارشی",
		max: 10,
		questions: 2,
		hint: "۲ سؤال، ۱۰ نمره"
	}
];
var ACADEMIC_MAX = SCORE_FIELDS.reduce((s, f) => s + f.max, 0);
var EMPTY_SCORES = {
	reading1: null,
	reading2: null,
	pageNumber: null,
	verseNumber: null,
	phraseRecognition: null,
	verseOrder: null,
	pageOrder: null,
	firstLastVerse: null,
	counting: null
};
var ATTENDANCE_LABEL = {
	present: "حاضر",
	late: "تأخیر",
	excused: "غیبت موجه",
	absent: "غیبت"
};
var LEVEL_LABEL = {
	A: "سطح الف",
	B: "سطح ب",
	C: "سطح ج"
};
var LEVEL_CHANGE_LABEL = {
	promote: "ارتقاء",
	stay: "ابقاء",
	demote: "نزول"
};
function academicTotal(scores) {
	const vals = SCORE_FIELDS.map((f) => scores[f.key]);
	if (vals.every((v) => v == null)) return null;
	return round1(vals.reduce((a, b) => a + (b ?? 0), 0));
}
function dailyAverage(academic, discipline) {
	if (academic == null && discipline == null) return null;
	return round1(((academic ?? 0) + (discipline ?? 0)) / 2);
}
function mean(nums) {
	const xs = nums.filter((n) => n != null && !Number.isNaN(n));
	if (xs.length === 0) return null;
	return round2(xs.reduce((a, b) => a + b, 0) / xs.length);
}
function examTotal(oral, written) {
	if (oral == null && written == null) return null;
	return round1((oral ?? 0) + (written ?? 0));
}
/** نمره ارزیابی کل هفته = میانگین (میانگین روزهای هفته ، جمع شفاهی و کتبی) */
function weekTotalScore(weekDailyAvg, exam) {
	if (weekDailyAvg == null && exam == null) return null;
	return round2(((weekDailyAvg ?? 0) + (exam ?? 0)) / 2);
}
function levelFromScore(score, settings) {
	if (score == null) return "C";
	if (score >= settings.levelA) return "A";
	if (score >= settings.levelB) return "B";
	return "C";
}
function levelChange(from, to) {
	const rank = {
		A: 3,
		B: 2,
		C: 1
	};
	if (rank[to] > rank[from]) return "promote";
	if (rank[to] < rank[from]) return "demote";
	return "stay";
}
function levelChangePhrase(from, to) {
	const change = levelChange(from, to);
	if (change === "promote") return `ارتقاء به ${LEVEL_LABEL[to]}`;
	if (change === "demote") return `نزول به ${LEVEL_LABEL[to]}`;
	return `ابقاء در ${LEVEL_LABEL[to]}`;
}
function cardForPoints(points, settings) {
	if (points >= settings.goldAt) return "gold";
	if (points >= settings.silverAt) return "silver";
	if (points >= settings.bronzeAt) return "bronze";
	return null;
}
var CARD_LABEL = {
	gold: "کارت طلایی",
	silver: "کارت نقره‌ای",
	bronze: "کارت برنزی"
};
function performancePoints(score, settings) {
	if (score == null) return 0;
	if (score >= settings.levelA) return settings.pointsHigh;
	if (score >= settings.levelB) return settings.pointsMid;
	if (score >= 65) return settings.pointsLow;
	return 0;
}
function summarizeDailies(dailies) {
	const present = dailies.filter((d) => d.attendance === "present" || d.attendance === "late");
	const avgs = present.map((d) => dailyAverage(academicTotal(d.scores), d.discipline));
	const discs = present.map((d) => d.discipline);
	const academics = present.map((d) => academicTotal(d.scores));
	return {
		dailyAvg: mean(avgs),
		disciplineAvg: mean(discs),
		academicAvg: mean(academics),
		presentCount: present.length,
		excusedCount: dailies.filter((d) => d.attendance === "excused").length,
		absentCount: dailies.filter((d) => d.attendance === "absent").length
	};
}
function fieldAverage(dailies, key) {
	return mean(dailies.map((d) => d.scores[key]));
}
function fieldPercent(value, max) {
	if (value == null) return null;
	return round1(value / max * 100);
}
function computeWeekly(dailies, weekly, prevLevel, settings) {
	const summary = summarizeDailies(dailies);
	const exam = examTotal(weekly?.oralExam ?? null, weekly?.writtenExam ?? null);
	const total = weekTotalScore(summary.dailyAvg, exam);
	const nextLevel = levelFromScore(total, settings);
	const change = levelChange(prevLevel, nextLevel);
	return {
		...summary,
		examTotal: exam,
		oralExam: weekly?.oralExam ?? null,
		writtenExam: weekly?.writtenExam ?? null,
		weekTotal: total,
		nextLevel,
		change,
		phrase: levelChangePhrase(prevLevel, nextLevel)
	};
}
var WEEKDAYS = [
	"شنبه",
	"یکشنبه",
	"دوشنبه",
	"سه‌شنبه",
	"چهارشنبه",
	"پنجشنبه",
	"جمعه"
];
var MONTHS = [
	"فروردین",
	"اردیبهشت",
	"خرداد",
	"تیر",
	"مرداد",
	"شهریور",
	"مهر",
	"آبان",
	"آذر",
	"دی",
	"بهمن",
	"اسفند"
];
/** Parse "1405/5/17" or "1405/05/17". */
function parseJalali(date) {
	const [y, m, d] = date.split("/").map((x) => Number(x));
	return {
		y,
		m,
		d
	};
}
function monthName(m) {
	return MONTHS[m - 1] ?? "";
}
function formatJalaliLong(date) {
	const { y, m, d } = parseJalali(date);
	return `${d} ${monthName(m)} ${y}`;
}
function formatJalaliShort(date) {
	const { y, m, d } = parseJalali(date);
	return `${d} ${monthName(m)}`;
}
function daysInJalaliMonth(m) {
	if (m <= 6) return 31;
	if (m <= 11) return 30;
	return 29;
}
function addJalaliDays(date, delta) {
	const p = parseJalali(date);
	let y = p.y;
	let m = p.m;
	let d = p.d + delta;
	if (delta >= 0) while (d > daysInJalaliMonth(m)) {
		d -= daysInJalaliMonth(m);
		m += 1;
		if (m > 12) {
			m = 1;
			y += 1;
		}
	}
	else while (d < 1) {
		m -= 1;
		if (m < 1) {
			m = 12;
			y -= 1;
		}
		d += daysInJalaliMonth(m);
	}
	return `${y}/${m}/${d}`;
}
/**
* Weekday for Jalali dates in Mordad 1405 (known mapping):
* 1405/5/17 = Saturday. Formula uses a linear day index from that epoch.
*/
function weekdayIndex(date) {
	const { y, m, d } = parseJalali(date);
	const epoch = jalaliDayNumber(1405, 5, 17);
	return ((jalaliDayNumber(y, m, d) - epoch) % 7 + 7) % 7;
}
function jalaliDayNumber(y, m, d) {
	const md = [
		0,
		31,
		31,
		31,
		31,
		31,
		31,
		30,
		30,
		30,
		30,
		30,
		29
	];
	let n = y * 365 + Math.floor((y - 1) / 4);
	for (let i = 1; i < m; i++) n += md[i];
	return n + d;
}
function weekdayName(date) {
	return WEEKDAYS[weekdayIndex(date)];
}
function formatJalaliWithWeekday(date) {
	return `${weekdayName(date)} ${formatJalaliLong(date)}`;
}
function compareJalali(a, b) {
	const pa = parseJalali(a);
	const pb = parseJalali(b);
	return pa.y - pb.y || pa.m - pb.m || pa.d - pb.d;
}
var SETTINGS = {
	institution: "دارالقرآن",
	className: "طرح صبحگاهی حافظان",
	teacherName: "",
	levelA: 85,
	levelB: 75,
	pointsHigh: 400,
	pointsMid: 250,
	pointsLow: 100,
	ethicsBonus: 1e3,
	promotionBonus: 200,
	bronzeAt: 500,
	silverAt: 750,
	goldAt: 2e3
};
var KEYS = SCORE_FIELDS.map((f) => f.key);
function scores(vals) {
	const s = {};
	KEYS.forEach((k, i) => {
		s[k] = vals[i] ?? null;
	});
	return s;
}
function emptyScores() {
	const s = {};
	KEYS.forEach((k) => {
		s[k] = null;
	});
	return s;
}
var STUDENTS = [
	{
		id: "s01",
		fullName: "محمد طه زارعیان",
		shortName: "محمدطه زارعیان",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "C",
		totalPoints: 500
	},
	{
		id: "s02",
		fullName: "محمد طه میرشکار",
		shortName: "محمدطه میرشکار",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "B",
		totalPoints: 0
	},
	{
		id: "s03",
		fullName: "سید محمدطه حسینی",
		shortName: "سیدمحمدطه حسینی",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "B",
		totalPoints: 200
	},
	{
		id: "s04",
		fullName: "ابوالفضل دهقانیزاده",
		shortName: "دهقانیزاده",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "B",
		totalPoints: 750
	},
	{
		id: "s05",
		fullName: "محمدمهدی زارعیان",
		shortName: "محمدمهدی زارعیان",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	},
	{
		id: "s06",
		fullName: "بهنام بیک",
		shortName: "بهنام بیک",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	},
	{
		id: "s07",
		fullName: "محمد امین زارع",
		shortName: "محمدامین زارع",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "B",
		totalPoints: 2e3
	},
	{
		id: "s08",
		fullName: "سیدمصطفی طباطبایی‌نسب",
		shortName: "طباطبایی‌نسب",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	},
	{
		id: "s09",
		fullName: "ابوالفضل پورصباغ",
		shortName: "پورصباغ",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	},
	{
		id: "s10",
		fullName: "بهزاد بیک",
		shortName: "بهزاد بیک",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "",
		photo: null,
		currentLevel: "B",
		totalPoints: 750
	},
	{
		id: "s11",
		fullName: "سیدعلی حسینی‌مهر",
		shortName: "حسینی‌مهر",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "غیبت موجه در بخشی از هفته ۲۲ مرداد — نمره پایه",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	},
	{
		id: "s12",
		fullName: "محمدرضا زارع بیدکی",
		shortName: "محمدرضا زارع",
		fatherName: "",
		phone: "",
		birthYear: "",
		joinDate: "1404/7/1",
		city: "",
		currentJuz: "",
		notes: "غیبت موجه در بخشی از هفته ۲۲ مرداد — نمره پایه",
		photo: null,
		currentLevel: "C",
		totalPoints: 0
	}
];
var WEEKS = [
	{
		id: "w08",
		startDate: "1405/5/3",
		endDate: "1405/5/7",
		evalDate: "1405/5/8",
		sessionDates: [
			"1405/5/3",
			"1405/5/4",
			"1405/5/5",
			"1405/5/6",
			"1405/5/7"
		],
		label: "هفته ۸ مرداد ۱۴۰۵",
		status: "complete"
	},
	{
		id: "w15",
		startDate: "1405/5/10",
		endDate: "1405/5/14",
		evalDate: "1405/5/15",
		sessionDates: [
			"1405/5/10",
			"1405/5/11",
			"1405/5/12",
			"1405/5/13",
			"1405/5/14"
		],
		label: "هفته ۱۵ مرداد ۱۴۰۵",
		status: "complete"
	},
	{
		id: "w22",
		startDate: "1405/5/17",
		endDate: "1405/5/21",
		evalDate: "1405/5/22",
		sessionDates: [
			"1405/5/17",
			"1405/5/18",
			"1405/5/19",
			"1405/5/20",
			"1405/5/21"
		],
		label: "هفته ۲۲ مرداد ۱۴۰۵",
		status: "complete"
	},
	{
		id: "w29",
		startDate: "1405/5/24",
		endDate: "1405/5/28",
		evalDate: "1405/5/29",
		sessionDates: [
			"1405/5/24",
			"1405/5/25",
			"1405/5/26",
			"1405/5/27",
			"1405/5/28"
		],
		label: "هفته ۲۹ مرداد ۱۴۰۵",
		status: "open"
	}
];
function daysFor(studentId, weekId, specs) {
	return specs.map((sp, i) => ({
		id: `${studentId}-${weekId}-${i}`,
		studentId,
		weekId,
		date: sp.date,
		attendance: sp.att ?? "present",
		scores: scores(sp.vals),
		discipline: sp.disc,
		notes: sp.att === "excused" ? "غیبت موجه — نمره پایه" : ""
	}));
}
function emptyWeekDays(studentId, week) {
	return week.sessionDates.map((date, i) => ({
		id: `${studentId}-${week.id}-${i}`,
		studentId,
		weekId: week.id,
		date,
		attendance: "present",
		scores: emptyScores(),
		discipline: null,
		notes: ""
	}));
}
/** Real daily scores from the class Excel — week of 22 Mordad 1405. */
var W22_DAYS = {
	s01: [
		{
			date: "1405/5/17",
			vals: [
				38,
				23,
				5,
				0,
				10,
				7,
				8,
				0,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				19,
				37,
				5,
				5,
				10,
				2,
				2,
				0,
				0
			],
			disc: 50
		},
		{
			date: "1405/5/19",
			vals: [
				21,
				21,
				0,
				5,
				5,
				3,
				2,
				5,
				5
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				20,
				40,
				5,
				5,
				5,
				1,
				4,
				0,
				10
			],
			disc: 40
		},
		{
			date: "1405/5/21",
			vals: [
				39,
				26,
				0,
				5,
				0,
				2,
				2,
				5,
				0
			],
			disc: 40
		}
	],
	s02: [
		{
			date: "1405/5/17",
			vals: [
				38,
				28,
				10,
				0,
				10,
				6,
				6,
				0,
				0
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				30,
				28,
				5,
				0,
				0,
				7,
				4,
				10,
				0
			],
			disc: 45
		},
		{
			date: "1405/5/19",
			vals: [
				30,
				39,
				10,
				5,
				5,
				7,
				8,
				0,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				28,
				30,
				10,
				5,
				0,
				7,
				4,
				7,
				5
			],
			disc: 55
		},
		{
			date: "1405/5/21",
			vals: [
				39,
				26,
				0,
				5,
				0,
				2,
				2,
				5,
				0
			],
			disc: 40
		}
	],
	s03: [
		{
			date: "1405/5/17",
			vals: [
				35,
				33,
				10,
				5,
				0,
				7,
				8,
				5,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				40,
				34,
				5,
				5,
				5,
				5,
				6,
				0,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/19",
			vals: [
				31,
				26,
				5,
				2.5,
				5,
				7,
				4,
				5,
				7
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				40,
				31,
				5,
				5,
				0,
				4,
				4,
				0,
				5
			],
			disc: 35
		},
		{
			date: "1405/5/21",
			vals: [
				40,
				26,
				10,
				5,
				0,
				7,
				2,
				0,
				0
			],
			disc: 50
		}
	],
	s04: [
		{
			date: "1405/5/17",
			vals: [
				22,
				35,
				5,
				0,
				10,
				5,
				8,
				0,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				37,
				33,
				10,
				0,
				5,
				6,
				8,
				10,
				10
			],
			disc: 55
		},
		{
			date: "1405/5/19",
			vals: [
				40,
				20,
				10,
				5,
				5,
				4,
				8,
				5,
				5
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				28,
				16,
				0,
				5,
				0,
				5,
				6,
				5,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/21",
			vals: [
				38,
				21,
				5,
				5,
				0,
				2,
				6,
				0,
				5
			],
			disc: 60
		}
	],
	s05: [
		{
			date: "1405/5/17",
			vals: [
				23,
				29,
				5,
				0,
				0,
				0,
				8,
				5,
				10
			],
			disc: 45
		},
		{
			date: "1405/5/18",
			vals: [
				10,
				33,
				0,
				0,
				5,
				0,
				6,
				0,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/19",
			vals: [
				0,
				0,
				0,
				5,
				5,
				2,
				6,
				0,
				5
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				22,
				29,
				5,
				0,
				5,
				3,
				6,
				10,
				5
			],
			disc: 60
		},
		{
			date: "1405/5/21",
			vals: [
				25,
				26,
				5,
				0,
				0,
				5,
				2,
				0,
				10
			],
			disc: 60
		}
	],
	s06: [
		{
			date: "1405/5/17",
			vals: [
				20,
				20,
				2.5,
				5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/18",
			vals: [
				28,
				34,
				10,
				5,
				10,
				4,
				8,
				5,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/19",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/20",
			vals: [
				35,
				39,
				10,
				0,
				5,
				5,
				8,
				0,
				0
			],
			disc: 50
		},
		{
			date: "1405/5/21",
			vals: [
				37,
				26,
				10,
				0,
				5,
				7,
				4,
				10,
				5
			],
			disc: 55
		}
	],
	s07: [
		{
			date: "1405/5/17",
			vals: [
				20,
				38,
				5,
				5,
				0,
				6,
				6,
				0,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				35,
				35,
				0,
				5,
				0,
				0,
				2,
				5,
				0
			],
			disc: 60
		},
		{
			date: "1405/5/21",
			vals: [
				34,
				40,
				0,
				5,
				5,
				7,
				5,
				5,
				10
			],
			disc: 60
		},
		{
			date: "1405/5/19",
			vals: [
				22,
				40,
				0,
				0,
				5,
				5,
				8,
				10,
				0
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				40,
				40,
				10,
				0,
				5,
				4,
				0,
				0,
				5
			],
			disc: 60
		}
	],
	s08: [
		{
			date: "1405/5/17",
			vals: [
				38,
				35,
				0,
				5,
				0,
				2,
				6,
				5,
				10
			],
			disc: 55
		},
		{
			date: "1405/5/18",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/19",
			vals: [
				28,
				26,
				10,
				0,
				0,
				0,
				8,
				10,
				0
			],
			disc: 60
		},
		{
			date: "1405/5/20",
			vals: [
				38,
				11,
				0,
				0,
				0,
				3,
				8,
				0,
				10
			],
			disc: 40
		},
		{
			date: "1405/5/21",
			vals: [
				21,
				40,
				5,
				0,
				0,
				3,
				6,
				0,
				10
			],
			disc: 55
		}
	],
	s09: [
		{
			date: "1405/5/17",
			vals: [
				39,
				21,
				10,
				0,
				0,
				5,
				8,
				5,
				5
			],
			disc: 60
		},
		{
			date: "1405/5/18",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/19",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/20",
			vals: [
				31,
				38,
				5,
				5,
				5,
				5,
				2,
				5,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/21",
			vals: [
				30,
				36,
				10,
				0,
				5,
				4,
				2,
				5,
				10
			],
			disc: 60
		}
	],
	s10: [
		{
			date: "1405/5/17",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/18",
			vals: [
				37,
				38,
				10,
				5,
				5,
				2,
				8,
				5,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/19",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30
		},
		{
			date: "1405/5/20",
			vals: [
				25,
				23,
				10,
				5,
				10,
				6,
				6,
				8,
				7.5
			],
			disc: 55
		},
		{
			date: "1405/5/21",
			vals: [
				39,
				18,
				10,
				5,
				10,
				6,
				6,
				10,
				10
			],
			disc: 60
		}
	],
	s11: [
		{
			date: "1405/5/17",
			vals: [
				25,
				38,
				5,
				5,
				10,
				7,
				8,
				5,
				10
			],
			disc: 45
		},
		{
			date: "1405/5/18",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/19",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/20",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/21",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		}
	],
	s12: [
		{
			date: "1405/5/17",
			vals: [
				0,
				21,
				10,
				0,
				0,
				4,
				6,
				0,
				5
			],
			disc: 50
		},
		{
			date: "1405/5/18",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/19",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/20",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		},
		{
			date: "1405/5/21",
			vals: [
				20,
				20,
				5,
				2.5,
				5,
				3.5,
				4,
				5,
				5
			],
			disc: 30,
			att: "excused"
		}
	]
};
function mulberry32(seed) {
	return function rand() {
		let t = seed += 1831565813;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
	};
}
function around(rng, target, max, spread) {
	const v = target + (rng() - .5) * 2 * spread;
	const stepped = Math.round(v * 2) / 2;
	return Math.min(max, Math.max(0, stepped));
}
/** Synthetic but consistent dailies for prior weeks so trend charts have history. */
function syntheticDays(studentId, week, academicTarget, discTarget, seed) {
	const rng = mulberry32(seed);
	const ratios = SCORE_FIELDS.map((f) => f.max / 140);
	return week.sessionDates.map((date, i) => {
		const dayAc = around(rng, academicTarget, 140, 18);
		const vals = SCORE_FIELDS.map((f, idx) => {
			const t = dayAc * ratios[idx];
			return around(rng, t, f.max, f.max * .25);
		});
		return {
			id: `${studentId}-${week.id}-${i}`,
			studentId,
			weekId: week.id,
			date,
			attendance: "present",
			scores: scores(vals),
			discipline: around(rng, discTarget, 60, 8),
			notes: ""
		};
	});
}
var HIST = {
	s01: {
		w08: {
			oral: 32,
			written: 41,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 100,
			discTarget: 54
		},
		w15: {
			oral: 30,
			written: 40,
			level: "B",
			change: "stay",
			ethics: false,
			points: 500,
			notes: "۵۰۰ امتیاز عملکرد هفته",
			acTarget: 98,
			discTarget: 52
		},
		w22: {
			oral: 27.75,
			written: 39.5,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "نزول به سطح ج"
		}
	},
	s02: {
		w08: {
			oral: 36,
			written: 45,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 102,
			discTarget: 50
		},
		w15: {
			oral: 36,
			written: 46,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 104,
			discTarget: 51
		},
		w22: {
			oral: 37,
			written: 47.5,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "ابقاء در سطح ب"
		}
	},
	s03: {
		w08: {
			oral: 34,
			written: 40,
			level: "C",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 88,
			discTarget: 48
		},
		w15: {
			oral: 35,
			written: 42,
			level: "C",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 92,
			discTarget: 49
		},
		w22: {
			oral: 38,
			written: 45,
			level: "B",
			change: "promote",
			ethics: false,
			points: 200,
			notes: "ارتقاء به سطح ب"
		}
	},
	s04: {
		w08: {
			oral: 33,
			written: 44,
			level: "B",
			change: "stay",
			ethics: false,
			points: 750,
			notes: "کارت نقره‌ای",
			acTarget: 108,
			discTarget: 58
		},
		w15: {
			oral: 34,
			written: 44,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 106,
			discTarget: 58
		},
		w22: {
			oral: 34,
			written: 44,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "ابقاء در سطح ب"
		}
	},
	s05: {
		w08: {
			oral: 31,
			written: 40,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 96,
			discTarget: 54
		},
		w15: {
			oral: 30,
			written: 39,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 94,
			discTarget: 55
		},
		w22: {
			oral: 29.25,
			written: 38,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "نزول به سطح ج"
		}
	},
	s06: {
		w08: {
			oral: 26,
			written: 40,
			level: "C",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 86,
			discTarget: 42
		},
		w15: {
			oral: 27,
			written: 41,
			level: "C",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 88,
			discTarget: 42
		},
		w22: {
			oral: 27.75,
			written: 43,
			level: "C",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "ابقاء در سطح ج"
		}
	},
	s07: {
		w08: {
			oral: 32,
			written: 43,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 104,
			discTarget: 60
		},
		w15: {
			oral: 33,
			written: 44,
			level: "B",
			change: "stay",
			ethics: true,
			points: 1e3,
			notes: "مرد اخلاق",
			acTarget: 106,
			discTarget: 60
		},
		w22: {
			oral: 33,
			written: 44,
			level: "B",
			change: "stay",
			ethics: true,
			points: 1e3,
			notes: "مرد اخلاق — ابقاء در سطح ب"
		}
	},
	s08: {
		w08: {
			oral: 28,
			written: 48,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 98,
			discTarget: 50
		},
		w15: {
			oral: 29,
			written: 49,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 96,
			discTarget: 49
		},
		w22: {
			oral: 29,
			written: 50,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "نزول به سطح ج"
		}
	},
	s09: {
		w08: {
			oral: 35,
			written: 44,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 100,
			discTarget: 48
		},
		w15: {
			oral: 36,
			written: 44,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 98,
			discTarget: 47
		},
		w22: {
			oral: 36.25,
			written: 45,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "نزول به سطح ج"
		}
	},
	s10: {
		w08: {
			oral: 39,
			written: 46,
			level: "B",
			change: "stay",
			ethics: false,
			points: 750,
			notes: "کارت نقره‌ای",
			acTarget: 102,
			discTarget: 46
		},
		w15: {
			oral: 40,
			written: 46,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 100,
			discTarget: 45
		},
		w22: {
			oral: 40.5,
			written: 47,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "ابقاء در سطح ب"
		}
	},
	s11: {
		w08: {
			oral: 30,
			written: 38,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 94,
			discTarget: 44
		},
		w15: {
			oral: 28,
			written: 36,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 90,
			discTarget: 40
		},
		w22: {
			oral: 25,
			written: 25,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "غیبت موجه — نمره پایه؛ نزول به سطح ج"
		}
	},
	s12: {
		w08: {
			oral: 29,
			written: 37,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 90,
			discTarget: 42
		},
		w15: {
			oral: 27,
			written: 35,
			level: "B",
			change: "stay",
			ethics: false,
			points: 0,
			notes: "",
			acTarget: 86,
			discTarget: 38
		},
		w22: {
			oral: 25,
			written: 25,
			level: "C",
			change: "demote",
			ethics: false,
			points: 0,
			notes: "غیبت موجه — نمره پایه؛ نزول به سطح ج"
		}
	}
};
function weeklyRec(studentId, weekId, h, locked) {
	return {
		id: `${studentId}-${weekId}`,
		studentId,
		weekId,
		oralExam: h.oral,
		writtenExam: h.written,
		notes: h.notes,
		locked,
		isEthicsMan: h.ethics,
		pointsAwarded: h.points,
		levelAfter: h.level,
		levelChange: h.change
	};
}
function buildDailies() {
	const out = [];
	const w08 = WEEKS[0];
	const w15 = WEEKS[1];
	const w29 = WEEKS[3];
	for (const s of STUDENTS) {
		const hist = HIST[s.id];
		out.push(...syntheticDays(s.id, w08, hist.w08.acTarget, hist.w08.discTarget, hash(s.id + "w08")));
		out.push(...syntheticDays(s.id, w15, hist.w15.acTarget, hist.w15.discTarget, hash(s.id + "w15")));
		out.push(...daysFor(s.id, "w22", W22_DAYS[s.id]));
		out.push(...emptyWeekDays(s.id, w29));
	}
	return out;
}
function hash(str) {
	let h = 2166136261;
	for (let i = 0; i < str.length; i++) {
		h ^= str.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
function buildWeeklies() {
	const out = [];
	for (const s of STUDENTS) {
		const h = HIST[s.id];
		out.push(weeklyRec(s.id, "w08", h.w08, true));
		out.push(weeklyRec(s.id, "w15", h.w15, true));
		out.push(weeklyRec(s.id, "w22", h.w22, true));
		out.push({
			id: `${s.id}-w29`,
			studentId: s.id,
			weekId: "w29",
			oralExam: null,
			writtenExam: null,
			notes: "",
			locked: false,
			isEthicsMan: false,
			pointsAwarded: 0,
			levelAfter: null,
			levelChange: null
		});
	}
	return out;
}
function buildPoints() {
	const events = [];
	let n = 0;
	const add = (e) => {
		events.push({
			...e,
			id: `p${++n}`
		});
	};
	add({
		studentId: "s01",
		weekId: "w15",
		date: "1405/5/15",
		amount: 500,
		reason: "عملکرد هفته ۱۵ مرداد",
		kind: "weekly"
	});
	add({
		studentId: "s04",
		weekId: "w08",
		date: "1405/5/8",
		amount: 750,
		reason: "کارت نقره‌ای",
		kind: "card"
	});
	add({
		studentId: "s07",
		weekId: "w15",
		date: "1405/5/15",
		amount: 1e3,
		reason: "مرد اخلاق هفته ۱۵ مرداد",
		kind: "ethics"
	});
	add({
		studentId: "s07",
		weekId: "w22",
		date: "1405/5/22",
		amount: 1e3,
		reason: "مرد اخلاق هفته ۲۲ مرداد",
		kind: "ethics"
	});
	add({
		studentId: "s03",
		weekId: "w22",
		date: "1405/5/22",
		amount: 200,
		reason: "ارتقاء به سطح ب",
		kind: "promotion"
	});
	add({
		studentId: "s10",
		weekId: "w08",
		date: "1405/5/8",
		amount: 750,
		reason: "کارت نقره‌ای",
		kind: "card"
	});
	return events;
}
function createSeedState() {
	return {
		students: STUDENTS,
		weeks: WEEKS,
		dailies: buildDailies(),
		weeklies: buildWeeklies(),
		points: buildPoints(),
		settings: SETTINGS,
		activeWeekId: "w22"
	};
}
var seed = createSeedState();
function emptyDaily(studentId, week, date, i) {
	return {
		id: `${studentId}-${week.id}-${i}`,
		studentId,
		weekId: week.id,
		date,
		attendance: "present",
		scores: { ...EMPTY_SCORES },
		discipline: null,
		notes: ""
	};
}
function emptyWeekly(studentId, week) {
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
		levelChange: null
	};
}
var useAppStore = create()(persist((set, get) => ({
	...seed,
	hydrated: false,
	setHydrated: (v) => set({ hydrated: v }),
	setActiveWeek: (id) => set({ activeWeekId: id }),
	updateStudent: (id, patch) => set({ students: get().students.map((s) => s.id === id ? {
		...s,
		...patch
	} : s) }),
	addStudent: (student) => {
		const { weeks, dailies, weeklies } = get();
		const newDailies = [];
		const newWeeklies = [];
		for (const w of weeks) {
			w.sessionDates.forEach((date, i) => {
				newDailies.push(emptyDaily(student.id, w, date, i));
			});
			newWeeklies.push(emptyWeekly(student.id, w));
		}
		set({
			students: [...get().students, student],
			dailies: [...dailies, ...newDailies],
			weeklies: [...weeklies, ...newWeeklies]
		});
	},
	removeStudent: (id) => set({
		students: get().students.filter((s) => s.id !== id),
		dailies: get().dailies.filter((d) => d.studentId !== id),
		weeklies: get().weeklies.filter((w) => w.studentId !== id),
		points: get().points.filter((p) => p.studentId !== id)
	}),
	upsertDaily: (record) => {
		const dailies = get().dailies;
		const idx = dailies.findIndex((d) => d.id === record.id);
		if (idx >= 0) {
			const next = dailies.slice();
			next[idx] = record;
			set({ dailies: next });
		} else set({ dailies: [...dailies, record] });
	},
	patchDaily: (id, patch) => set({ dailies: get().dailies.map((d) => d.id === id ? {
		...d,
		...patch
	} : d) }),
	patchDailyScores: (id, scores, extra) => set({ dailies: get().dailies.map((d) => d.id === id ? {
		...d,
		...extra,
		scores: {
			...d.scores,
			...scores
		}
	} : d) }),
	upsertWeekly: (record) => {
		const weeklies = get().weeklies;
		const idx = weeklies.findIndex((w) => w.id === record.id);
		if (idx >= 0) {
			const next = weeklies.slice();
			next[idx] = record;
			set({ weeklies: next });
		} else set({ weeklies: [...weeklies, record] });
	},
	patchWeekly: (id, patch) => set({ weeklies: get().weeklies.map((w) => w.id === id ? {
		...w,
		...patch
	} : w) }),
	lockWeek: (weekId) => {
		const state = get();
		const settings = state.settings;
		const week = state.weeks.find((w) => w.id === weekId);
		if (!week) return;
		if (week.status === "complete") return;
		const prevWeek = [...state.weeks].filter((w) => w.evalDate < week.evalDate && w.status === "complete").sort((a, b) => a.evalDate.localeCompare(b.evalDate)).at(-1);
		const discByStudent = /* @__PURE__ */ new Map();
		for (const s of state.students) {
			const days = state.dailies.filter((d) => d.studentId === s.id && d.weekId === weekId);
			const prevLevel = (prevWeek ? state.weeklies.find((w) => w.studentId === s.id && w.weekId === prevWeek.id)?.levelAfter : null) ?? s.currentLevel;
			const computed = computeWeekly(days, state.weeklies.find((w) => w.studentId === s.id && w.weekId === weekId), prevLevel, settings);
			if (computed.disciplineAvg != null) discByStudent.set(s.id, computed.disciplineAvg);
		}
		const maxDisc = Math.max(0, ...discByStudent.values());
		let weeklies = state.weeklies.slice();
		let students = state.students.slice();
		let points = state.points.filter((p) => p.weekId !== weekId);
		for (const s of state.students) {
			const days = state.dailies.filter((d) => d.studentId === s.id && d.weekId === weekId);
			const prevLevel = (prevWeek ? state.weeklies.find((w) => w.studentId === s.id && w.weekId === prevWeek.id)?.levelAfter : null) ?? s.currentLevel;
			const computed = computeWeekly(days, weeklies.find((w) => w.studentId === s.id && w.weekId === weekId), prevLevel, settings);
			const isEthics = computed.disciplineAvg != null && computed.disciplineAvg === maxDisc && maxDisc > 0;
			let awarded = performancePoints(computed.weekTotal, settings);
			if (isEthics) awarded += settings.ethicsBonus;
			if (computed.change === "promote") awarded += settings.promotionBonus;
			weeklies = weeklies.map((w) => w.studentId === s.id && w.weekId === weekId ? {
				...w,
				locked: true,
				isEthicsMan: isEthics,
				pointsAwarded: awarded,
				levelAfter: computed.nextLevel,
				levelChange: computed.change
			} : w);
			students = students.map((st) => st.id === s.id ? {
				...st,
				currentLevel: computed.nextLevel,
				totalPoints: st.totalPoints + awarded
			} : st);
			if (awarded > 0) points.push({
				id: `p-${s.id}-${weekId}-${Date.now()}`,
				studentId: s.id,
				weekId,
				date: week.evalDate,
				amount: awarded,
				reason: isEthics ? computed.change === "promote" ? "عملکرد هفته + مرد اخلاق + ارتقاء" : "عملکرد هفته + مرد اخلاق" : computed.change === "promote" ? "عملکرد هفته + ارتقاء" : "عملکرد هفته",
				kind: isEthics ? "ethics" : computed.change === "promote" ? "promotion" : "weekly"
			});
		}
		set({
			weeklies,
			students,
			points,
			weeks: state.weeks.map((w) => w.id === weekId ? {
				...w,
				status: "complete"
			} : w)
		});
	},
	unlockWeek: (weekId) => {
		const state = get();
		const week = state.weeks.find((w) => w.id === weekId);
		if (!week || week.status !== "complete") {
			set({
				weeks: state.weeks.map((w) => w.id === weekId ? {
					...w,
					status: "open"
				} : w),
				weeklies: state.weeklies.map((w) => w.weekId === weekId ? {
					...w,
					locked: false,
					isEthicsMan: false,
					pointsAwarded: 0
				} : w)
			});
			return;
		}
		const awarded = new Map(state.weeklies.filter((w) => w.weekId === weekId).map((w) => [w.studentId, w.pointsAwarded]));
		set({
			students: state.students.map((s) => ({
				...s,
				currentLevel: previousLevelFor(state, s.id, weekId),
				totalPoints: Math.max(0, s.totalPoints - (awarded.get(s.id) ?? 0))
			})),
			points: state.points.filter((p) => p.weekId !== weekId),
			weeklies: state.weeklies.map((w) => w.weekId === weekId ? {
				...w,
				locked: false,
				isEthicsMan: false,
				pointsAwarded: 0,
				levelAfter: null,
				levelChange: null
			} : w),
			weeks: state.weeks.map((w) => w.id === weekId ? {
				...w,
				status: "open"
			} : w)
		});
	},
	addWeek: (week) => {
		const { students, dailies, weeklies, weeks } = get();
		if (weeks.some((w) => w.id === week.id)) return;
		const newDailies = [];
		const newWeeklies = [];
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
			activeWeekId: week.id
		});
	},
	updateSettings: (patch) => set({ settings: {
		...get().settings,
		...patch
	} }),
	resetToSeed: () => {
		set({ ...createSeedState() });
	},
	loadBackup: (data) => {
		set({
			students: data.students ?? get().students,
			weeks: data.weeks ?? get().weeks,
			dailies: data.dailies ?? get().dailies,
			weeklies: data.weeklies ?? get().weeklies,
			points: data.points ?? get().points,
			settings: data.settings ?? get().settings,
			activeWeekId: data.activeWeekId ?? get().activeWeekId
		});
	},
	addPoints: (studentId, amount, reason) => {
		const state = get();
		set({
			students: state.students.map((s) => s.id === studentId ? {
				...s,
				totalPoints: s.totalPoints + amount
			} : s),
			points: [...state.points, {
				id: `p-manual-${studentId}-${Date.now()}`,
				studentId,
				weekId: state.activeWeekId,
				date: state.weeks.find((w) => w.id === state.activeWeekId)?.evalDate ?? "",
				amount,
				reason,
				kind: "manual"
			}]
		});
	}
}), {
	name: `miqat-hifz-v3`,
	storage: createJSONStorage(() => localStorage),
	partialize: (s) => ({
		students: s.students,
		weeks: s.weeks,
		dailies: s.dailies,
		weeklies: s.weeklies,
		points: s.points,
		settings: s.settings,
		activeWeekId: s.activeWeekId
	}),
	onRehydrateStorage: () => () => {
		useAppStore.setState({ hydrated: true });
	}
}));
function selectWeek(state, weekId) {
	const id = weekId ?? state.activeWeekId;
	return state.weeks.find((w) => w.id === id);
}
function selectStudentDailies(state, studentId, weekId) {
	return state.dailies.filter((d) => d.studentId === studentId && (weekId ? d.weekId === weekId : true)).sort((a, b) => compareJalali(a.date, b.date));
}
function selectWeekDailies(state, weekId) {
	return state.dailies.filter((d) => d.weekId === weekId).sort((a, b) => compareJalali(a.date, b.date));
}
function previousLevelFor(state, studentId, weekId) {
	const week = state.weeks.find((w) => w.id === weekId);
	if (!week) return state.students.find((s) => s.id === studentId)?.currentLevel ?? "C";
	const prev = [...state.weeks].filter((w) => w.evalDate < week.evalDate).sort((a, b) => a.evalDate.localeCompare(b.evalDate)).at(-1);
	if (!prev) return "C";
	return state.weeklies.find((w) => w.studentId === studentId && w.weekId === prev.id)?.levelAfter ?? state.students.find((s) => s.id === studentId)?.currentLevel ?? "C";
}
function studentWeeklyComputed(state, studentId, weekId) {
	return computeWeekly(selectStudentDailies(state, studentId, weekId), state.weeklies.find((w) => w.studentId === studentId && w.weekId === weekId), previousLevelFor(state, studentId, weekId), state.settings);
}
var NAV = [
	{
		to: "/",
		label: "داشبورد",
		icon: LayoutDashboard
	},
	{
		to: "/students",
		label: "پرونده‌ها",
		icon: Users
	},
	{
		to: "/entry",
		label: "ثبت روزانه",
		icon: ClipboardPen
	},
	{
		to: "/weekly",
		label: "ارزیابی هفته",
		icon: CalendarCheck
	},
	{
		to: "/analysis",
		label: "تحلیل عملکرد",
		icon: ChartLine
	},
	{
		to: "/rewards",
		label: "امتیاز و کارت",
		icon: Award
	},
	{
		to: "/settings",
		label: "تنظیمات",
		icon: Settings
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const settings = useAppStore((s) => s.settings);
	const weeks = useAppStore((s) => s.weeks);
	const activeWeekId = useAppStore((s) => s.activeWeekId);
	const setActiveWeek = useAppStore((s) => s.setActiveWeek);
	const week = weeks.find((w) => w.id === activeWeekId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background pattern-paper",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "no-print pattern-khatam fixed inset-y-0 right-0 z-30 hidden w-60 flex-col text-ink-foreground lg:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 px-5 pt-6 pb-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-display text-2xl leading-none",
							children: "میقات"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px] tracking-wide text-ink-foreground/60",
							children: "ارزیابی حافظان"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-1 flex-col gap-0.5 px-3",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
							const Icon = item.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								className: cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm transition-colors duration-150", active ? "bg-ink-foreground/10 text-ink-foreground" : "text-ink-foreground/70 hover:bg-ink-foreground/6 hover:text-ink-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4 shrink-0 opacity-80" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-5 pb-6 pt-4 text-[11px] leading-relaxed text-ink-foreground/45",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-3" }), settings.institution]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-0.5",
							children: settings.className
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 lg:pr-60",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
					className: "no-print sticky top-0 z-20 border-b border-border/80 bg-background/85 backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 px-4 py-3 sm:px-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-center gap-3 lg:hidden",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mark, { small: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-xl",
									children: "میقات"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden min-w-0 lg:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: settings.className
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: week?.label ?? "هفته جاری"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-muted-foreground sm:inline",
									children: "هفته"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: activeWeekId,
									onChange: (e) => setActiveWeek(e.target.value),
									className: "h-10 max-w-[220px] rounded-lg border border-border bg-card px-3 text-sm shadow-sm",
									children: weeks.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: w.id,
										children: [w.label, w.status === "open" ? " — باز" : ""]
									}, w.id))
								})]
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto w-full min-w-0 max-w-6xl px-4 py-5 pb-24 sm:px-6 sm:py-8 lg:pb-10",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "no-print fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card/95 backdrop-blur-md lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-5",
					children: NAV.slice(0, 5).map((item) => {
						const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
						const Icon = item.icon;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[10px]", active ? "text-primary" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5" }), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
function Mark({ small }) {
	const s = small ? 32 : 40;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		width: s,
		height: s,
		viewBox: "0 0 40 40",
		"aria-hidden": true,
		className: "shrink-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "40",
				height: "40",
				rx: "10",
				fill: "#f4f1ea"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "20,4 23,16 36,20 23,24 20,36 17,24 4,20 17,16",
				fill: "#1e4d3a"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "20,12 21.5,18 28,20 21.5,22 20,28 18.5,22 12,20 18.5,18",
				fill: "#f4f1ea"
			})
		]
	});
}
//#endregion
export { parseJalali as C, selectWeekDailies as D, selectWeek as E, studentWeeklyComputed as O, monthName as S, selectStudentDailies as T, formatJalaliShort as _, LEVEL_CHANGE_LABEL as a, levelChange as b, academicTotal as c, cn as d, compareJalali as f, formatInt as g, fieldPercent as h, CARD_LABEL as i, useAppStore as k, addJalaliDays as l, fieldAverage as m, ATTENDANCE_LABEL as n, LEVEL_LABEL as o, dailyAverage as p, AppShell as r, SCORE_FIELDS as s, ACADEMIC_MAX as t, cardForPoints as u, formatJalaliWithWeekday as v, previousLevelFor as w, mean as x, formatScore as y };
