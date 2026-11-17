import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { canAccessPath } from "@/lib/access";
import { useSession } from "@/lib/session";
import { AccessDenied } from "./access-denied";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { NAV_ITEMS } from "./nav-config";

/** Pages rendered without the sidebar/header shell. */
const BARE_PATHS = ["/auth"];

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useSession();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (BARE_PATHS.includes(pathname)) return <>{children}</>;

  const isAppPage = NAV_ITEMS.some((i) =>
    i.path === "/" ? pathname === "/" : pathname.startsWith(i.path),
  );
  const allowed = !isAppPage || canAccessPath(user.role, pathname);

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full bg-background">
        <AppSidebar />
        <SidebarInset className="min-w-0 bg-surface">
          <AppHeader />
          <div className="flex-1">{allowed ? children : <AccessDenied role={user.role} />}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
