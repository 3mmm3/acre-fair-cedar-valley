import { S as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { d as cn } from "./layout-DmJiP8F_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DPrZzMBZ.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight", {
	variants: { variant: {
		default: "bg-primary/10 text-primary",
		muted: "bg-muted text-muted-foreground",
		a: "bg-primary text-primary-foreground",
		b: "bg-accent text-accent-foreground",
		c: "bg-secondary text-secondary-foreground",
		promote: "bg-primary/10 text-primary",
		demote: "bg-destructive/10 text-destructive",
		stay: "bg-muted text-muted-foreground",
		gold: "bg-primary text-primary-foreground",
		silver: "bg-stone-500/15 text-stone-700",
		bronze: "bg-amber-800/10 text-amber-900",
		ethics: "bg-primary text-primary-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({
			variant,
			className
		})),
		...props
	});
}
//#endregion
export { Badge as t };
