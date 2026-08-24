import { S as require_jsx_runtime, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Award, i as TrendingDown, m as ClipboardPen, r as TrendingUp, t as Users } from "../_libs/lucide-react.mjs";
import { D as selectWeekDailies, E as selectWeek, O as studentWeeklyComputed, g as formatInt, k as useAppStore, o as LEVEL_LABEL, r as AppShell, w as previousLevelFor, x as mean, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { r as classCategoryAverages } from "./analysis-DvBNbLkb.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dro_C0CF.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { n as CategoryRadar } from "./charts-BPjJcIpZ.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { t as ExcelButton } from "./excel-button-CX4CCuIB.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
import { n as LevelBadge, t as ChangeBadge } from "./level-badge-CycilJdM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BHTD9TpO.js
var import_jsx_runtime = require_jsx_runtime();
function Dashboard() {
	const state = useAppStore();
	const navigate = useNavigate();
	const week = selectWeek(state);
	const students = state.students;
	const rows = students.map((s) => {
		return {
			student: s,
			c: studentWeeklyComputed(state, s.id, state.activeWeekId),
			weekly: state.weeklies.find((w) => w.studentId === s.id && w.weekId === state.activeWeekId),
			prev: previousLevelFor(state, s.id, state.activeWeekId)
		};
	}).sort((a, b) => (b.c.weekTotal ?? -1) - (a.c.weekTotal ?? -1));
	const classAvg = mean(rows.map((r) => r.c.weekTotal));
	const ethics = rows.find((r) => r.weekly?.isEthicsMan) ?? rows.slice().sort((a, b) => (b.c.disciplineAvg ?? 0) - (a.c.disciplineAvg ?? 0))[0];
	const levels = {
		A: 0,
		B: 0,
		C: 0
	};
	for (const r of rows) levels[r.c.nextLevel] += 1;
	const promoted = rows.filter((r) => r.c.change === "promote");
	const demoted = rows.filter((r) => r.c.change === "demote");
	const weekDays = selectWeekDailies(state, state.activeWeekId).filter((d) => d.attendance === "present" || d.attendance === "late");
	const radar = classCategoryAverages(weekDays).filter((c) => c.key !== "discipline").map((c) => ({
		subject: c.label.replace(" ", "‌"),
		درصد: c.percent ?? 0
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: state.settings.institution
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold sm:text-4xl",
						children: state.settings.className
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: [
							week?.label,
							" · ارزیابی ",
							week?.evalDate
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void navigate({ to: "/entry" }),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPen, { className: "size-4" }), "ثبت جلسه"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelButton, {})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid grid-cols-2 gap-3 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "میانگین کلاس",
						value: formatScore(classAvg),
						hint: "از ۱۰۰"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "تعداد حافظان",
						value: formatInt(students.length),
						hint: "پرونده فعال",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
						label: "مرد اخلاق",
						value: ethics?.student.shortName ?? "—",
						hint: ethics ? `انضباط ${formatScore(ethics.c.disciplineAvg)} از ۶۰` : "",
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-card p-4 shadow-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "توزیع سطح"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex items-end gap-2",
							children: [
								"A",
								"B",
								"C"
							].map((lv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mx-auto w-full rounded-md bg-primary/15",
										style: { height: 8 + levels[lv] * 10 }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1 text-xs text-muted-foreground",
										children: LEVEL_LABEL[lv]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabular text-sm font-medium",
										children: formatInt(levels[lv])
									})
								]
							}, lv))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "min-w-0 overflow-hidden lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex-row items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "رتبه‌بندی هفته" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "بر اساس نمره ارزیابی کل"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "p-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border lg:hidden",
							children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/students/$id",
								params: { id: r.student.id },
								className: "flex items-center gap-3 px-4 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-5 tabular text-xs text-muted-foreground",
										children: formatInt(i + 1)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
										name: r.student.fullName,
										photo: r.student.photo,
										size: 36
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "truncate font-medium",
											children: r.student.fullName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-0.5 flex flex-wrap items-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: r.c.nextLevel }), r.weekly?.isEthicsMan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "ethics",
												children: "مرد اخلاق"
											}) : null]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "tabular text-sm font-semibold",
										children: formatScore(r.c.weekTotal)
									})
								]
							}) }, r.student.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden overflow-x-auto lg:block",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full min-w-[640px] text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "text-xs text-muted-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 text-right font-medium",
												children: "رتبه"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "نام"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "میانگین هفته"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "شفاهی"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "کتبی"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "انضباط"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-2 py-2 text-right font-medium",
												children: "نمره کل"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-2 text-right font-medium",
												children: "وضعیت"
											})
										]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "border-b border-border/70 last:border-0 hover:bg-muted/40",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2.5 tabular text-muted-foreground",
											children: formatInt(i + 1)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
												to: "/students/$id",
												params: { id: r.student.id },
												className: "flex items-center gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
														name: r.student.fullName,
														photo: r.student.photo,
														size: 32
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-medium",
														children: r.student.fullName
													}),
													r.weekly?.isEthicsMan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "ethics",
														className: "hidden sm:inline",
														children: "مرد اخلاق"
													}) : null
												]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5 tabular",
											children: formatScore(r.c.dailyAvg)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5 tabular",
											children: formatScore(r.c.oralExam)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5 tabular",
											children: formatScore(r.c.writtenExam)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5 tabular",
											children: formatScore(r.c.disciplineAvg)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-2 py-2.5 tabular font-semibold",
											children: formatScore(r.c.weekTotal)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-4 py-2.5",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: r.c.nextLevel }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
													change: r.c.change,
													from: r.prev,
													to: r.c.nextLevel
												})]
											})
										})
									]
								}, r.student.id)) })]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "نیمرخ مهارت کلاس" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRadar, { data: radar }) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "جابه‌جایی سطح" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-3 text-sm",
						children: [
							promoted.length === 0 && demoted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-muted-foreground",
								children: "در این هفته جابه‌جایی سطح ثبت نشده."
							}) : null,
							promoted.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-4 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.student.shortName }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
										change: "promote",
										from: r.prev,
										to: r.c.nextLevel
									})
								]
							}, r.student.id)),
							demoted.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "size-4 text-destructive" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r.student.shortName }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
										change: "demote",
										from: r.prev,
										to: r.c.nextLevel
									})
								]
							}, r.student.id))
						]
					})] })]
				})]
			})
		]
	}) });
}
function Kpi({ label, value, hint, icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card p-4 shadow-border",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [label, icon]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 font-display text-2xl font-bold leading-tight",
				children: value
			}),
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			}) : null
		]
	});
}
//#endregion
export { Dashboard as component };
