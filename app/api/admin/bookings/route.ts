import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      package: { select: { titleEs: true, titleEn: true, type: true, line: { select: { nameEs: true } } } },
      activity: { select: { nameEs: true, nameEn: true } },
    },
  });
  return NextResponse.json({ bookings });
}
