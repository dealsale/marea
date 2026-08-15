import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { tour: { select: { titleEs: true, titleEn: true, price: true, currency: true } } },
  });
  return NextResponse.json({ bookings });
}
