import { Banknote, HandCoins, Receipt, TrendingUp } from "lucide-react";

import type { Financials } from "@/lib/dashboard/metrics";
import { formatIDR, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

export function FinancialOverview({ data, rangeLabel }: { data: Financials; rangeLabel: string }) {
  const base = Math.max(1, data.revenue);
  const pct = (v: number) => Math.max(0, (v / base) * 100);
  const items = [
    { label: "Total pendapatan", value: data.revenue, icon: Banknote, dot: "bg-primary", tone: "text-foreground" },
    { label: "Biaya operasional", value: -data.expenses, icon: Receipt, dot: "bg-highlight", tone: "text-foreground" },
    { label: "Komisi capster", value: -data.commissions, icon: HandCoins, dot: "bg-crest", tone: "text-foreground" },
  ];
  const profitPositive = data.netProfit >= 0;

  return (
    <SectionCard title="Ringkasan Keuangan" description={rangeLabel}>
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full bg-highlight" style={{ width: `${pct(data.expenses)}%` }} />
        <div className="h-full bg-crest" style={{ width: `${pct(data.commissions)}%` }} />
        <div className="h-full bg-primary" style={{ width: `${pct(data.netProfit)}%` }} />
      </div>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-highlight" />Operasional</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-crest" />Komisi</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-primary" />Laba bersih</span>
      </div>

      <ul className="mt-5 divide-y">
        {items.map((it) => (
          <li key={it.label} className="flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <it.icon className="size-4" />
              </div>
              <span className="text-sm">{it.label}</span>
            </div>
            <span className={cn("text-sm font-semibold tabular", it.tone)}>
              {it.value < 0 ? "− " : ""}
              {formatIDR(Math.abs(it.value))}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={cn(
          "mt-2 flex items-center justify-between rounded-xl p-4",
          profitPositive ? "bg-primary-soft" : "bg-destructive/10",
        )}
      >
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              profitPositive ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground",
            )}
          >
            <TrendingUp className="size-[18px]" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Laba bersih</div>
            <div className="text-lg font-extrabold tabular">{formatIDR(data.netProfit)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Margin</div>
          <div className={cn("text-sm font-bold tabular", profitPositive ? "text-primary" : "text-destructive")}>
            {formatPercent(data.margin)}
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
