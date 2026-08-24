import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as cn } from "./layout-DmJiP8F_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/score-input-DBcY9aNl.js
var import_jsx_runtime = require_jsx_runtime();
function ScoreInput({ value, max, onChange, disabled, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "number",
		inputMode: "decimal",
		step: .5,
		min: 0,
		max,
		disabled,
		value: value ?? "",
		onChange: (e) => {
			const raw = e.target.value;
			if (raw === "") {
				onChange(null);
				return;
			}
			const n = Number(raw);
			if (Number.isNaN(n)) return;
			onChange(Math.min(max, Math.max(0, n)));
		},
		className: cn("score-input h-9 w-full rounded-md border border-input bg-card px-1 text-center text-sm tabular-nums outline-none transition-[border-color,box-shadow] duration-150 focus:border-primary/40 focus:ring-2 focus:ring-ring/25 disabled:bg-muted disabled:opacity-60", value != null && value === 0 && "text-destructive/80", className)
	});
}
//#endregion
export { ScoreInput as t };
