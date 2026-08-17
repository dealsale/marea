"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../LanguageContext";

const T = {
  es: { install: "Instalar app", title: "Instala Marea Tours", ios: "En tu iPhone: toca", share: "Compartir", then: "y luego", add: "Añadir a pantalla de inicio", close: "Entendido" },
  en: { install: "Install app", title: "Install Marea Tours", ios: "On your iPhone: tap", share: "Share", then: "then", add: "Add to Home Screen", close: "Got it" },
};

export function InstallButton({ variant = "nav" }: { variant?: "nav" | "floating" }) {
  const { lang } = useLang();
  const t = T[lang];
  const [deferred, setDeferred] = useState<any>(null);
  const [installed, setInstalled] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [iosHelp, setIosHelp] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone === true;
    if (standalone) { setInstalled(true); return; }
    const ua = navigator.userAgent || "";
    setIsIos(/iphone|ipad|ipod/i.test(ua) && !/crios|fxios/i.test(ua));

    const onPrompt = (e: Event) => { e.preventDefault(); setDeferred(e); };
    const onInstalled = () => { setInstalled(true); setDeferred(null); };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const canInstall = !installed && (!!deferred || isIos);
  if (!canInstall) return null;

  const doInstall = async () => {
    if (deferred) {
      deferred.prompt();
      try { await deferred.userChoice; } catch {}
      setDeferred(null);
    } else if (isIos) {
      setIosHelp(true);
    }
  };

  const btnClass =
    variant === "floating"
      ? "flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-marea-700/40"
      : "flex items-center gap-2 rounded-full border border-marea-400/40 bg-marea-900/40 px-4 py-2 text-sm font-semibold text-marea-50 transition-colors hover:bg-marea-800/60";

  return (
    <>
      <button onClick={doInstall} className={btnClass} aria-label={t.install}>
        <DownloadIcon className="h-4 w-4" />
        {t.install}
      </button>

      <AnimatePresence>
        {iosHelp && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setIosHelp(false)}
            className="fixed inset-0 z-[80] flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
          >
            <motion.div
              initial={{ y: 30, scale: 0.96 }} animate={{ y: 0, scale: 1 }} exit={{ y: 30, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-marea-400/20 bg-marea-950 p-6 text-center"
            >
              <h3 className="font-display text-xl font-bold text-marea-50">{t.title}</h3>
              <p className="mt-3 text-sm text-marea-200">
                {t.ios} <b className="text-marea-50">“{t.share}” ⬆️</b> {t.then} <b className="text-marea-50">“{t.add}” ➕</b>
              </p>
              <button onClick={() => setIosHelp(false)} className="btn-glow mt-5 w-full rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 py-2.5 text-sm font-semibold text-white">
                {t.close}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function DownloadIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v12" />
      <path d="M7 10l5 5 5-5" />
      <path d="M5 21h14" />
    </svg>
  );
}
