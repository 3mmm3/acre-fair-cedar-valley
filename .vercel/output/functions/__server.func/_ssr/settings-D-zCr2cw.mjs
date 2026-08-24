import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, V as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { _ as CalendarPlus } from "../_libs/lucide-react.mjs";
import { C as parseJalali, S as monthName, f as compareJalali, k as useAppStore, l as addJalaliDays, r as AppShell } from "./layout-DmJiP8F_.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dro_C0CF.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as ExcelButton } from "./excel-button-CX4CCuIB.mjs";
import { t as Input } from "./input-u5pia17s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-D-zCr2cw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function buildFollowingWeek(prev) {
	const startDate = addJalaliDays(prev.startDate, 7);
	const endDate = addJalaliDays(prev.endDate, 7);
	const evalDate = addJalaliDays(prev.evalDate, 7);
	const sessionDates = prev.sessionDates.map((d) => addJalaliDays(d, 7));
	const { y, m, d } = parseJalali(evalDate);
	return {
		id: `w${y}-${m}-${d}`,
		startDate,
		endDate,
		evalDate,
		sessionDates,
		label: `هفته ${d} ${monthName(m)} ${y}`,
		status: "open"
	};
}
function SettingsPage() {
	const settings = useAppStore((s) => s.settings);
	const weeks = useAppStore((s) => s.weeks);
	const updateSettings = useAppStore((s) => s.updateSettings);
	const resetToSeed = useAppStore((s) => s.resetToSeed);
	const addWeek = useAppStore((s) => s.addWeek);
	const loadBackup = useAppStore((s) => s.loadBackup);
	const fileRef = (0, import_react.useRef)(null);
	const set = (key, value) => {
		updateSettings({ [key]: value });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: "تنظیمات کلاس"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: "نام مؤسسه، آستانه‌های سطح و قوانین امتیاز — محاسبات بلافاصله با این اعداد هماهنگ می‌شوند"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "مشخصات" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "مؤسسه",
							value: settings.institution,
							onChange: (v) => set("institution", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نام کلاس",
							value: settings.className,
							onChange: (v) => set("className", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "نام مربی",
							value: settings.teacherName,
							onChange: (v) => set("teacherName", v)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "آستانه سطح" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "سطح الف از نمره",
							value: settings.levelA,
							onChange: (v) => set("levelA", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "سطح ب از نمره",
							value: settings.levelB,
							onChange: (v) => set("levelB", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "پایین‌تر از سطح ب، سطح ج محسوب می‌شود."
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "امتیاز عملکرد" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "امتیاز نمره سطح الف",
							value: settings.pointsHigh,
							onChange: (v) => set("pointsHigh", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "امتیاز نمره سطح ب",
							value: settings.pointsMid,
							onChange: (v) => set("pointsMid", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "امتیاز نمره ۶۵ به بالا",
							value: settings.pointsLow,
							onChange: (v) => set("pointsLow", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "پاداش مرد اخلاق",
							value: settings.ethicsBonus,
							onChange: (v) => set("ethicsBonus", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "پاداش ارتقاء سطح",
							value: settings.promotionBonus,
							onChange: (v) => set("promotionBonus", v)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "کارت‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "برنزی از",
							value: settings.bronzeAt,
							onChange: (v) => set("bronzeAt", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "نقره‌ای از",
							value: settings.silverAt,
							onChange: (v) => set("silverAt", v)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Num, {
							label: "طلایی از",
							value: settings.goldAt,
							onChange: (v) => set("goldAt", v)
						})
					]
				})] })
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "هفته‌ها" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-1 text-sm",
					children: weeks.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: w.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: w.status === "complete" ? "نهایی" : "باز"
						})]
					}, w.id))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => {
						const last = [...weeks].sort((a, b) => compareJalali(a.evalDate, b.evalDate)).at(-1);
						if (!last) return;
						addWeek(buildFollowingWeek(last));
						toast.success("هفته بعد ساخته شد و فعال است");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarPlus, { className: "size-4" }), "ساخت هفته بعد"]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "خروجی و پشتیبان" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelButton, { variant: "default" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => {
							const blob = {
								students: useAppStore.getState().students,
								weeks: useAppStore.getState().weeks,
								dailies: useAppStore.getState().dailies,
								weeklies: useAppStore.getState().weeklies,
								points: useAppStore.getState().points,
								settings: useAppStore.getState().settings,
								activeWeekId: useAppStore.getState().activeWeekId
							};
							const a = document.createElement("a");
							a.href = URL.createObjectURL(new Blob([JSON.stringify(blob, null, 2)], { type: "application/json" }));
							a.download = "miqat-backup.json";
							a.click();
							toast.success("نسخه پشتیبان دانلود شد");
						},
						children: "خروجی JSON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						children: "بازیابی از JSON"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json",
						className: "hidden",
						onChange: async (e) => {
							const file = e.target.files?.[0];
							if (!file) return;
							try {
								const data = JSON.parse(await file.text());
								if (!Array.isArray(data.students)) throw new Error("invalid");
								loadBackup(data);
								toast.success("پشتیبان بازیابی شد");
							} catch {
								toast.error("این فایل پشتیبان معتبر نیست");
							}
							e.target.value = "";
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "destructive",
						onClick: () => {
							if (confirm("همه تغییرات پاک شود و داده‌های نمونه هفته ۲۲ مرداد برگردد؟")) {
								resetToSeed();
								toast.success("داده‌ها به حالت اولیه برگشت");
							}
						},
						children: "بازگشت به داده نمونه"
					})
				]
			})]
		})
	] });
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
function Num({ label, value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "mb-1 block text-xs text-muted-foreground",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		type: "number",
		value,
		onChange: (e) => onChange(Number(e.target.value))
	})] });
}
//#endregion
export { SettingsPage as component };
