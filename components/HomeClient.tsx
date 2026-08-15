"use client";

import { useState } from "react";
import { LanguageProvider } from "./LanguageContext";
import { Navbar } from "./Navbar";
import { Hero } from "./Hero";
import { ToursSection } from "./ToursSection";
import { About } from "./About";
import { Reviews } from "./Reviews";
import { FAQ } from "./FAQ";
import { BookingSection } from "./BookingSection";
import { WhatsAppFloat } from "./WhatsAppFloat";
import { Footer } from "./Footer";
import type { TourDTO } from "@/lib/types";

export function HomeClient({ tours, whatsappNumber }: { tours: TourDTO[]; whatsappNumber: string }) {
  const [selectedTourId, setSelectedTourId] = useState(tours[0]?.id ?? "");

  const handleBook = (tourId: string) => {
    setSelectedTourId(tourId);
    document.getElementById("book")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <LanguageProvider>
      <Navbar />
      <main>
        <Hero whatsappNumber={whatsappNumber} />
        <ToursSection tours={tours} onBook={handleBook} />
        <About />
        <Reviews />
        <BookingSection tours={tours} selectedTourId={selectedTourId} whatsappNumber={whatsappNumber} />
        <FAQ />
      </main>
      <Footer whatsappNumber={whatsappNumber} />
      <WhatsAppFloat whatsappNumber={whatsappNumber} />
    </LanguageProvider>
  );
}
