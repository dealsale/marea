"use client";

import { useEffect, useState } from "react";
import { LogoMark } from "@/components/Logo";
import { formatPrice } from "@/lib/format";

type Lang = "es" | "en";
type Customer = { id: string; name: string; email: string; phone: string };
type Booking = {
  id: string; date: string; endDate: string | null; nights: number; timeSlot: string; people: number;
  status: string; total: number; changeRequest: string; requestNote: string;
  package: { titleEs: string; titleEn: string; type: string; line: { nameEs: string; nameEn: string } } | null;
  activity: { nameEs: string; nameEn: string } | null;
};

const T = {
  es: {
    account: "Mi cuenta", login: "Iniciar sesión", register: "Crear cuenta", email: "Correo", password: "Contraseña",
    name: "Nombre completo", phone: "WhatsApp", enter: "Entrar", create: "Registrarme", logout: "Cerrar sesión",
    noAcc: "¿No tienes cuenta?", hasAcc: "¿Ya tienes cuenta?", hi: "Hola", myBookings: "Mis reservas",
    empty: "Aún no tienes reservas.", back: "← Volver al sitio", people: "personas", nights: "noches",
    reschedule: "Reprogramar", cancel: "Cancelar", requested: "Solicitud enviada", cancelReq: "Quitar solicitud",
    reqReschedule: "Solicitar reprogramación", reqCancel: "Solicitar cancelación",
    notePlaceholder: "Cuéntanos tu nueva fecha preferida o el motivo…", send: "Enviar solicitud", close: "Cerrar",
    status: { pending: "Pendiente", confirmed: "Confirmada", cancelled: "Cancelada" },
    reqType: { reschedule: "reprogramar", cancel: "cancelar" },
    minPass: "Mínimo 6 caracteres",
  },
  en: {
    account: "My account", login: "Log in", register: "Create account", email: "Email", password: "Password",
    name: "Full name", phone: "WhatsApp", enter: "Log in", create: "Sign up", logout: "Log out",
    noAcc: "No account yet?", hasAcc: "Already have an account?", hi: "Hi", myBookings: "My bookings",
    empty: "You don't have bookings yet.", back: "← Back to site", people: "people", nights: "nights",
    reschedule: "Reschedule", cancel: "Cancel", requested: "Request sent", cancelReq: "Withdraw request",
    reqReschedule: "Request reschedule", reqCancel: "Request cancellation",
    notePlaceholder: "Tell us your preferred new date or the reason…", send: "Send request", close: "Close",
    status: { pending: "Pending", confirmed: "Confirmed", cancelled: "Cancelled" },
    reqType: { reschedule: "reschedule", cancel: "cancel" },
    minPass: "At least 6 characters",
  },
};

const statusStyle: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-300",
  confirmed: "bg-green-500/20 text-green-300",
  cancelled: "bg-red-500/20 text-red-300",
};

