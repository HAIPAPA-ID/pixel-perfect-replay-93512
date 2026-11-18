/**
 * Active outlet for the signed-in user. The outlet list comes from the database
 * under RLS; the selection is a convenience filter, never a security boundary.
 */
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import {
  ALL_OUTLETS,
  canChooseAllOutlets,
  outletScope,
  resolveOutletSelection,
} from "@/lib/access";
import { accessibleOutletsQueryOptions } from "@/lib/data/outlets";
import type { Outlet } from "@/lib/data/types";
import { useSession } from "@/lib/session";

interface OutletContextValue {
  /** Outlets this account may access (empty while signed out). */
  outlets: Outlet[];
  /** ALL_OUTLETS, one outlet id, or "" when the account has no outlet. */
  selection: string;
  setSelection: (value: string) => void;
  /** Outlet ids covered by the current selection. */
  scope: string[];
  canChooseAll: boolean;
  isLoading: boolean;
  error: unknown;
}

const OutletContext = createContext<OutletContextValue | null>(null);
const storageKey = (userId: string) => `haipapa.outlet.${userId}`;

export function OutletProvider({ children }: { children: ReactNode }) {
  const { user, isPreview, authStatus } = useSession();
  const enabled = authStatus === "signed_in" && !isPreview;
  const query = useQuery({ ...accessibleOutletsQueryOptions(user.id), enabled });
  const outlets = useMemo(() => (enabled ? (query.data ?? []) : []), [enabled, query.data]);
  const ids = useMemo(() => outlets.map((o) => o.id), [outlets]);

  const [stored, setStored] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    setStored(window.localStorage.getItem(storageKey(user.id)));
  }, [enabled, user.id]);

  const selection = resolveOutletSelection(user.role, ids, stored);

  const value = useMemo<OutletContextValue>(
    () => ({
      outlets,
      selection,
      setSelection: (next) => {
        setStored(next);
        window.localStorage.setItem(storageKey(user.id), next);
      },
      scope: outletScope(selection, ids),
      canChooseAll: canChooseAllOutlets(user.role, ids.length),
      isLoading: enabled && query.isLoading,
      error: query.error,
    }),
    [outlets, selection, ids, user.id, user.role, enabled, query.isLoading, query.error],
  );

  return <OutletContext.Provider value={value}>{children}</OutletContext.Provider>;
}

export function useOutlets(): OutletContextValue {
  const ctx = useContext(OutletContext);
  if (!ctx) throw new Error("useOutlets must be used inside OutletProvider");
  return ctx;
}

export { ALL_OUTLETS };
