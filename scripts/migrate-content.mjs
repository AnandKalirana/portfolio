
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const sql = neon(process.env.DATABASE_URL);

const projects = [
    {
        number: "01",
        slug: "rentledger",
        category: "Full-Stack System",
        name: "RentLedger",
        description:
            "A multi-tenant rental management platform designed to simplify landlord and tenant operations. Features tenant-level data isolation, JWT authentication, rent payment tracking, proof uploads, and automated notifications via WhatsApp Cloud API.",
        tech: ["Next.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma"],
        github: "https://github.com/AnandKalirana",
        demo: null,
        image: "/projects/rentledger.webp",
        screenshotBg: "#0F1923",
        accentColor: "#C9822B",
        tags: ["Multi-Tenant Isolation", "Payment Workflows", "JWT Auth", "WhatsApp API"],
    },
    {
        number: "02",
        slug: "personal-book-tracker",
        category: "Full-Stack Application",
        name: "Personal Book Tracker",
        description:
            "A personal library and reading management platform that helps users catalog books, record reading milestones, and track history. Features full CRUD workflows, Google Books API integration, ratings, and deployed via Railway.",
        tech: ["React.js", "Node.js", "Express.js", "MySQL", "Google Books API"],
        github: "https://github.com/AnandKalirana",
        demo: null,
        image: "/projects/book-tracker.webp",
        screenshotBg: "#0D1B2A",
        accentColor: "#C9822B",
        tags: ["Reading Status", "Google Books API", "CRUD Workflows", "Railway"],
    },
];

const experiences = [
    {
        number: "01",
        company: "Shri Balaji Cotton Mills",
        role: "Developer : E-Commerce Website",
        period: "2026 — Present",
        status: "In Development",
        category: "E-Commerce",
        description:
            "Designing and developing an e-commerce website for Shri Balaji Cotton Mills, a textile company. Currently in development.",
        side: "left",
    },
    {
        number: "02",
        company: "Agastya International Foundation & JP Morgan Initiative",
        role: "Project Partner Intern (IoT & Systems)",
        period: "Dec 2025 — Feb 2026",
        status: "Internship",
        category: "Hardware & IoT",
        description:
            "Designed and developed a software-hardware integrated system to support recycling initiatives. Implemented sensor modules for automated material identification and built software for tracking and data logging.",
        side: "right",
    },
    {
        number: "03",
        company: "Threat Prism",
        role: "Cybersecurity Intern",
        period: "Jan 2025 — Apr 2025",
        status: "Internship",
        category: "Cybersecurity",
        description:
            "Developed security tools for phishing simulation, network scanning, and reconnaissance automation. Practiced threat identification, vulnerability assessment, and secure code analysis.",
        side: "left",
    },
];

const skillGroups = [
    {
        number: "01",
        title: "IoT & Embedded Systems",
        iconPath:
            "M2 6a1 1 0 011-1h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6zm4 4h.01M6 14h.01M12 10h.01M12 14h.01M18 10h.01M18 14h.01M8 2v4M16 2v4M8 18v4M16 18v4",
        skills: [
            "Arduino / ESP32",
            "Sensors & Actuators",
            "MQTT / CoAP",
            "Edge Computing",
            "Real-time Data Processing",
        ],
    },
    {
        number: "02",
        title: "Full-Stack Development",
        iconPath: "M16 18l6-6-6-6M8 6L2 12l6 6",
        skills: [
            "Next.js / React",
            "JavaScript / TypeScript",
            "Node.js / Express",
            "MySQL / PostgreSQL",
            "Prisma ORM",
            "Tailwind CSS",
        ],
    },
    {
        number: "03",
        title: "Cybersecurity",
        iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
        skills: [
            "Network Security",
            "Threat Analysis",
            "Vulnerability Assessment",
            "Security Monitoring",
            "Security Best Practices",
        ],
    },
];

