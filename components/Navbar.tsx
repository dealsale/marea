"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { InstallButton } from "./pwa/InstallButton";
import { ThemeToggle } from "./pwa/ThemeToggle";
import { useLang } from "./LanguageContext";

export function Navbar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#tours", label: t.nav.tours },
    { href: "#about", label: t.nav.about },
    { href: "#reviews", label: t.nav.reviews },
    { href: "#faq", label: t.nav.faq },
  ];

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "glass py-2 shadow-lg shadow-marea-950/50" : "bg-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5">
        <a href="#top" aria-label="Marea Tours">
          <Logo />
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-marea-200 transition-colors hover:text-marea-50"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-full border border-marea-400/30 text-xs">
            {(["es", "en"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 font-semibold uppercase transition-colors ${
                  lang === l ? "bg-marea-500 text-white" : "text-marea-300 hover:text-white"
                }`}
                aria-pressed={lang === l}
              >
                {l}
              </button>
            ))}
          </div>
          <ThemeToggle />
          <div className="hidden lg:block">
            <InstallButton variant="nav" />
          </div>
          <a
            href="#book"
            className="btn-glow hidden rounded-full bg-gradient-to-r from-magenta-500 to-magenta-600 px-5 py-2 text-sm font-semibold text-white sm:block"
          >
            {t.nav.book}
          </a>
          <button
            className="md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="menu"
          >
            <div className="space-y-1.5">
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <motion.nav
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mx-auto mt-3 flex max-w-7xl flex-col gap-1 px-5 md:hidden"
        >
          {[...links, { href: "#book", label: t.nav.book }].map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-marea-100 hover:bg-marea-800/50"
            >
              {l.label}
            </a>
          ))}
          <div className="px-3 py-2" onClick={() => setOpen(false)}>
            <InstallButton variant="nav" />
          </div>
        </motion.nav>
      )}
    </motion.header>
  );
}
