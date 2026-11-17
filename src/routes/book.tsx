import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Clock3, MapPin, Scissors } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Option = { id: string; name: string; outlet_id?: string; description?: string };
type BookingOptions = { outlets: Option[]; services: Option[]; barbers: Option[] };

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Booking Online — HAIPAPA Men’s Hair Studio" },
      { name: "description", content: "Booking haircut dan treatment HAIPAPA Men’s Hair Studio." },
    ],
  }),
  component: PublicBookingPage,
});

function PublicBookingPage() {
  const [options, setOptions] = useState<BookingOptions>({ outlets: [], services: [], barbers: [] });
  const [outletId, setOutletId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [barberId, setBarberId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [bookingCode, setBookingCode] = useState("");

  const barbers = useMemo(
    () => options.barbers.filter((b) => b.outlet_id === outletId),
    [options.barbers, outletId],
  );
  const minDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error: rpcError } = await (supabase as any).rpc("get_public_booking_options");
      if (!active) return;
      if (rpcError) setError("Belum dapat memuat pilihan booking. Silakan coba lagi.");
      else {
        const result = data as BookingOptions;
        setOptions(result);
        if (result.outlets.length) setOutletId(result.outlets[0].id);
        if (result.services.length) setServiceId(result.services[0].id);
      }
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const { data, error: rpcError } = await (supabase as any).rpc("submit_public_booking", {
      p_outlet_id: outletId,
      p_customer_name: name.trim(),
      p_customer_phone: phone.replace(/\\D/g, ""),
      p_service_id: serviceId,
      p_barber_id: barberId || null,
      p_booking_date: date,
      p_start_time: time,
      p_customer_notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (rpcError) {
      setError(rpcError.message?.includes("Jadwal capster")
        ? rpcError.message
        : rpcError.message || "Booking belum berhasil. Silakan coba lagi.");
      return;
    }
    setBookingCode(data.booking_code);
  }

  if (bookingCode) return (
    <main className="min-h-svh bg-[#11110f] px-4 py-12 text-white">
      <section className="mx-auto max-w-lg rounded-2xl border border-white/10 bg-[#1c1c19] p-8 text-center shadow-2xl">
        <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-emerald-400" />
        <p className="text-xs font-semibold uppercase tracking-[.28em] text-amber-400">HAIPAPA Booking</p>
        <h1 className="mt-3 text-2xl font-bold">Booking berhasil dikirim</h1>
        <p className="mt-2 text-sm text-white/60">Simpan kode booking ini. Tim HAIPAPA akan mengonfirmasi jadwal Anda.</p>
        <div className="my-6 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4">
          <p className="text-xs text-white/60">Kode booking</p>
          <p className="mt-1 text-2xl font-bold tracking-wider text-amber-300">{bookingCode}</p>
          <p className="mt-2 text-xs text-amber-100/70">Status: Menunggu konfirmasi</p>
        </div>
        <button onClick={() => window.location.reload()} className="w-full rounded-lg bg-amber-400 px-4 py-3 font-semibold text-black hover:bg-amber-300">Buat booking lain</button>
      </section>
    </main>
  );

  return (
    <main className="min-h-svh bg-[#11110f] px-4 py-8 text-white sm:py-12">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/40 bg-amber-400/10">
            <Scissors className="h-7 w-7 text-amber-300" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-[.3em] text-amber-400">Men’s Hair Studio</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">BOOK YOUR STYLE</h1>
          <p className="mt-2 text-sm text-white/55">Pilih jadwal kunjungan Anda di HAIPAPA</p>
        </header>

        <form onSubmit={submit} className="space-y-6 rounded-2xl border border-white/10 bg-[#1c1c19] p-5 shadow-2xl sm:p-8">
          {loading ? <p className="py-8 text-center text-white/60">Memuat pilihan booking...</p> : (
            <>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Pilih outlet" icon={<MapPin className="h-4 w-4" />}>
                  <select required value={outletId} onChange={(e) => { setOutletId(e.target.value); setBarberId(""); }} className={inputClass}>
                    {options.outlets.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                </Field>
                <Field label="Treatment" icon={<Scissors className="h-4 w-4" />}>
                  <select required value={serviceId} onChange={(e) => setServiceId(e.target.value)} className={inputClass}>
                    {options.services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Pilih capster">
                <select value={barberId} onChange={(e) => setBarberId(e.target.value)} className={inputClass}>
                  <option value="">Capster mana saja</option>
                  {barbers.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Tanggal booking" icon={<CalendarDays className="h-4 w-4" />}>
                  <input required type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
                </Field>
                <Field label="Jam kedatangan" icon={<Clock3 className="h-4 w-4" />}>
                  <input required type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputClass} />
                </Field>
              </div>
              <div className="border-t border-white/10 pt-5">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-amber-300">Data pelanggan</h2>
                <div className="space-y-4">
                  <Field label="Nama lengkap">
                    <input required minLength={2} maxLength={100} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" className={inputClass} />
                  </Field>
                  <Field label="Nomor WhatsApp">
                    <input required type="tel" minLength={10} maxLength={18} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className={inputClass} />
                  </Field>
                  <Field label="Catatan (opsional)">
                    <textarea maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: ingin model low taper..." rows={3} className={inputClass} />
                  </Field>
                </div>
              </div>
              {error && <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">{error}</p>}
              <button disabled={submitting || !options.outlets.length || !options.services.length} className="w-full rounded-lg bg-amber-400 px-5 py-3.5 font-bold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50">
                {submitting ? "Mengirim booking..." : "Kirim Booking"}
              </button>
              <p className="text-center text-xs leading-relaxed text-white/40">Booking Anda berstatus menunggu konfirmasi. Tim HAIPAPA akan menghubungi Anda melalui WhatsApp.</p>
            </>
          )}
        </form>
        <p className="mt-6 text-center text-xs tracking-wider text-white/35">© HAIPAPA MEN’S HAIR STUDIO</p>
      </div>
    </main>
  );
}

const inputClass = "mt-2 w-full rounded-lg border border-white/10 bg-[#11110f] px-3 py-3 text-sm text-white outline-none transition focus:border-amber-400";
function Field({ label, icon, children }: { label: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-white/80"><span className="flex items-center gap-2">{icon}{label}</span>{children}</label>;
}
