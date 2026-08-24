import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, V as require_react, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as Plus, s as Search } from "../_libs/lucide-react.mjs";
import { O as studentWeeklyComputed, g as formatInt, i as CARD_LABEL, k as useAppStore, r as AppShell, u as cardForPoints, y as formatScore } from "./layout-DmJiP8F_.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { t as ExcelButton } from "./excel-button-CX4CCuIB.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
import { n as LevelBadge } from "./level-badge-CycilJdM.mjs";
import { t as Input } from "./input-u5pia17s.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/students.index-BtTSaAI3.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function StudentsPage() {
	const state = useAppStore();
	const [q, setQ] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const addStudent = useAppStore((s) => s.addStudent);
	const list = state.students.filter((s) => s.fullName.includes(q) || s.shortName.includes(q));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "پرونده دانش‌آموزان"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "عکس، مشخصات و خلاصه عملکرد — برای جزئیات کامل روی هر پرونده بزنید"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcelButton, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen((v) => !v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "دانش‌آموز جدید"]
				})]
			})]
		}),
		open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddStudentForm, {
			onClose: () => setOpen(false),
			onAdd: addStudent,
			count: state.students.length
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative mt-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: q,
				onChange: (e) => setQ(e.target.value),
				placeholder: "جستجوی نام…",
				className: "pr-10"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3",
			children: list.map((s) => {
				const c = studentWeeklyComputed(state, s.id, state.activeWeekId);
				const card = cardForPoints(s.totalPoints, state.settings);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/students/$id",
					params: { id: s.id },
					className: "group rounded-2xl bg-card p-4 shadow-border transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
								name: s.fullName,
								photo: s.photo,
								size: 56
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-medium leading-snug",
										children: s.fullName
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelBadge, { level: s.currentLevel })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 flex flex-wrap gap-1",
									children: [card ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: card,
										children: CARD_LABEL[card]
									}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-muted-foreground",
										children: [formatInt(s.totalPoints), " امتیاز"]
									})]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-3 gap-2 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: "نمره هفته",
									v: formatScore(c.weekTotal)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: "میانگین روز",
									v: formatScore(c.dailyAvg)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: "انضباط",
									v: formatScore(c.disciplineAvg)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-xs text-primary sm:opacity-0 sm:transition-opacity sm:duration-150 sm:group-hover:opacity-100",
							children: "اطلاعات تکمیلی و نمودارها ←"
						})
					]
				}, s.id);
			})
		})
	] });
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-muted/60 px-2 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-muted-foreground",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "tabular text-sm font-semibold",
			children: v
		})]
	});
}
function AddStudentForm({ onClose, onAdd, count }) {
	const [name, setName] = (0, import_react.useState)("");
	const [father, setFather] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-4 flex flex-wrap items-end gap-2 rounded-2xl bg-card p-4 shadow-border",
		onSubmit: (e) => {
			e.preventDefault();
			if (!name.trim()) return;
			onAdd({
				id: `s${String(count + 1).padStart(2, "0")}-${Date.now()}`,
				fullName: name.trim(),
				shortName: name.trim(),
				fatherName: father.trim(),
				phone: "",
				birthYear: "",
				joinDate: "",
				city: "",
				currentJuz: "",
				notes: "",
				photo: null,
				currentLevel: "C",
				totalPoints: 0
			});
			setName("");
			setFather("");
			onClose();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-56 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs text-muted-foreground",
					children: "نام و نام خانوادگی"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "مثلاً علی محمدی"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-40 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs text-muted-foreground",
					children: "نام پدر"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: father,
					onChange: (e) => setFather(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				children: "افزودن"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: onClose,
				children: "انصراف"
			})
		]
	});
}
//#endregion
export { StudentsPage as component };
