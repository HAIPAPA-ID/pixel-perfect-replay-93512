import { Area, AreaChart, CartesianGrid, XAxis, YAxis, type TooltipProps } from "recharts";

import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Granularity, SeriesPoint } from "@/lib/dashboard/metrics";
import { formatCompactIDR, formatIDR, formatNumber } from "@/lib/format";
import { SectionCard } from "./section-card";

const config = {
  revenue: { label: "Pendapatan", color: "var(--chart-1)" },
} satisfies ChartConfig;

const GRANULARITY_LABEL: Record<Granularity, string> = {
  daily: "Harian",
  weekly: "Mingguan",
  monthly: "Bulanan",
};

function RevenueTooltip({ active, payload }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  const p = payload[0]?.payload as SeriesPoint | undefined;
  if (!p) return null;
  return (
    <div className="rounded-xl border bg-popover px-3 py-2 text-xs shadow-lift">
      <div className="font-semibold">{p.label}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="size-2 rounded-full bg-primary" />
        <span className="tabular font-semibold">{formatIDR(p.revenue)}</span>
      </div>
      <div className="mt-0.5 text-muted-foreground">{formatNumber(p.transactions)} transaksi</div>
    </div>
  );
}

interface Props {
  points: SeriesPoint[];
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
  total: number;
  rangeLabel: string;
}

export function RevenueChart({ points, granularity, onGranularityChange, total, rangeLabel }: Props) {
  return (
    <SectionCard
      title="Grafik Pendapatan"
      description={`${rangeLabel} · Total ${formatIDR(total)}`}
      action={
        <Tabs value={granularity} onValueChange={(v) => onGranularityChange(v as Granularity)}>
          <TabsList className="rounded-full">
            {(Object.keys(GRANULARITY_LABEL) as Granularity[]).map((g) => (
              <TabsTrigger key={g} value={g} className="rounded-full px-3 text-xs">
                {GRANULARITY_LABEL[g]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      }
    >
      <ChartContainer config={config} className="aspect-auto h-[280px] w-full">
        <AreaChart data={points} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-revenue)" stopOpacity={0.32} />
              <stop offset="100%" stopColor="var(--color-revenue)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} strokeDasharray="3 4" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            minTickGap={24}
            fontSize={11}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={68}
            fontSize={11}
            tickFormatter={(v: number) => formatCompactIDR(v)}
          />
          <ChartTooltip cursor={{ strokeDasharray: "3 3" }} content={<RevenueTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="var(--color-revenue)"
            strokeWidth={2.5}
            fill="url(#fillRevenue)"
            activeDot={{ r: 5, strokeWidth: 2, stroke: "var(--background)" }}
            dot={points.length <= 14 ? { r: 3, fill: "var(--color-revenue)" } : false}
          />
        </AreaChart>
      </ChartContainer>
    </SectionCard>
  );
}
