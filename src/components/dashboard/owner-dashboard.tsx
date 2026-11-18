import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarRange, Receipt, Sun, Users } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { DataError, NoOutletAssigned, PageLoading } from "@/components/layout/data-state";
import { SignInRequired } from "@/components/layout/sign-in-required";
import { ALL_OUTLETS, canViewAllOutlets } from "@/lib/access";
import { dashboardQueryOptions } from "@/lib/data/dashboard";
import type { DashboardDataset } from "@/lib/data/types";
import { useOutlets } from "@/lib/outlet-context";
import {
  buildBarberRanking,
  buildFinancials,
  buildOutletPerformance,
  buildOverview,
  buildRevenueSeries,
  sumTotals,
  type DateRange,
  type Granularity,
} from "@/lib/dashboard/metrics";
import { formatLongDay, formatShortDay } from "@/lib/dates";
import { formatCompactIDR, formatIDR, formatNumber } from "@/lib/format";
import { useSession } from "@/lib/session";
import { DateRangeFilter, PRESET_LABEL, rangeForPreset, type RangePreset } from "./date-range-filter";
import { FinancialOverview } from "./financial-overview";
import { MockDataNotice } from "./mock-data-notice";
import { OutletPerformance } from "./outlet-performance";
import { RevenueChart } from "./revenue-chart";
import { StatCard } from "./stat-card";
import { TopBarbers } from "./top-barbers";

/** Dashboard entry: business data only loads for a real signed-in account. */
export function DashboardPage() {
  const { authStatus, isPreview } = useSession();
  if (authStatus === "loading") return <PageLoading label="Memeriksa sesi login…" />;
  if (isPreview) return <SignInRequired what="dashboard" />;
  return <LiveDashboard />;
}

function LiveDashboard() {
  const { user } = useSession();
  const outlets = useOutlets();
  const query = useQuery(dashboardQueryOptions(user.id));

  if (outlets.isLoading || query.isLoading) return <PageLoading />;
  if (outlets.error) return <DataError error={outlets.error} />;
  if (query.error || !query.data) return <DataError error={query.error} onRetry={() => void query.refetch()} />;
  if (outlets.outlets.length === 0) return <NoOutletAssigned />;
  return <OwnerDashboard data={query.data} />;
}

function OwnerDashboard({ data }: { data: DashboardDataset }) {
  const { user } = useSession();
  const { scope, selection, outlets: accessible } = useOutlets();

  const [preset, setPreset] = useState<RangePreset>("30d");
  const [range, setRange] = useState<DateRange>(() => rangeForPreset("30d", data.today));
  const [granularity, setGranularity] = useState<Granularity>("daily");

  const isOwner = canViewAllOutlets(user.role);
  const scopedOutlets = data.outlets.filter((o) => scope.includes(o.id));
  const scopeLabel =
    selection === ALL_OUTLETS
      ? `${isOwner ? "Semua outlet" : "Semua outlet saya"} · ${accessible.length} outlet`
      : (accessible.find((o) => o.id === selection)?.name ?? "");

  const rangeLabel =
    preset === "custom"
      ? `${formatShortDay(range.from)} – ${formatShortDay(range.to)}`
      : PRESET_LABEL[preset];

  const view = useMemo(() => {
    const totals = sumTotals(data.daily, range, scope);
    const barbers = buildBarberRanking(data.daily, range, data.barbers, data.outlets, scope, data.commissionRate, data.barberDaily);
    const commissions = barbers.reduce((s, b) => s + b.commission, 0);
    return {
      overview: buildOverview(data.daily, data.today, scope),
      series: buildRevenueSeries(data.daily, range, scope, granularity),
      totals,
      outlets: buildOutletPerformance(data.daily, range, scopedOutlets),
      barbers,
      financials: buildFinancials(totals.revenue, totals.expenses, commissions),
    };
    // scope is derived from stable inputs below
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, range, granularity, scope.join(",")]);

  const { overview } = view;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
              {isOwner ? "Dashboard Owner" : "Dashboard Outlet"}
            </h1>
            {data.source === "mock" && <Badge variant="mock">Data contoh</Badge>}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatLongDay(data.today)}
            {scopeLabel && ` · ${scopeLabel}`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DateRangeFilter
            preset={preset}
            range={range}
            today={data.today}
            onChange={(p, r) => {
              setPreset(p);
              setRange(r);
              if (p === "12m") setGranularity("monthly");
              else if (p === "90d" && granularity === "daily") setGranularity("weekly");
              else if (p === "7d") setGranularity("daily");
            }}
          />
        </div>
      </div>

      {data.source === "mock" && <MockDataNotice />}

      <section aria-label="Ringkasan pendapatan" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          featured
          label="Pendapatan hari ini"
          value={formatIDR(overview.today.value)}
          growth={overview.today.growth}
          comparison="vs kemarin"
          icon={Sun}
        />
        <StatCard
          label="Pendapatan minggu ini"
          value={formatCompactIDR(overview.week.value)}
          growth={overview.week.growth}
          comparison="vs minggu lalu"
          icon={CalendarDays}
          tone="primary"
        />
        <StatCard
          label="Pendapatan bulan ini"
          value={formatCompactIDR(overview.month.value)}
          growth={overview.month.growth}
          comparison="vs bulan lalu"
          icon={CalendarRange}
          tone="highlight"
        />
        <StatCard
          label="Transaksi bulan ini"
          value={formatNumber(overview.transactions.value)}
          growth={overview.transactions.growth}
          comparison="vs bulan lalu"
          icon={Receipt}
          tone="crest"
        />
        <StatCard
          label="Pelanggan bulan ini"
          value={formatNumber(overview.customers.value)}
          growth={overview.customers.growth}
          comparison="vs bulan lalu"
          icon={Users}
          tone="neutral"
        />
      </section>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart
            points={view.series}
            granularity={granularity}
            onGranularityChange={setGranularity}
            total={view.totals.revenue}
            rangeLabel={rangeLabel}
          />
        </div>
        <FinancialOverview data={view.financials} rangeLabel={rangeLabel} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <OutletPerformance rows={view.outlets} activeCount={scopedOutlets.filter((o) => o.active).length} />
        </div>
        <div className="xl:col-span-3">
          <TopBarbers rows={view.barbers} commissionRate={data.commissionRate} />
        </div>
      </div>
    </div>
  );
}
