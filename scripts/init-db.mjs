
import nextEnv from "@next/env";
import { neon } from "@neondatabase/serverless";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

async function initializeDatabase() {
    if (!process.env.DATABASE_URL) {
        throw new Error("DATABASE_URL is missing");
    }

    const sql = neon(process.env.DATABASE_URL);

    try {
        await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT NOT NULL,
        technologies TEXT[] NOT NULL DEFAULT '{}',
        github_url TEXT,
        demo_url TEXT,
        image_key TEXT,
        screenshot_bg TEXT,
        accent_color TEXT,
        tags TEXT[] NOT NULL DEFAULT '{}',
        sort_order INTEGER NOT NULL DEFAULT 0,
        published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS experiences (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        company TEXT NOT NULL,
        role TEXT NOT NULL,
        period TEXT NOT NULL,
        status TEXT,
        category TEXT,
        description TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS skill_groups (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        icon_path TEXT,
        sort_order INTEGER NOT NULL DEFAULT 0,
        published BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS skills (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        group_id UUID NOT NULL REFERENCES skill_groups(id)
          ON DELETE CASCADE,
        name TEXT NOT NULL,
        sort_order INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS site_assets (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        asset_type TEXT NOT NULL,
        original_name TEXT NOT NULL,
        storage_key TEXT NOT NULL UNIQUE,
        bucket_name TEXT NOT NULL,
        content_type TEXT,
        is_public BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        await sql`
      CREATE TABLE IF NOT EXISTS admin_login_attempts (
        id BIGSERIAL PRIMARY KEY,
        ip TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

        console.log("Database tables created successfully!");
        console.log("1. projects");
        console.log("2. experiences");
        console.log("3. skill_groups");
        console.log("4. skills");
        console.log("5. site_assets");
    } catch (error) {
        console.error("Database setup failed:", error.message);
        process.exitCode = 1;
    }
}

initializeDatabase();
