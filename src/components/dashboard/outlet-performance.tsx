import { MapPin } from "lucide-react";

import type { OutletPerformance as Row } from "@/lib/dashboard/metrics";
import { formatCompactIDR, formatIDR, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { GrowthBadge } from "./growth-badge";
import { SectionCard } from "./section-card";

const BAR = ["bg-primary", "bg-highlight", "bg-crest", "bg-chart-4", "bg-chart-5"];

export function OutletPerformance({ rows, activeCount }: { rows: Row[]; activeCount: number }) {
  const max = Math.max(1, ...rows.map((r) => r.revenue));
  const totalCustomers = rows.reduce((s, r) => s + r.customers, 0);

  return (
    <SectionCard
      title="Performa Outlet"
      description="Pendapatan & pelanggan per outlet, dibanding periode sebelumnya"
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-primary-soft p-3">
          <div className="text-xs text-accent-foreground">Outlet aktif</div>
          <div className="mt-1 text-2xl font-extrabold tabular">{activeCount}</div>
        </div>
        <div className="rounded-xl bg-highlight-soft p-3">
          <div className="text-xs text-highlight-foreground">Total pelanggan</div>
          <div className="mt-1 text-2xl font-extrabold tabular">{formatNumber(totalCustomers)}</div>
        </div>
      </div>

      <ul className="mt-5 space-y-4">
        {rows.map((r, i) => (
          <li key={r.outlet.id}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{r.outlet.name}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="size-3" /> {r.outlet.city} · {formatNumber(r.customers)} pelanggan
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-sm font-bold tabular" title={formatIDR(r.revenue)}>
                  {formatCompactIDR(r.revenue)}
                </div>
                <GrowthBadge value={r.growth} className="mt-1" />
              </div>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className={cn("h-full rounded-full transition-all", BAR[i % BAR.length])}
                  style={{ width: `${(r.revenue / max) * 100}%` }}
                />
              </div>
              <span className="w-12 text-right text-xs text-muted-foreground tabular">
                {formatPercent(r.share * 100)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}
