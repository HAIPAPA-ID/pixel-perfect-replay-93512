import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export function GrowthBadge({ value, className }: { value: number | null; className?: string }) {
  if (value === null) {
    return (
      <Badge variant="secondary" className={cn("gap-1 font-medium", className)}>
        <Minus className="size-3" /> n/a
      </Badge>
    );
  }
  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <Badge variant={up ? "positive" : "negative"} className={cn("gap-0.5 tabular", className)}>
      <Icon className="size-3.5" />
      {formatPercent(value, true)}
    </Badge>
  );
}
