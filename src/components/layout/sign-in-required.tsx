import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";

/** Shown instead of business data while nobody is signed in. Data is never shown in preview mode. */
export function SignInRequired({ what = "data bisnis" }: { what?: string }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary-soft text-primary">
        <LogIn className="size-6" />
      </div>
      <h1 className="mt-5 text-xl font-bold tracking-tight">Masuk untuk melihat {what}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Angka di halaman ini diambil langsung dari database HAIPAPA dan hanya tampil untuk akun yang
        sudah login, sesuai outlet yang boleh diakses.
      </p>
      <Button asChild className="mt-6">
        <Link to="/auth">Masuk</Link>
      </Button>
    </div>
  );
}
