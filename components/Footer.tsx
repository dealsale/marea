"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./Hero";
import { useLang } from "./LanguageContext";
import { whatsappUrl } from "@/lib/format";

export function Footer({ whatsappNumber }: { whatsappNumber: string }) {
  const { t } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-marea-400/15 bg-marea-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 md:grid-cols-4">
        <div className="sm:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-marea-300">{t.footer.tagline}</p>
          <div className="mt-4 flex gap-3">
            <a
              href={whatsappUrl(whatsappNumber, t.whatsapp.prefill)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white transition-transform hover:scale-110"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-marea-800 text-white transition-transform hover:scale-110"
              aria-label="Instagram"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.3 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .3-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.3-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.3 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.7A6.1 6.1 0 1012 18a6.1 6.1 0 000-12.1zm0 10a3.9 3.9 0 110-7.8 3.9 3.9 0 010 7.8zm6.4-10.2a1.4 1.4 0 11-2.9 0 1.4 1.4 0 012.9 0z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-marea-50">{t.footer.links}</h4>
          <ul className="mt-4 space-y-2 text-sm text-marea-300">
            <li><a href="#tours" className="hover:text-marea-50">{t.nav.tours}</a></li>
            <li><a href="#about" className="hover:text-marea-50">{t.nav.about}</a></li>
            <li><a href="#reviews" className="hover:text-marea-50">{t.nav.reviews}</a></li>
            <li><a href="#book" className="hover:text-marea-50">{t.nav.book}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-marea-50">{t.footer.contact}</h4>
          <ul className="mt-4 space-y-2 text-sm text-marea-300">
            <li>📍 Comuna 13, Medellín</li>
            <li>🕘 9:00 - 18:00</li>
            <li>🌎 ES / EN</li>
            <li>
              <a
                href={whatsappUrl(whatsappNumber, t.whatsapp.prefill)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-marea-50"
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-marea-400/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-marea-400 sm:flex-row">
          <span>© {year} Marea Tours. {t.footer.rights}</span>
          <Link href="/admin" className="hover:text-marea-200">
            {t.footer.admin}
          </Link>
        </div>
      </div>
    </footer>
  );
}
