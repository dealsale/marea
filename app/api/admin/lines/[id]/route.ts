import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  const data: Record<string, unknown> = {};
  for (const f of ["nameEs", "nameEn", "taglineEs", "taglineEn", "emoji", "color", "image"]) if (b[f] !== undefined) data[f] = b[f];
  if (b.order !== undefined) data.order = Number(b.order) || 0;
  if (b.active !== undefined) data.active = Boolean(b.active);
  const line = await prisma.line.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, line });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.line.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
