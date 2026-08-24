import { formatScore } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function Meter({
  label,
  value,
  max,
  hint,
}: {
  label: string
  value: number | null
  max: number
  hint?: string
}) {
  const pct = value == null ? 0 : Math.min(100, Math.max(0, (value / max) * 100));
  const tone = pct >= 80 ? "bg-primary" : pct >= 60 ? "bg-sage" : "bg-destructive/70";
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="tabular font-medium">
          {formatScore(value)}
          <span className="font-normal text-muted-foreground"> / {max}</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full transition-[width] duration-300", tone)} style={{ width: `${pct}%` }} />
      </div>
      {hint ? <div className="mt-1 text-[10px] text-muted-foreground">{hint}</div> : null}
    </div>
  );
}