export default function AccountPage() {
  const [lang, setLang] = useState<Lang>("es");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reqModal, setReqModal] = useState<{ id: string; type: "reschedule" | "cancel" } | null>(null);
  const [reqNote, setReqNote] = useState("");

  const t = T[lang];

  useEffect(() => {
    const l = (typeof window !== "undefined" && localStorage.getItem("marea_lang")) as Lang | null;
    if (l === "es" || l === "en") setLang(l);
    fetch("/api/account/me").then((r) => r.json()).then((d) => {
      setCustomer(d.customer);
      setLoading(false);
      if (d.customer) loadBookings();
    });
  }, []);

  async function loadBookings() {
    const d = await fetch("/api/account/bookings").then((r) => r.json());
    setBookings(d.bookings || []);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    const url = mode === "login" ? "/api/account/login" : "/api/account/register";
    const body = mode === "login" ? { email: form.email, password: form.password } : form;
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error || "Error"); return; }
    setCustomer(data.customer); loadBookings();
  }

  async function logout() {
    await fetch("/api/account/logout", { method: "POST" });
    setCustomer(null); setBookings([]);
  }

  async function sendRequest() {
    if (!reqModal) return;
    setBusy(true);
    await fetch(`/api/account/bookings/${reqModal.id}/request`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: reqModal.type, note: reqNote }),
    });
    setBusy(false); setReqModal(null); setReqNote(""); loadBookings();
  }

  async function clearRequest(id: string) {
    await fetch(`/api/account/bookings/${id}/request`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "", note: "" }),
    });
    loadBookings();
  }

  const inputC = "w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-marea-50 placeholder-marea-400 outline-none focus:border-marea-400";

  return (
    <div className="min-h-screen bg-marea-950 text-marea-50">
      <header className="border-b border-marea-400/15">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4">
          <a href="/" className="flex items-center gap-2"><LogoMark className="h-9 w-auto" /><span className="font-display font-semibold text-gradient">MAREA <span className="text-sm tracking-[0.3em] text-marea-300">TOURS</span></span></a>
          <a href="/" className="text-sm text-marea-300 hover:text-marea-50">{t.back}</a>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-10">
        {loading ? (
          <p className="py-20 text-center text-marea-400">…</p>
        ) : !customer ? (
          <div className="mx-auto max-w-md">
            <div className="mb-6 flex justify-center gap-2">
              {(["login", "register"] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setError(""); }}
                  className={`rounded-full px-5 py-2 text-sm font-semibold ${mode === m ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300"}`}>
                  {m === "login" ? t.login : t.register}
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="glass space-y-3 rounded-3xl p-6">
              {mode === "register" && (
                <>
                  <input required placeholder={t.name} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputC} />
                  <input placeholder={t.phone} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputC} />
                </>
              )}
              <input required type="email" placeholder={t.email} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputC} />
              <input required type="password" placeholder={t.password} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={inputC} />
              {mode === "register" && <p className="text-xs text-marea-400">{t.minPass}</p>}
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button disabled={busy} className="btn-glow w-full rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 py-3 font-semibold text-white disabled:opacity-60">
                {busy ? "…" : mode === "login" ? t.enter : t.create}
              </button>
              <p className="text-center text-sm text-marea-300">
                {mode === "login" ? t.noAcc : t.hasAcc}{" "}
                <button type="button" onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-marea-200 underline">
                  {mode === "login" ? t.register : t.login}
                </button>
              </p>
            </form>
          </div>
        ) : (
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl font-bold">{t.hi}, {customer.name} 👋</h1>
                <p className="text-marea-300">{customer.email}</p>
              </div>
              <button onClick={logout} className="rounded-full border border-marea-400/30 px-4 py-2 text-sm text-marea-100 hover:bg-marea-800/50">{t.logout}</button>
            </div>

            <h2 className="mb-3 font-display text-xl font-bold">{t.myBookings}</h2>
            {bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-marea-400/20 py-14 text-center text-marea-400">{t.empty}</div>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => {
                  const what = b.package ? (lang === "es" ? b.package.titleEs : b.package.titleEn) : b.activity ? (lang === "es" ? b.activity.nameEs : b.activity.nameEn) : "—";
                  const line = b.package ? (lang === "es" ? b.package.line.nameEs : b.package.line.nameEn) : "";
                  return (
                    <div key={b.id} className="rounded-2xl border border-marea-400/15 bg-marea-900/40 p-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{what}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs ${statusStyle[b.status]}`}>{(t.status as any)[b.status]}</span>
                          </div>
                          {line && <div className="text-sm text-marea-400">{line}</div>}
                          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-marea-400">
                            <span>📅 {b.date}{b.endDate ? ` → ${b.endDate} (${b.nights} ${t.nights})` : b.timeSlot ? ` · ${b.timeSlot}` : ""}</span>
                            <span>👥 {b.people} {t.people}</span>
                            <span>💵 {b.total === 0 ? "—" : formatPrice(b.total, "COP", lang)}</span>
                          </div>
                          {b.changeRequest && (
                            <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-marea-950/60 px-3 py-1.5 text-xs text-amber-300">
                              ⏳ {t.requested}: {(t.reqType as any)[b.changeRequest]}
                              <button onClick={() => clearRequest(b.id)} className="text-marea-300 underline hover:text-marea-50">{t.cancelReq}</button>
                            </div>
                          )}
                        </div>
                        {b.status !== "cancelled" && !b.changeRequest && (
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => { setReqModal({ id: b.id, type: "reschedule" }); setReqNote(""); }} className="rounded-full bg-marea-800 px-3 py-1.5 text-xs text-marea-100 hover:bg-marea-700">{t.reschedule}</button>
                            <button onClick={() => { setReqModal({ id: b.id, type: "cancel" }); setReqNote(""); }} className="rounded-full bg-red-500/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-500/30">{t.cancel}</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {reqModal && (
        <div onClick={() => setReqModal(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-2xl border border-marea-400/20 bg-marea-950 p-6">
            <h3 className="font-display text-lg font-bold">{reqModal.type === "reschedule" ? t.reqReschedule : t.reqCancel}</h3>
            <textarea rows={3} value={reqNote} onChange={(e) => setReqNote(e.target.value)} placeholder={t.notePlaceholder}
              className="mt-3 w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-marea-50 placeholder-marea-400 outline-none focus:border-marea-400" />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReqModal(null)} className="rounded-full border border-marea-400/30 px-4 py-2 text-sm text-marea-200 hover:bg-marea-800/50">{t.close}</button>
              <button onClick={sendRequest} disabled={busy} className="btn-glow rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60">{t.send}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
