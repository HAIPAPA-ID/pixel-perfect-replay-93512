import { Store } from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Outlet } from "@/lib/data/types";

export const ALL_OUTLETS = "all";

interface Props {
  outlets: Outlet[];
  value: string;
  onChange: (value: string) => void;
  locked: boolean;
}

export function OutletFilter({ outlets, value, onChange, locked }: Props) {
  if (locked) {
    return (
      <div className="flex h-9 items-center gap-2 rounded-full border bg-card px-3 text-sm">
        <Store className="size-4 text-highlight" />
        <span className="font-medium">{outlets[0]?.name ?? "Tidak ada outlet"}</span>
      </div>
    );
  }
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-9 w-[200px] rounded-full bg-card">
        <Store className="size-4 text-highlight" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_OUTLETS}>Semua outlet</SelectItem>
        {outlets.map((o) => (
          <SelectItem key={o.id} value={o.id}>
            {o.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
