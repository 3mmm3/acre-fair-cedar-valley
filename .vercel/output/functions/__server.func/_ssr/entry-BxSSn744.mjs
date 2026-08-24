import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, V as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Printer } from "../_libs/lucide-react.mjs";
import { E as selectWeek, c as academicTotal, k as useAppStore, n as ATTENDANCE_LABEL, p as dailyAverage, r as AppShell, s as SCORE_FIELDS, t as ACADEMIC_MAX, v as formatJalaliWithWeekday, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ScoreInput } from "./score-input-DBcY9aNl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/entry-BxSSn744.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EntryPage() {
	const state = useAppStore();
	const week = selectWeek(state);
	const patchDailyScores = useAppStore((s) => s.patchDailyScores);
	const patchDaily = useAppStore((s) => s.patchDaily);
	const dates = week?.sessionDates ?? [];
	const [date, setDate] = (0, import_react.useState)(dates[0] ?? "");
	(0, import_react.useEffect)(() => {
		if (!week) return;
		const stored = sessionStorage.getItem("miqat-entry-date");
		if (stored && week.sessionDates.includes(stored)) {
			setDate(stored);
			return;
		}
		const filled = week.sessionDates.find((d) => state.dailies.some((x) => x.weekId === week.id && x.date === d && academicTotal(x.scores) != null));
		setDate(filled ?? week.sessionDates[0] ?? "");
	}, [week?.id]);
	if (!week) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "هفته‌ای انتخاب نشده." }) });
	const locked = week.status === "complete";
	const rows = state.students.map((s) => {
		return {
			student: s,
			rec: state.dailies.find((d) => d.studentId === s.id && d.weekId === week.id && d.date === date)
		};
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "no-print flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "ثبت ارزیابی روزانه"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "فقط خانه‌های نمره را پر کنید — جمع، میانگین و پرونده‌ها همان لحظه به‌روز می‌شوند"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					value: date,
					onChange: (e) => {
						sessionStorage.setItem("miqat-entry-date", e.target.value);
						setDate(e.target.value);
					},
					className: "h-10 rounded-lg border border-border bg-card px-3 text-sm shadow-sm",
					children: dates.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: d,
						children: formatJalaliWithWeekday(d)
					}, d))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => window.print(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "چاپ فرم"]
				})]
			})]
		}),
		locked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "no-print mt-3 rounded-xl bg-muted px-4 py-2 text-sm text-muted-foreground",
			children: "این هفته قفل است. برای ویرایش، از صفحه ارزیابی هفته قفل را باز کنید."
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 hidden print:block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "فرم ارزیابی روزانه حافظان"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					state.settings.className,
					" · ",
					formatJalaliWithWeekday(date)
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 overflow-x-auto rounded-2xl bg-card shadow-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[1100px] text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border bg-muted/50 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "sticky right-0 z-10 bg-muted/90 px-3 py-3 text-right font-medium",
							children: "نام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "حضور"
						}),
						SCORE_FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-1 py-3 text-center font-medium",
							title: f.hint,
							children: [f.short, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-normal text-[10px] opacity-70",
								children: f.max
							})]
						}, f.key)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: ["جمع", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-normal text-[10px] opacity-70",
								children: ACADEMIC_MAX
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
							className: "px-2 py-3 text-center font-medium",
							children: ["انضباط", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-normal text-[10px] opacity-70",
								children: 60
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 text-center font-medium",
							children: "میانگین ۱۰۰"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(({ student, rec }, idx) => {
					if (!rec) return null;
					const ac = academicTotal(rec.scores);
					const avg = dailyAverage(ac, rec.discipline);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/70 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "sticky right-0 z-10 bg-card px-3 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-4 text-muted-foreground",
											children: idx + 1
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
											name: student.fullName,
											photo: student.photo,
											size: 28
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "whitespace-nowrap font-medium",
											children: student.fullName
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									disabled: locked,
									value: rec.attendance,
									onChange: (e) => patchDaily(rec.id, { attendance: e.target.value }),
									className: "h-9 rounded-md border border-input bg-card px-1 text-xs",
									children: Object.keys(ATTENDANCE_LABEL).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: k,
										children: ATTENDANCE_LABEL[k]
									}, k))
								})
							}),
							SCORE_FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-1 py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreInput, {
									value: rec.scores[f.key],
									max: f.max,
									disabled: locked,
									onChange: (v) => patchDailyScores(rec.id, { [f.key]: v })
								})
							}, f.key)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-2 text-center tabular font-medium",
								children: formatScore(ac)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "w-20 px-1 py-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreInput, {
									value: rec.discipline,
									max: 60,
									disabled: locked,
									onChange: (v) => patchDaily(rec.id, { discipline: v })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-2 text-center tabular text-sm font-semibold",
								children: formatScore(avg)
							})
						]
					}, student.id);
				}) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "no-print mt-3 text-xs text-muted-foreground",
			children: [
				"میانگین روز = (جمع علمی از ۱۴۰ + انضباط از ۶۰) ÷ ۲. تغییرات همان لحظه ذخیره می‌شود.",
				" ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "text-primary underline-offset-2 hover:underline",
					onClick: () => toast.success("نمرات این جلسه ثبت شد"),
					children: "تأیید ثبت"
				})
			]
		})
	] });
}
//#endregion
export { EntryPage as component };