async function migrate() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is missing");
    }

    try {
        // Add fields needed to preserve the existing frontend data.
        await sql`
      ALTER TABLE projects
      ADD COLUMN IF NOT EXISTS number TEXT,
      ADD COLUMN IF NOT EXISTS image_url TEXT
    `;

        await sql`
      ALTER TABLE experiences
      ADD COLUMN IF NOT EXISTS number TEXT,
      ADD COLUMN IF NOT EXISTS side TEXT
    `;

        await sql`
      ALTER TABLE skill_groups
      ADD COLUMN IF NOT EXISTS number TEXT
    `;

        // Unique constraints make the migration safe to run again.
        await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS
      skill_groups_title_unique ON skill_groups(title)
    `;

        await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS
      skills_group_name_unique ON skills(group_id, name)
    `;

        await sql`
      CREATE UNIQUE INDEX IF NOT EXISTS
      experiences_company_role_unique
      ON experiences(company, role)
    `;

        // Migrate projects.
        for (let i = 0; i < projects.length; i++) {
            const p = projects[i];

            await sql`
        INSERT INTO projects (
          number, slug, category, name, description,
          technologies, github_url, demo_url, image_url,
          screenshot_bg, accent_color, tags, sort_order, published
        )
        VALUES (
          ${p.number},
          ${p.slug},
          ${p.category},
          ${p.name},
          ${p.description},
          ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(p.tech)}::jsonb)),
          ${p.github},
          ${p.demo},
          ${p.image},
          ${p.screenshotBg},
          ${p.accentColor},
          ARRAY(SELECT jsonb_array_elements_text(${JSON.stringify(p.tags)}::jsonb)),
          ${i + 1},
          TRUE
        )
        ON CONFLICT (slug) DO UPDATE SET
          number = EXCLUDED.number,
          category = EXCLUDED.category,
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          technologies = EXCLUDED.technologies,
          github_url = EXCLUDED.github_url,
          demo_url = EXCLUDED.demo_url,
          image_url = EXCLUDED.image_url,
          screenshot_bg = EXCLUDED.screenshot_bg,
          accent_color = EXCLUDED.accent_color,
          tags = EXCLUDED.tags,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `;
        }

        // Migrate experiences.
        for (let i = 0; i < experiences.length; i++) {
            const e = experiences[i];

            await sql`
        INSERT INTO experiences (
          number, company, role, period, status, category,
          description, side, sort_order, published
        )
        VALUES (
          ${e.number},
          ${e.company},
          ${e.role},
          ${e.period},
          ${e.status},
          ${e.category},
          ${e.description},
          ${e.side},
          ${i + 1},
          TRUE
        )
        ON CONFLICT (company, role) DO UPDATE SET
          number = EXCLUDED.number,
          period = EXCLUDED.period,
          status = EXCLUDED.status,
          category = EXCLUDED.category,
          description = EXCLUDED.description,
          side = EXCLUDED.side,
          sort_order = EXCLUDED.sort_order,
          updated_at = NOW()
      `;
        }

        // Migrate skill groups and their skills.
        for (let i = 0; i < skillGroups.length; i++) {
            const group = skillGroups[i];

            await sql`
        INSERT INTO skill_groups (
          number, title, icon_path, sort_order, published
        )
        VALUES (
          ${group.number},
          ${group.title},
          ${group.iconPath},
          ${i + 1},
          TRUE
        )
        ON CONFLICT (title) DO UPDATE SET
          number = EXCLUDED.number,
          icon_path = EXCLUDED.icon_path,
          sort_order = EXCLUDED.sort_order
      `;

            const rows = await sql`
        SELECT id FROM skill_groups
        WHERE title = ${group.title}
        LIMIT 1
      `;

            const groupId = rows[0].id;

            for (let j = 0; j < group.skills.length; j++) {
                await sql`
          INSERT INTO skills (group_id, name, sort_order)
          VALUES (${groupId}, ${group.skills[j]}, ${j + 1})
          ON CONFLICT (group_id, name) DO UPDATE SET
            sort_order = EXCLUDED.sort_order
        `;
            }
        }

        // Verify migrated record counts.
        const projectCount = await sql`
      SELECT COUNT(*)::int AS count FROM projects
    `;

        const experienceCount = await sql`
      SELECT COUNT(*)::int AS count FROM experiences
    `;

        const groupCount = await sql`
      SELECT COUNT(*)::int AS count FROM skill_groups
    `;

        const skillCount = await sql`
      SELECT COUNT(*)::int AS count FROM skills
    `;

        console.log("\nMigration successful!");
        console.log("Projects:", projectCount[0].count);
        console.log("Experiences:", experienceCount[0].count);
        console.log("Skill groups:", groupCount[0].count);
        console.log("Individual skills:", skillCount[0].count);
    } catch (error) {
        console.error("Migration failed:", error.message);
        process.exitCode = 1;
    }
}

migrate();
