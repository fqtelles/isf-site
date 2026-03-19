import { cookies } from "next/headers";

export function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;
  return token === process.env.ADMIN_SECRET;
}
