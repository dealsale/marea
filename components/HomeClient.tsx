"use client";

import { useState } from "react";
import { LanguageProvider, useLang } from "./LanguageContext";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { LineSection } from "./LineSection";
import { PackageModal } from "./PackageCard";
import { About } from "./About";
import { Reviews } from "./Reviews";
import { FAQ } from "./FAQ";
import { BookingSection } from "./BookingSection";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { Footer } from "./Footer";
import { Reveal } from "./Reveal";
import type { LineDTO, PackageDTO } from "@/lib/types";

function Experiences({
  lines,
  onBook,
  onDetails,
}: {
  lines: LineDTO[];
  onBook: (id: string) => void;
  onDetails: (pkg: PackageDTO) => void;
}) {
  const { t } = useLang();
  return (
    <section id="tours" className="mx-auto max-w-7xl px-5 py-24">
      <Reveal className="text-center">
        <span className="eyebrow text-marea-400">Marea</span>
        <h2 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{t.shop.linesTitle}</h2>
        <p className="mt-3 text-marea-300">{t.shop.linesSubtitle}</p>
      </Reveal>
      <div className="mt-10 divide-y divide-marea-400/10">
        {lines.map((line, i) => (
          <LineSection key={line.id} line={line} index={i} onBook={onBook} onDetails={onDetails} />
        ))}
      </div>
    </section>
  );
}

export function HomeClient({ lines, whatsappNumber }: { lines: LineDTO[]; whatsappNumber: string }) {
  const [target, setTarget] = useState<{ packageId?: string; activityId?: string }>(
    lines[0]?.packages[0]?.id ? { packageId: lines[0].packages[0].id } : {}
  );
  const [modalPkg, setModalPkg] = useState<PackageDTO | null>(null);

  const scrollToBook = () => document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  const bookPackage = (id: string) => { setTarget({ packageId: id }); scrollToBook(); };
  const bookActivity = (activityId: string) => { setTarget({ activityId }); setModalPkg(null); scrollToBook(); };

  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero whatsappNumber={whatsappNumber} />
        <Experiences lines={lines} onBook={bookPackage} onDetails={setModalPkg} />
        <About />
        <Reviews />
        <BookingSection lines={lines} target={target} whatsappNumber={whatsappNumber} />
        <FAQ />
      </main>
      <Footer whatsappNumber={whatsappNumber} />
      <WhatsAppFloat whatsappNumber={whatsappNumber} />
      <PackageModal pkg={modalPkg} onClose={() => setModalPkg(null)} onBookPackage={bookPackage} onBookActivity={bookActivity} />
    </LanguageProvider>
  );
}
