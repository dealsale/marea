import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const display = Cinzel({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mareatours.site"),
  title: "Marea Tours | Tours en la Comuna 13, Medellín",
  description:
    "Tours culturales bilingües por la Comuna 13 de Medellín. +5 años de experiencia, guías locales, arte urbano e historia. Algunos tours gratis. Reserva online.",
  keywords: ["Comuna 13", "tours Medellín", "graffiti tour", "Comuna 13 tour English", "Marea Tours"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Marea Tours | Comuna 13, Medellín",
    description: "Tours culturales bilingües por la Comuna 13. Reserva online, algunos tours gratis.",
    url: "https://mareatours.site",
    siteName: "Marea Tours",
    type: "website",
    locale: "es_CO",
    images: [{ url: "/logo.png", width: 512, height: 436, alt: "Marea Tours" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marea Tours | Comuna 13, Medellín",
    description: "Tours culturales bilingües por la Comuna 13. Reserva online, algunos tours gratis.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
