import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/store";
import { toast } from "sonner";
import { FileSpreadsheet } from "lucide-react";
import { useState } from "react";

export function ExcelButton({ variant = "outline" }: { variant?: "outline" | "default" | "ink" }) {
  const [busy, setBusy] = useState(false);
  return (
    <Button
      variant={variant}
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        try {
          const { downloadExcel } = await import("@/lib/excel-export");
          await downloadExcel(useAppStore.getState());
          toast.success("فایل اکسل آماده شد");
        } catch (err) {
          console.error(err);
          toast.error("خروجی اکسل ساخته نشد");
        } finally {
          setBusy(false);
        }
      }}
    >
      <FileSpreadsheet className="size-4" />
      {busy ? "در حال ساخت…" : "دانلود اکسل حرفه‌ای"}
    </Button>
  );
}
