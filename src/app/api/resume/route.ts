import { NextResponse, connection } from "next/server";
import { sql } from "@/lib/db";
import { publicUrlForKey } from "@/lib/storage";

// Stable download link for the resume: streams the uploaded PDF as an attachment,
// or falls back to /resume.pdf in /public if nothing has been uploaded.
export async function GET(request: Request) {
  await connection(); // always resolve at request time, never at build
  try {
    const rows = await sql`SELECT storage_key FROM site_assets WHERE asset_type = 'resume' ORDER BY created_at DESC LIMIT 1`;
    const url = rows[0] ? publicUrlForKey(rows[0].storage_key as string) : null;
    if (url) {
      const upstream = await fetch(url);
      if (upstream.ok && upstream.body) {
        return new Response(upstream.body, {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": 'attachment; filename="Anand-Kalirana-Resume.pdf"',
            "Cache-Control": "public, max-age=300",
          },
        });
      }
    }
  } catch (e) {
    console.error("resume lookup failed", e);
  }
  return NextResponse.redirect(new URL("/resume.pdf", request.url));
}
