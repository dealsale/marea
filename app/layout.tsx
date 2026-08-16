import type { Metadata, Viewport } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import { ServiceWorker } from "@/components/pwa/ServiceWorker";

const display = Cinzel({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-display" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://mareatours.site"),
  title: "Marea Tours | Descubre Colombia — Tours en Medellín y la Comuna 13",
  description:
    "Descubre Colombia con Marea Tours: experiencias culturales bilingües con guías locales, desde la Comuna 13 de Medellín. +5 años de experiencia. Algunos tours gratis. Reserva online.",
  keywords: ["descubrir Colombia", "tours Colombia", "Comuna 13", "tours Medellín", "graffiti tour", "Marea Tours"],
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
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "Marea Tours" },
};

export const viewport: Viewport = {
  themeColor: "#2e1065",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
