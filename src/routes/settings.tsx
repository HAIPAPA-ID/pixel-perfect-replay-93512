import { createFileRoute } from "@tanstack/react-router";

import { ModulePlaceholder } from "@/components/layout/module-placeholder";
import { NAV_ITEMS } from "@/components/layout/nav-config";

const TITLE = "Settings — HAIPAPA Barber Management System";
const DESCRIPTION = "Pengaturan bisnis dan aplikasi.";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const item = NAV_ITEMS.find((i) => i.path === "/settings")!;
  return <ModulePlaceholder item={item} description={DESCRIPTION} />;
}
