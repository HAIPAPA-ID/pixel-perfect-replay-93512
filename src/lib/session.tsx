/**
 * Current-user session.
 * - Real sign-in: Supabase Auth session + row from the existing `profiles` table.
 * - Fallback: clearly-labelled preview users (role switcher) while nobody is signed in,
 *   kept for development until real login is fully tested.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { supabase } from "@/integrations/supabase/client";
import type { Role, SessionUser } from "@/lib/access";
import { checkProfile, signInErrorMessage, type ProfileCheck } from "@/lib/auth-profile";

export const PREVIEW_USERS: Record<Role, SessionUser> = {
  owner: { id: "preview-owner", name: "Owner (contoh)", role: "owner", outletId: null },
  manager: { id: "preview-manager", name: "Manager (contoh)", role: "manager", outletId: "out-1" },
  cashier: { id: "preview-cashier", name: "Kasir (contoh)", role: "cashier", outletId: "out-2" },
};

export type AuthStatus = "loading" | "signed_in" | "signed_out";

export type SignInResult = { ok: true; user: SessionUser } | { ok: false; error: string };

interface SessionValue {
  /** Signed-in user when available, otherwise the selected preview user. */
  user: SessionUser;
  isPreview: boolean;
  authStatus: AuthStatus;
  email: string | null;
  /** Last reason a signed-in account was refused (inactive, unknown role, …). */
  authError: string | null;
  setPreviewRole: (role: Role) => void;
  signIn: (email: string, password: string) => Promise<SignInResult>;
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);
const STORAGE_KEY = "haipapa.previewRole";

async function loadSessionUser(userId: string): Promise<{ check: ProfileCheck; user?: SessionUser }> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, is_active")
    .eq("id", userId)
    .maybeSingle();
  if (error) {
    return { check: { ok: false, reason: "Profil tidak dapat dimuat. Silakan coba lagi." } };
  }
  const check = checkProfile(data);
  if (!check.ok) return { check };

  let outletId: string | null = null;
  if (check.role !== "owner") {
    const { data: links } = await supabase
      .from("user_outlets")
      .select("outlet_id")
      .eq("user_id", userId)
      .limit(1);
    outletId = links?.[0]?.outlet_id ?? null;
  }
  return { check, user: { id: userId, name: check.name, role: check.role, outletId } };
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [previewRole, setPreviewRoleState] = useState<Role>("owner");
  const [authUser, setAuthUser] = useState<SessionUser | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<AuthStatus>("loading");
  const [authError, setAuthError] = useState<string | null>(null);
  const loadedFor = useRef<string | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "owner" || saved === "manager" || saved === "cashier") setPreviewRoleState(saved);
  }, []);

  const applySession = useCallback(async (userId: string | null, userEmail: string | null) => {
    if (!userId) {
      loadedFor.current = null;
      setAuthUser(null);
      setEmail(null);
      setAuthStatus("signed_out");
      return;
    }
    if (loadedFor.current === userId) return;
    loadedFor.current = userId;
    const { check, user } = await loadSessionUser(userId);
    if (!check.ok || !user) {
      loadedFor.current = null;
      setAuthError(check.ok ? "Profil tidak dapat dimuat." : check.reason);
      setAuthUser(null);
      setEmail(null);
      setAuthStatus("signed_out");
      await supabase.auth.signOut();
      return;
    }
    setAuthError(null);
    setAuthUser(user);
    setEmail(userEmail);
    setAuthStatus("signed_in");
  }, []);

  // Single auth listener for the app. Supabase calls are deferred out of the callback.
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "TOKEN_REFRESHED") return;
      setTimeout(() => {
        void applySession(session?.user.id ?? null, session?.user.email ?? null);
      }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, [applySession]);

  const signIn = useCallback(async (emailInput: string, password: string): Promise<SignInResult> => {
    setAuthError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email: emailInput, password });
    if (error || !data.user) return { ok: false, error: signInErrorMessage(error?.message) };

    loadedFor.current = data.user.id;
    const { check, user } = await loadSessionUser(data.user.id);
    if (!check.ok || !user) {
      loadedFor.current = null;
      await supabase.auth.signOut();
      return { ok: false, error: check.ok ? "Profil tidak dapat dimuat." : check.reason };
    }
    setAuthUser(user);
    setEmail(data.user.email ?? null);
    setAuthStatus("signed_in");
    return { ok: true, user };
  }, []);

  const signOut = useCallback(async () => {
    loadedFor.current = null;
    await supabase.auth.signOut();
    setAuthUser(null);
    setEmail(null);
    setAuthStatus("signed_out");
  }, []);

  const value = useMemo<SessionValue>(
    () => ({
      user: authUser ?? PREVIEW_USERS[previewRole],
      isPreview: !authUser,
      authStatus,
      email,
      authError,
      setPreviewRole: (next) => {
        setPreviewRoleState(next);
        window.localStorage.setItem(STORAGE_KEY, next);
      },
      signIn,
      signOut,
    }),
    [authUser, previewRole, authStatus, email, authError, signIn, signOut],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}
