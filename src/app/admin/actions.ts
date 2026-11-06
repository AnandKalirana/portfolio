"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { endSession, requireAdmin, startSession } from "@/lib/auth";
import { ValidationError } from "@/lib/validation";
import { removeStoredAsset, storeUpload } from "@/lib/uploads";

export type FormState = { error?: string; ok?: string };

const MAX_FAILS = 5;
const WINDOW_MIN = 15;

/* ---------- auth ---------- */

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return { error: "Admin login is not configured." };

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";

  try {
    await sql`DELETE FROM admin_login_attempts WHERE created_at < NOW() - INTERVAL '1 day'`;
    const [{ n }] = await sql`
      SELECT COUNT(*)::int AS n FROM admin_login_attempts
      WHERE ip = ${ip} AND created_at > NOW() - make_interval(mins => ${WINDOW_MIN})`;
    if (n >= MAX_FAILS) {
      return { error: `Too many attempts. Try again in ${WINDOW_MIN} minutes.` };
    }
  } catch (e) {
    console.error("login rate-limit check failed", e);
    return { error: "Sign-in is temporarily unavailable. Please try again shortly." };
  }

  const password = String(formData.get("password") ?? "").slice(0, 200);
  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    await sql`INSERT INTO admin_login_attempts (ip) VALUES (${ip})`.catch(() => {});
    return { error: "Incorrect password." };
  }

  await sql`DELETE FROM admin_login_attempts WHERE ip = ${ip}`.catch(() => {});
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* ---------- helpers ---------- */


const str = (f: FormData, k: string, max: number) =>
  String(f.get(k) ?? "").trim().slice(0, max);

const required = (f: FormData, k: string, label: string, max: number) => {
  const v = str(f, k, max);
  if (!v) throw new ValidationError(`${label} is required.`);
  return v;
};

const list = (f: FormData, k: string) =>
  str(f, k, 2000)
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);

const httpUrl = (f: FormData, k: string, label: string) => {
  const v = str(f, k, 500);
  if (!v) return null;
  if (!/^https?:\/\/[^\s]+$/i.test(v)) throw new ValidationError(`${label} must start with http:// or https://`);
  return v;
};

const imageRef = (f: FormData, k: string) => {
  const v = str(f, k, 500);
  if (!v) return null;
  if (/^https:\/\/[^\s]+$/i.test(v) || /^\/[A-Za-z0-9._\-/]+$/.test(v)) return v;
  throw new ValidationError("Image must be an https:// URL or a path like /projects/name.webp");
};

