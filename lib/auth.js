import { createHmac, randomUUID, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_SESSION_COOKIE = "admin_token";
const ADMIN_SESSION_VERSION = "v1";
const ADMIN_SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminSecret() {
  return process.env.ADMIN_SECRET ?? "";
}

function createSignature(payload, secret) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeCompare(a, b) {
  try {
    const bufA = Buffer.from(a);
    const bufB = Buffer.from(b);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export function createAdminSessionToken() {
  const secret = getAdminSecret();
  if (!secret) return "";

  const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
  const nonce = randomUUID();
  const payload = `${ADMIN_SESSION_VERSION}.${expiresAt}.${nonce}`;
  const signature = createSignature(payload, secret);

  return `${payload}.${signature}`;
}

export function verifyAdminSessionToken(token) {
  const secret = getAdminSecret();
  if (!token || !secret) return false;

  const parts = token.split(".");
  if (parts.length !== 4) return false;

  const [version, expiresAtRaw, nonce, signature] = parts;
  if (version !== ADMIN_SESSION_VERSION || !nonce || !signature) return false;

  const expiresAt = Number(expiresAtRaw);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) return false;

  const payload = `${version}.${expiresAt}.${nonce}`;
  const expectedSignature = createSignature(payload, secret);
  return safeCompare(signature, expectedSignature);
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifyAdminSessionToken(token);
}

export { ADMIN_SESSION_COOKIE, ADMIN_SESSION_TTL_MS };
