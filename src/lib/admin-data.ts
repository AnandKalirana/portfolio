import "server-only";
import { sql } from "@/lib/db";

export async function adminProjects() {
  return sql`SELECT id, name, category, description, technologies, tags, github_url, demo_url, image_url,
    screenshot_bg, accent_color, published FROM projects ORDER BY sort_order, created_at`;
}

export async function adminExperiences() {
  return sql`SELECT id, company, role, period, status, category, description, published
    FROM experiences ORDER BY sort_order, created_at`;
}

export async function adminSkillGroups() {
  return sql`SELECT g.id, g.title, g.icon_path, g.published,
      COALESCE(array_agg(s.name ORDER BY s.sort_order) FILTER (WHERE s.id IS NOT NULL), '{}') AS skills
    FROM skill_groups g LEFT JOIN skills s ON s.group_id = g.id
    GROUP BY g.id ORDER BY g.sort_order, g.created_at`;
}

export async function adminCounts() {
  const [r] = await sql`SELECT
    (SELECT COUNT(*) FROM projects)::int AS projects,
    (SELECT COUNT(*) FROM projects WHERE published)::int AS projects_live,
    (SELECT COUNT(*) FROM experiences)::int AS experiences,
    (SELECT COUNT(*) FROM experiences WHERE published)::int AS experiences_live,
    (SELECT COUNT(*) FROM skill_groups)::int AS groups,
    (SELECT COUNT(*) FROM skills)::int AS skills`;
  return r;
}
