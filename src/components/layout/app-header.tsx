import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, Eye } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ROLE_HOME, ROLE_LABEL, type Role } from "@/lib/access";
import { useSession } from "@/lib/session";
import { navItemFor } from "./nav-config";

const ROLE_HINT: Record<Role, string> = {
  owner: "Semua outlet & laporan",
  manager: "Hanya outlet yang ditugaskan",
  cashier: "Outlet ditugaskan, fungsi kasir",
};

export function AppHeader() {
  const { user, isPreview, setPreviewRole } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const current = navItemFor(pathname);
  const initials = ROLE_LABEL[user.role].slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-2 border-b bg-background/85 px-3 backdrop-blur-md sm:px-5">
      <SidebarTrigger className="-ml-1" />
      <div className="mx-1 h-5 w-px bg-border" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{current?.title ?? "HAIPAPA"}</div>
        <div className="hidden truncate text-xs text-muted-foreground sm:block">
          HAIPAPA Barber Management System
        </div>
      </div>

      {isPreview && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
              <Eye className="size-3.5 text-highlight" />
              <span className="hidden sm:inline">Lihat sebagai:</span>
              <span className="font-semibold">{ROLE_LABEL[user.role]}</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
              Pratinjau peran — sebelum login asli terhubung
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {(Object.keys(ROLE_LABEL) as Role[]).map((role) => (
              <DropdownMenuItem
                key={role}
                onSelect={() => {
                  setPreviewRole(role);
                  navigate({ to: ROLE_HOME[role] });
                }}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="font-medium">
                  {ROLE_LABEL[role]}
                  {role === user.role && " ✓"}
                </span>
                <span className="text-xs text-muted-foreground">{ROLE_HINT[role]}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <Button variant="ghost" size="icon" className="rounded-full" aria-label="Notifikasi">
        <Bell className="size-[18px]" />
      </Button>
      <Avatar className="size-8">
        <AvatarFallback className="bg-primary-soft text-xs font-bold text-accent-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
