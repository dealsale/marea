"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TourImage } from "./TourImage";
import { Reveal } from "./Reveal";
import { useLang } from "./LanguageContext";
import { formatPrice } from "@/lib/format";
import type { TourDTO } from "@/lib/types";

export function ToursSection({
  tours,
  onBook,
}: {
  tours: TourDTO[];
  onBook: (tourId: string) => void;
}) {
  const { t, lang } = useLang();
  const [active, setActive] = useState<TourDTO | null>(null);

  const categories = ["all", ...Array.from(new Set(tours.map((x) => x.category)))];
  const [filter, setFilter] = useState("all");
  const shown = filter === "all" ? tours : tours.filter((x) => x.category === filter);

  return (
    <section id="tours" className="relative mx-auto max-w-7xl px-5 py-24">
      <Reveal className="text-center">
        <h2 className="font-display text-4xl font-bold sm:text-5xl">{t.tours.title}</h2>
        <p className="mt-3 text-marea-300">{t.tours.subtitle}</p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8 flex flex-wrap justify-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
              filter === c ? "bg-marea-500 text-white" : "bg-marea-900/50 text-marea-300 hover:text-white"
            }`}
          >
            {c === "all" ? t.tours.all : c}
          </button>
        ))}
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((tour, i) => {
          const title = lang === "es" ? tour.titleEs : tour.titleEn;
          const summary = lang === "es" ? tour.summaryEs : tour.summaryEn;
          const isFree = tour.price === 0;
          return (
            <Reveal key={tour.id} delay={(i % 3) * 0.08}>
              <motion.div
                whileHover={{ y: -8 }}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-marea-400/15 bg-marea-900/40"
              >
                <div className="relative h-44 overflow-hidden">
                  <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
                    <TourImage image={tour.image} className="h-full w-full" />
                  </div>
                  {tour.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-marea-800">
                      ★ Top
                    </span>
                  )}
                  <span
                    className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${
                      isFree ? "bg-green-500 text-white" : "bg-marea-950/80 text-marea-100"
                    }`}
                  >
                    {isFree ? t.tours.free : `${t.tours.from} ${formatPrice(tour.price, tour.currency, lang)}`}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
                  <p className="mt-2 flex-1 text-sm text-marea-300">{summary}</p>

                  <div className="mt-4 flex items-center gap-4 text-xs text-marea-400">
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" /> {Math.round(tour.durationMin / 60)}h {tour.durationMin % 60 ? `${tour.durationMin % 60}m` : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" /> max {tour.maxPeople}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => onBook(tour.id)}
                      className="btn-glow flex-1 rounded-full bg-gradient-to-r from-marea-500 to-marea-700 py-2.5 text-sm font-semibold text-white"
                    >
                      {t.tours.book}
                    </button>
                    <button
                      onClick={() => setActive(tour)}
                      className="rounded-full border border-marea-400/30 px-4 py-2.5 text-sm text-marea-200 transition-colors hover:bg-marea-800/50"
                    >
                      {t.tours.details}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          );
        })}
      </div>

      {/* Details modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-marea-400/20 bg-marea-950"
            >
              <div className="relative h-48">
                <TourImage image={active.image} className="h-full w-full" />
                <button
                  onClick={() => setActive(null)}
                  className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-2xl font-bold text-white">
                    {lang === "es" ? active.titleEs : active.titleEn}
                  </h3>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
                      active.price === 0 ? "bg-green-500 text-white" : "bg-marea-700 text-white"
                    }`}
                  >
                    {formatPrice(active.price, active.currency, lang)}
                  </span>
                </div>
                <p className="mt-4 text-marea-200">
                  {lang === "es" ? active.descriptionEs : active.descriptionEn}
                </p>
                <div className="mt-5 space-y-2 text-sm text-marea-300">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4" /> {active.durationMin} {t.tours.min}
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon className="h-4 w-4" /> max {active.maxPeople}
                  </div>
                  {active.meetingPoint && (
                    <div className="flex items-center gap-2">
                      <PinIcon className="h-4 w-4" /> {active.meetingPoint}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => {
                    onBook(active.id);
                    setActive(null);
                  }}
                  className="btn-glow mt-6 w-full rounded-full bg-gradient-to-r from-marea-400 to-marea-700 py-3 font-semibold text-white"
                >
                  {t.tours.book}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ClockIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" />
    </svg>
  );
}
function UsersIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3 3-5 6-5s6 2 6 5" strokeLinecap="round" />
      <path d="M16 6a3 3 0 010 6M18 20c0-2-1-3.5-2.5-4.5" strokeLinecap="round" />
    </svg>
  );
}
function PinIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
