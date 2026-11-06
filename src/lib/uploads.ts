import "server-only";
import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { ValidationError } from "@/lib/validation";
import { bucketName, deleteObject, keyFromPublicUrl, publicUrlForKey, putObject, storageConfigured } from "@/lib/storage";

export const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

type Detected = { ext: string; mime: string; kind: "image" | "pdf" };

/** Identify the file from its first bytes; never trust the browser-supplied type. */
function sniff(b: Buffer): Detected | null {
  if (b.length > 12 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", mime: "image/jpeg", kind: "image" };
  if (b.length > 8 && b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: "png", mime: "image/png", kind: "image" };
  }
  if (b.length > 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") {
    return { ext: "webp", mime: "image/webp", kind: "image" };
  }
  if (b.length > 5 && b.toString("ascii", 0, 5) === "%PDF-") return { ext: "pdf", mime: "application/pdf", kind: "pdf" };
  return null;
}

export async function storeUpload(
  file: File,
  opts: { kind: "image" | "pdf"; assetType: "portrait" | "resume" | "project_image"; folder: string },
): Promise<{ url: string; key: string }> {
  if (!storageConfigured()) throw new ValidationError("File storage is not configured on the server.");
  if (file.size > MAX_UPLOAD_BYTES) throw new ValidationError("File is too large (max 3.5 MB).");

  const buf = Buffer.from(await file.arrayBuffer());
  const found = sniff(buf);
  if (!found || found.kind !== opts.kind) {
    throw new ValidationError(opts.kind === "pdf" ? "Please upload a PDF file." : "Please upload a JPG, PNG or WebP image.");
  }

  const key = `${opts.folder}/${randomUUID()}.${found.ext}`;
  await putObject(key, buf, found.mime);
  try {
    await sql`INSERT INTO site_assets (asset_type, original_name, storage_key, bucket_name, content_type, is_public)
      VALUES (${opts.assetType}, ${file.name.slice(0, 200)}, ${key}, ${bucketName()}, ${found.mime}, true)`;
  } catch (e) {
    await deleteObject(key).catch(() => {});
    throw e;
  }
  return { url: publicUrlForKey(key)!, key };
}

/** Remove an uploaded file (object + tracking row). Ignores links that aren't ours. */
export async function removeStoredAsset(urlOrKey: string): Promise<void> {
  const key = keyFromPublicUrl(urlOrKey) ?? (urlOrKey.includes("://") ? null : urlOrKey);
  if (!key) return;
  await deleteObject(key).catch((e) => console.error("storage delete failed", e));
  await sql`DELETE FROM site_assets WHERE storage_key = ${key}`;
}
