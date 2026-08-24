import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as LEVEL_CHANGE_LABEL, b as levelChange, o as LEVEL_LABEL } from "./layout-DmJiP8F_.mjs";
import { t as Badge } from "./badge-DPrZzMBZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/level-badge-CycilJdM.js
var import_jsx_runtime = require_jsx_runtime();
function LevelBadge({ level, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant: level === "A" ? "a" : level === "B" ? "b" : "c",
		className,
		children: LEVEL_LABEL[level]
	});
}
function ChangeBadge({ change, from, to }) {
	const c = change ?? (from && to ? levelChange(from, to) : "stay");
	const variant = c === "promote" ? "promote" : c === "demote" ? "demote" : "stay";
	const label = from && to ? c === "promote" ? `ارتقاء به ${LEVEL_LABEL[to]}` : c === "demote" ? `نزول به ${LEVEL_LABEL[to]}` : `ابقاء در ${LEVEL_LABEL[to]}` : LEVEL_CHANGE_LABEL[c];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
		variant,
		children: label
	});
}
//#endregion
export { LevelBadge as n, ChangeBadge as t };
