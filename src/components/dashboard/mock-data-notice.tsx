import { FlaskConical } from "lucide-react";

export function MockDataNotice() {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-xl border border-crest/60 mock-stripes px-4 py-3 text-sm text-crest-foreground"
    >
      <FlaskConical className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="font-semibold">Data contoh sementara.</span> Semua angka di halaman ini
        dibuat otomatis untuk visualisasi dan <span className="font-semibold">bukan</span> data
        bisnis asli. Angka akan tampil otomatis setelah database terhubung.
      </p>
    </div>
  );
}
