import { cn } from "@/lib/utils";

export function ScoreInput({
  value,
  max,
  onChange,
  disabled,
  className,
}: {
  value: number | null
  max: number
  onChange: (v: number | null) => void
  disabled?: boolean
  className?: string
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      step={0.5}
      min={0}
      max={max}
      disabled={disabled}
      value={value ?? ""}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw === "") {
          onChange(null);
          return;
        }
        const n = Number(raw);
        if (Number.isNaN(n)) return;
        onChange(Math.min(max, Math.max(0, n)));
      }}
      className={cn(
        "score-input h-9 w-full rounded-md border border-input bg-card px-1 text-center text-sm tabular-nums outline-none transition-[border-color,box-shadow] duration-150 focus:border-primary/40 focus:ring-2 focus:ring-ring/25 disabled:bg-muted disabled:opacity-60",
        value != null && value === 0 && "text-destructive/80",
        className,
      )}
    />
  );
}
