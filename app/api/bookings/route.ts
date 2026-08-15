import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { whatsappUrl, formatPrice } from "@/lib/format";

const schema = z.object({
  tourId: z.string().min(1),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  language: z.enum(["es", "en"]).default("es"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  timeSlot: z.string().min(1).max(10),
  people: z.number().int().min(1).max(50),
  notes: z.string().max(500).optional().default(""),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }
    const data = parsed.data;

    const tour = await prisma.tour.findUnique({ where: { id: data.tourId } });
    if (!tour || !tour.active) {
      return NextResponse.json({ error: "Tour not found" }, { status: 404 });
    }

    const booking = await prisma.booking.create({
      data: {
        tourId: data.tourId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        language: data.language,
        date: data.date,
        timeSlot: data.timeSlot,
        people: data.people,
        notes: data.notes ?? "",
      },
    });

    const lang = data.language;
    const title = lang === "es" ? tour.titleEs : tour.titleEn;
    const priceLabel =
      tour.price === 0
        ? lang === "es"
          ? "Gratis (a la gorra)"
          : "Free (tip-based)"
        : formatPrice(tour.price * data.people, tour.currency, lang);

    const msg =
      lang === "es"
        ? `¡Hola Marea Tours! 🌟 Quiero confirmar mi reserva:\n\n` +
          `🎫 Tour: ${title}\n👤 Nombre: ${data.name}\n📅 Fecha: ${data.date} a las ${data.timeSlot}\n` +
          `👥 Personas: ${data.people}\n🗣️ Idioma: Español\n💵 Valor: ${priceLabel}\n` +
          (data.notes ? `📝 Notas: ${data.notes}\n` : "") +
          `\nRef: ${booking.id.slice(-6).toUpperCase()}`
        : `Hi Marea Tours! 🌟 I'd like to confirm my booking:\n\n` +
          `🎫 Tour: ${title}\n👤 Name: ${data.name}\n📅 Date: ${data.date} at ${data.timeSlot}\n` +
          `👥 People: ${data.people}\n🗣️ Language: English\n💵 Price: ${priceLabel}\n` +
          (data.notes ? `📝 Notes: ${data.notes}\n` : "") +
          `\nRef: ${booking.id.slice(-6).toUpperCase()}`;

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";

    return NextResponse.json({
      ok: true,
      bookingId: booking.id,
      whatsappUrl: whatsappUrl(number, msg),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
