
import "server-only";
import { sql } from "@/lib/db";

export type Project = {
    number: string;
    category: string;
    name: string;
    description: string;
    tech: string[];
    github: string;
    demo: string | null;
    image: string | null;
    screenshotBg: string;
    accentColor: string;
    tags: string[];
};

export type ExperienceItem = {
    number: string;
    org: string;
    role: string;
    period: string;
    type: string;
    category: string;
    description: string;
    side: string;
};

export type SkillGroup = {
    number: string;
    title: string;
    iconPath: string;
    skills: string[];
};

export async function getProjects(): Promise<Project[]> {
    const projects = await sql`
    SELECT
      LPAD(ROW_NUMBER() OVER (ORDER BY sort_order, created_at)::text, 2, '0') AS number,
      category,
      name,
      description,
      technologies AS tech,
      github_url AS github,
      demo_url AS demo,
      image_url AS image,
      screenshot_bg AS "screenshotBg",
      accent_color AS "accentColor",
      tags
    FROM projects
    WHERE published = true
    ORDER BY sort_order ASC, created_at ASC
  `;

    return projects as Project[];
}

export async function getExperiences(): Promise<ExperienceItem[]> {
    const experiences = await sql`
    SELECT
      LPAD(ROW_NUMBER() OVER (ORDER BY sort_order, created_at)::text, 2, '0') AS number,
      company AS org,
      role,
      period,
      status AS type,
      category,
      description,
      CASE WHEN ROW_NUMBER() OVER (ORDER BY sort_order, created_at) % 2 = 1 THEN 'left' ELSE 'right' END AS side
    FROM experiences
    WHERE published = true
    ORDER BY sort_order ASC, created_at ASC
  `;

    return experiences as ExperienceItem[];
}

export async function getSkillGroups(): Promise<SkillGroup[]> {
    const groups = await sql`
    SELECT
      id,
      LPAD(ROW_NUMBER() OVER (ORDER BY sort_order, created_at)::text, 2, '0') AS number,
      title,
      icon_path AS "iconPath"
    FROM skill_groups
    WHERE published = true
    ORDER BY sort_order ASC, created_at ASC
  `;

    const skills = await sql`
    SELECT
      group_id,
      name
    FROM skills
    ORDER BY sort_order ASC
  `;

    return groups.map((group) => ({
        number: group.number,
        title: group.title,
        iconPath: group.iconPath,
        skills: skills
            .filter((skill) => skill.group_id === group.id)
            .map((skill) => skill.name),
    })) as SkillGroup[];
}
