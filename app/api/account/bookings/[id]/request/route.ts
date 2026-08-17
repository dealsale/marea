import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCustomerId } from "@/lib/customerAuth";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const customerId = getCustomerId();
  if (!customerId) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const { type, note } = await req.json();
  if (!["reschedule", "cancel", ""].includes(type)) {
    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  }

  const booking = await prisma.booking.findUnique({ where: { id: params.id } });
  if (!booking || booking.customerId !== customerId) {
    return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  }
  if (booking.status === "cancelled") {
    return NextResponse.json({ error: "La reserva ya está cancelada" }, { status: 400 });
  }

  const updated = await prisma.booking.update({
    where: { id: params.id },
    data: { changeRequest: type, requestNote: type ? String(note || "").slice(0, 300) : "" },
  });
  return NextResponse.json({ ok: true, booking: updated });
}
