import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Printer, d as LockOpen, u as Lock } from "../_libs/lucide-react.mjs";
import { E as selectWeek, O as studentWeeklyComputed, g as formatInt, k as useAppStore, r as AppShell, w as previousLevelFor, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ExcelButton } from "./excel-button-CX4CCuIB.mjs";
import { t as ScoreInput } from "./score-input-DBcY9aNl.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
import { n as LevelBadge, t as ChangeBadge } from "./level-badge-CycilJdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/weekly-DWxigrx5.js
var import_jsx_runtime = require_jsx_runtime();
function WeeklyPage() {
	const state = useAppStore();
	const week = selectWeek(state);
	const patchWeekly = useAppStore((s) => s.patchWeekly);
	const lockWeek = useAppStore((s) => s.lockWeek);
	const unlockWeek = useAppStore((s) => s.unlockWeek);
	if (!week) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "هفته‌ای انتخاب نشده." }) });
	const locked = week.status === "complete";
	const rows = state.students.map((s) => {
		return {
			student: s,
			rec: state.weeklies.find((w) => w.studentId === s.id && w.weekId === week.id),
			c: studentWeeklyComputed(state, s.id, week.id),
			prev: previousLevelFor(state, s.id, week.id)
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "ارزیابی پایان هفته"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					week.label,
					" · تاریخ ارزیابی ",
					week.evalDate,
					" — شفاهی و کتبی را وارد کنید؛ بقیه خودکار است"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelButton, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "چاپ خلاصه هفته"]
					}),
					locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						onClick: () => {
							unlockWeek(week.id);
							toast.message("قفل هفته باز شد؛ امتیازها و سطح به قبل برگشت.");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LockOpen, { className: "size-4" }), "باز کردن قفل"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => {
							lockWeek(week.id);
							toast.success("هفته قفل شد؛ سطح‌ها و امتیازها به‌روز شدند");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" }), "نهایی‌کردن هفته"]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 hidden print:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display text-2xl",
				children: ["ارزیابی ", week.label]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					state.settings.institution,
					" · ",
					state.settings.className
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto rounded-2xl bg-card shadow-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[980px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border bg-muted/50 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "ردیف"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "نام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "میانگین هفته"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "شفاهی ۵۰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "کتبی ۵۰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "جمع آزمون"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "انضباط ۶۰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: "نمره کل ۱۰۰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "توضیحات"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-right font-medium",
							children: "امتیاز"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/70 last:border-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular text-muted-foreground",
							children: formatInt(i + 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
									name: r.student.fullName,
									photo: r.student.photo,
									size: 28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "whitespace-nowrap font-medium",
									children: r.student.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 flex flex-wrap gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: r.c.nextLevel }), r.rec?.isEthicsMan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "ethics",
										children: "مرد اخلاق"
									}) : null]
								})] })]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2 text-center tabular",
							children: formatScore(r.c.dailyAvg)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "w-24 px-1 py-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreInput, {
								value: r.rec?.oralExam ?? null,
								max: 50,
								disabled: locked || !r.rec,
								onChange: (v) => r.rec && patchWeekly(r.rec.id, { oralExam: v })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "w-24 px-1 py-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreInput, {
								value: r.rec?.writtenExam ?? null,
								max: 50,
								disabled: locked || !r.rec,
								onChange: (v) => r.rec && patchWeekly(r.rec.id, { writtenExam: v })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2 text-center tabular",
							children: formatScore(r.c.examTotal)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2 text-center tabular",
							children: formatScore(r.c.disciplineAvg)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2 text-center tabular font-semibold",
							children: formatScore(r.c.weekTotal)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-2 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
									change: r.c.change,
									from: r.prev,
									to: r.c.nextLevel
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									disabled: locked || !r.rec,
									value: r.rec?.notes ?? "",
									onChange: (e) => r.rec && patchWeekly(r.rec.id, { notes: e.target.value }),
									placeholder: "یادداشت…",
									className: "h-8 rounded-md border border-input bg-card px-2 text-xs"
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2 tabular text-muted-foreground",
							children: formatInt(r.rec?.pointsAwarded ?? 0)
						})
					]
				}, r.student.id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "no-print mt-3 text-xs text-muted-foreground",
			children: [
				"نمره کل هفته = میانگینِ (میانگین روزهای هفته و جمع آزمون شفاهی+کتبی). سطح الف از",
				" ",
				state.settings.levelA,
				" و سطح ب از ",
				state.settings.levelB,
				"."
			]
		})
	] });
}
//#endregion
export { WeeklyPage as component };
