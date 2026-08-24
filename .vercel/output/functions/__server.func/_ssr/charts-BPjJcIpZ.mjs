import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as formatScore } from "./layout-DmJiP8F_.mjs";
import { a as XAxis, c as Bar, d as PolarRadiusAxis, f as PolarGrid, i as YAxis, l as Radar, m as Tooltip, n as BarChart, o as Line, p as ResponsiveContainer, r as LineChart, s as CartesianGrid, t as RadarChart, u as PolarAngleAxis } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/charts-BPjJcIpZ.js
var import_jsx_runtime = require_jsx_runtime();
var GRID = "#e4ddd2";
var INK = "#1c1917";
var PRIMARY = "#1e4d3a";
var MUTED = "#6b645c";
function Tip({ active, payload, label }) {
	if (!active || !payload?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border bg-card px-3 py-2 text-xs shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 font-medium",
			children: label
		}), payload.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between gap-4 tabular-nums",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-muted-foreground",
				children: p.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatScore(p.value) })]
		}, p.name))]
	});
}
function DailyLineChart({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-56 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: GRID,
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					tick: {
						fill: MUTED,
						fontSize: 11
					},
					axisLine: { stroke: GRID }
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain: [0, 100],
					tick: {
						fill: MUTED,
						fontSize: 11
					},
					axisLine: { stroke: GRID },
					width: 32
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "میانگین",
					stroke: PRIMARY,
					strokeWidth: 2,
					dot: { r: 3 },
					connectNulls: true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "انضباط",
					stroke: "#8a8278",
					strokeWidth: 1.5,
					dot: { r: 2 },
					connectNulls: true
				})
			]
		}) })
	});
}
function CategoryBars({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
			data,
			layout: "vertical",
			margin: {
				top: 4,
				right: 12,
				left: 8,
				bottom: 4
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: GRID,
					strokeDasharray: "3 3",
					horizontal: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					type: "number",
					domain: [0, 100],
					tick: {
						fill: MUTED,
						fontSize: 11
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					type: "category",
					dataKey: "name",
					width: 88,
					tick: {
						fill: INK,
						fontSize: 11
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
					dataKey: "درصد",
					fill: PRIMARY,
					radius: [
						0,
						6,
						6,
						0
					],
					maxBarSize: 16
				})
			]
		}) })
	});
}
function CategoryRadar({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
			data,
			cx: "50%",
			cy: "50%",
			outerRadius: "70%",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: GRID }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
					dataKey: "subject",
					tick: {
						fill: MUTED,
						fontSize: 10
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
					domain: [0, 100],
					tick: false,
					axisLine: false
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
					dataKey: "درصد",
					stroke: PRIMARY,
					fill: PRIMARY,
					fillOpacity: .18
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) })
			]
		}) })
	});
}
function WeekTrend({ data }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-48 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
			data,
			margin: {
				top: 8,
				right: 8,
				left: 0,
				bottom: 0
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
					stroke: GRID,
					strokeDasharray: "3 3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
					dataKey: "label",
					tick: {
						fill: MUTED,
						fontSize: 11
					}
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
					domain: [0, 100],
					tick: {
						fill: MUTED,
						fontSize: 11
					},
					width: 32
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
					type: "monotone",
					dataKey: "نمره",
					stroke: PRIMARY,
					strokeWidth: 2.2,
					dot: { r: 4 },
					connectNulls: true
				})
			]
		}) })
	});
}
function SkillSmallMultiples({ series }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2",
		children: series.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl bg-muted/40 px-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium",
				children: s.name
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-24 w-full",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
					data: s.data,
					margin: {
						top: 8,
						right: 4,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "label",
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							domain: [0, 100],
							hide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tip, {}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
							type: "monotone",
							dataKey: "درصد",
							stroke: PRIMARY,
							strokeWidth: 1.8,
							dot: { r: 2 },
							connectNulls: true
						})
					]
				}) })
			})]
		}, s.name))
	});
}
//#endregion
export { WeekTrend as a, SkillSmallMultiples as i, CategoryRadar as n, DailyLineChart as r, CategoryBars as t };
