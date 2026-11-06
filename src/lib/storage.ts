import "server-only";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

type Cfg = { endpoint: string; region: string; bucket: string; id: string; secret: string };

function cfg(): Cfg | null {
  const e = process.env;
  if (!e.STORAGE_ENDPOINT || !e.STORAGE_BUCKET || !e.STORAGE_ACCESS_KEY_ID || !e.STORAGE_SECRET_ACCESS_KEY) {
    return null;
  }
  return {
    endpoint: e.STORAGE_ENDPOINT.replace(/\/$/, ""),
    region: e.STORAGE_REGION || "us-east-2",
    bucket: e.STORAGE_BUCKET,
    id: e.STORAGE_ACCESS_KEY_ID,
    secret: e.STORAGE_SECRET_ACCESS_KEY,
  };
}

let client: S3Client | null = null;
function s3(c: Cfg) {
  return (client ??= new S3Client({
    region: c.region,
    endpoint: c.endpoint,
    credentials: { accessKeyId: c.id, secretAccessKey: c.secret },
    forcePathStyle: true,
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  }));
}

export const storageConfigured = () => cfg() !== null;
export const bucketName = () => cfg()?.bucket ?? "";

export const FILES_PREFIX = "/api/files/";

/** Site-relative URL for an uploaded object (served through /api/files), or null when storage isn't configured. */
export function publicUrlForKey(key: string): string | null {
  return cfg() ? `${FILES_PREFIX}${key}` : null;
}

/** Reverse of publicUrlForKey; also accepts old direct bucket URLs. Returns the object key, or null. */
export function keyFromPublicUrl(url: string): string | null {
  if (url.startsWith(FILES_PREFIX)) return url.slice(FILES_PREFIX.length);
  const c = cfg();
  const base = c ? `${c.endpoint}/${c.bucket}/` : null;
  return base && url.startsWith(base) ? url.slice(base.length) : null;
}

export async function getObject(key: string) {
  const c = cfg();
  if (!c) return null;
  try {
    const res = await s3(c).send(new GetObjectCommand({ Bucket: c.bucket, Key: key }));
    if (!res.Body) return null;
    return {
      body: res.Body.transformToWebStream(),
      contentType: res.ContentType || "application/octet-stream",
      length: res.ContentLength,
    };
  } catch {
    return null;
  }
}

export async function putObject(key: string, body: Buffer, contentType: string) {
  const c = cfg();
  if (!c) throw new Error("Storage is not configured");
  await s3(c).send(
    new PutObjectCommand({
      Bucket: c.bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function deleteObject(key: string) {
  const c = cfg();
  if (!c) return;
  await s3(c).send(new DeleteObjectCommand({ Bucket: c.bucket, Key: key }));
}
