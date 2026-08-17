import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createCustomerToken, CUSTOMER_COOKIE } from "@/lib/customerAuth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }
    const customer = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });
    if (!customer || !verifyPassword(password, customer.passwordHash)) {
      return NextResponse.json({ error: "Correo o contraseña incorrectos" }, { status: 401 });
    }
    const res = NextResponse.json({
      ok: true,
      customer: { id: customer.id, name: customer.name, email: customer.email, phone: customer.phone },
    });
    res.cookies.set(CUSTOMER_COOKIE, createCustomerToken(customer.id), {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
