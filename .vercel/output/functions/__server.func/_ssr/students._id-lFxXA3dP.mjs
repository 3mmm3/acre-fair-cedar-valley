import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, V as require_react, b as useNavigate, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Trash2, c as Printer, g as Camera, x as ArrowRight } from "../_libs/lucide-react.mjs";
import { O as studentWeeklyComputed, T as selectStudentDailies, _ as formatJalaliShort, c as academicTotal, d as cn, g as formatInt, h as fieldPercent, i as CARD_LABEL, k as useAppStore, n as ATTENDANCE_LABEL, p as dailyAverage, r as AppShell, s as SCORE_FIELDS, u as cardForPoints, v as formatJalaliWithWeekday, w as previousLevelFor, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { n as categoryInsights, t as analyzeStudent } from "./analysis-DvBNbLkb.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dro_C0CF.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { a as WeekTrend, i as SkillSmallMultiples, n as CategoryRadar, r as DailyLineChart, t as CategoryBars } from "./charts-BPjJcIpZ.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
import { n as Route } from "./router-C3JaLAD2.mjs";
import { n as LevelBadge, t as ChangeBadge } from "./level-badge-CycilJdM.mjs";
import { n as Textarea, t as Input } from "./input-u5pia17s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students._id-lFxXA3dP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Meter({ label, value, max, hint }) {
	const pct = value == null ? 0 : Math.min(100, Math.max(0, value / max * 100));
	const tone = pct >= 80 ? "bg-primary" : pct >= 60 ? "bg-sage" : "bg-destructive/70";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular font-medium",
				children: [formatScore(value), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-normal text-muted-foreground",
					children: [" / ", max]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("h-full rounded-full transition-[width] duration-300", tone),
				style: { width: `${pct}%` }
			})
		}),
		hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-1 text-[10px] text-muted-foreground",
			children: hint
		}) : null
	] });
}
function resizeImageFile(file, size = 256) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const url = URL.createObjectURL(file);
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = size;
			canvas.height = size;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("canvas"));
				return;
			}
			const scale = Math.max(size / img.width, size / img.height);
			const w = img.width * scale;
			const h = img.height * scale;
			ctx.fillStyle = "#efe8dc";
			ctx.fillRect(0, 0, size, size);
			ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .86));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("image"));
		};
		img.src = url;
	});
}
function StudentDossier() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const state = useAppStore();
	const updateStudent = useAppStore((s) => s.updateStudent);
	const removeStudent = useAppStore((s) => s.removeStudent);
	const student = state.students.find((s) => s.id === id);
	const fileRef = (0, import_react.useRef)(null);
	const weekId = state.activeWeekId;
	const week = state.weeks.find((w) => w.id === weekId);
	const computed = student ? studentWeeklyComputed(state, student.id, weekId) : null;
	const prevLevel = student ? previousLevelFor(state, student.id, weekId) : "C";
	const weekly = state.weeklies.find((w) => w.studentId === id && w.weekId === weekId);
	const allDailies = (0, import_react.useMemo)(() => student ? selectStudentDailies(state, student.id) : [], [state.dailies, student?.id]);
	const weekDailies = allDailies.filter((d) => d.weekId === weekId);
	const presentAll = allDailies.filter((d) => d.attendance === "present" || d.attendance === "late");
	const cats = categoryInsights(allDailies);
	const insight = student ? analyzeStudent(student, allDailies, state.weeklies.filter((w) => w.studentId === id)) : null;
	const card = student ? cardForPoints(student.totalPoints, state.settings) : null;
	const weekTrend = state.weeks.map((w) => ({
		label: formatJalaliShort(w.evalDate),
		نمره: studentWeeklyComputed(state, id, w.id).weekTotal
	}));
	const dailyLine = weekDailies.map((d) => ({
		label: formatJalaliShort(d.date),
		میانگین: dailyAverage(academicTotal(d.scores), d.discipline),
		انضباط: d.discipline
	}));
	const skillSeries = SCORE_FIELDS.map((f) => ({
		name: f.label,
		data: presentAll.map((d) => ({
			label: formatJalaliShort(d.date),
			درصد: fieldPercent(d.scores[f.key], f.max)
		}))
	}));
	if (!student || !computed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "این پرونده پیدا نشد."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/students",
		className: "mt-3 inline-block text-sm text-primary",
		children: "بازگشت به فهرست"
	})] });
	const set = (patch) => updateStudent(student.id, patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "stagger-in space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "no-print flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/students",
					className: "inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }), "پرونده‌ها"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => window.print(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "چاپ پرونده"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => {
							if (confirm(`پرونده «${student.fullName}» حذف شود؟`)) {
								removeStudent(student.id);
								toast.message("پرونده حذف شد");
								navigate({ to: "/students" });
							}
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-2xl bg-card p-5 shadow-border sm:p-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-5 sm:flex-row sm:items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "group relative mx-auto sm:mx-0",
							onClick: () => fileRef.current?.click(),
							title: "بارگذاری عکس",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
								name: student.fullName,
								photo: student.photo,
								size: 96
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "size-3.5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/*",
							className: "hidden",
							onChange: async (e) => {
								const file = e.target.files?.[0];
								if (!file) return;
								try {
									const data = await resizeImageFile(file);
									set({ photo: data });
									toast.success("عکس پرونده ذخیره شد");
								} catch {
									toast.error("بارگذاری عکس ممکن نشد");
								}
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "font-display text-3xl font-bold leading-tight",
									children: student.fullName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-1 text-sm text-muted-foreground",
									children: [
										state.settings.className,
										" · ",
										week?.label
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: student.currentLevel }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
											change: computed.change,
											from: prevLevel,
											to: computed.nextLevel
										}),
										card ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: card,
											children: CARD_LABEL[card]
										}) : null,
										weekly?.isEthicsMan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "ethics",
											children: "مرد اخلاق"
										}) : null
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
										k: "نمره هفته",
										v: formatScore(computed.weekTotal)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
										k: "میانگین روز",
										v: formatScore(computed.dailyAvg)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
										k: "انضباط",
										v: formatScore(computed.disciplineAvg)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
										k: "امتیاز کل",
										v: formatInt(student.totalPoints)
									})
								]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "مشخصات پرونده" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "grid gap-3 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "نام کامل",
								value: student.fullName,
								onChange: (v) => set({
									fullName: v,
									shortName: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "نام پدر",
								value: student.fatherName,
								onChange: (v) => set({ fatherName: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "تلفن",
								value: student.phone,
								onChange: (v) => set({ phone: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "سال تولد",
								value: student.birthYear,
								onChange: (v) => set({ birthYear: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "شهر",
								value: student.city,
								onChange: (v) => set({ city: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "جزء جاری",
								value: student.currentJuz,
								onChange: (v) => set({ currentJuz: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "تاریخ ورود",
								value: student.joinDate,
								onChange: (v) => set({ joinDate: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs text-muted-foreground",
									children: "یادداشت مربی"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: student.notes,
									onChange: (e) => set({ notes: e.target.value }),
									rows: 2
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "آزمون پایان هفته" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "شفاهی از ۵۰",
							v: formatScore(computed.oralExam)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "کتبی از ۵۰",
							v: formatScore(computed.writtenExam)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "جمع آزمون",
							v: formatScore(computed.examTotal)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "حضور این هفته",
							v: `${formatInt(computed.presentCount)} جلسه`
						}),
						computed.excusedCount ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							k: "غیبت موجه",
							v: formatInt(computed.excusedCount)
						}) : null,
						weekly?.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "pt-2 text-muted-foreground",
							children: weekly.notes
						}) : null
					]
				})] })]
			}),
			insight ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-2xl bg-ink p-5 text-ink-foreground shadow-border sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-ink-foreground/60",
						children: "تحلیل پیشرفته"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl font-bold",
						children: insight.focusTitle
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-3 text-sm leading-7 text-ink-foreground/85",
						children: insight.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
					}),
					insight.plan.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
						className: "mt-5 space-y-2 text-sm",
						children: insight.plan.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-ink-foreground/10 text-xs tabular",
								children: formatInt(i + 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: step })]
						}, step))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [insight.strengths.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "a",
							children: ["قوت: ", s.label]
						}, s.key)), insight.weaknesses.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "c",
							children: ["ضعف: ", s.label]
						}, s.key))]
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "روند نمره هفته‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WeekTrend, { data: weekTrend }) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "میانگین روزهای این هفته" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DailyLineChart, { data: dailyLine }) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "درصد مهارت‌ها نسبت به سقف" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryBars, { data: cats.map((c) => ({
						name: c.label,
						درصد: c.percent
					})) }) })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "نیمرخ راداری" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryRadar, { data: cats.filter((c) => c.key !== "discipline").map((c) => ({
						subject: c.label,
						درصد: c.percent ?? 0
					})) }) })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "نمودار تک‌تک مهارت‌ها در طول زمان" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillSmallMultiples, { series: skillSeries }) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "جزئیات مهارت‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-4 sm:grid-cols-2",
				children: cats.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Meter, {
					label: c.label,
					value: c.average,
					max: c.max,
					hint: c.trend === "up" ? `روند صعودی ${formatScore(c.trendDelta)}` : c.trend === "down" ? `روند نزولی ${formatScore(c.trendDelta)}` : void 0
				}, c.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "کارنامه روزانه این هفته" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[860px] text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-right font-medium",
									children: "تاریخ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-right font-medium",
									children: "حضور"
								}),
								SCORE_FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-1 py-2 text-center font-medium",
									children: f.short
								}, f.key)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "جمع"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "انضباط"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-center font-medium",
									children: "میانگین"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: weekDailies.map((d) => {
						const ac = academicTotal(d.scores);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 whitespace-nowrap",
									children: formatJalaliWithWeekday(d.date)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2",
									children: ATTENDANCE_LABEL[d.attendance]
								}),
								SCORE_FIELDS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-1 py-2 text-center tabular",
									children: formatScore(d.scores[f.key])
								}, f.key)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular font-medium",
									children: formatScore(ac)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular",
									children: formatScore(d.discipline)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2 text-center tabular font-semibold",
									children: formatScore(dailyAverage(ac, d.discipline))
								})
							]
						}, d.id);
					}) })]
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "تاریخچه هفته‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto p-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[640px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-right font-medium",
									children: "هفته"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "میانگین"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "شفاهی"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "کتبی"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-2 py-2 text-center font-medium",
									children: "نمره کل"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-2 text-right font-medium",
									children: "وضعیت"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: state.weeks.map((w) => {
						const c = studentWeeklyComputed(state, student.id, w.id);
						const rec = state.weeklies.find((x) => x.studentId === student.id && x.weekId === w.id);
						const from = previousLevelFor(state, student.id, w.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70 last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: w.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular",
									children: formatScore(c.dailyAvg)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular",
									children: formatScore(c.oralExam)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular",
									children: formatScore(c.writtenExam)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-2 py-2 text-center tabular font-semibold",
									children: formatScore(c.weekTotal)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: c.nextLevel }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChangeBadge, {
												change: c.change,
												from,
												to: c.nextLevel
											}),
											rec?.isEthicsMan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "ethics",
												children: "مرد اخلاق"
											}) : null
										]
									})
								})
							]
						}, w.id);
					}) })]
				})
			})] })
		]
	}) });
}
function Kpi({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-muted/70 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tabular text-lg font-semibold",
			children: v
		})]
	});
}
function Row({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular font-medium",
			children: v
		})]
	});
}
function Field({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		value,
		onChange: (e) => onChange(e.target.value)
	})] });
}
//#endregion
export { StudentDossier as component };
