import { o as __toESM } from "../_runtime.mjs";
import { D as selectWeekDailies, O as studentWeeklyComputed, c as academicTotal, i as CARD_LABEL, n as ATTENDANCE_LABEL, o as LEVEL_LABEL, p as dailyAverage, s as SCORE_FIELDS, u as cardForPoints, v as formatJalaliWithWeekday, w as previousLevelFor } from "./layout-DmJiP8F_.mjs";
import { r as classCategoryAverages, t as analyzeStudent } from "./analysis-DvBNbLkb.mjs";
import { t as require_excel } from "../_libs/exceljs+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/excel-export-DrEZD2qC.js
var import_excel = /* @__PURE__ */ __toESM(require_excel());
var INK = "FF1E4D3A";
var CREAM = "FFF4F1EA";
var PAPER = "FFF3EFE6";
var INPUT = "FFFFF8E1";
var LINE = "FFE4DDD2";
var MUTED = "FF6B645C";
var thin = {
	top: {
		style: "thin",
		color: { argb: LINE }
	},
	left: {
		style: "thin",
		color: { argb: LINE }
	},
	bottom: {
		style: "thin",
		color: { argb: LINE }
	},
	right: {
		style: "thin",
		color: { argb: LINE }
	}
};
function font(opts = {}) {
	return {
		name: "Tahoma",
		size: 10,
		...opts
	};
}
function fill(argb) {
	return {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb }
	};
}
function headerCell(cell, text) {
	cell.value = text;
	cell.font = font({
		bold: true,
		color: { argb: CREAM },
		size: 10
	});
	cell.fill = fill(INK);
	cell.alignment = {
		horizontal: "center",
		vertical: "middle",
		wrapText: true
	};
	cell.border = thin;
}
function inputCell(cell, value) {
	cell.value = value;
	cell.font = font();
	cell.fill = fill(INPUT);
	cell.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	cell.border = thin;
}
function valueCell(cell, value, bold = false) {
	cell.value = value;
	cell.font = font({ bold });
	cell.alignment = {
		horizontal: "center",
		vertical: "middle"
	};
	cell.border = thin;
}
function titleRow(ws, text, cols) {
	ws.mergeCells(1, 1, 1, cols);
	const c = ws.getCell(1, 1);
	c.value = text;
	c.font = font({
		bold: true,
		size: 16,
		color: { argb: INK }
	});
	c.alignment = {
		horizontal: "right",
		vertical: "middle"
	};
	ws.getRow(1).height = 28;
}
function sheetNameFor(name) {
	return `پ-${name}`.replace(/[\\/?*[\]]/g, " ").slice(0, 31);
}
async function buildWorkbook(state) {
	const wb = new import_excel.default.Workbook();
	wb.creator = "میقات";
	wb.company = state.settings.institution;
	wb.created = /* @__PURE__ */ new Date();
	wb.calcProperties.fullCalcOnLoad = true;
	addGuide(wb, state);
	addDashboard(wb, state);
	addRoster(wb, state);
	addDailyForm(wb, state);
	addWeeklyForm(wb, state);
	addDailyData(wb, state);
	addAnalysis(wb, state);
	for (const s of state.students) addStudentSheet(wb, state, s);
	return wb;
}
async function downloadExcel(state) {
	const buf = await (await buildWorkbook(state)).xlsx.writeBuffer();
	const blob = new Blob([buf], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const a = document.createElement("a");
	const week = state.weeks.find((w) => w.id === state.activeWeekId);
	a.href = URL.createObjectURL(blob);
	a.download = `میقات-ارزیابی-${week?.evalDate ?? "خروجی"}.xlsx`;
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 1500);
}
function rtlSheet(wb, name, landscape = true) {
	const ws = wb.addWorksheet(name, {
		views: [{
			rightToLeft: true,
			showGridLines: false
		}],
		pageSetup: {
			paperSize: 9,
			orientation: landscape ? "landscape" : "portrait",
			fitToPage: true,
			fitToWidth: 1,
			fitToHeight: 0,
			margins: {
				left: .4,
				right: .4,
				top: .5,
				bottom: .5,
				header: .2,
				footer: .2
			}
		},
		properties: { tabColor: { argb: INK } }
	});
	ws.properties.defaultRowHeight = 18;
	return ws;
}
function addGuide(wb, state) {
	const ws = rtlSheet(wb, "راهنما", false);
	ws.getColumn(1).width = 22;
	ws.getColumn(2).width = 72;
	titleRow(ws, "میقات — سامانه ارزیابی حافظان قرآن", 2);
	ws.getCell("A2").value = state.settings.institution;
	ws.getCell("B2").value = state.settings.className;
	ws.getCell("A2").font = font({
		bold: true,
		color: { argb: INK }
	});
	[
		["خانه زرد", "فقط این خانه‌ها را مربی پر می‌کند. بقیه با فرمول همان لحظه حساب می‌شوند."],
		["ورود روزانه", "فرم جلسه مطابق برگه کلاسی: حضور، ۹ مهارت، انضباط. جمع و میانگین خودکار است."],
		["ارزیابی هفته", "فقط شفاهی و کتبی را وارد کنید. میانگین هفته، نمره کل و سطح از روی نمرات روزانه می‌آید."],
		["پرونده‌ها", "هر دانش‌آموز یک شیت دارد؛ از داشبورد روی نام بزنید. عکس را در سامانه وب بارگذاری کنید."],
		["نمره روز", "میانگین روز = (جمع علمی از ۱۴۰ + انضباط از ۶۰) ÷ ۲"],
		["نمره هفته", "نمره کل = میانگینِ (میانگین روزهای هفته و جمع آزمون شفاهی+کتبی)"],
		["سطح", `الف از ${state.settings.levelA} · ب از ${state.settings.levelB} · پایین‌تر سطح ج`],
		["مرد اخلاق", "بالاترین میانگین انضباط هفته + پاداش امتیاز"],
		["کارت‌ها", `برنزی ${state.settings.bronzeAt} · نقره‌ای ${state.settings.silverAt} · طلایی ${state.settings.goldAt}`],
		["وب", "همین داده در سامانه زنده هم هست؛ خروجی اکسل برای بایگانی و کار آفلاین است."]
	].forEach(([k, v], i) => {
		const r = i + 4;
		ws.getCell(r, 1).value = k;
		ws.getCell(r, 1).font = font({
			bold: true,
			color: { argb: INK }
		});
		ws.getCell(r, 2).value = v;
		ws.getCell(r, 2).font = font();
		ws.getCell(r, 2).alignment = {
			wrapText: true,
			vertical: "middle",
			horizontal: "right"
		};
		ws.getRow(r).height = 28;
	});
}
function addDashboard(wb, state) {
	const ws = rtlSheet(wb, "داشبورد");
	titleRow(ws, `داشبورد کلاس — ${state.weeks.find((w) => w.id === state.activeWeekId)?.label ?? ""}`, 9);
	ws.getCell("A2").value = `${state.settings.institution} · ${state.settings.className}`;
	ws.getCell("A2").font = font({ color: { argb: MUTED } });
	const rows = state.students.map((s) => {
		return {
			s,
			c: studentWeeklyComputed(state, s.id, state.activeWeekId)
		};
	}).sort((a, b) => (b.c.weekTotal ?? -1) - (a.c.weekTotal ?? -1));
	[
		"رتبه",
		"نام",
		"میانگین هفته",
		"شفاهی",
		"کتبی",
		"انضباط",
		"نمره کل",
		"سطح",
		"توضیح"
	].forEach((h, i) => headerCell(ws.getCell(4, i + 1), h));
	ws.getRow(4).height = 22;
	rows.forEach((r, idx) => {
		const row = 5 + idx;
		valueCell(ws.getCell(row, 1), idx + 1);
		const nameCell = ws.getCell(row, 2);
		nameCell.value = {
			text: r.s.fullName,
			hyperlink: `#'${sheetNameFor(r.s.fullName)}'!A1`
		};
		nameCell.font = font({
			underline: true,
			color: { argb: INK }
		});
		nameCell.border = thin;
		valueCell(ws.getCell(row, 3), r.c.dailyAvg);
		valueCell(ws.getCell(row, 4), r.c.oralExam);
		valueCell(ws.getCell(row, 5), r.c.writtenExam);
		valueCell(ws.getCell(row, 6), r.c.disciplineAvg);
		valueCell(ws.getCell(row, 7), r.c.weekTotal, true);
		valueCell(ws.getCell(row, 8), LEVEL_LABEL[r.c.nextLevel]);
		valueCell(ws.getCell(row, 9), r.c.phrase);
	});
	[
		8,
		28,
		14,
		12,
		12,
		12,
		12,
		12,
		22
	].forEach((w, i) => {
		ws.getColumn(i + 1).width = w;
	});
	if (rows.length) ws.addConditionalFormatting({
		ref: `G5:G${4 + rows.length}`,
		rules: [{
			type: "dataBar",
			priority: 1,
			cfvo: [{
				type: "num",
				value: 0
			}, {
				type: "num",
				value: 100
			}],
			gradient: true,
			showValue: true
		}]
	});
}
function addRoster(wb, state) {
	const ws = rtlSheet(wb, "دانش‌آموزان");
	titleRow(ws, "فهرست پرونده‌ها — خانه‌های زرد قابل ویرایش‌اند", 9);
	[
		"ردیف",
		"نام",
		"نام پدر",
		"تلفن",
		"سال تولد",
		"شهر",
		"جزء جاری",
		"سطح",
		"امتیاز"
	].forEach((h, i) => headerCell(ws.getCell(3, i + 1), h));
	state.students.forEach((s, i) => {
		const r = 4 + i;
		valueCell(ws.getCell(r, 1), i + 1);
		const name = ws.getCell(r, 2);
		name.value = {
			text: s.fullName,
			hyperlink: `#'${sheetNameFor(s.fullName)}'!A1`
		};
		name.font = font({
			underline: true,
			color: { argb: INK }
		});
		name.fill = fill(INPUT);
		name.border = thin;
		inputCell(ws.getCell(r, 3), s.fatherName);
		inputCell(ws.getCell(r, 4), s.phone);
		inputCell(ws.getCell(r, 5), s.birthYear);
		inputCell(ws.getCell(r, 6), s.city);
		inputCell(ws.getCell(r, 7), s.currentJuz);
		valueCell(ws.getCell(r, 8), LEVEL_LABEL[s.currentLevel]);
		valueCell(ws.getCell(r, 9), s.totalPoints, true);
	});
	[
		8,
		28,
		16,
		16,
		12,
		14,
		12,
		12,
		12
	].forEach((w, i) => {
		ws.getColumn(i + 1).width = w;
	});
}
function addDailyForm(wb, state) {
	const week = state.weeks.find((w) => w.id === state.activeWeekId);
	if (!week) return;
	const ws = rtlSheet(wb, "فرم روزانه");
	const cols = 3 + SCORE_FIELDS.length + 3;
	titleRow(ws, `فرم ارزیابی روزانه — ${week.label} — خانه‌های زرد را پر کنید`, cols);
	let row = 3;
	week.sessionDates.forEach((date) => {
		ws.mergeCells(row, 1, row, cols);
		const t = ws.getCell(row, 1);
		t.value = formatJalaliWithWeekday(date);
		t.font = font({
			bold: true,
			size: 12,
			color: { argb: INK }
		});
		t.fill = fill(PAPER);
		row += 1;
		[
			"ردیف",
			"نام",
			"حضور",
			...SCORE_FIELDS.map((f) => `${f.short}\n${f.max}`),
			"جمع ۱۴۰",
			"انضباط ۶۰",
			"میانگین ۱۰۰"
		].forEach((h, i) => headerCell(ws.getCell(row, i + 1), h));
		ws.getRow(row).height = 28;
		row += 1;
		state.students.forEach((s, idx) => {
			const rec = state.dailies.find((d) => d.studentId === s.id && d.weekId === week.id && d.date === date);
			const r = row;
			valueCell(ws.getCell(r, 1), idx + 1);
			valueCell(ws.getCell(r, 2), s.fullName);
			ws.getCell(r, 2).alignment = {
				horizontal: "right",
				vertical: "middle"
			};
			inputCell(ws.getCell(r, 3), rec ? ATTENDANCE_LABEL[rec.attendance] : "حاضر");
			SCORE_FIELDS.forEach((f, fi) => {
				inputCell(ws.getCell(r, 4 + fi), rec?.scores[f.key] ?? null);
			});
			const firstScore = 4;
			const lastScore = 3 + SCORE_FIELDS.length;
			const sumCol = lastScore + 1;
			const discCol = sumCol + 1;
			const avgCol = discCol + 1;
			const sumCell = ws.getCell(r, sumCol);
			sumCell.value = {
				formula: `SUM(${colLetter(firstScore)}${r}:${colLetter(lastScore)}${r})`,
				result: rec ? academicTotal(rec.scores) ?? 0 : 0
			};
			sumCell.font = font({ bold: true });
			sumCell.border = thin;
			sumCell.alignment = { horizontal: "center" };
			inputCell(ws.getCell(r, discCol), rec?.discipline ?? null);
			const avgCell = ws.getCell(r, avgCol);
			avgCell.value = {
				formula: `IF(COUNTA(${colLetter(firstScore)}${r}:${colLetter(discCol)}${r})=0,"",(${colLetter(sumCol)}${r}+IF(${colLetter(discCol)}${r}="",0,${colLetter(discCol)}${r}))/2)`,
				result: rec ? dailyAverage(academicTotal(rec.scores), rec.discipline) ?? 0 : 0
			};
			avgCell.font = font({ bold: true });
			avgCell.border = thin;
			avgCell.alignment = { horizontal: "center" };
			row += 1;
		});
		row += 2;
	});
	ws.getColumn(1).width = 8;
	ws.getColumn(2).width = 26;
	ws.getColumn(3).width = 12;
	for (let i = 4; i <= cols; i++) ws.getColumn(i).width = 11;
}
function addWeeklyForm(wb, state) {
	const week = state.weeks.find((w) => w.id === state.activeWeekId);
	if (!week) return;
	const ws = rtlSheet(wb, "ارزیابی هفته");
	titleRow(ws, `ارزیابی پایان هفته — ${week.label} — تاریخ ${week.evalDate}`, 10);
	[
		"ردیف",
		"نام",
		"میانگین هفته",
		"شفاهی ۵۰",
		"کتبی ۵۰",
		"جمع آزمون",
		"انضباط ۶۰",
		"نمره کل ۱۰۰",
		"توضیحات",
		"امتیاز"
	].forEach((h, i) => headerCell(ws.getCell(3, i + 1), h));
	ws.getRow(3).height = 24;
	state.students.forEach((s, i) => {
		const r = 4 + i;
		const c = studentWeeklyComputed(state, s.id, week.id);
		const rec = state.weeklies.find((w) => w.studentId === s.id && w.weekId === week.id);
		valueCell(ws.getCell(r, 1), i + 1);
		valueCell(ws.getCell(r, 2), s.fullName);
		ws.getCell(r, 2).alignment = {
			horizontal: "right",
			vertical: "middle"
		};
		valueCell(ws.getCell(r, 3), c.dailyAvg);
		inputCell(ws.getCell(r, 4), rec?.oralExam ?? null);
		inputCell(ws.getCell(r, 5), rec?.writtenExam ?? null);
		const exam = ws.getCell(r, 6);
		exam.value = {
			formula: `IF(AND(D${r}="",E${r}=""),"",IF(D${r}="",0,D${r})+IF(E${r}="",0,E${r}))`,
			result: c.examTotal ?? 0
		};
		exam.font = font({ bold: true });
		exam.border = thin;
		exam.alignment = { horizontal: "center" };
		valueCell(ws.getCell(r, 7), c.disciplineAvg);
		const total = ws.getCell(r, 8);
		total.value = {
			formula: `IF(OR(C${r}="",F${r}=""),"",(IF(C${r}="",0,C${r})+IF(F${r}="",0,F${r}))/2)`,
			result: c.weekTotal ?? 0
		};
		total.font = font({ bold: true });
		total.border = thin;
		total.alignment = { horizontal: "center" };
		inputCell(ws.getCell(r, 9), rec?.notes || c.phrase);
		valueCell(ws.getCell(r, 10), rec?.pointsAwarded ?? 0);
	});
	[
		8,
		26,
		14,
		12,
		12,
		12,
		12,
		14,
		28,
		12
	].forEach((w, i) => {
		ws.getColumn(i + 1).width = w;
	});
}
function addDailyData(wb, state) {
	const ws = rtlSheet(wb, "کارنامه کامل");
	const headers = [
		"نام",
		"هفته",
		"تاریخ",
		"حضور",
		...SCORE_FIELDS.map((f) => f.short),
		"جمع",
		"انضباط",
		"میانگین",
		"یادداشت"
	];
	titleRow(ws, "کارنامه کامل روزانه — منبع داده نمودارها و پرونده‌ها", headers.length);
	headers.forEach((h, i) => headerCell(ws.getCell(3, i + 1), h));
	[...state.dailies].sort((a, b) => {
		const sa = state.students.find((s) => s.id === a.studentId)?.fullName ?? "";
		const sb = state.students.find((s) => s.id === b.studentId)?.fullName ?? "";
		return sa.localeCompare(sb, "fa") || a.date.localeCompare(b.date);
	}).forEach((d, i) => {
		const r = 4 + i;
		const s = state.students.find((x) => x.id === d.studentId);
		const w = state.weeks.find((x) => x.id === d.weekId);
		valueCell(ws.getCell(r, 1), s?.fullName ?? "");
		valueCell(ws.getCell(r, 2), w?.label ?? d.weekId);
		valueCell(ws.getCell(r, 3), d.date);
		valueCell(ws.getCell(r, 4), ATTENDANCE_LABEL[d.attendance]);
		SCORE_FIELDS.forEach((f, fi) => valueCell(ws.getCell(r, 5 + fi), d.scores[f.key]));
		const ac = academicTotal(d.scores);
		valueCell(ws.getCell(r, 5 + SCORE_FIELDS.length), ac, true);
		valueCell(ws.getCell(r, 6 + SCORE_FIELDS.length), d.discipline);
		valueCell(ws.getCell(r, 7 + SCORE_FIELDS.length), dailyAverage(ac, d.discipline), true);
		valueCell(ws.getCell(r, 8 + SCORE_FIELDS.length), d.notes);
	});
	ws.autoFilter = {
		from: {
			row: 3,
			column: 1
		},
		to: {
			row: 3,
			column: headers.length
		}
	};
	ws.getColumn(1).width = 24;
	ws.getColumn(2).width = 22;
	for (let i = 3; i <= headers.length; i++) ws.getColumn(i).width = 12;
	ws.getColumn(headers.length).width = 24;
}
function addAnalysis(wb, state) {
	const ws = rtlSheet(wb, "تحلیل عملکرد", false);
	titleRow(ws, "تحلیل کلاس و برنامه فردی هفته بعد", 4);
	const days = selectWeekDailies(state, state.activeWeekId).filter((d) => d.attendance === "present" || d.attendance === "late");
	const cats = classCategoryAverages(days);
	headerCell(ws.getCell(3, 1), "مهارت");
	headerCell(ws.getCell(3, 2), "میانگین");
	headerCell(ws.getCell(3, 3), "سقف");
	headerCell(ws.getCell(3, 4), "درصد");
	cats.forEach((c, i) => {
		const r = 4 + i;
		valueCell(ws.getCell(r, 1), c.label);
		ws.getCell(r, 1).alignment = { horizontal: "right" };
		valueCell(ws.getCell(r, 2), c.average);
		valueCell(ws.getCell(r, 3), c.max);
		valueCell(ws.getCell(r, 4), c.percent);
	});
	if (cats.length) ws.addConditionalFormatting({
		ref: `D4:D${3 + cats.length}`,
		rules: [{
			type: "dataBar",
			priority: 1,
			cfvo: [{
				type: "num",
				value: 0
			}, {
				type: "num",
				value: 100
			}],
			gradient: true,
			showValue: true
		}]
	});
	let r = 6 + cats.length;
	ws.getCell(r, 1).value = "پیشنهاد فردی";
	ws.getCell(r, 1).font = font({
		bold: true,
		size: 13,
		color: { argb: INK }
	});
	r += 1;
	headerCell(ws.getCell(r, 1), "نام");
	headerCell(ws.getCell(r, 2), "تمرکز هفته بعد");
	headerCell(ws.getCell(r, 3), "تحلیل");
	headerCell(ws.getCell(r, 4), "تمرین");
	r += 1;
	for (const s of state.students) {
		const insight = analyzeStudent(s, state.dailies.filter((d) => d.studentId === s.id), state.weeklies.filter((w) => w.studentId === s.id));
		valueCell(ws.getCell(r, 1), s.fullName);
		ws.getCell(r, 1).alignment = {
			horizontal: "right",
			wrapText: true
		};
		valueCell(ws.getCell(r, 2), insight.focusTitle);
		ws.getCell(r, 2).alignment = {
			wrapText: true,
			horizontal: "right"
		};
		valueCell(ws.getCell(r, 3), insight.paragraphs.join(" "));
		ws.getCell(r, 3).alignment = {
			wrapText: true,
			horizontal: "right"
		};
		valueCell(ws.getCell(r, 4), insight.plan.join(" · "));
		ws.getCell(r, 4).alignment = {
			wrapText: true,
			horizontal: "right"
		};
		ws.getRow(r).height = 64;
		r += 1;
	}
	ws.getColumn(1).width = 24;
	ws.getColumn(2).width = 28;
	ws.getColumn(3).width = 48;
	ws.getColumn(4).width = 40;
}
function addStudentSheet(wb, state, s) {
	const ws = rtlSheet(wb, sheetNameFor(s.fullName), false);
	titleRow(ws, `پرونده ${s.fullName}`, 6);
	const card = cardForPoints(s.totalPoints, state.settings);
	const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
	const insight = analyzeStudent(s, state.dailies.filter((d) => d.studentId === s.id), state.weeklies.filter((w) => w.studentId === s.id));
	[
		["نام پدر", s.fatherName || "—"],
		["تلفن", s.phone || "—"],
		["سال تولد", s.birthYear || "—"],
		["شهر", s.city || "—"],
		["جزء جاری", s.currentJuz || "—"],
		["تاریخ ورود", s.joinDate || "—"],
		["سطح فعلی", LEVEL_LABEL[s.currentLevel]],
		["امتیاز کل", s.totalPoints],
		["کارت", card ? CARD_LABEL[card] : "—"],
		["نمره این هفته", c.weekTotal],
		["میانگین روز", c.dailyAvg],
		["انضباط", c.disciplineAvg]
	].forEach((pair, i) => {
		const r = 3 + i;
		ws.getCell(r, 1).value = pair[0];
		ws.getCell(r, 1).font = font({ color: { argb: MUTED } });
		ws.getCell(r, 2).value = pair[1];
		ws.getCell(r, 2).font = font({ bold: true });
	});
	ws.getCell(16, 1).value = insight.focusTitle;
	ws.getCell(16, 1).font = font({
		bold: true,
		size: 12,
		color: { argb: INK }
	});
	ws.mergeCells(17, 1, 19, 6);
	ws.getCell(17, 1).value = [...insight.paragraphs, ...insight.plan.map((p, i) => `${i + 1}. ${p}`)].join("\n");
	ws.getCell(17, 1).alignment = {
		wrapText: true,
		vertical: "top",
		horizontal: "right"
	};
	ws.getCell(17, 1).font = font();
	ws.getRow(17).height = 36;
	ws.getRow(18).height = 36;
	ws.getRow(19).height = 36;
	[
		"هفته",
		"میانگین",
		"شفاهی",
		"کتبی",
		"نمره کل",
		"وضعیت"
	].forEach((h, i) => headerCell(ws.getCell(21, i + 1), h));
	state.weeks.forEach((w, i) => {
		const r = 22 + i;
		const cw = studentWeeklyComputed(state, s.id, w.id);
		const from = previousLevelFor(state, s.id, w.id);
		valueCell(ws.getCell(r, 1), w.label);
		valueCell(ws.getCell(r, 2), cw.dailyAvg);
		valueCell(ws.getCell(r, 3), cw.oralExam);
		valueCell(ws.getCell(r, 4), cw.writtenExam);
		valueCell(ws.getCell(r, 5), cw.weekTotal, true);
		valueCell(ws.getCell(r, 6), cw.phrase.replace(LEVEL_LABEL[from] ? "" : "", "") || cw.phrase);
	});
	const start = 23 + state.weeks.length;
	ws.getCell(start, 1).value = "کارنامه روزانه";
	ws.getCell(start, 1).font = font({
		bold: true,
		size: 12,
		color: { argb: INK }
	});
	[
		"تاریخ",
		...SCORE_FIELDS.map((f) => f.short),
		"جمع",
		"انضباط",
		"میانگین"
	].forEach((h, i) => headerCell(ws.getCell(start + 1, i + 1), h));
	state.dailies.filter((d) => d.studentId === s.id).sort((a, b) => a.date.localeCompare(b.date)).forEach((d, i) => {
		const r = start + 2 + i;
		const ac = academicTotal(d.scores);
		valueCell(ws.getCell(r, 1), d.date);
		SCORE_FIELDS.forEach((f, fi) => valueCell(ws.getCell(r, 2 + fi), d.scores[f.key]));
		valueCell(ws.getCell(r, 2 + SCORE_FIELDS.length), ac, true);
		valueCell(ws.getCell(r, 3 + SCORE_FIELDS.length), d.discipline);
		valueCell(ws.getCell(r, 4 + SCORE_FIELDS.length), dailyAverage(ac, d.discipline), true);
	});
	[
		22,
		14,
		12,
		12,
		12,
		28
	].forEach((w, i) => {
		ws.getColumn(i + 1).width = w;
	});
	for (let i = 7; i <= 14; i++) ws.getColumn(i).width = 11;
}
function colLetter(n) {
	let s = "";
	let x = n;
	while (x > 0) {
		const m = (x - 1) % 26;
		s = String.fromCharCode(65 + m) + s;
		x = Math.floor((x - 1) / 26);
	}
	return s;
}
//#endregion
export { downloadExcel };
