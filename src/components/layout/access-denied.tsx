import { Link } from "@tanstack/react-router";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ROLE_HOME, ROLE_LABEL, type Role } from "@/lib/access";

export function AccessDenied({ role }: { role: Role }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-highlight-soft text-highlight">
        <Lock className="size-6" />
      </div>
      <h1 className="mt-5 text-xl font-bold tracking-tight">Akses dibatasi</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Peran {ROLE_LABEL[role]} tidak memiliki akses ke halaman ini.
      </p>
      <Button asChild className="mt-6">
        <Link to={ROLE_HOME[role]}>Kembali ke halaman utama</Link>
      </Button>
    </div>
  );
}
