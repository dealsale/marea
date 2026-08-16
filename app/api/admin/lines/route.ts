import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

const slugify = (s: string) =>
  String(s || `linea-${Date.now()}`).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const lines = await prisma.line.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    include: { _count: { select: { packages: true } } },
  });
  return NextResponse.json({ lines });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const b = await req.json();
  try {
    const line = await prisma.line.create({
      data: {
        slug: slugify(b.slug || b.nameEs),
        nameEs: b.nameEs || "Nueva línea",
        nameEn: b.nameEn || b.nameEs || "New line",
        taglineEs: b.taglineEs || "",
        taglineEn: b.taglineEn || "",
        emoji: b.emoji || "🌊",
        color: b.color || "#2247cf",
        image: b.image || "",
        order: Number(b.order) || 0,
        active: b.active !== false,
      },
    });
    return NextResponse.json({ ok: true, line });
  } catch {
    return NextResponse.json({ error: "No se pudo crear (slug duplicado)" }, { status: 400 });
  }
}
