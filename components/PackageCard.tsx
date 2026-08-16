"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TourImage } from "./TourImage";
import { Reveal } from "./Reveal";
import { useLang } from "./LanguageContext";
import { formatPrice } from "@/lib/format";
import { TYPE_LABELS, type PackageDTO } from "@/lib/types";

const typeBadge: Record<string, string> = {
  tour: "bg-marea-500/80 text-white",
  escape: "bg-cyan-500/80 text-white",
  hospedaje: "bg-amber-500/80 text-marea-950",
};

export function priceLabel(p: PackageDTO, lang: "es" | "en", t: any) {
  if (p.price === 0) return t.shop.free;
  const money = formatPrice(p.price, p.currency, lang);
  return p.type === "hospedaje" ? `${money} ${t.shop.perNight}` : `${t.shop.from} ${money}`;
}

export function PackageCard({
  pkg,
  index,
  onBook,
  onDetails,
}: {
  pkg: PackageDTO;
  index: number;
  onBook: (id: string) => void;
  onDetails: (pkg: PackageDTO) => void;
}) {
  const { t, lang } = useLang();
  const title = lang === "es" ? pkg.titleEs : pkg.titleEn;
  const summary = lang === "es" ? pkg.summaryEs : pkg.summaryEn;
  const isFree = pkg.price === 0;

  return (
    <Reveal delay={(index % 3) * 0.07}>
      <motion.div
        whileHover={{ y: -7 }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-marea-400/15 bg-marea-900/40"
      >
        <div className="relative h-44 overflow-hidden">
          <div className="h-full w-full transition-transform duration-500 group-hover:scale-110">
            <TourImage image={pkg.image} className="h-full w-full" />
          </div>
          <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${typeBadge[pkg.type] || "bg-marea-700 text-white"}`}>
            {TYPE_LABELS[pkg.type]?.[lang] || pkg.type}
          </span>
          <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${isFree ? "bg-green-500 text-white" : "bg-marea-950/80 text-marea-100"}`}>
            {priceLabel(pkg, lang, t)}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 flex-1 text-sm text-marea-300">{summary}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-marea-400">
            {pkg.type === "hospedaje" ? (
              <span>🌙 {t.shop.perNight.replace("/ ", "")}</span>
            ) : (
              <span>🕒 {Math.round(pkg.durationMin / 60)}h</span>
            )}
            <span>👥 máx {pkg.maxPeople}</span>
            {pkg.activities.length > 0 && <span>✨ {pkg.activities.length} act.</span>}
          </div>
          <div className="mt-5 flex gap-2">
            <button
              onClick={() => onBook(pkg.id)}
              className="btn-glow flex-1 rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 py-2.5 text-sm font-semibold text-white"
            >
              {t.shop.book}
            </button>
            <button
              onClick={() => onDetails(pkg)}
              className="rounded-full border border-marea-400/30 px-4 py-2.5 text-sm text-marea-200 transition-colors hover:bg-marea-800/50"
            >
              {t.shop.details}
            </button>
          </div>
        </div>
      </motion.div>
    </Reveal>
  );
}

export function PackageModal({
  pkg,
  onClose,
  onBookPackage,
  onBookActivity,
}: {
  pkg: PackageDTO | null;
  onClose: () => void;
  onBookPackage: (id: string) => void;
  onBookActivity: (activityId: string) => void;
}) {
  const { t, lang } = useLang();
  return (
    <AnimatePresence>
      {pkg && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[86vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-marea-400/20 bg-marea-950"
          >
            <div className="relative h-48">
              <TourImage image={pkg.image} className="h-full w-full" />
              <button onClick={onClose} className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70">✕</button>
              <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-bold ${typeBadge[pkg.type] || "bg-marea-700 text-white"}`}>
                {TYPE_LABELS[pkg.type]?.[lang] || pkg.type}
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-2xl font-bold text-white">{lang === "es" ? pkg.titleEs : pkg.titleEn}</h3>
                <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${pkg.price === 0 ? "bg-green-500 text-white" : "bg-marea-700 text-white"}`}>
                  {priceLabel(pkg, lang, t)}
                </span>
              </div>
              <p className="mt-3 text-marea-200">{lang === "es" ? pkg.descriptionEs : pkg.descriptionEn}</p>

              <div className="mt-4 space-y-1.5 text-sm text-marea-300">
                {pkg.type !== "hospedaje" && <div>🕒 {pkg.durationMin} min</div>}
                <div>👥 máx {pkg.maxPeople}</div>
                {pkg.meetingPoint && <div>📍 {pkg.meetingPoint}</div>}
              </div>

              {pkg.activities.filter((a) => !a.optional).length > 0 && (
                <div className="mt-5">
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-marea-300">{t.shop.includes}</h4>
                  <ul className="space-y-1.5">
                    {pkg.activities.filter((a) => !a.optional).map((a) => (
                      <li key={a.id} className="flex items-center gap-2 text-sm text-marea-100">
                        <span className="text-green-400">✓</span> {lang === "es" ? a.nameEs : a.nameEn}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pkg.activities.filter((a) => a.optional).length > 0 && (
                <div className="mt-5">
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-marea-300">{t.shop.optionalExtras}</h4>
                  <ul className="space-y-1.5">
                    {pkg.activities.filter((a) => a.optional).map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-2 rounded-lg bg-marea-900/50 px-3 py-2 text-sm">
                        <span className="text-marea-100">➕ {lang === "es" ? a.nameEs : a.nameEn}</span>
                        <span className="flex items-center gap-2">
                          <span className="text-marea-300">+{formatPrice(a.price, pkg.currency, lang)}</span>
                          {a.bookableAlone && (
                            <button onClick={() => onBookActivity(a.id)} className="rounded-full bg-marea-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-marea-500">
                              {t.shop.bookAlone}
                            </button>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => onBookPackage(pkg.id)}
                className="btn-glow mt-6 w-full rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 py-3 font-semibold text-white"
              >
                {t.shop.bookPackage}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
