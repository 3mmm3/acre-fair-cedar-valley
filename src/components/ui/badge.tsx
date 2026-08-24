import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
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
        ethics: "bg-primary text-primary-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}
