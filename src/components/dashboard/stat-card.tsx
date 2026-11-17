import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GrowthBadge } from "./growth-badge";

type Tone = "primary" | "highlight" | "crest" | "neutral";

const TONE: Record<Tone, string> = {
  primary: "bg-primary-soft text-primary",
  highlight: "bg-highlight-soft text-highlight",
  crest: "bg-crest-soft text-crest-foreground",
  neutral: "bg-muted text-foreground",
};

interface StatCardProps {
  label: string;
  value: string;
  growth: number | null;
  comparison: string;
  icon: LucideIcon;
  tone?: Tone;
  featured?: boolean;
}

export function StatCard({ label, value, growth, comparison, icon: Icon, tone = "neutral", featured }: StatCardProps) {
  if (featured) {
    return (
      <Card className="relative overflow-hidden border-0 bg-gradient-hero p-5 text-primary-foreground shadow-lift">
        <div className="pointer-events-none absolute -right-8 -top-10 size-36 rounded-full bg-crest/25 blur-2xl" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium opacity-90">{label}</span>
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary-foreground/15">
            <Icon className="size-[18px]" />
          </div>
        </div>
        <div className="mt-4 whitespace-nowrap text-[26px] font-extrabold leading-none tracking-tight tabular xl:text-[22px] 2xl:text-[26px]">{value}</div>
        <div className="mt-3 flex items-center gap-2 text-xs opacity-90">
          <GrowthBadge value={growth} className="bg-primary-foreground/15 text-primary-foreground" />
          <span>{comparison}</span>
        </div>
      </Card>
    );
  }
  return (
    <Card className="p-5 transition-shadow hover:shadow-lift">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className={cn("flex size-9 items-center justify-center rounded-xl", TONE[tone])}>
          <Icon className="size-[18px]" />
        </div>
      </div>
      <div className="mt-4 text-2xl font-extrabold leading-none tracking-tight tabular">{value}</div>
      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
        <GrowthBadge value={growth} />
        <span>{comparison}</span>
      </div>
    </Card>
  );
}
