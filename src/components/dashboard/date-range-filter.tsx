import { CalendarDays } from "lucide-react";
import { useState } from "react";
import type { DateRange as PickerRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DateRange } from "@/lib/dashboard/metrics";
import {
  addDays,
  formatShortDay,
  keyToLocalDate,
  localDateToKey,
  monthStartKey,
  type DayKey,
} from "@/lib/dates";

export type RangePreset = "7d" | "30d" | "90d" | "mtd" | "12m" | "custom";

export const PRESET_LABEL: Record<RangePreset, string> = {
  "7d": "7 hari terakhir",
  "30d": "30 hari terakhir",
  "90d": "90 hari terakhir",
  mtd: "Bulan ini",
  "12m": "12 bulan terakhir",
  custom: "Rentang khusus",
};

export function rangeForPreset(preset: Exclude<RangePreset, "custom">, today: DayKey): DateRange {
  switch (preset) {
    case "7d":
      return { from: addDays(today, -6), to: today };
    case "30d":
      return { from: addDays(today, -29), to: today };
    case "90d":
      return { from: addDays(today, -89), to: today };
    case "mtd":
      return { from: monthStartKey(today), to: today };
    case "12m":
      return { from: addDays(today, -364), to: today };
  }
}

interface Props {
  preset: RangePreset;
  range: DateRange;
  today: DayKey;
  onChange: (preset: RangePreset, range: DateRange) => void;
}

export function DateRangeFilter({ preset, range, today, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<PickerRange | undefined>();
  const earliest = addDays(today, -364);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select
        value={preset}
        onValueChange={(v) => {
          const p = v as RangePreset;
          if (p === "custom") {
            setDraft({ from: keyToLocalDate(range.from), to: keyToLocalDate(range.to) });
            setOpen(true);
            return;
          }
          onChange(p, rangeForPreset(p, today));
        }}
      >
        <SelectTrigger className="h-9 w-[170px] rounded-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(PRESET_LABEL) as RangePreset[]).map((p) => (
            <SelectItem key={p} value={p}>
              {PRESET_LABEL[p]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover
        open={open}
        onOpenChange={(o) => {
          setOpen(o);
          if (o) setDraft({ from: keyToLocalDate(range.from), to: keyToLocalDate(range.to) });
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-9 gap-2 rounded-full bg-card tabular">
            <CalendarDays className="size-4 text-primary" />
            {formatShortDay(range.from)} – {formatShortDay(range.to)}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={1}
            selected={draft}
            onSelect={setDraft}
            defaultMonth={draft?.to ?? keyToLocalDate(range.to)}
            disabled={{ before: keyToLocalDate(earliest), after: keyToLocalDate(today) }}
          />
          <div className="flex justify-end gap-2 border-t p-3">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button
              size="sm"
              disabled={!draft?.from}
              onClick={() => {
                if (!draft?.from) return;
                const from = localDateToKey(draft.from);
                const to = localDateToKey(draft.to ?? draft.from);
                onChange("custom", { from, to });
                setOpen(false);
              }}
            >
              Terapkan
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
