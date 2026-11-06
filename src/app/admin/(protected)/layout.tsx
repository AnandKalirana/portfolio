import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";

const links = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/experience", label: "Experience" },
  { href: "/admin/skills", label: "Skills" },
];

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <>
      <header className="border-b" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <nav className="flex flex-wrap items-center gap-5 text-sm font-medium">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-[var(--accent)] transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" target="_blank" className="hover:text-[var(--accent)]" style={{ color: "var(--text-secondary)" }}>
              View site ↗
            </Link>
            <form action={logout}>
              <button className="hover:text-[var(--accent)]" style={{ color: "var(--text-secondary)" }}>Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-10">{children}</main>
    </>
  );
}
