import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm border p-8" style={{ borderColor: "var(--border)", backgroundColor: "var(--elevated)" }}>
        <div className="editorial-label mb-2">Admin</div>
        <h1 className="text-2xl font-bold tracking-tight mb-6">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  );
}
