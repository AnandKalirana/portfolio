"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { ValidationError } from "@/lib/validation";
import { removeStoredAsset, storeUpload } from "@/lib/uploads";
import type { FormState } from "./actions";

const TYPES = {
  portrait: { kind: "image", folder: "site" },
  resume: { kind: "pdf", folder: "site" },
} as const;

function typeOf(v: FormDataEntryValue | null): keyof typeof TYPES {
  if (v === "portrait" || v === "resume") return v;
  throw new ValidationError("Unknown file type.");
}

async function currentKeys(type: string) {
  const rows = await sql`SELECT storage_key FROM site_assets WHERE asset_type = ${type}`;
  return rows.map((r) => r.storage_key as string);
}

export async function uploadSiteFile(_prev: FormState, f: FormData): Promise<FormState> {
  await requireAdmin();
  try {
    const type = typeOf(f.get("type"));
    const file = f.get("file");
    if (!(file instanceof File) || file.size === 0) return { error: "Choose a file first." };
    const before = await currentKeys(type);
    await storeUpload(file, { ...TYPES[type], assetType: type });
    for (const key of before) await removeStoredAsset(key); // keep only the newest
    revalidatePath("/");
    revalidatePath("/admin", "layout");
    return { ok: "Uploaded. It is live on the site now." };
  } catch (e) {
    if (e instanceof ValidationError) return { error: e.message };
    console.error(e);
    return { error: "Upload failed. Nothing was changed." };
  }
}

export async function removeSiteFile(f: FormData) {
  await requireAdmin();
  const type = typeOf(f.get("type"));
  for (const key of await currentKeys(type)) await removeStoredAsset(key);
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}
