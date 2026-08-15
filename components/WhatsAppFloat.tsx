"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WhatsAppIcon } from "./Hero";
import { useLang } from "./LanguageContext";
import { whatsappUrl } from "@/lib/format";

export function WhatsAppFloat({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useLang();
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    const timer = setTimeout(() => setTip(true), 3000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3"
        >
          <AnimatePresence>
            {tip && (
              <motion.a
                href={whatsappUrl(whatsappNumber, t.whatsapp.prefill)}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-marea-800 shadow-lg sm:block"
              >
                {t.whatsapp.float}
              </motion.a>
            )}
          </AnimatePresence>
          <a
            href={whatsappUrl(whatsappNumber, t.whatsapp.prefill)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl shadow-green-500/40 transition-transform hover:scale-110"
          >
            <span className="absolute inset-0 animate-ping rounded-full bg-green-500 opacity-40" />
            <WhatsAppIcon className="relative h-7 w-7" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
