import { Hammer } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { NavItem } from "./nav-config";

export function ModulePlaceholder({ item, description }: { item: NavItem; description: string }) {
  const Icon = item.icon;
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{item.title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Card className="mt-6 flex flex-col items-center px-6 py-16 text-center">
        <Hammer className="size-8 text-highlight" />
        <Badge variant="crest" className="mt-4">Tahap berikutnya</Badge>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Modul ini belum dibangun. Tahap pertama berfokus pada Dashboard Owner.
        </p>
      </Card>
    </div>
  );
}
