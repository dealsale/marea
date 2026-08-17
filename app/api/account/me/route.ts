import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customerAuth";

export async function GET() {
  const id = getCustomerId();
  if (!id) return NextResponse.json({ customer: null });
  const c = await prisma.customer.findUnique({ where: { id }, select: { id: true, name: true, email: true, phone: true } });
  return NextResponse.json({ customer: c });
}
