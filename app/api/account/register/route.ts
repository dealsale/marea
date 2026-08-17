import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, createCustomerToken, CUSTOMER_COOKIE } from "@/lib/customerAuth";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  password: z.string().min(6).max(100),
});

export async function POST(req: Request) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    const { name, email, phone, password } = parsed.data;
    const emailLc = email.toLowerCase();

    const existing = await prisma.customer.findUnique({ where: { email: emailLc } });
    if (existing) return NextResponse.json({ error: "Ese correo ya está registrado" }, { status: 409 });

    const customer = await prisma.customer.create({
      data: { name, email: emailLc, phone, passwordHash: hashPassword(password) },
    });

    // link any prior guest bookings made with this email
    await prisma.booking.updateMany({ where: { email: emailLc, customerId: null }, data: { customerId: customer.id } });

    const res = NextResponse.json({ ok: true, customer: { id: customer.id, name, email: emailLc, phone } });
    res.cookies.set(CUSTOMER_COOKIE, createCustomerToken(customer.id), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
