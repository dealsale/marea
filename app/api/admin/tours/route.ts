import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const tours = await prisma.tour.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { bookings: true } } },
  });
  return NextResponse.json({ tours });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const slug = String(b.slug || `tour-${Date.now()}`)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  try {
    const tour = await prisma.tour.create({
      data: {
        slug,
        titleEs: b.titleEs || "Nuevo tour",
        titleEn: b.titleEn || "New tour",
        summaryEs: b.summaryEs || "",
        summaryEn: b.summaryEn || "",
        descriptionEs: b.descriptionEs || "",
        descriptionEn: b.descriptionEn || "",
        price: Number(b.price) || 0,
        durationMin: Number(b.durationMin) || 180,
        category: b.category || "cultural",
        meetingPoint: b.meetingPoint || "",
        image: b.image || "graffiti",
        availableDays: b.availableDays || "0,1,2,3,4,5,6",
        blockedDates: b.blockedDates || "",
        maxPeople: Number(b.maxPeople) || 15,
        featured: Boolean(b.featured),
        active: b.active !== false,
        order: Number(b.order) || 0,
      },
    });
    return NextResponse.json({ ok: true, tour });
  } catch (e) {
    return NextResponse.json({ error: "Could not create (slug may exist)" }, { status: 400 });
  }
}
