"use client";

import { useEffect, useMemo, useState } from "react";
import { Logo } from "../Logo";
import { formatPrice, whatsappUrl } from "@/lib/format";
import { TYPE_LABELS } from "@/lib/types";

type Line = { id: string; slug: string; nameEs: string; nameEn: string; taglineEs: string; taglineEn: string; emoji: string; color: string; order: number; active: boolean; _count: { packages: number } };
type Activity = { id?: string; nameEs: string; nameEn: string; descEs: string; descEn: string; price: number; optional: boolean; bookableAlone: boolean; durationMin: number };
type Pkg = {
  id: string; slug: string; lineId: string; type: string; titleEs: string; titleEn: string; summaryEs: string; summaryEn: string;
  descriptionEs: string; descriptionEn: string; price: number; currency: string; durationMin: number; meetingPoint: string; image: string;
  availableDays: string; blockedDates: string; maxPeople: number; featured: boolean; active: boolean; order: number;
  line: { nameEs: string }; activities: Activity[]; _count: { bookings: number };
};
type Booking = {
  id: string; name: string; email: string; phone: string; language: string; date: string; endDate: string | null; timeSlot: string;
  nights: number; people: number; extras: string; notes: string; status: string; total: number; createdAt: string;
  package: { titleEs: string; type: string; line: { nameEs: string } } | null;
  activity: { nameEs: string; nameEn: string } | null;
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  confirmed: "bg-green-500/20 text-green-300 border-green-500/30",
  cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
};
const WEEK = [{ i: 1, l: "Lun" }, { i: 2, l: "Mar" }, { i: 3, l: "Mié" }, { i: 4, l: "Jue" }, { i: 5, l: "Vie" }, { i: 6, l: "Sáb" }, { i: 0, l: "Dom" }];
const isPhoto = (s: string) => /^(https?:\/\/|data:image\/)/.test(s || "");
const input = "w-full rounded-lg border border-marea-400/20 bg-marea-900/50 px-3 py-2 text-sm text-marea-50 outline-none focus:border-marea-400";

function compressImage(file: File, maxW = 1200, quality = 0.72): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale), h = Math.round(img.height * scale);
      const c = document.createElement("canvas"); c.width = w; c.height = h;
      const ctx = c.getContext("2d"); if (!ctx) return reject(new Error("no ctx"));
      ctx.drawImage(img, 0, 0, w, h); resolve(c.toDataURL("image/jpeg", quality)); URL.revokeObjectURL(img.src);
    };
    img.onerror = reject; img.src = URL.createObjectURL(file);
  });
}

export function AdminDashboard() {
  const [tab, setTab] = useState<"bookings" | "packages" | "lines">("bookings");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [packages, setPackages] = useState<Pkg[]>([]);
  const [lines, setLines] = useState<Line[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const [b, p, l] = await Promise.all([
      fetch("/api/admin/bookings").then((r) => r.json()),
      fetch("/api/admin/packages").then((r) => r.json()),
      fetch("/api/admin/lines").then((r) => r.json()),
    ]);
    setBookings(b.bookings || []); setPackages(p.packages || []); setLines(l.lines || []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function setStatus(id: string, status: string) {
    setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
    await fetch(`/api/admin/bookings/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
  }
  async function deleteBooking(id: string) {
    if (!confirm("¿Eliminar esta reserva?")) return;
    setBookings((bs) => bs.filter((b) => b.id !== id));
    await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); window.location.href = "/"; }

  const stats = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed");
    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === "pending").length,
      confirmed: confirmed.length,
      people: confirmed.reduce((s, b) => s + b.people, 0),
      revenue: confirmed.reduce((s, b) => s + b.total, 0),
    };
  }, [bookings]);

  const shown = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div className="min-h-screen bg-marea-950">
      <header className="sticky top-0 z-20 border-b border-marea-400/15 bg-marea-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
          <Logo />
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm text-marea-300 hover:text-marea-50">Ver sitio ↗</a>
            <button onClick={logout} className="rounded-full border border-marea-400/30 px-4 py-1.5 text-sm text-marea-100 hover:bg-marea-800/50">Salir</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <h1 className="font-display text-3xl font-bold text-marea-50">Panel de administración</h1>

        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            { l: "Reservas", v: stats.total, c: "text-marea-50" },
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

        <div className="mt-8 flex gap-2 border-b border-marea-400/15">
          {[{ k: "bookings", l: "Reservas" }, { k: "packages", l: "Paquetes" }, { k: "lines", l: "Líneas" }].map((x) => (
            <button key={x.k} onClick={() => setTab(x.k as any)}
              className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${tab === x.k ? "border-marea-400 text-marea-50" : "border-transparent text-marea-400 hover:text-marea-200"}`}>
              {x.l}
            </button>
          ))}
          <button onClick={load} className="ml-auto px-3 py-2 text-sm text-marea-400 hover:text-marea-50">⟳ Actualizar</button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-marea-400">Cargando...</div>
        ) : tab === "bookings" ? (
          <BookingsTab bookings={shown} filter={filter} setFilter={setFilter} setStatus={setStatus} deleteBooking={deleteBooking} />
        ) : tab === "packages" ? (
          <PackagesTab packages={packages} lines={lines} reload={load} />
        ) : (
          <LinesTab lines={lines} reload={load} />
        )}
      </main>
    </div>
  );
}

