import { S as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Award } from "../_libs/lucide-react.mjs";
import { g as formatInt, i as CARD_LABEL, k as useAppStore, r as AppShell, u as cardForPoints } from "./layout-DmJiP8F_.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-Dro_C0CF.mjs";
import { t as StudentAvatar } from "./avatar-C_tAzlBB.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rewards-CltYi7pC.js
var import_jsx_runtime = require_jsx_runtime();
function RewardsPage() {
	const state = useAppStore();
	const ranked = [...state.students].sort((a, b) => b.totalPoints - a.totalPoints);
	const ethics = state.weeklies.filter((w) => w.isEthicsMan && w.weekId === state.activeWeekId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-bold",
			children: "امتیاز و کارت‌ها"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-1 text-sm text-muted-foreground",
			children: [
				"کارت برنزی از ",
				formatInt(state.settings.bronzeAt),
				"، نقره‌ای از ",
				formatInt(state.settings.silverAt),
				" و طلایی از",
				" ",
				formatInt(state.settings.goldAt),
				" امتیاز"
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					title: "برنزی",
					desc: `از ${formatInt(state.settings.bronzeAt)} امتیاز`,
					variant: "bronze"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					title: "نقره‌ای",
					desc: `از ${formatInt(state.settings.silverAt)} امتیاز`,
					variant: "silver"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
					title: "طلایی",
					desc: `از ${formatInt(state.settings.goldAt)} امتیاز`,
					variant: "gold"
				})
			]
		}),
		ethics.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-5" }), "مرد اخلاق این هفته"]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "flex flex-wrap gap-3",
				children: ethics.map((e) => {
					const s = state.students.find((x) => x.id === e.studentId);
					if (!s) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/students/$id",
						params: { id: s.id },
						className: "flex items-center gap-2 rounded-xl bg-muted px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
							name: s.fullName,
							photo: s.photo,
							size: 36
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: s.fullName
						})]
					}, e.id);
				})
			})]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 overflow-x-auto rounded-2xl bg-card shadow-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[640px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-medium",
							children: "رتبه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "نام"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "امتیاز کل"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-2 py-3 text-right font-medium",
							children: "کارت"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-medium",
							children: "آخرین رویدادها"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ranked.map((s, i) => {
					const card = cardForPoints(s.totalPoints, state.settings);
					const events = state.points.filter((p) => p.studentId === s.id).slice(-3).reverse();
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/70 last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular text-muted-foreground",
								children: formatInt(i + 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/students/$id",
									params: { id: s.id },
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudentAvatar, {
										name: s.fullName,
										photo: s.photo,
										size: 32
									}), s.fullName]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3 tabular font-semibold",
								children: formatInt(s.totalPoints)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3",
								children: card ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: card,
									children: CARD_LABEL[card]
								}) : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted-foreground",
								children: events.length === 0 ? "بدون امتیاز" : events.map((e) => `${e.reason} (${formatInt(e.amount)})`).join(" · ")
							})
						]
					}, s.id);
				}) })]
			})
		})
	] });
}
function Legend({ title, desc, variant }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl bg-card p-4 shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			variant,
			children: ["کارت ", title]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: desc
		})]
	});
}
//#endregion
export { RewardsPage as component };
