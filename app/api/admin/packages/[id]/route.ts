import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const actFields = (a: any, i: number) => ({
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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const f of ["titleEs", "titleEn", "summaryEs", "summaryEn", "descriptionEs", "descriptionEn", "meetingPoint", "image", "availableDays", "blockedDates", "lineId"]) {
    if (b[f] !== undefined) data[f] = b[f];
  }
  if (b.type !== undefined && ["tour", "escape", "hospedaje"].includes(b.type)) data.type = b.type;
  if (b.price !== undefined) data.price = Number(b.price) || 0;
  if (b.durationMin !== undefined) data.durationMin = Number(b.durationMin) || 180;
  if (b.maxPeople !== undefined) data.maxPeople = Number(b.maxPeople) || 15;
  if (b.order !== undefined) data.order = Number(b.order) || 0;
  if (b.featured !== undefined) data.featured = Boolean(b.featured);
  if (b.active !== undefined) data.active = Boolean(b.active);

  await prisma.package.update({ where: { id: params.id }, data });

  // reconcile activities if provided (update existing by id, create new, delete removed)
  if (Array.isArray(b.activities)) {
    const incoming = b.activities as any[];
    const existing = await prisma.activity.findMany({ where: { packageId: params.id }, select: { id: true } });
    const incomingIds = new Set(incoming.filter((a) => a.id).map((a) => a.id));
    const toDelete = existing.filter((e) => !incomingIds.has(e.id)).map((e) => e.id);
    await prisma.$transaction([
      ...(toDelete.length ? [prisma.activity.deleteMany({ where: { id: { in: toDelete } } })] : []),
      ...incoming.map((a, i) =>
        a.id
          ? prisma.activity.update({ where: { id: a.id }, data: actFields(a, i) })
          : prisma.activity.create({ data: { ...actFields(a, i), packageId: params.id } })
      ),
    ]);
  }

  const pkg = await prisma.package.findUnique({ where: { id: params.id }, include: { activities: { orderBy: { order: "asc" } } } });
  return NextResponse.json({ ok: true, pkg });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.package.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
