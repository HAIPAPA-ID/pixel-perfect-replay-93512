import { Scissors } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-highlight-foreground shadow-card",
        className,
      )}
    >
      <Scissors className="size-[18px]" strokeWidth={2.4} />
    </div>
  );
}
