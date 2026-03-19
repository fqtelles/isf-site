import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  const token = cookies().get("admin_token")?.value;
  if (token === process.env.ADMIN_SECRET) {
    redirect("/admin");
  }
  return <LoginForm />;
}
