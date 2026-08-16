import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const slugify = (s: string) =>
  String(s || `paquete-${Date.now()}`).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const actData = (a: any, i: number) => ({
  nameEs: a.nameEs || "Actividad",
  nameEn: a.nameEn || a.nameEs || "Activity",
  descEs: a.descEs || "",
  descEn: a.descEn || "",
  price: Number(a.price) || 0,
  optional: Boolean(a.optional),
  bookableAlone: Boolean(a.bookableAlone),
  durationMin: Number(a.durationMin) || 60,
  order: i,
});

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const packages = await prisma.package.findMany({
    orderBy: [{ lineId: "asc" }, { order: "asc" }],
    include: { line: true, activities: { orderBy: { order: "asc" } }, _count: { select: { bookings: true } } },
  });
  return NextResponse.json({ packages });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  if (!b.lineId) return NextResponse.json({ error: "lineId requerido" }, { status: 400 });
  const activities: any[] = Array.isArray(b.activities) ? b.activities : [];
  try {
    const pkg = await prisma.package.create({
      data: {
        slug: slugify(b.slug || b.titleEs),
        lineId: b.lineId,
        type: ["tour", "escape", "hospedaje"].includes(b.type) ? b.type : "tour",
        titleEs: b.titleEs || "Nuevo paquete",
        titleEn: b.titleEn || b.titleEs || "New package",
        summaryEs: b.summaryEs || "",
        summaryEn: b.summaryEn || "",
        descriptionEs: b.descriptionEs || "",
        descriptionEn: b.descriptionEn || "",
        price: Number(b.price) || 0,
        durationMin: Number(b.durationMin) || 180,
        meetingPoint: b.meetingPoint || "",
        image: b.image || "graffiti",
        availableDays: b.availableDays || "0,1,2,3,4,5,6",
        blockedDates: b.blockedDates || "",
        maxPeople: Number(b.maxPeople) || 15,
        featured: Boolean(b.featured),
        active: b.active !== false,
        order: Number(b.order) || 0,
        activities: { create: activities.map(actData) },
      },
    });
    return NextResponse.json({ ok: true, pkg });
  } catch (e) {
    return NextResponse.json({ error: "No se pudo crear (slug duplicado)" }, { status: 400 });
  }
}
