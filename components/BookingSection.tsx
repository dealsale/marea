"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal } from "./Reveal";
import { WhatsAppIcon } from "./Hero";
import { useLang } from "./LanguageContext";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS, type LineDTO, type PackageDTO, type ActivityDTO } from "@/lib/types";

const TIME_SLOTS = ["09:00", "11:00", "14:00", "16:00"];
const MONTHS = {
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
};
const DOW = { es: ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] };
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const addDays = (isoStr: string, n: number) => {
  const d = new Date(isoStr + "T00:00:00");
  d.setDate(d.getDate() + n);
  return iso(d);
};

export function BookingSection({
  lines,
  target,
  whatsappNumber,
}: {
  lines: LineDTO[];
  target: { packageId?: string; activityId?: string };
  whatsappNumber: string;
}) {
  const { t, lang } = useLang();
  const today = useMemo(() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; }, []);

  const packages = useMemo(() => lines.flatMap((l) => l.packages), [lines]);
  const findActivity = (id: string): { act: ActivityDTO; pkg: PackageDTO } | null => {
    for (const p of packages) { const a = p.activities.find((x) => x.id === id); if (a) return { act: a, pkg: p }; }
    return null;
  };
  const lineOf = (pkgId: string) => lines.find((l) => l.packages.some((p) => p.id === pkgId));

  const [activityId, setActivityId] = useState<string | null>(target.activityId || null);
  const [lineId, setLineId] = useState<string>(lines[0]?.id || "");
  const [type, setType] = useState<string>("");
  const [packageId, setPackageId] = useState<string>("");
  const [extras, setExtras] = useState<string[]>([]);

  const [view, setView] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selDate, setSelDate] = useState<Date | null>(null);
  const [nights, setNights] = useState(2);
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
  const [people, setPeople] = useState(2);
  const [contact, setContact] = useState({ name: "", email: "", phone: "", notes: "" });
  const [flang, setFlang] = useState<"es" | "en">(lang);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [waLink, setWaLink] = useState("");

  useEffect(() => setFlang(lang), [lang]);

  // sync from target (card clicks)
  useEffect(() => {
    if (target.activityId) {
      setActivityId(target.activityId);
      const f = findActivity(target.activityId);
      if (f) { setPackageId(f.pkg.id); setLineId(f.pkg.lineId); setType(f.pkg.type); }
    } else if (target.packageId) {
      setActivityId(null);
      const p = packages.find((x) => x.id === target.packageId);
      if (p) { setPackageId(p.id); setLineId(p.lineId); setType(p.type); }
    }
    setExtras([]); setSelDate(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.packageId, target.activityId]);

  // when line changes, pick a valid type + package
  const lineObj = lines.find((l) => l.id === lineId);
  const typesInLine = useMemo(
    () => Array.from(new Set((lineObj?.packages || []).map((p) => p.type))),
    [lineObj]
  );
  useEffect(() => {
    if (activityId) return;
    if (!typesInLine.includes(type)) setType(typesInLine[0] || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);
  const pkgsInScope = (lineObj?.packages || []).filter((p) => p.type === type);
  useEffect(() => {
    if (activityId) return;
    if (!pkgsInScope.some((p) => p.id === packageId)) setPackageId(pkgsInScope[0]?.id || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId, type]);

  const activityInfo = activityId ? findActivity(activityId) : null;
  const selectedPkg = packages.find((p) => p.id === packageId) || null;
  const isHospedaje = !activityId && selectedPkg?.type === "hospedaje";
  const optionalActs = (selectedPkg?.activities || []).filter((a) => a.optional);

  // availability from the selected package
  const availSet = useMemo(
    () => new Set((selectedPkg?.availableDays ?? "0,1,2,3,4,5,6").split(",").filter(Boolean).map(Number)),
    [selectedPkg]
  );
  const blockedSet = useMemo(
    () => new Set((selectedPkg?.blockedDates ?? "").split(",").map((s) => s.trim()).filter(Boolean)),
    [selectedPkg]
  );
  const dayOk = (d: Date) => d >= today && availSet.has(d.getDay()) && !blockedSet.has(iso(d));

  useEffect(() => { setSelDate(null); setExtras([]); }, [packageId, activityId]);

  // calendar cells
  const cells = useMemo(() => {
    const first = new Date(view.y, view.m, 1);
    const startDow = (first.getDay() + 6) % 7;
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const arr: (Date | null)[] = [];
    for (let i = 0; i < startDow; i++) arr.push(null);
    for (let dd = 1; dd <= days; dd++) arr.push(new Date(view.y, view.m, dd));
    return arr;
  }, [view]);
  const prevBlocked = view.y === today.getFullYear() && view.m <= today.getMonth();

  // pricing
  const extrasSum = optionalActs.filter((a) => extras.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const total = useMemo(() => {
    if (activityInfo) return activityInfo.act.price * people;
    if (!selectedPkg) return 0;
    if (isHospedaje) return selectedPkg.price * Math.max(1, nights) + extrasSum * people;
    return selectedPkg.price * people + extrasSum * people;
  }, [activityInfo, selectedPkg, isHospedaje, nights, extrasSum, people]);

  const money = (v: number) => (v === 0 ? t.shop.free : formatPrice(v, "COP", lang));
  const inputC = "w-full rounded-xl border border-marea-400/20 bg-marea-900/50 px-4 py-3 text-white placeholder-marea-400 outline-none transition-colors focus:border-marea-400";

  const toggleExtra = (id: string) => setExtras((e) => (e.includes(id) ? e.filter((x) => x !== id) : [...e, id]));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if ((!packageId && !activityId) || !contact.name || !contact.email || !contact.phone || !selDate) {
      setError(t.booking.errorRequired);
      return;
    }
    setStatus("loading");
    try {
      const body: any = {
        name: contact.name, email: contact.email, phone: contact.phone,
        language: flang, date: iso(selDate), people, notes: contact.notes,
      };
      if (activityId) body.activityId = activityId;
      else {
        body.packageId = packageId;
        body.extras = extras;
        if (isHospedaje) body.endDate = addDays(iso(selDate), Math.max(1, nights));
        else body.timeSlot = timeSlot;
      }
      const res = await fetch("/api/bookings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
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

  const titleOf = activityInfo
    ? (lang === "es" ? activityInfo.act.nameEs : activityInfo.act.nameEn)
    : selectedPkg ? (lang === "es" ? selectedPkg.titleEs : selectedPkg.titleEn) : "";

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
                <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="py-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-3xl text-white">✓</div>
                  <h3 className="mt-5 font-display text-2xl font-bold text-white">{t.booking.successTitle}</h3>
                  <p className="mx-auto mt-3 max-w-md text-marea-200">{t.booking.successMsg}</p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    {waLink && (
                      <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn-glow flex items-center justify-center gap-2 rounded-full bg-green-500 px-6 py-3 font-semibold text-white">
                        <WhatsAppIcon className="h-5 w-5" /> {t.booking.openWhatsapp}
                      </a>
                    )}
                    <button onClick={() => setStatus("idle")} className="rounded-full border border-marea-400/30 px-6 py-3 font-semibold text-marea-100 hover:bg-marea-800/50">
                      {t.booking.newBooking}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={submit} className="grid gap-7 md:grid-cols-2">
                  {/* LEFT: experience + dates */}
                  <div className="space-y-4">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marea-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-marea-500 text-[10px] text-white">1</span>
                      {t.shop.chooseExperience}
                    </div>

                    {activityInfo ? (
                      <div className="flex items-center justify-between gap-2 rounded-xl bg-marea-900/50 px-4 py-3 text-sm">
                        <span className="text-marea-100">🎟️ {titleOf} <span className="text-marea-400">· {t.shop.activity}</span></span>
                        <button type="button" onClick={() => setActivityId(null)} className="text-xs text-marea-300 underline hover:text-white">✕</button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.shop.line}</label>
                          <select value={lineId} onChange={(e) => setLineId(e.target.value)} className={inputC}>
                            {lines.map((l) => <option key={l.id} value={l.id}>{l.emoji} {lang === "es" ? l.nameEs : l.nameEn}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1.5 block text-sm text-marea-300">{t.shop.type}</label>
                            <select value={type} onChange={(e) => setType(e.target.value)} className={inputC}>
                              {typesInLine.map((tp) => <option key={tp} value={tp}>{TYPE_LABELS[tp]?.[lang] || tp}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1.5 block text-sm text-marea-300">{t.shop.pkg}</label>
                            <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className={inputC}>
                              {pkgsInScope.map((p) => <option key={p.id} value={p.id}>{lang === "es" ? p.titleEs : p.titleEn}</option>)}
                            </select>
                          </div>
                        </div>
                      </>
                    )}

                    {/* calendar */}
                    <div className="rounded-2xl border border-marea-400/20 bg-marea-950/40 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <button type="button" disabled={prevBlocked} onClick={() => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-marea-400/30 text-lg text-white hover:bg-marea-700 disabled:opacity-30">‹</button>
                        <span className="font-display text-lg font-semibold capitalize text-white">{MONTHS[lang][view.m]} {view.y}</span>
                        <button type="button" onClick={() => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }))} className="flex h-9 w-9 items-center justify-center rounded-lg border border-marea-400/30 text-lg text-white hover:bg-marea-700">›</button>
                      </div>
                      <div className="mb-1.5 grid grid-cols-7 gap-1">
                        {DOW[lang].map((dd) => <span key={dd} className="text-center text-[11px] uppercase text-marea-400">{dd}</span>)}
                      </div>
                      <div className="grid grid-cols-7 gap-1">
                        {cells.map((dd, i) => {
                          if (!dd) return <span key={`e${i}`} />;
                          const ok = dayOk(dd);
                          const isToday = dd.getTime() === today.getTime();
                          const isSel = !!selDate && iso(dd) === iso(selDate);
                          return (
                            <button key={iso(dd)} type="button" disabled={!ok} onClick={() => setSelDate(dd)}
                              className={["aspect-square rounded-lg text-sm transition-colors",
                                !ok ? "cursor-not-allowed text-marea-700 line-through decoration-marea-700/60" : "text-marea-100 hover:bg-marea-700/40",
                                isToday && !isSel ? "border border-marea-400" : "",
                                isSel ? "bg-gradient-to-br from-marea-400 to-marea-700 font-bold text-white shadow-lg shadow-marea-700/40" : ""].join(" ")}>
                              {dd.getDate()}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {activityInfo ? null : isHospedaje ? (
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.shop.nights}</label>
                          <input type="number" min={1} value={nights} onChange={(e) => setNights(Math.max(1, parseInt(e.target.value) || 1))} className={inputC} />
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm text-marea-300">{t.shop.checkOut}</label>
                          <input readOnly value={selDate ? addDays(iso(selDate), Math.max(1, nights)) : "—"} className={`${inputC} opacity-70`} />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <label className="mb-1.5 block text-sm text-marea-300">{t.booking.time}</label>
                        <div className="grid grid-cols-4 gap-2">
                          {TIME_SLOTS.map((s) => (
                            <button key={s} type="button" onClick={() => setTimeSlot(s)}
                              className={`rounded-lg border py-2.5 text-sm transition-colors ${timeSlot === s ? "border-marea-400 bg-marea-500 font-semibold text-white" : "border-marea-400/25 bg-marea-900/40 text-marea-200 hover:border-marea-400"}`}>
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: extras + contact */}
                  <div className="space-y-4">
                    <div className="mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-marea-300">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-marea-500 text-[10px] text-white">2</span>
                      {t.booking.yourDetails}
                    </div>

                    {!activityInfo && optionalActs.length > 0 && (
                      <div className="rounded-xl border border-marea-400/15 bg-marea-900/30 p-3">
                        <span className="mb-2 block text-sm text-marea-300">{t.shop.extras}</span>
                        <div className="space-y-1.5">
                          {optionalActs.map((a) => (
                            <label key={a.id} className="flex cursor-pointer items-center justify-between gap-2 text-sm">
                              <span className="flex items-center gap-2 text-marea-100">
                                <input type="checkbox" checked={extras.includes(a.id)} onChange={() => toggleExtra(a.id)} className="accent-marea-500" />
                                {lang === "es" ? a.nameEs : a.nameEn}
                              </span>
                              <span className="text-marea-300">+{formatPrice(a.price, "COP", lang)}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="mb-1.5 block text-sm text-marea-300">{t.booking.name} *</label><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} className={inputC} /></div>
                      <div><label className="mb-1.5 block text-sm text-marea-300">{t.booking.phone} *</label><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+57 300 000 0000" className={inputC} /></div>
                    </div>
                    <div><label className="mb-1.5 block text-sm text-marea-300">{t.booking.email} *</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} className={inputC} /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1.5 block text-sm text-marea-300">{t.booking.language}</label>
                        <select value={flang} onChange={(e) => setFlang(e.target.value as "es" | "en")} className={inputC}>
                          <option value="es">{t.booking.spanish}</option>
                          <option value="en">{t.booking.english}</option>
                        </select>
                      </div>
                      <div><label className="mb-1.5 block text-sm text-marea-300">{t.booking.people}</label><input type="number" min={1} max={selectedPkg?.maxPeople ?? 20} value={people} onChange={(e) => setPeople(Math.max(1, parseInt(e.target.value) || 1))} className={inputC} /></div>
                    </div>
                    <div><label className="mb-1.5 block text-sm text-marea-300">{t.booking.notes}</label><textarea rows={2} value={contact.notes} onChange={(e) => setContact({ ...contact, notes: e.target.value })} placeholder={t.booking.notesPlaceholder} className={inputC} /></div>
                  </div>

                  {/* summary + submit */}
                  <div className="md:col-span-2">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-marea-900/50 px-4 py-3 text-sm">
                      <span className="inline-flex items-center gap-2 rounded-full bg-marea-700/40 px-3 py-1 text-marea-100">
                        📅 {selDate ? iso(selDate) : "—"}{!activityInfo && isHospedaje && selDate ? ` · ${nights} ${t.shop.nights}` : !activityInfo && selDate ? ` · ${timeSlot}` : ""}
                      </span>
                      <span className="text-marea-300">{titleOf}</span>
                      <span className="font-bold text-white">{t.shop.total}: {money(total)}</span>
                    </div>
                    {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
                    <button type="submit" disabled={status === "loading"} className="btn-glow flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-marea-400 to-marea-700 py-3.5 font-semibold text-white disabled:opacity-60">
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
