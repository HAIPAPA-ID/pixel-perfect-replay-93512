import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Eye, EyeOff, Loader2, Scissors } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { BrandMark } from "@/components/layout/brand-mark";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROLE_HOME } from "@/lib/access";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Masuk — HAIPAPA Barber Management System" },
      { name: "description", content: "Masuk ke HAIPAPA Barber Management System dengan akun HAIPAPA POS Anda." },
      { property: "og:title", content: "Masuk — HAIPAPA Barber Management System" },
      { property: "og:description", content: "Masuk ke HAIPAPA Barber Management System dengan akun HAIPAPA POS Anda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn, authStatus, authError, user, isPreview } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Already signed in (e.g. returning visitor): go to the role's home page.
  useEffect(() => {
    if (authStatus === "signed_in" && !isPreview && !submitting) {
      navigate({ to: ROLE_HOME[user.role], replace: true });
    }
  }, [authStatus, isPreview, submitting, user.role, navigate]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError("Isi email dan kata sandi.");
      return;
    }
    setSubmitting(true);
    setError(null);
    const result = await signIn(email.trim(), password);
    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }
    navigate({ to: ROLE_HOME[result.user.role], replace: true });
  }

  const shownError = error ?? authError;

  return (
    <div className="grid min-h-svh bg-background lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <BrandMark className="size-11" />
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight">HAIPAPA</div>
            <div className="text-[11px] font-medium uppercase tracking-[0.16em] opacity-80">
              Barber Management
            </div>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight">
            Semua outlet, satu layar.
          </h2>
          <p className="mt-4 text-base opacity-85">
            Pantau pendapatan, capster, dan operasional barbershop HAIPAPA dari mana saja.
          </p>
          <div className="mt-8 flex gap-2">
            <span className="h-1.5 w-10 rounded-full bg-highlight" />
            <span className="h-1.5 w-6 rounded-full bg-crest" />
            <span className="h-1.5 w-3 rounded-full bg-primary-foreground/50" />
          </div>
        </div>
        <Scissors
          aria-hidden
          className="pointer-events-none absolute -right-16 -bottom-16 size-80 rotate-[-18deg] opacity-10"
          strokeWidth={1.2}
        />
        <p className="text-xs opacity-70">Gunakan akun yang sama dengan HAIPAPA POS.</p>
      </aside>

      <main className="flex items-center justify-center px-5 py-10 sm:px-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <BrandMark />
            <div className="leading-tight">
              <div className="text-[15px] font-extrabold tracking-tight">HAIPAPA</div>
              <div className="text-[10.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Barber Management
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight">Masuk</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Masukkan email dan kata sandi akun HAIPAPA Anda.
          </p>

          <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
            {shownError && (
              <Alert variant="destructive">
                <AlertCircle className="size-4" />
                <AlertDescription>{shownError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="nama@haipapa.id"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitting}
                className="h-11"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Kata sandi</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={submitting}
                  className="h-11 pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="h-11 w-full text-sm font-semibold" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? "Memeriksa akun…" : "Masuk"}
            </Button>
          </form>

          <div className="mt-8 rounded-xl border border-dashed bg-surface p-3.5 text-xs text-muted-foreground">
            Mode pengembangan:{" "}
            <Link to="/" className="font-semibold text-primary underline-offset-2 hover:underline">
              lanjut dengan pratinjau peran
            </Link>{" "}
            tanpa login (data contoh).
          </div>
        </div>
      </main>
    </div>
  );
}
