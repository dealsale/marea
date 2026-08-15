import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "marea_admin";
const SECRET = process.env.SESSION_SECRET || "insecure-dev-secret";

function sign(value: string) {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(token: string): boolean {
  const idx = token.lastIndexOf(".");
  if (idx === -1) return false;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  try {
    if (sig.length !== expected.length) return false;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  } catch {
    return false;
  }
  const expiry = parseInt(value.split("|")[1] || "0", 10);
  return Date.now() < expiry;
}

export function createSessionToken() {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 7; // 7 days
  return sign(`admin|${expiry}`);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  if (password.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(password), Buffer.from(expected));
}

export async function isAuthenticated(): Promise<boolean> {
  const token = cookies().get(COOKIE_NAME)?.value;
  return token ? verify(token) : false;
}

export const AUTH_COOKIE = COOKIE_NAME;
