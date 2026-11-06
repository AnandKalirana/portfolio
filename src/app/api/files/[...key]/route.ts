import { connection } from "next/server";
import { getObject } from "@/lib/storage";

// Serves uploaded portrait / project images from the storage bucket through this site,
// so the browser only ever talks to our own domain. Keys are random per upload, so they
// can be cached forever.
const KEY = /^(site|projects)\/[A-Za-z0-9-]+\.(jpg|png|webp)$/;

export async function GET(_req: Request, ctx: { params: Promise<{ key: string[] }> }) {
  await connection();
  const key = (await ctx.params).key.join("/");
  if (!KEY.test(key)) return new Response("Not found", { status: 404 });

  const obj = await getObject(key);
  if (!obj) return new Response("Not found", { status: 404 });

  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.contentType,
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
