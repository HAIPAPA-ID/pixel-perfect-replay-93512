import { createFileRoute } from "@tanstack/react-router";

import { OwnerDashboard } from "@/components/dashboard/owner-dashboard";
import { dashboardQueryOptions } from "@/lib/data/dashboard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard Owner — HAIPAPA Barber Management System" },
      {
        name: "description",
        content: "Ringkasan pendapatan, performa outlet, capster terbaik dan laba bersih HAIPAPA.",
      },
      { property: "og:title", content: "Dashboard Owner — HAIPAPA Barber Management System" },
      {
        property: "og:description",
        content: "Ringkasan pendapatan, performa outlet, capster terbaik dan laba bersih HAIPAPA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQueryOptions()),
  component: OwnerDashboard,
});
