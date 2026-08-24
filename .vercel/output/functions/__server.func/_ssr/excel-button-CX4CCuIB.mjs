import { o as __toESM } from "../_runtime.mjs";
import { S as require_jsx_runtime, V as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { p as FileSpreadsheet } from "../_libs/lucide-react.mjs";
import { k as useAppStore } from "./layout-DmJiP8F_.mjs";
import { t as Button } from "./button-B6mwiH5j.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/excel-button-CX4CCuIB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ExcelButton({ variant = "outline" }) {
	const [busy, setBusy] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant,
		disabled: busy,
		onClick: async () => {
			setBusy(true);
			try {
				const { downloadExcel } = await import("./excel-export-DrEZD2qC.mjs");
				await downloadExcel(useAppStore.getState());
				toast.success("فایل اکسل آماده شد");
			} catch (err) {
				console.error(err);
				toast.error("خروجی اکسل ساخته نشد");
			} finally {
				setBusy(false);
			}
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "size-4" }), busy ? "در حال ساخت…" : "دانلود اکسل حرفه‌ای"]
	});
}
//#endregion
export { ExcelButton as t };