const color = (f: FormData, k: string, fallback: string) => {
  const v = str(f, k, 9) || fallback;
  if (!/^#[0-9a-fA-F]{6}$/.test(v)) throw new ValidationError("Colours must be hex like #C9822B.");
  return v;
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "project";

const isUuid = (v: string) => /^[0-9a-f-]{36}$/i.test(v);

async function guarded(fn: () => Promise<FormState>): Promise<FormState> {
  await requireAdmin();
  try {
    const res = await fn();
    revalidatePath("/");
    revalidatePath("/admin", "layout");
    return res;
  } catch (e) {
    if (e instanceof ValidationError) return { error: e.message };
    console.error(e);
    return { error: "Something went wrong. Nothing was saved." };
  }
}

async function nextOrder(table: "projects" | "experiences" | "skill_groups") {
  const rows = await sql.query(`SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM ${table}`);
  return Number(rows[0].n);
}

/* ---------- projects ---------- */

export async function saveProject(_p: FormState, f: FormData): Promise<FormState> {
  return guarded(async () => {
    const id = str(f, "id", 40);
    const name = required(f, "name", "Name", 120);
    const data = {
      category: required(f, "category", "Category", 80),
      description: required(f, "description", "Description", 1500),
      tech: list(f, "technologies"),
      tags: list(f, "tags"),
      github: httpUrl(f, "github_url", "GitHub URL"),
      demo: httpUrl(f, "demo_url", "Demo URL"),
      image: imageRef(f, "image_url"),
      bg: color(f, "screenshot_bg", "#0F1923"),
      accent: color(f, "accent_color", "#C9822B"),
      published: f.get("published") === "on",
    };
    const file = f.get("image_file");
    let uploaded: string | null = null;
    if (file instanceof File && file.size > 0) {
      uploaded = (await storeUpload(file, { kind: "image", assetType: "project_image", folder: "projects" })).url;
      data.image = uploaded;
    }
    if (id) {
      if (!isUuid(id)) throw new ValidationError("Invalid project.");
      const [old] = await sql`SELECT image_url FROM projects WHERE id=${id}`;
      await sql`UPDATE projects SET name=${name}, category=${data.category}, description=${data.description},
        technologies=${data.tech}, tags=${data.tags}, github_url=${data.github}, demo_url=${data.demo},
        image_url=${data.image}, screenshot_bg=${data.bg}, accent_color=${data.accent},
        published=${data.published}, updated_at=NOW() WHERE id=${id}`;
      if (old?.image_url && old.image_url !== data.image) await removeStoredAsset(old.image_url);
      return { ok: "Saved." };
    }
    let slug = slugify(name);
    const taken = await sql`SELECT 1 FROM projects WHERE slug=${slug}`;
    if (taken.length) slug += "-" + Math.random().toString(36).slice(2, 6);
    const order = await nextOrder("projects");
    await sql`INSERT INTO projects (slug, name, category, description, technologies, tags, github_url, demo_url,
      image_url, screenshot_bg, accent_color, published, sort_order, number)
      VALUES (${slug}, ${name}, ${data.category}, ${data.description}, ${data.tech}, ${data.tags}, ${data.github},
      ${data.demo}, ${data.image}, ${data.bg}, ${data.accent}, ${data.published}, ${order}, ${String(order).padStart(2, "0")})`;
    return { ok: "Project added." };
  });
}

/* ---------- experience ---------- */

export async function saveExperience(_p: FormState, f: FormData): Promise<FormState> {
  return guarded(async () => {
    const id = str(f, "id", 40);
    const v = {
      company: required(f, "company", "Organisation", 160),
      role: required(f, "role", "Role", 160),
      period: required(f, "period", "Period", 60),
      status: str(f, "status", 60) || null,
      category: str(f, "category", 60) || null,
      description: required(f, "description", "Description", 1500),
      published: f.get("published") === "on",
    };
    if (id) {
      if (!isUuid(id)) throw new ValidationError("Invalid entry.");
      await sql`UPDATE experiences SET company=${v.company}, role=${v.role}, period=${v.period}, status=${v.status},
        category=${v.category}, description=${v.description}, published=${v.published}, updated_at=NOW() WHERE id=${id}`;
      return { ok: "Saved." };
    }
    const order = await nextOrder("experiences");
    await sql`INSERT INTO experiences (company, role, period, status, category, description, published, sort_order, number, side)
      VALUES (${v.company}, ${v.role}, ${v.period}, ${v.status}, ${v.category}, ${v.description}, ${v.published}, ${order},
      ${String(order).padStart(2, "0")}, ${order % 2 ? "left" : "right"})`;
    return { ok: "Experience added." };
  });
}

/* ---------- skills ---------- */

export async function saveSkillGroup(_p: FormState, f: FormData): Promise<FormState> {
  return guarded(async () => {
    const id = str(f, "id", 40);
    const title = required(f, "title", "Title", 100);
    const icon = str(f, "icon_path", 1500);
    if (icon && !/^[0-9A-Za-z\s.,\-+]+$/.test(icon)) {
      throw new ValidationError("Icon path may only contain SVG path characters.");
    }
    const names = [...new Set(list(f, "skills"))];
    const published = f.get("published") === "on";

    if (id) {
      if (!isUuid(id)) throw new ValidationError("Invalid group.");
      await sql.transaction([
        sql`UPDATE skill_groups SET title=${title}, icon_path=${icon || null}, published=${published}, updated_at=NOW() WHERE id=${id}`,
        sql`DELETE FROM skills WHERE group_id=${id}`,
        sql`INSERT INTO skills (group_id, name, sort_order)
            SELECT ${id}::uuid, x.name, x.i - 1 FROM unnest(${names}::text[]) WITH ORDINALITY AS x(name, i)`,
      ]);
      return { ok: "Saved." };
    }
    const order = await nextOrder("skill_groups");
    const [row] = await sql`INSERT INTO skill_groups (title, icon_path, published, sort_order, number)
      VALUES (${title}, ${icon || null}, ${published}, ${order}, ${String(order).padStart(2, "0")}) RETURNING id`;
    await sql`INSERT INTO skills (group_id, name, sort_order)
      SELECT ${row.id}::uuid, x.name, x.i - 1 FROM unnest(${names}::text[]) WITH ORDINALITY AS x(name, i)`;
    return { ok: "Skill group added." };
  });
}

/* ---------- shared row actions (delete / publish / reorder) ---------- */

const TABLES = ["projects", "experiences", "skill_groups"] as const;
type Table = (typeof TABLES)[number];

function tableOf(f: FormData): Table {
  const t = String(f.get("table"));
  if (!(TABLES as readonly string[]).includes(t)) throw new Error("bad table");
  return t as Table;
}

export async function deleteRow(f: FormData) {
  await requireAdmin();
  const id = str(f, "id", 40);
  if (!isUuid(id)) return;
  const table = tableOf(f);
  if (table === "projects") {
    const [row] = await sql`SELECT image_url FROM projects WHERE id=${id}`;
    if (row?.image_url) await removeStoredAsset(row.image_url);
  }
  await sql.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function togglePublished(f: FormData) {
  await requireAdmin();
  const id = str(f, "id", 40);
  if (!isUuid(id)) return;
  await sql.query(`UPDATE ${tableOf(f)} SET published = NOT published, updated_at = NOW() WHERE id = $1`, [id]);
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function moveRow(f: FormData) {
  await requireAdmin();
  const table = tableOf(f);
  const id = str(f, "id", 40);
  const dir = f.get("dir") === "up" ? -1 : 1;
  const rows = await sql.query(`SELECT id FROM ${table} ORDER BY sort_order, created_at`);
  const ids = rows.map((r) => r.id as string);
  const i = ids.indexOf(id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= ids.length) return;
  [ids[i], ids[j]] = [ids[j], ids[i]];
  await sql.query(
    `UPDATE ${table} t SET sort_order = x.i FROM unnest($1::uuid[]) WITH ORDINALITY AS x(id, i) WHERE t.id = x.id`,
    [ids],
  );
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}