function BookingsTab({ bookings, filter, setFilter, setStatus, deleteBooking }: { bookings: Booking[]; filter: string; setFilter: (f: string) => void; setStatus: (id: string, s: string) => void; deleteBooking: (id: string) => void }) {
  return (
    <div className="mt-6">
      <div className="mb-4 flex flex-wrap gap-2">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`rounded-full px-4 py-1.5 text-sm capitalize ${filter === f ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300 hover:text-marea-50"}`}>
            {f === "all" ? "Todas" : f === "pending" ? "Pendientes" : f === "confirmed" ? "Confirmadas" : "Canceladas"}
          </button>
        ))}
      </div>
      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-marea-400/20 py-16 text-center text-marea-400">No hay reservas en esta categoría.</div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const what = b.package ? b.package.titleEs : b.activity ? b.activity.nameEs : "—";
            const typeLabel = b.package ? (TYPE_LABELS[b.package.type]?.es || b.package.type) : "Actividad";
            const extrasCount = b.extras ? b.extras.split(",").filter(Boolean).length : 0;
            return (
              <div key={b.id} className="rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-marea-50">{b.name}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-xs capitalize ${statusStyles[b.status]}`}>{b.status}</span>
                      <span className="rounded-full bg-marea-800 px-2 py-0.5 text-xs uppercase text-marea-200">{b.language}</span>
                    </div>
                    <div className="mt-1 text-sm text-marea-300">
                      {b.package?.line?.nameEs ? <span className="text-marea-400">{b.package.line.nameEs} · </span> : null}
                      <span className="text-marea-200">{typeLabel}</span> — {what}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-marea-400">
                      <span>📅 {b.date}{b.endDate ? ` → ${b.endDate} (${b.nights}n)` : b.timeSlot ? ` · ${b.timeSlot}` : ""}</span>
                      <span>👥 {b.people}</span>
                      {extrasCount > 0 && <span>➕ {extrasCount} extra(s)</span>}
                      <span>💵 {b.total === 0 ? "Gratis" : formatPrice(b.total, "COP", "es")}</span>
                      <span>✉️ {b.email}</span>
                      <span>📞 {b.phone}</span>
                      <span className="text-marea-500">#{b.id.slice(-6).toUpperCase()}</span>
                    </div>
                    {b.notes && <div className="mt-2 rounded-lg bg-marea-950/60 px-3 py-2 text-xs text-marea-300">📝 {b.notes}</div>}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a href={whatsappUrl(b.phone, `Hola ${b.name}, te escribimos de Marea Tours sobre tu reserva del ${b.date}.`)} target="_blank" rel="noopener noreferrer" className="rounded-full bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-300 hover:bg-green-500/30">WhatsApp</a>
                    {b.status !== "confirmed" && <button onClick={() => setStatus(b.id, "confirmed")} className="rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-600">Confirmar</button>}
                    {b.status !== "cancelled" && <button onClick={() => setStatus(b.id, "cancelled")} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs font-medium text-marea-200 hover:bg-marea-700">Cancelar</button>}
                    <button onClick={() => deleteBooking(b.id)} className="rounded-full px-2 py-1.5 text-xs text-red-400 hover:text-red-300" title="Eliminar">✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PackagesTab({ packages, lines, reload }: { packages: Pkg[]; lines: Line[]; reload: () => void }) {
  const [editing, setEditing] = useState<Pkg | null>(null);
  const [creating, setCreating] = useState(false);

  async function toggle(p: Pkg, field: "active" | "featured") {
    await fetch(`/api/admin/packages/${p.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ [field]: !p[field] }) });
    reload();
  }
  async function remove(p: Pkg) {
    if (!confirm(`¿Eliminar "${p.titleEs}"? Se borran sus actividades.`)) return;
    await fetch(`/api/admin/packages/${p.id}`, { method: "DELETE" }); reload();
  }

  const byLine = lines.map((l) => ({ line: l, items: packages.filter((p) => p.lineId === l.id) }));

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end">
        <button onClick={() => setCreating(true)} disabled={lines.length === 0} className="btn-glow rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">+ Nuevo paquete</button>
      </div>
      {lines.length === 0 && <p className="text-sm text-marea-400">Crea una línea primero en la pestaña «Líneas».</p>}
      <div className="space-y-6">
        {byLine.map(({ line, items }) => (
          <div key={line.id}>
            <h3 className="mb-2 flex items-center gap-2 font-display text-lg font-bold text-marea-50">{line.emoji} {line.nameEs}</h3>
            <div className="grid gap-3">
              {items.length === 0 && <p className="text-xs text-marea-500">Sin paquetes.</p>}
              {items.map((p) => (
                <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-marea-50">{p.titleEs}</span>
                      <span className="rounded bg-marea-700 px-1.5 py-0.5 text-xs text-white">{TYPE_LABELS[p.type]?.es || p.type}</span>
                      {p.featured && <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-xs text-amber-300">★</span>}
                      {!p.active && <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-300">Oculto</span>}
                    </div>
                    <div className="mt-1 text-xs text-marea-400">
                      {p.price === 0 ? "Gratis" : formatPrice(p.price, p.currency, "es")}{p.type === "hospedaje" ? "/noche" : ""} · {p.activities.length} act. · {p._count.bookings} reservas
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <button onClick={() => toggle(p, "featured")} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-200 hover:bg-marea-700">{p.featured ? "Quitar ★" : "Destacar"}</button>
                    <button onClick={() => toggle(p, "active")} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-200 hover:bg-marea-700">{p.active ? "Ocultar" : "Mostrar"}</button>
                    <button onClick={() => setEditing(p)} className="rounded-full bg-marea-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-marea-600">Editar</button>
                    <button onClick={() => remove(p)} className="rounded-full px-2 py-1.5 text-xs text-red-400 hover:text-red-300">✕</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && (
        <PackageEditor pkg={editing} lines={lines} onClose={() => { setEditing(null); setCreating(false); }} onSaved={() => { setEditing(null); setCreating(false); reload(); }} />
      )}
    </div>
  );
}

function PackageEditor({ pkg, lines, onClose, onSaved }: { pkg: Pkg | null; lines: Line[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    lineId: pkg?.lineId || lines[0]?.id || "",
    type: pkg?.type || "tour",
    titleEs: pkg?.titleEs || "", titleEn: pkg?.titleEn || "",
    summaryEs: pkg?.summaryEs || "", summaryEn: pkg?.summaryEn || "",
    descriptionEs: pkg?.descriptionEs || "", descriptionEn: pkg?.descriptionEn || "",
    price: pkg?.price ?? 0, durationMin: pkg?.durationMin ?? 180, maxPeople: pkg?.maxPeople ?? 15,
    meetingPoint: pkg?.meetingPoint || "", image: pkg?.image || "graffiti", slug: pkg?.slug || "",
  });
  const [days, setDays] = useState<number[]>((pkg?.availableDays ?? "0,1,2,3,4,5,6").split(",").filter(Boolean).map(Number));
  const [blocked, setBlocked] = useState<string[]>((pkg?.blockedDates ?? "").split(",").map((s) => s.trim()).filter(Boolean));
  const [newBlock, setNewBlock] = useState("");
  const [acts, setActs] = useState<Activity[]>(pkg?.activities?.map((a) => ({ ...a })) || []);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  const photo = isPhoto(form.image);
  const toggleDay = (i: number) => setDays((d) => (d.includes(i) ? d.filter((x) => x !== i) : [...d, i].sort()));

  const setAct = (idx: number, k: string, v: any) => setActs((a) => a.map((x, i) => (i === idx ? { ...x, [k]: v } : x)));
  const addAct = () => setActs((a) => [...a, { nameEs: "", nameEn: "", descEs: "", descEn: "", price: 0, optional: false, bookableAlone: false, durationMin: 60 }]);
  const rmAct = (idx: number) => setActs((a) => a.filter((_, i) => i !== idx));

  async function onFile(file?: File) {
    if (!file) return; setUploading(true);
    try { set("image", await compressImage(file)); } catch { alert("No se pudo procesar la imagen."); }
    setUploading(false);
  }

  async function save() {
    setSaving(true);
    const url = pkg ? `/api/admin/packages/${pkg.id}` : "/api/admin/packages";
    const method = pkg ? "PATCH" : "POST";
    const body = { ...form, availableDays: days.join(","), blockedDates: blocked.join(","), activities: acts };
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setSaving(false); onSaved();
  }

  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-marea-400/20 bg-marea-950 p-6">
        <h3 className="font-display text-xl font-bold text-marea-50">{pkg ? "Editar paquete" : "Nuevo paquete"}</h3>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <Field label="Línea"><select className={input} value={form.lineId} onChange={(e) => set("lineId", e.target.value)}>{lines.map((l) => <option key={l.id} value={l.id}>{l.emoji} {l.nameEs}</option>)}</select></Field>
          <Field label="Tipo"><select className={input} value={form.type} onChange={(e) => set("type", e.target.value)}><option value="tour">Marea Tour</option><option value="escape">Marea Escape</option><option value="hospedaje">Marea Hospedaje</option></select></Field>
          <Field label={form.type === "hospedaje" ? "Precio / noche (COP)" : "Precio / persona (COP)"}><input type="number" className={input} value={form.price} onChange={(e) => set("price", Number(e.target.value))} /></Field>
        </div>

        {/* Photo */}
        <div className="mt-4 rounded-xl border border-marea-400/15 bg-marea-900/30 p-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-marea-300">Foto</span>
          <div className="flex items-center gap-4">
            <div className="h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-marea-400/20 bg-marea-900">
              {photo ? <img src={form.image} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center text-xs text-marea-400">Sin foto</div>}
            </div>
            <div className="flex-1 space-y-2">
              <label className="inline-block cursor-pointer rounded-full bg-marea-500 px-4 py-2 text-xs font-semibold text-white hover:bg-marea-600">{uploading ? "Procesando..." : photo ? "Cambiar foto" : "Subir foto"}<input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} /></label>
              {photo && <button onClick={() => set("image", "graffiti")} className="ml-2 rounded-full border border-marea-400/30 px-3 py-2 text-xs text-marea-200 hover:bg-marea-800/50">Quitar</button>}
              <input className={input} value={form.image.startsWith("http") ? form.image : ""} placeholder="https://… (o sube arriba)" onChange={(e) => set("image", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Availability */}
        <div className="mt-4 rounded-xl border border-marea-400/15 bg-marea-900/30 p-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-marea-300">Disponibilidad</span>
          <div className="flex flex-wrap gap-1.5">
            {WEEK.map((d) => <button key={d.i} onClick={() => toggleDay(d.i)} className={`w-11 rounded-lg py-2 text-xs font-semibold ${days.includes(d.i) ? "bg-marea-500 text-white" : "bg-marea-900/60 text-marea-400 hover:text-marea-50"}`}>{d.l}</button>)}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input type="date" value={newBlock} onChange={(e) => setNewBlock(e.target.value)} className={`${input} w-auto`} />
            <button onClick={() => { if (newBlock && !blocked.includes(newBlock)) setBlocked((b) => [...b, newBlock].sort()); setNewBlock(""); }} className="rounded-full bg-marea-700 px-3 py-2 text-xs font-medium text-white hover:bg-marea-600">Bloquear fecha</button>
          </div>
          {blocked.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{blocked.map((d) => <span key={d} className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-xs text-red-300">{d}<button onClick={() => setBlocked((b) => b.filter((x) => x !== d))}>✕</button></span>)}</div>}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Título (ES)"><input className={input} value={form.titleEs} onChange={(e) => set("titleEs", e.target.value)} /></Field>
          <Field label="Título (EN)"><input className={input} value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} /></Field>
          <Field label="Resumen (ES)"><input className={input} value={form.summaryEs} onChange={(e) => set("summaryEs", e.target.value)} /></Field>
          <Field label="Resumen (EN)"><input className={input} value={form.summaryEn} onChange={(e) => set("summaryEn", e.target.value)} /></Field>
          <Field label="Descripción (ES)" full><textarea rows={2} className={input} value={form.descriptionEs} onChange={(e) => set("descriptionEs", e.target.value)} /></Field>
          <Field label="Descripción (EN)" full><textarea rows={2} className={input} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} /></Field>
          {form.type !== "hospedaje" && <Field label="Duración (min)"><input type="number" className={input} value={form.durationMin} onChange={(e) => set("durationMin", Number(e.target.value))} /></Field>}
          <Field label="Máx. personas"><input type="number" className={input} value={form.maxPeople} onChange={(e) => set("maxPeople", Number(e.target.value))} /></Field>
          <Field label="Punto de encuentro" full><input className={input} value={form.meetingPoint} onChange={(e) => set("meetingPoint", e.target.value)} /></Field>
          {!pkg && <Field label="Slug (URL)"><input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mi-paquete" /></Field>}
        </div>

        {/* Activities */}
        <div className="mt-4 rounded-xl border border-marea-400/15 bg-marea-900/30 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-marea-300">Actividades</span>
            <button onClick={addAct} className="rounded-full bg-marea-600 px-3 py-1 text-xs font-medium text-white hover:bg-marea-500">+ Actividad</button>
          </div>
          <div className="space-y-2">
            {acts.length === 0 && <p className="text-xs text-marea-500">Sin actividades. Agrega las incluidas y las opcionales.</p>}
            {acts.map((a, i) => (
              <div key={i} className="rounded-lg border border-marea-400/15 bg-marea-950/50 p-3">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input className={input} placeholder="Nombre (ES)" value={a.nameEs} onChange={(e) => setAct(i, "nameEs", e.target.value)} />
                  <input className={input} placeholder="Name (EN)" value={a.nameEn} onChange={(e) => setAct(i, "nameEn", e.target.value)} />
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-marea-300">
                  <label className="flex items-center gap-1">Precio extra <input type="number" className={`${input} w-24`} value={a.price} onChange={(e) => setAct(i, "price", Number(e.target.value))} /></label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-marea-500" checked={a.optional} onChange={(e) => setAct(i, "optional", e.target.checked)} /> Opcional (extra)</label>
                  <label className="flex items-center gap-1"><input type="checkbox" className="accent-marea-500" checked={a.bookableAlone} onChange={(e) => setAct(i, "bookableAlone", e.target.checked)} /> Reservable sola</label>
                  <button onClick={() => rmAct(i)} className="ml-auto text-red-400 hover:text-red-300">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-marea-400/30 px-5 py-2 text-sm text-marea-200 hover:bg-marea-800/50">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-glow rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
}

function LinesTab({ lines, reload }: { lines: Line[]; reload: () => void }) {
  const [editing, setEditing] = useState<Line | null>(null);
  const [creating, setCreating] = useState(false);
  async function toggle(l: Line) { await fetch(`/api/admin/lines/${l.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ active: !l.active }) }); reload(); }
  async function remove(l: Line) { if (!confirm(`¿Eliminar "${l.nameEs}"? Se borran sus paquetes.`)) return; await fetch(`/api/admin/lines/${l.id}`, { method: "DELETE" }); reload(); }

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-end"><button onClick={() => setCreating(true)} className="btn-glow rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-5 py-2 text-sm font-semibold text-white">+ Nueva línea</button></div>
      <div className="grid gap-3">
        {lines.map((l) => (
          <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg text-xl" style={{ background: l.color + "33" }}>{l.emoji}</span>
              <div>
                <div className="flex items-center gap-2"><span className="font-semibold text-marea-50">{l.nameEs}</span>{!l.active && <span className="rounded bg-red-500/20 px-1.5 py-0.5 text-xs text-red-300">Oculta</span>}</div>
                <div className="text-xs text-marea-400">{l.taglineEs || "—"} · {l._count.packages} paquetes</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => toggle(l)} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-200 hover:bg-marea-700">{l.active ? "Ocultar" : "Mostrar"}</button>
              <button onClick={() => setEditing(l)} className="rounded-full bg-marea-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-marea-600">Editar</button>
              <button onClick={() => remove(l)} className="rounded-full px-2 py-1.5 text-xs text-red-400 hover:text-red-300">✕</button>
            </div>
          </div>
        ))}
      </div>
      {(editing || creating) && <LineEditor line={editing} onClose={() => { setEditing(null); setCreating(false); }} onSaved={() => { setEditing(null); setCreating(false); reload(); }} />}
    </div>
  );
}

function LineEditor({ line, onClose, onSaved }: { line: Line | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    nameEs: line?.nameEs || "", nameEn: line?.nameEn || "", taglineEs: line?.taglineEs || "", taglineEn: line?.taglineEn || "",
    emoji: line?.emoji || "🌊", color: line?.color || "#4f46e5", order: line?.order ?? 0, slug: line?.slug || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));
  async function save() {
    setSaving(true);
    const url = line ? `/api/admin/lines/${line.id}` : "/api/admin/lines";
    await fetch(url, { method: line ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false); onSaved();
  }
  return (
    <div onClick={onClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border border-marea-400/20 bg-marea-950 p-6">
        <h3 className="font-display text-xl font-bold text-marea-50">{line ? "Editar línea" : "Nueva línea"}</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Field label="Nombre (ES)"><input className={input} value={form.nameEs} onChange={(e) => set("nameEs", e.target.value)} /></Field>
          <Field label="Nombre (EN)"><input className={input} value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} /></Field>
          <Field label="Tagline (ES)" full><input className={input} value={form.taglineEs} onChange={(e) => set("taglineEs", e.target.value)} /></Field>
          <Field label="Tagline (EN)" full><input className={input} value={form.taglineEn} onChange={(e) => set("taglineEn", e.target.value)} /></Field>
          <Field label="Emoji"><input className={input} value={form.emoji} onChange={(e) => set("emoji", e.target.value)} /></Field>
          <Field label="Color"><input type="color" className={`${input} h-10 p-1`} value={form.color} onChange={(e) => set("color", e.target.value)} /></Field>
          <Field label="Orden"><input type="number" className={input} value={form.order} onChange={(e) => set("order", Number(e.target.value))} /></Field>
          {!line && <Field label="Slug"><input className={input} value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="mi-linea" /></Field>}
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full border border-marea-400/30 px-5 py-2 text-sm text-marea-200 hover:bg-marea-800/50">Cancelar</button>
          <button onClick={save} disabled={saving} className="btn-glow rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-6 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return <label className={`block ${full ? "sm:col-span-2" : ""}`}><span className="mb-1 block text-xs text-marea-400">{label}</span>{children}</label>;
}
