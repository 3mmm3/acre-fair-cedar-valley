import { cn } from "@/lib/utils";

const PALETTES = [
  ["#1e4d3a", "#d7e4dc"],
  ["#16332c", "#e8f0eb"],
  ["#3d6b56", "#f4f1ea"],
  ["#2c4a3e", "#efe8d8"],
  ["#1a3c34", "#f7f4ef"],
  ["#245042", "#e4ddd2"],
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.replace(/‌/g, " ").split(" ").filter(Boolean);
  const last = parts[parts.length - 1] ?? "";
  const first = parts[0] ?? "";
  return (first[0] ?? "") + (last[0] ?? "");
}

export function StudentAvatar({
  name,
  photo,
  size = 48,
  className,
}: {
  name: string
  photo?: string | null
  size?: number
  className?: string
}) {
  const h = hashName(name);
  const [fg, bg] = PALETTES[h % PALETTES.length];
  const rot = (h % 12) * 30;

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover shadow-border", className)}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-full", className)}
      style={{ width: size, height: size, background: bg }}
      aria-hidden
    >
      <svg viewBox="0 0 80 80" className="absolute inset-0 size-full" style={{ transform: `rotate(${rot}deg)` }}>
        <polygon points="40,8 48,32 72,40 48,48 40,72 32,48 8,40 32,32" fill={fg} opacity="0.18" />
        <polygon points="40,18 44,36 62,40 44,44 40,62 36,44 18,40 36,36" fill={fg} opacity="0.35" />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display font-bold"
        style={{ color: fg, fontSize: size * 0.32 }}
      >
        {initials(name)}
      </span>
    </div>
  );
}
