import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

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

/** Public URL for an object in the public_read bucket, or null when storage isn't configured. */
export function publicUrlForKey(key: string): string | null {
  const c = cfg();
  return c ? `${c.endpoint}/${c.bucket}/${key}` : null;
}

/** Reverse of publicUrlForKey: returns the object key if the URL points at our bucket. */
export function keyFromPublicUrl(url: string): string | null {
  const c = cfg();
  const base = c ? `${c.endpoint}/${c.bucket}/` : null;
  return base && url.startsWith(base) ? url.slice(base.length) : null;
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
