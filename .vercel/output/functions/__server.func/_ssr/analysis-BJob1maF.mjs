import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as selectWeekDailies, O as studentWeeklyComputed, k as useAppStore, r as AppShell, s as SCORE_FIELDS, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { r as classCategoryAverages, t as analyzeStudent } from "./analysis-DvBNbLkb.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dro_C0CF.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { n as CategoryRadar, t as CategoryBars } from "./charts-BPjJcIpZ.mjs";
import { t as ExcelButton } from "./excel-button-CX4CCuIB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analysis-BJob1maF.js
var import_jsx_runtime = require_jsx_runtime();
function AnalysisPage() {
	const state = useAppStore();
	const weekDays = selectWeekDailies(state, state.activeWeekId).filter((d) => d.attendance === "present" || d.attendance === "late");
	const cats = classCategoryAverages(weekDays);
	const weakest = [...cats].sort((a, b) => (a.percent ?? 100) - (b.percent ?? 100))[0];
	const needsHelp = state.students.map((s) => {
		const dailies = state.dailies.filter((d) => d.studentId === s.id);
		const weeklies = state.weeklies.filter((w) => w.studentId === s.id);
		return {
			student: s,
			insight: analyzeStudent(s, dailies, weeklies),
			c: studentWeeklyComputed(state, s.id, state.activeWeekId)
		};
	}).filter((x) => x.insight.weaknesses.length > 0).sort((a, b) => (a.c.weekTotal ?? 0) - (b.c.weekTotal ?? 0));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "تحلیل عملکرد کلاس"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "بر اساس نمرات ثبت‌شده، ضعف‌های مشترک و برنامه فردی هر حافظ مشخص می‌شود"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelButton, {})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "میانگین مهارت‌های کلاس" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBars, { data: cats.map((c) => ({
				name: c.label,
				درصد: c.percent
			})) }), weakest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"ضعیف‌ترین بخش کلاس: ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium text-foreground",
						children: weakest.label
					}),
					" با میانگین",
					" ",
					formatScore(weakest.percent),
					"٪ از سقف. بهتر است جلسه گروهی روی همین مهارت طراحی شود."
				]
			}) : null] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "نیمرخ راداری" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRadar, { data: cats.filter((c) => c.key !== "discipline").map((c) => ({
				subject: c.label,
				درصد: c.percent ?? 0
			})) }) })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 font-display text-2xl font-bold",
			children: "پیشنهاد فردی هفته بعد"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 grid gap-3",
			children: needsHelp.map(({ student, insight, c }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/students/$id",
				params: { id: student.id },
				className: "rounded-2xl bg-card p-4 shadow-border transition-transform duration-150 hover:-translate-y-0.5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
						name: student.fullName,
						photo: student.photo,
						size: 44
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-baseline justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-medium",
									children: student.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-muted-foreground",
									children: ["نمره هفته ", formatScore(c.weekTotal)]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-medium text-primary",
								children: insight.focusTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-6 text-muted-foreground",
								children: insight.paragraphs[0]
							}),
							insight.plan[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "تمرین پیشنهادی: "
								}), insight.plan[0]]
							}) : null
						]
					})]
				})
			}, student.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "راهنمای مهارت‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-3 sm:grid-cols-2",
				children: SCORE_FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl bg-muted/50 px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [
							f.label,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-normal text-muted-foreground",
								children: ["از ", f.max]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: f.hint
					})]
				}, f.key))
			})]
		})
	] });
}
//#endregion
export { AnalysisPage as component };
