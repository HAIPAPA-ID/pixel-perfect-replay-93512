/**
 * Outlets the signed-in account may access. RLS on `outlets` (can_access_outlet)
 * already limits rows to the owner's full list or a staff member's assigned outlets.
 */
import { queryOptions } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import type { Outlet } from "./types";

async function fetchAccessibleOutlets(): Promise<Outlet[]> {
  const { data, error } = await supabase
    .from("outlets")
    .select("id, name, address, is_active")
    .order("name");
  if (error) throw error;
  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    city: row.address ?? "",
    active: row.is_active,
  }));
}

export const accessibleOutletsQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["outlets", "accessible", userId],
    queryFn: fetchAccessibleOutlets,
    staleTime: 5 * 60_000,
  });
