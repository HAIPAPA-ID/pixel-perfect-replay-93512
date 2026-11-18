import { AlertTriangle, Loader2, Store } from "lucide-react";

import { Button } from "@/components/ui/button";
import { dataErrorMessage } from "@/lib/data/errors";

export function PageLoading({ label = "Memuat data…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 px-6 py-24 text-sm text-muted-foreground" role="status">
      <Loader2 className="size-4 animate-spin" />
      {label}
    </div>
  );
}

export function DataError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center" role="alert">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-6" />
      </div>
      <h1 className="mt-5 text-xl font-bold tracking-tight">Data belum dapat ditampilkan</h1>
      <p className="mt-2 text-sm text-muted-foreground">{dataErrorMessage(error)}</p>
      {onRetry && (
        <Button className="mt-6" variant="outline" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function NoOutletAssigned() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-crest-soft text-highlight">
        <Store className="size-6" />
      </div>
      <h1 className="mt-5 text-xl font-bold tracking-tight">Akun belum ditugaskan ke outlet</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Minta Owner menambahkan akun Anda ke outlet yang sesuai agar data dapat ditampilkan.
      </p>
    </div>
  );
}
