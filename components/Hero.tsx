"use client";

import { motion } from "framer-motion";
import { LogoMark } from "./Logo";
import { useLang } from "./LanguageContext";
import { whatsappUrl } from "@/lib/format";

const stats = [
  { key: "stat1", value: "5+" },
  { key: "stat2", value: "10k+" },
  { key: "stat3", value: "4.9★" },
  { key: "stat4", value: "ES / EN" },
] as const;

export function Hero({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useLang();

  return (
    <section id="top" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="aurora absolute inset-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-marea-950/40 via-marea-950/70 to-marea-950" />

      {/* Floating orbs */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-marea-500/20 blur-2xl"
          style={{ width: 120 + i * 40, height: 120 + i * 40, left: `${10 + i * 18}%`, top: `${15 + (i % 3) * 22}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pt-28 pb-16 md:grid-cols-2">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-marea-400/30 bg-marea-900/40 px-4 py-1.5 text-xs font-medium text-marea-200"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            {t.hero.badge}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-5 font-display text-5xl font-bold leading-[1.05] sm:text-6xl lg:text-7xl"
          >
            {t.hero.title1}
            <br />
            <span className="text-gradient animate-gradient-x bg-[length:200%_auto]">{t.hero.title2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-6 max-w-lg text-lg text-marea-200"
          >
            {t.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <a
              href="#book"
              className="btn-glow rounded-full bg-gradient-to-r from-marea-400 to-marea-700 px-7 py-3.5 font-semibold text-white"
            >
              {t.hero.ctaBook}
            </a>
            <a
              href={whatsappUrl(whatsappNumber, t.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-marea-400/40 bg-marea-900/30 px-7 py-3.5 font-semibold text-white transition-colors hover:bg-marea-800/50"
            >
              <WhatsAppIcon className="h-5 w-5" />
              {t.hero.ctaWhatsapp}
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-12 grid grid-cols-4 gap-4"
          >
            {stats.map((s) => (
              <div key={s.key}>
                <div className="font-display text-2xl font-bold text-white sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs text-marea-300">{t.hero[s.key]}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          className="relative hidden justify-center md:flex"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 m-auto h-80 w-80 rounded-full border border-dashed border-marea-400/30"
          />
          <motion.div
            className="animate-float"
          >
            <div className="absolute -inset-10 rounded-full bg-marea-500/30 blur-3xl" />
            <LogoMark className="relative h-72 w-72 object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.5)]" />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-marea-400/50 p-1.5"
        >
          <div className="h-2 w-1 rounded-full bg-marea-300" />
        </motion.div>
      </div>
    </section>
  );
}

export function WhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
    </svg>
  );
}
