import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const data: Record<string, unknown> = {};
  const fields = [
    "titleEs", "titleEn", "summaryEs", "summaryEn", "descriptionEs", "descriptionEn",
    "meetingPoint", "image", "category", "availableDays", "blockedDates",
  ];
  for (const f of fields) if (b[f] !== undefined) data[f] = b[f];
  if (b.price !== undefined) data.price = Number(b.price) || 0;
  if (b.durationMin !== undefined) data.durationMin = Number(b.durationMin) || 180;
  if (b.maxPeople !== undefined) data.maxPeople = Number(b.maxPeople) || 15;
  if (b.order !== undefined) data.order = Number(b.order) || 0;
  if (b.featured !== undefined) data.featured = Boolean(b.featured);
  if (b.active !== undefined) data.active = Boolean(b.active);

  const tour = await prisma.tour.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, tour });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.tour.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
