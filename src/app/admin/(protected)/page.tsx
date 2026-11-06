import Link from "next/link";
import { adminCounts } from "@/lib/admin-data";

// Admin pages read the session and database on every request; skip instant-navigation validation.
export const instant = false;

export default async function Overview() {
  const c = await adminCounts();
  const cards = [
    { href: "/admin/projects", label: "Projects", main: c.projects, sub: `${c.projects_live} visible` },
    { href: "/admin/experience", label: "Experience", main: c.experiences, sub: `${c.experiences_live} visible` },
    { href: "/admin/skills", label: "Skill groups", main: c.groups, sub: `${c.skills} skills` },
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Portfolio content</h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
        Changes appear on the public site as soon as you save.
      </p>
      <div className="grid sm:grid-cols-3 gap-4">
        {cards.map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="card-lift border p-5 block"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--elevated)" }}
          >
            <div className="editorial-label mb-3">{x.label}</div>
            <div className="text-4xl font-bold" style={{ color: "var(--accent)" }}>{x.main}</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{x.sub}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
