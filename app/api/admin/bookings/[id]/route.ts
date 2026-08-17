import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const b = await req.json();
  const data: Record<string, unknown> = {};
  if (b.status !== undefined) {
    if (!["pending", "confirmed", "cancelled"].includes(b.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    data.status = b.status;
  }
  // reschedule / edit date fields
  if (typeof b.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(b.date)) data.date = b.date;
  if (typeof b.timeSlot === "string") data.timeSlot = b.timeSlot;
  if (typeof b.endDate === "string") data.endDate = b.endDate;
  if (b.nights !== undefined) data.nights = Number(b.nights) || 1;
  // resolve/clear a change request
  if (b.clearRequest) { data.changeRequest = ""; data.requestNote = ""; }

  const booking = await prisma.booking.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true, booking });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.booking.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
