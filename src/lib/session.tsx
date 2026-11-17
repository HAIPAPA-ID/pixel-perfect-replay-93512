/**
 * Current-user session. Until real sign-in is connected this uses
 * clearly-labelled preview users so each role's view can be checked.
 */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import type { Role, SessionUser } from "@/lib/access";

export const PREVIEW_USERS: Record<Role, SessionUser> = {
  owner: { id: "preview-owner", name: "Owner (contoh)", role: "owner", outletId: null },
  manager: { id: "preview-manager", name: "Manager (contoh)", role: "manager", outletId: "out-1" },
  cashier: { id: "preview-cashier", name: "Kasir (contoh)", role: "cashier", outletId: "out-2" },
};

interface SessionValue {
  user: SessionUser;
  isPreview: boolean;
  setPreviewRole: (role: Role) => void;
}

const SessionContext = createContext<SessionValue | null>(null);
const STORAGE_KEY = "haipapa.previewRole";

export function SessionProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("owner");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "owner" || saved === "manager" || saved === "cashier") setRole(saved);
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      user: PREVIEW_USERS[role],
      isPreview: true,
      setPreviewRole: (next) => {
        setRole(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
    }),
    [role],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
