import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customerAuth";

export async function GET() {
  const id = getCustomerId();
  if (!id) return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  const bookings = await prisma.booking.findMany({
    where: { customerId: id },
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { titleEs: true, titleEn: true, type: true, line: { select: { nameEs: true, nameEn: true } } } },
      activity: { select: { nameEs: true, nameEn: true } },
    },
  });
  return NextResponse.json({ bookings });
}
