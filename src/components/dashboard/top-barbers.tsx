import { Crown } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { BarberPerformance } from "@/lib/dashboard/metrics";
import { formatCompactIDR, formatIDR, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { SectionCard } from "./section-card";

const RANK_STYLE = [
  "bg-crest text-crest-foreground",
  "bg-highlight-soft text-highlight-foreground",
  "bg-primary-soft text-accent-foreground",
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

interface Props {
  rows: BarberPerformance[];
  commissionRate: number;
  limit?: number;
}

export function TopBarbers({ rows, commissionRate, limit = 6 }: Props) {
  const top = rows.slice(0, limit);
  const totalCommission = rows.reduce((s, r) => s + r.commission, 0);
  const totalCuts = rows.reduce((s, r) => s + r.haircuts, 0);

  return (
    <SectionCard title="Capster Terbaik" description="Peringkat berdasarkan pendapatan layanan">
      <div className="grid grid-cols-3 gap-2 rounded-xl border bg-surface p-3 text-center">
        <div>
          <div className="text-[11px] text-muted-foreground">Total potong</div>
          <div className="mt-0.5 text-sm font-bold tabular">{formatNumber(totalCuts)}</div>
        </div>
        <div className="border-x">
          <div className="text-[11px] text-muted-foreground">Total komisi</div>
          <div className="mt-0.5 text-sm font-bold tabular">{formatCompactIDR(totalCommission)}</div>
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">Rate komisi</div>
          <div className="mt-0.5 text-sm font-bold tabular">{formatPercent(commissionRate * 100)}</div>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[460px] text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
              <th className="pb-2 font-semibold">Capster</th>
              <th className="pb-2 text-right font-semibold">Potong</th>
              <th className="pb-2 text-right font-semibold">Pendapatan</th>
              <th className="pb-2 text-right font-semibold">Komisi</th>
            </tr>
          </thead>
          <tbody>
            {top.map((r, i) => (
              <tr key={r.barber.id} className="border-t">
                <td className="py-2.5">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="size-9">
                        <AvatarFallback className={cn("text-xs font-bold", RANK_STYLE[i] ?? "bg-muted")}>
                          {initials(r.barber.name)}
                        </AvatarFallback>
                      </Avatar>
                      {i === 0 && (
                        <Crown className="absolute -right-1 -top-1.5 size-4 fill-crest text-highlight" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{r.barber.name}</div>
                      <div className="truncate text-xs text-muted-foreground">{r.outlet?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 text-right tabular">{formatNumber(r.haircuts)}</td>
                <td className="py-2.5 text-right font-semibold tabular" title={formatIDR(r.revenue)}>
                  {formatCompactIDR(r.revenue)}
                </td>
                <td className="py-2.5 text-right text-highlight-foreground tabular" title={formatIDR(r.commission)}>
                  {formatCompactIDR(r.commission)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionCard>
  );
}
