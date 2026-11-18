import { Store } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ALL_OUTLETS } from "@/lib/access";
import { useOutlets } from "@/lib/outlet-context";
import { useSession } from "@/lib/session";

/** Global outlet selector in the header; only lists outlets the database lets this account see. */
export function OutletSwitcher() {
  const { user, isPreview } = useSession();
  const { outlets, selection, setSelection, canChooseAll, isLoading } = useOutlets();
  if (isPreview) return null;

  if (isLoading) {
    return <div className="hidden h-9 w-40 animate-pulse rounded-full bg-muted sm:block" aria-hidden />;
  }

  if (outlets.length === 0) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-full border border-crest/60 bg-crest-soft px-3 text-xs font-medium">
        <Store className="size-4 text-highlight" />
        <span className="hidden sm:inline">Belum ada outlet</span>
      </div>
    );
  }

  if (!canChooseAll && outlets.length === 1) {
    return (
      <div className="flex h-9 max-w-[180px] items-center gap-2 rounded-full border bg-card px-3 text-sm">
        <Store className="size-4 shrink-0 text-highlight" />
        <span className="truncate font-medium">{outlets[0]?.name}</span>
      </div>
    );
  }

  return (
    <Select value={selection} onValueChange={setSelection}>
      <SelectTrigger className="h-9 w-[150px] rounded-full bg-card sm:w-[200px]" aria-label="Pilih outlet">
        <Store className="size-4 shrink-0 text-highlight" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {canChooseAll && (
          <SelectItem value={ALL_OUTLETS}>
            {user.role === "owner" ? "Semua outlet" : "Semua outlet saya"}
          </SelectItem>
        )}
        {outlets.map((o) => (
          <SelectItem key={o.id} value={o.id}>
            {o.name}
            {!o.active && " (nonaktif)"}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
