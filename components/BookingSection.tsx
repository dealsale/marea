"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./Hero";
import { useLang } from "./LanguageContext";
import { formatPrice } from "@/lib/format";
import type { TourDTO } from "@/lib/types";

const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00"];

const MONTHS = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const DOW = {
  es: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export function BookingSection({
  tours,
  selectedTourId,
  whatsappNumber,
}: {
  tours: TourDTO[];
  selectedTourId: string;
  whatsappNumber: string;
}) {
  const { t, lang } = useLang();

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [form, setForm] = useState({
    tourId: selectedTourId || tours[0]?.id || "",
    name: "",
    email: "",
    phone: "",
    language: lang,
    date: "",
    timeSlot: TIME_SLOTS[0],
    people: 2,
    notes: "",
  });
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [waLink, setWaLink] = useState("");

  useEffect(() => {
    if (selectedTourId) setForm((f) => ({ ...f, tourId: selectedTourId }));
  }, [selectedTourId]);
  useEffect(() => {
    setForm((f) => ({ ...f, language: lang }));
  }, [lang]);

  const selectedTour = tours.find((x) => x.id === form.tourId);
  const set = (k: string, v: string | number) => setForm((f) => ({ ...f, [k]: v }));

  // per-tour availability
  const availSet = useMemo(
    () => new Set((selectedTour?.availableDays ?? "0,1,2,3,4,5,6").split(",").filter(Boolean).map(Number)),
    [selectedTour]
  );
  const blockedSet = useMemo(
    () => new Set((selectedTour?.blockedDates ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
    [selectedTour]
  );
  const dayOk = (d: Date) => d >= today && availSet.has(d.getDay()) && !blockedSet.has(iso(d));

  // if the tour changes and the chosen date is no longer valid, clear it
  useEffect(() => {
    if (selDate && !(selDate >= today && availSet.has(selDate.getDay()) && !blockedSet.has(iso(selDate)))) {
      setSelDate(null);
      setForm((f) => ({ ...f, date: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.tourId]);

  // calendar cells
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7; // Monday = 0
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let d = 1; d <= days; d++) arr.push(new Date(view.y, view.m, d));
    return arr;
  }, [view]);

  const prevBlocked = view.y === today.getFullYear() && view.m <= today.getMonth();
  const goPrev = () => {
    if (prevBlocked) return;
    setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }));
  };
  const goNext = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }));

  const pickDate = (d: Date) => {
    setSelDate(d);
    set("date", iso(d));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!form.tourId || !form.name || !form.email || !form.phone || !form.date) {
      setError(t.booking.errorRequired);
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "error");
      setWaLink(data.whatsappUrl);
      setStatus("success");
      if (data.whatsappUrl) window.open(data.whatsappUrl, "_blank");
    } catch {
      setStatus("error");
      setError(t.booking.errorGeneric);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-white placeholder-marea-400 outline-none transition-colors focus:border-marea-400";

  return (
    <section id="book" className="relative overflow-hidden py-24">
      <div className="aurora absolute inset-0 opacity-50" />
      <div className="relative mx-auto max-w-4xl px-5">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.booking.title}</h2>
          <p className="mt-3 text-marea-300">{t.booking.subtitle}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="glass mt-10 rounded-3xl p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 text-center"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">
                    ✓
                  </div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{t.booking.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-md text-marea-200">{t.booking.successMsg}</p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-glow flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white"
                      >
                        <WhatsAppIcon className="h-5 w-5" /> {t.booking.openWhatsapp}
                      </a>
                    )}
                    <button
                      onClick={() => setStatus("idle")}
                      className="rounded-full border border-marea-400/30 px-6 py-3 font-semibold text-marea-100 hover:bg-marea-800/50"
                    >
                      {t.booking.newBooking}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={submit}
                  className="grid gap-7 md:grid-cols-2"
                >
                  {/* Calendar column */}
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marea-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-marea-500 text-[10px] text-white">1</span>
                      {t.booking.pickDate}
                    </div>
                    <div className="rounded-2xl border border-marea-400/20 bg-marea-950/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={goPrev}
                          disabled={prevBlocked}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-marea-400/30 text-lg text-white transition-colors hover:bg-marea-700 disabled:opacity-30"
                          aria-label="prev month"
                        >
                          ‹
                        </button>
                        <span className="font-display text-lg font-semibold capitalize text-white">
                          {MONTHS[lang][view.m]} {view.y}
                        </span>
                        <button
                          type="button"
                          onClick={goNext}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-marea-400/30 text-lg text-white transition-colors hover:bg-marea-700"
                          aria-label="next month"
                        >
                          ›
                        </button>
                      </div>
                      <div className="mb-1.5 grid grid-cols-7 gap-1">
                        {DOW[lang].map((d) => (
                          <span key={d} className="text-center text-[11px] uppercase text-marea-400">
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {cells.map((d, i) => {
                          if (!d) return <span key={`e${i}`} />;
                          const ok = dayOk(d);
                          const isToday = d.getTime() === today.getTime();
                          const isSel = !!selDate && iso(d) === iso(selDate);
                          return (
                            <motion.button
                              key={iso(d)}
                              type="button"
                              disabled={!ok}
                              onClick={() => pickDate(d)}
                              whileTap={{ scale: 0.9 }}
                              title={!ok && d >= today ? (lang === "es" ? "No disponible" : "Not available") : undefined}
                              className={[
                                "aspect-square rounded-lg text-sm transition-colors",
                                !ok ? "cursor-not-allowed text-marea-700 line-through decoration-marea-700/60" : "text-marea-100 hover:bg-marea-700/40",
                                isToday && !isSel ? "border border-marea-400" : "",
                                isSel
                                  ? "bg-gradient-to-br from-marea-400 to-marea-700 font-bold text-white shadow-lg shadow-marea-700/40"
                                  : "",
                              ].join(" ")}
                            >
                              {d.getDate()}
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>

                    <label className="mb-2 mt-4 block text-sm text-marea-300">{t.booking.time}</label>
                    {selDate ? (
                      <div className="grid grid-cols-4 gap-2">
                        {TIME_SLOTS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => set("timeSlot", s)}
                            className={`rounded-lg border py-2.5 text-sm transition-colors ${
                              form.timeSlot === s
                                ? "border-marea-400 bg-marea-500 font-semibold text-white"
                                : "border-marea-400/25 bg-marea-900/40 text-marea-200 hover:border-marea-400"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-marea-400">{t.booking.pickDateFirst}</p>
                    )}
                  </div>

                  {/* Details column */}
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marea-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-marea-500 text-[10px] text-white">2</span>
                      {t.booking.yourDetails}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-sm text-marea-300">{t.booking.tour}</label>
                        <select value={form.tourId} onChange={(e) => set("tourId", e.target.value)} className={inputClass}>
                          {tours.map((tour) => (
                            <option key={tour.id} value={tour.id}>
                              {(lang === "es" ? tour.titleEs : tour.titleEn)} —{" "}
                              {tour.price === 0 ? t.tours.free : formatPrice(tour.price, tour.currency, lang)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.booking.name} *</label>
                          <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.booking.phone} *</label>
                          <input
                            value={form.phone}
                            onChange={(e) => set("phone", e.target.value)}
                            placeholder="+57 300 000 0000"
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-marea-300">{t.booking.email} *</label>
                        <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.booking.language}</label>
                          <select value={form.language} onChange={(e) => set("language", e.target.value)} className={inputClass}>
                            <option value="es">{t.booking.spanish}</option>
                            <option value="en">{t.booking.english}</option>
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.booking.people}</label>
                          <input
                            type="number"
                            min={1}
                            max={selectedTour?.maxPeople ?? 20}
                            value={form.people}
                            onChange={(e) => set("people", Math.max(1, parseInt(e.target.value) || 1))}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-sm text-marea-300">{t.booking.notes}</label>
                        <textarea
                          value={form.notes}
                          onChange={(e) => set("notes", e.target.value)}
                          placeholder={t.booking.notesPlaceholder}
                          rows={2}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Summary + submit (full width) */}
                  <div className="md:col-span-2">
                    {selectedTour && (
                      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-marea-900/50 px-4 py-3 text-sm">
                        <span className="inline-flex items-center gap-2 rounded-full bg-marea-700/40 px-3 py-1 text-marea-100">
                          📅 {form.date || "—"} {form.date ? `· ${form.timeSlot}` : ""}
                        </span>
                        <span className="text-marea-300">{lang === "es" ? selectedTour.titleEs : selectedTour.titleEn}</span>
                        <span className="font-bold text-white">
                          {selectedTour.price === 0
                            ? t.tours.free
                            : formatPrice(selectedTour.price * form.people, selectedTour.currency, lang)}
                        </span>
                      </div>
                    )}
                    {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
                    <button
                      type="submit"
                      disabled={status === "loading"}
                      className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-marea-400 to-marea-700 py-3.5 font-semibold text-white disabled:opacity-60"
                    >
                      <WhatsAppIcon className="h-5 w-5" />
                      {status === "loading" ? t.booking.submitting : t.booking.submit}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
