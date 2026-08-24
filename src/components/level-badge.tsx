import { Badge } from "@/components/ui/badge";
import { LEVEL_CHANGE_LABEL, LEVEL_LABEL, levelChange } from "@/lib/scoring";
import type { Level, LevelChange } from "@/lib/types";

export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  const v = level === "A" ? "a" : level === "B" ? "b" : "c";
  return (
    <Badge variant={v} className={className}>
      {LEVEL_LABEL[level]}
    </Badge>
  );
}

export function ChangeBadge({
  change,
  from,
  to,
}: {
  change?: LevelChange | null
  from?: Level
  to?: Level | null
}) {
  const c = change ?? (from && to ? levelChange(from, to) : "stay");
  const variant = c === "promote" ? "promote" : c === "demote" ? "demote" : "stay";
  const label =
    from && to
      ? c === "promote"
        ? `ارتقاء به ${LEVEL_LABEL[to]}`
        : c === "demote"
          ? `نزول به ${LEVEL_LABEL[to]}`
          : `ابقاء در ${LEVEL_LABEL[to]}`
      : LEVEL_CHANGE_LABEL[c];
  return <Badge variant={variant}>{label}</Badge>;
}
