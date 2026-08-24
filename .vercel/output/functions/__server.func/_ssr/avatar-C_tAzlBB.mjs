import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./layout-DmJiP8F_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/avatar-C_tAzlBB.js
var import_jsx_runtime = require_jsx_runtime();
var PALETTES = [
	["#1e4d3a", "#d7e4dc"],
	["#16332c", "#e8f0eb"],
	["#3d6b56", "#f4f1ea"],
	["#2c4a3e", "#efe8d8"],
	["#1a3c34", "#f7f4ef"],
	["#245042", "#e4ddd2"]
];
function hashName(name) {
	let h = 0;
	for (let i = 0; i < name.length; i++) h = h * 31 + name.charCodeAt(i) | 0;
	return Math.abs(h);
}
function initials(name) {
	const parts = name.replace(/‌/g, " ").split(" ").filter(Boolean);
	const last = parts[parts.length - 1] ?? "";
	return ((parts[0] ?? "")[0] ?? "") + (last[0] ?? "");
}
function StudentAvatar({ name, photo, size = 48, className }) {
	const h = hashName(name);
	const [fg, bg] = PALETTES[h % PALETTES.length];
	const rot = h % 12 * 30;
	if (photo) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: photo,
		alt: name,
		width: size,
		height: size,
		className: cn("rounded-full object-cover shadow-border", className),
		style: {
			width: size,
			height: size
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative shrink-0 overflow-hidden rounded-full", className),
		style: {
			width: size,
			height: size,
			background: bg
		},
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 80 80",
			className: "absolute inset-0 size-full",
			style: { transform: `rotate(${rot}deg)` },
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "40,8 48,32 72,40 48,48 40,72 32,48 8,40 32,32",
				fill: fg,
				opacity: "0.18"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: "40,18 44,36 62,40 44,44 40,62 36,44 18,40 36,36",
				fill: fg,
				opacity: "0.35"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute inset-0 flex items-center justify-center font-display font-bold",
			style: {
				color: fg,
				fontSize: size * .32
			},
			children: initials(name)
		})]
	});
}
//#endregion
export { StudentAvatar as t };
