import { Link, useRouterState } from "@tanstack/react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { canAccessPath, ROLE_LABEL } from "@/lib/access";
import { useSession } from "@/lib/session";
import { BrandMark } from "./brand-mark";
import { NAV_GROUP_LABEL, NAV_ITEMS, type NavItem } from "./nav-config";

const GROUPS = Object.keys(NAV_GROUP_LABEL) as NavItem["group"][];

export function AppSidebar() {
  const { user, isPreview } = useSession();
  const { setOpenMobile, isMobile } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <BrandMark />
          <div className="min-w-0 leading-tight group-data-[collapsible=icon]:hidden">
            <div className="text-[15px] font-extrabold tracking-tight">HAIPAPA</div>
            <div className="truncate text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Barber Management
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-1">
        {GROUPS.map((group) => {
          const items = NAV_ITEMS.filter((i) => i.group === group && canAccessPath(user.role, i.path));
          if (!items.length) return null;
          return (
            <SidebarGroup key={group}>
              <SidebarGroupLabel className="text-[10.5px] uppercase tracking-[0.14em]">
                {NAV_GROUP_LABEL[group]}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.path}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        tooltip={item.title}
                        className="h-9 rounded-lg font-medium data-[active=true]:font-semibold"
                      >
                        <Link to={item.path} onClick={() => isMobile && setOpenMobile(false)}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="p-3 group-data-[collapsible=icon]:hidden">
        <div className="rounded-xl border bg-card p-3 text-xs">
          <div className="font-semibold">{user.name}</div>
          <div className="mt-0.5 text-muted-foreground">Peran: {ROLE_LABEL[user.role]}</div>
          {isPreview && (
            <div className="mt-1.5 font-medium text-highlight">Mode pratinjau — belum login</div>
          )}
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
