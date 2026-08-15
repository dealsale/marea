"use client";

import { useEffect, useMemo, useState } from "react";
import { Logo } from "../Logo";
import { formatPrice } from "@/lib/format";
import { whatsappUrl } from "@/lib/format";

type Booking = {
  id: string;
  name: string;
  email: string;
  phone: string;
  language: string;
  date: string;
  timeSlot: string;
  people: number;
  notes: string;
  status: string;
  createdAt: string;
  tour: { titleEs: string; titleEn: string; price: number; currency: string };
};

type Tour = {
  id: string;
  slug: string;
  titleEs: string;
  titleEn: string;
  price: number;
  currency: string;
  durationMin: number;
  maxPeople: number;
  category: string;
  image: string;
  featured: boolean;
  active: boolean;
  order: number;
  _count: { bookings: number };
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};

export function AdminDashboard() {
  const [tab, setTab] = useState<"bookings" | "tours">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [b, t] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/tours").then((r) => r.json()),
    ]);
    setBookings(b.bookings || []);
    setTours(t.tours || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function setStatus(id: string, status: string) {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  async function deleteBooking(id: string) {
    if (!confirm("¿Eliminar esta reserva?")) return;
    setBookings((bs) => bs.filter((b) => b.id !== id));
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/";
  }

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    const revenue = confirmed.reduce((sum, b) => sum + b.tour.price * b.people, 0);
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: confirmed.length,
      people: confirmed.reduce((s, b) => s + b.people, 0),
      revenue,
    };
  }, [bookings]);

  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen bg-marea-950">
      <header className="sticky top-0 z-20 border-b border-marea-400/15 bg-marea-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-marea-300 hover:text-white">
              Ver sitio ↗
            </a>
            <button
              onClick={logout}
              className="rounded-full border border-marea-400/30 px-4 py-1.5 text-sm text-marea-100 hover:bg-marea-800/50"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="font-display text-3xl font-bold text-white">Panel de administración</h1>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {[
            { l: "Reservas", v: stats.total, c: "text-white" },
            { l: "Pendientes", v: stats.pending, c: "text-amber-300" },
            { l: "Confirmadas", v: stats.confirmed, c: "text-green-300" },
            { l: "Personas", v: stats.people, c: "text-marea-200" },
            { l: "Ingresos est.", v: formatPrice(stats.revenue, "COP", "es"), c: "text-gradient" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
              <div className="text-xs text-marea-400">{s.l}</div>
              <div className={`mt-1 font-display text-2xl font-bold ${s.c}`}>{s.v}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8 flex gap-2 border-b border-marea-400/15">
          {[
            { k: "bookings", l: "Reservas" },
            { k: "tours", l: "Tours" },
          ].map((x) => (
            <button
              key={x.k}
              onClick={() => setTab(x.k as "bookings" | "tours")}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
                tab === x.k ? "border-marea-400 text-white" : "border-transparent text-marea-400 hover:text-marea-200"
              }`}
            >
              {x.l}
            </button>
          ))}
          <button onClick={load} className="ml-auto px-3 py-2 text-sm text-marea-400 hover:text-white">
            ⟳ Actualizar
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-marea-400">Cargando...</div>
        ) : tab === "bookings" ? (
          <BookingsTab
            bookings={shown}
            filter={filter}
            setFilter={setFilter}
            setStatus={setStatus}
            deleteBooking={deleteBooking}
          />
        ) : (
          <ToursTab tours={tours} reload={load} />
        )}
      </main>
    </div>
  );
}

function BookingsTab({
  bookings,
  filter,
  setFilter,
  setStatus,
  deleteBooking,
}: {
  bookings: Booking[];
  filter: string;
  setFilter: (f: string) => void;
  setStatus: (id: string, s: string) => void;
  deleteBooking: (id: string) => void;
}) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm capitalize ${
              filter === f ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300 hover:text-white"
            }`}
          >
            {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : f === "confirmed" ? "Confirmadas" : "Canceladas"}
          </button>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-marea-400/20 py-16 text-center text-marea-400">
          No hay reservas en esta categoría.
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{b.name}</span>
                    <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusStyles[b.status]}`}>
                      {b.status}
                    </span>
                    <span className="rounded-full bg-marea-800 px-2 py-0.5 text-xs uppercase text-marea-200">
                      {b.language}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-marea-300">{b.tour.titleEs}</div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-marea-400">
                    <span>📅 {b.date} · {b.timeSlot}</span>
                    <span>👥 {b.people}</span>
                    <span>💵 {b.tour.price === 0 ? "Gratis" : formatPrice(b.tour.price * b.people, b.tour.currency, "es")}</span>
                    <span>✉️ {b.email}</span>
                    <span>📞 {b.phone}</span>
                    <span className="text-marea-500">#{b.id.slice(-6).toUpperCase()}</span>
                  </div>
                  {b.notes && <div className="mt-2 rounded-lg bg-marea-950/60 px-3 py-2 text-xs text-marea-300">📝 {b.notes}</div>}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={whatsappUrl(b.phone, `Hola ${b.name}, te escribimos de Marea Tours sobre tu reserva del ${b.date}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-300 hover:bg-green-500/30"
                  >
                    WhatsApp
                  </a>
                  {b.status !== "confirmed" && (
                    <button
                      onClick={() => setStatus(b.id, "confirmed")}
                      className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600"
                    >
                      Confirmar
                    </button>
                  )}
                  {b.status !== "cancelled" && (
                    <button
                      onClick={() => setStatus(b.id, "cancelled")}
                      className="rounded-full bg-marea-800 px-3 py-1.5 text-xs font-medium text-marea-200 hover:bg-marea-700"
                    >
                      Cancelar
                    </button>
                  )}
                  <button
                    onClick={() => deleteBooking(b.id)}
                    className="rounded-full px-2 py-1.5 text-xs text-red-400 hover:text-red-300"
                    title="Eliminar"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ToursTab({ tours, reload }: { tours: Tour[]; reload: () => void }) {
  const [editing, setEditing] = useState<Tour | null>(null);
  const [creating, setCreating] = useState(false);

  async function toggle(t: Tour, field: "active" | "featured") {
    await fetch(`/api/admin/tours/${t.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !t[field] }),
    });
    reload();
  }

  async function remove(t: Tour) {
    if (!confirm(`¿Eliminar "${t.titleEs}"? Se borrarán sus reservas.`)) return;
    await fetch(`/api/admin/tours/${t.id}`, { method: "DELETE" });
    reload();
  }

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setCreating(true)}
          className="btn-glow rounded-full bg-gradient-to-r from-marea-400 to-marea-700 px-5 py-2 text-sm font-semibold text-white"
        >
          + Nuevo tour
        </button>
      </div>

      <div className="grid gap-3">
        {tours.map((t) => (
          <div key={t.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{t.titleEs}</span>
                {t.featured && <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-300">★ Top</span>}
                {!t.active && <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-300">Oculto</span>}
              </div>
              <div className="mt-1 text-xs text-marea-400">
                {t.price === 0 ? "Gratis" : formatPrice(t.price, t.currency, "es")} · {t.durationMin}min · max {t.maxPeople} · {t._count.bookings} reservas
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => toggle(t, "featured")} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-200 hover:bg-marea-700">
                {t.featured ? "Quitar Top" : "Marcar Top"}
              </button>
              <button onClick={() => toggle(t, "active")} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-200 hover:bg-marea-700">
                {t.active ? "Ocultar" : "Mostrar"}
              </button>
              <button onClick={() => setEditing(t)} className="rounded-full bg-marea-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-marea-600">
                Editar
              </button>
              <button onClick={() => remove(t)} className="rounded-full px-2 py-1.5 text-xs text-red-400 hover:text-red-300">
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <TourEditor
          tour={editing}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSaved={() => {
            setEditing(null);
            setCreating(false);
            reload();
          }}
        />
      )}
    </div>
  );
}

function TourEditor({ tour, onClose, onSaved }: { tour: Tour | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    titleEs: tour?.titleEs || "",
    titleEn: tour?.titleEn || "",
    summaryEs: (tour as any)?.summaryEs || "",
    summaryEn: (tour as any)?.summaryEn || "",
    descriptionEs: (tour as any)?.descriptionEs || "",
    descriptionEn: (tour as any)?.descriptionEn || "",
    price: tour?.price ?? 0,
    durationMin: tour?.durationMin ?? 180,
    maxPeople: tour?.maxPeople ?? 15,
    category: tour?.category || "cultural",
    image: tour?.image || "graffiti",
    meetingPoint: (tour as any)?.meetingPoint || "",
    slug: tour?.slug || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  async function save() {
    setSaving(true);
    const url = tour ? `/api/admin/tours/${tour.id}` : "/api/admin/tours";
    const method = tour ? "PATCH" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    onSaved();
  }

  const input = "w-full rounded-lg border border-marea-400/20 bg-marea-900/50 px-3 py-2 text-sm text-white outline-none focus:border-marea-400";

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-marea-400/20 bg-marea-950 p-6">
        <h3 className="font-display text-xl font-bold text-white">{tour ? "Editar tour" : "Nuevo tour"}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Título (ES)"><input className={input} value={form.titleEs} onChange={(e) => set("titleEs", e.target.value)} /></Field>
          <Field label="Título (EN)"><input className={input} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} /></Field>
          <Field label="Resumen (ES)"><input className={input} value={form.summaryEs} onChange={(e) => set("summaryEs", e.target.value)} /></Field>
          <Field label="Resumen (EN)"><input className={input} value={form.summaryEn} onChange={(e) => set("summaryEn", e.target.value)} /></Field>
          <Field label="Descripción (ES)" full><textarea rows={2} className={input} value={form.descriptionEs} onChange={(e) => set("descriptionEs", e.target.value)} /></Field>
          <Field label="Descripción (EN)" full><textarea rows={2} className={input} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} /></Field>
          <Field label="Precio (COP, 0 = gratis)"><input type="number" className={input} value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></Field>
          <Field label="Duración (min)"><input type="number" className={input} value={form.durationMin} onChange={(e) => set("durationMin", Number(e.target.value))} /></Field>
          <Field label="Máx. personas"><input type="number" className={input} value={form.maxPeople} onChange={(e) => set("maxPeople", Number(e.target.value))} /></Field>
          <Field label="Categoría"><input className={input} value={form.category} onChange={(e) => set("category", e.target.value)} /></Field>
          <Field label="Imagen (tema)">
            <select className={input} value={form.image} onChange={(e) => set("image", e.target.value)}>
              {["graffiti", "english", "sunset", "vip", "food", "workshop"].map((x) => (
                <option key={x} value={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Punto de encuentro" full><input className={input} value={form.meetingPoint} onChange={(e) => set("meetingPoint", e.target.value)} /></Field>
          {!tour && <Field label="Slug (URL)"><input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mi-tour" /></Field>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-marea-400/30 px-5 py-2 text-sm text-marea-200 hover:bg-marea-800/50">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-glow rounded-full bg-gradient-to-r from-marea-400 to-marea-700 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs text-marea-400">{label}</span>
      {children}
    </label>
  );
}
