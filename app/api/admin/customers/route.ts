import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, phone: true, createdAt: true,
      _count: { select: { bookings: true } },
      bookings: {
        orderBy: { createdAt: "desc" },
        take: 20,
        select: {
          id: true, date: true, endDate: true, nights: true, people: true, status: true, total: true, changeRequest: true,
          package: { select: { titleEs: true, type: true } },
          activity: { select: { nameEs: true } },
        },
      },
    },
  });
  return NextResponse.json({ customers });
}
