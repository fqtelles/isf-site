import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (token === process.env.ADMIN_SECRET) {
    redirect("/admin");
  }
  return <LoginForm />;
}
