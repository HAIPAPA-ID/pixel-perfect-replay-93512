import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/components/dashboard/owner-dashboard";

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
  // No loader: data needs the browser login session and RLS, so it loads after sign-in.
  component: DashboardPage,
});
