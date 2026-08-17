import crypto from "crypto";
import { cookies } from "next/headers";

const COOKIE = "marea_customer";
const SECRET = process.env.SESSION_SECRET || "insecure-dev-secret";

// ---- password hashing (scrypt) ----
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(password, salt, 64);
  const keyBuf = Buffer.from(key, "hex");
  if (keyBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(keyBuf, derived);
}

// ---- signed session token ----
function sign(value: string) {
  const hmac = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verifyToken(token: string): string | null {
  const idx = token.lastIndexOf(".");
  if (idx === -1) return null;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = crypto.createHmac("sha256", SECRET).update(value).digest("hex");
  try {
    if (sig.length !== expected.length) return null;
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  } catch {
    return null;
  }
  const [id, expiry] = value.split("|");
  if (!id || Date.now() > parseInt(expiry || "0", 10)) return null;
  return id;
}

export function createCustomerToken(id: string) {
  const expiry = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  return sign(`${id}|${expiry}`);
}

export function getCustomerId(): string | null {
  const token = cookies().get(COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export const CUSTOMER_COOKIE = COOKIE;
