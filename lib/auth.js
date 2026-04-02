import { cookies } from "next/headers";
import { timingSafeEqual } from "crypto";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token || !process.env.ADMIN_SECRET) return false;
  try {
    const bufA = Buffer.from(token);
    const bufB = Buffer.from(process.env.ADMIN_SECRET);
    if (bufA.length !== bufB.length) return false;
    return timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}
