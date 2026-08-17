import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { whatsappUrl, formatPrice } from "@/lib/format";
import { TYPE_LABELS } from "@/lib/types";
import { getCustomerId } from "@/lib/customerAuth";

const schema = z.object({
  packageId: z.string().optional(),
  activityId: z.string().optional(),
  extras: z.array(z.string()).optional().default([]),
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(5).max(40),
  language: z.enum(["es", "en"]).default("es"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  timeSlot: z.string().max(10).optional().default(""),
  people: z.number().int().min(1).max(50),
  notes: z.string().max(500).optional().default(""),
});

const nightsBetween = (a: string, b: string) =>
  Math.max(1, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }
    const d = parsed.data;
    const lang = d.language;
    if (!d.packageId && !d.activityId) {
      return NextResponse.json({ error: "packageId or activityId required" }, { status: 400 });
    }

    let total = 0;
    let nights = 1;
    let endDate: string | null = null;
    let title = "";
    let typeLabel = "";
    let lineName = "";
    const extraNames: string[] = [];

    if (d.activityId) {
      const act = await prisma.activity.findUnique({
        where: { id: d.activityId },
        include: { package: { include: { line: true } } },
      });
      if (!act) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
      title = lang === "es" ? act.nameEs : act.nameEn;
      typeLabel = lang === "es" ? "Actividad" : "Activity";
      lineName = act.package.line ? (lang === "es" ? act.package.line.nameEs : act.package.line.nameEn) : "";
      total = act.price * d.people;
    } else {
      const pkg = await prisma.package.findUnique({
        where: { id: d.packageId! },
        include: { line: true, activities: true },
      });
      if (!pkg || !pkg.active) return NextResponse.json({ error: "Package not found" }, { status: 404 });
      title = lang === "es" ? pkg.titleEs : pkg.titleEn;
      typeLabel = (TYPE_LABELS[pkg.type]?.[lang]) || pkg.type;
      lineName = lang === "es" ? pkg.line.nameEs : pkg.line.nameEn;

      const chosen = pkg.activities.filter((a) => a.optional && d.extras.includes(a.id));
      const extrasTotal = chosen.reduce((s, a) => s + a.price, 0) * d.people;
      chosen.forEach((a) => extraNames.push(lang === "es" ? a.nameEs : a.nameEn));

      if (pkg.type === "hospedaje") {
        if (!d.endDate) return NextResponse.json({ error: "endDate required for hospedaje" }, { status: 400 });
        nights = nightsBetween(d.date, d.endDate);
        endDate = d.endDate;
        total = pkg.price * nights + extrasTotal;
      } else {
        total = pkg.price * d.people + extrasTotal;
      }
    }

    const customerId = getCustomerId();

    const booking = await prisma.booking.create({
      data: {
        packageId: d.packageId || null,
        activityId: d.activityId || null,
        customerId: customerId || null,
        name: d.name,
        email: d.email,
        phone: d.phone,
        language: lang,
        date: d.date,
        endDate,
        timeSlot: d.timeSlot || "",
        nights,
        people: d.people,
        extras: d.extras.join(","),
        notes: d.notes || "",
        total,
      },
    });

    const priceLabel = total === 0 ? (lang === "es" ? "Gratis (a la gorra)" : "Free (tip-based)") : formatPrice(total, "COP", lang);
    const ref = booking.id.slice(-6).toUpperCase();
    const dateLine = endDate
      ? (lang === "es" ? `📅 ${d.date} → ${endDate} (${nights} noche(s))` : `📅 ${d.date} → ${endDate} (${nights} night(s))`)
      : `📅 ${d.date}${d.timeSlot ? ` · ${d.timeSlot}` : ""}`;

    const lines = lang === "es"
      ? [
          `¡Hola Marea Tours! 🌟 Quiero confirmar mi reserva:`, ``,
          lineName ? `📍 Línea: ${lineName}` : "",
          `🎫 ${typeLabel}: ${title}`,
          `👤 ${d.name}`,
          dateLine,
          `👥 Personas: ${d.people}`,
          extraNames.length ? `➕ Extras: ${extraNames.join(", ")}` : "",
          `💵 Total: ${priceLabel}`,
          d.notes ? `📝 ${d.notes}` : "",
          ``, `Ref: ${ref}`,
        ]
      : [
          `Hi Marea Tours! 🌟 I'd like to confirm my booking:`, ``,
          lineName ? `📍 Line: ${lineName}` : "",
          `🎫 ${typeLabel}: ${title}`,
          `👤 ${d.name}`,
          dateLine,
          `👥 People: ${d.people}`,
          extraNames.length ? `➕ Extras: ${extraNames.join(", ")}` : "",
          `💵 Total: ${priceLabel}`,
          d.notes ? `📝 ${d.notes}` : "",
          ``, `Ref: ${ref}`,
        ];
    const msg = lines.filter((l) => l !== "").join("\n");

    const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";
    return NextResponse.json({ ok: true, bookingId: booking.id, whatsappUrl: whatsappUrl(number, msg) });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
