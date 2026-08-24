import type { ErrorComponentProps } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background px-6 text-center text-foreground">
      <TriangleAlert className="size-10 text-destructive" strokeWidth={2} aria-hidden />
      <h1 className="font-display text-2xl font-bold">خطایی رخ داد</h1>
      <p className="max-w-md text-sm break-words text-muted-foreground">
        {error.message || "یک خطای پیش‌بینی‌نشده رخ داد. صفحه را دوباره بارگذاری کنید."}
      </p>
    </main>
  );
}
