import { sql } from "@/lib/db";
import { publicUrlForKey, storageConfigured } from "@/lib/storage";
import { removeSiteFile, uploadSiteFile } from "../../file-actions";
import { AdminForm, ConfirmButton } from "@/components/admin/AdminForm";

async function latest(type: string) {
  const rows = await sql`SELECT storage_key, original_name, created_at FROM site_assets
    WHERE asset_type = ${type} ORDER BY created_at DESC LIMIT 1`;
  return rows[0] as { storage_key: string; original_name: string; created_at: string } | undefined;
}

function Card({ title, hint, children }: { title: string; hint: string; children: React.ReactNode }) {
  return (
    <section className="border p-5 space-y-4" style={{ borderColor: "var(--border)", backgroundColor: "var(--elevated)" }}>
      <div>
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>{hint}</p>
      </div>
      {children}
    </section>
  );
}

export default async function FilesAdmin() {
  const [portrait, resume] = await Promise.all([latest("portrait"), latest("resume")]);
  const ready = storageConfigured();
  const input = "text-sm";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Site files</h1>
      {!ready && (
        <p role="alert" className="text-sm text-red-400">
          File storage is not configured on this server (STORAGE_* variables missing), so uploads are disabled.
        </p>
      )}

      <Card title="Portrait" hint="Shown in the hero. JPG, PNG or WebP, max 3.5 MB. Until you upload one, the portrait.jpg shipped with the site is used.">
        {portrait && ready && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={publicUrlForKey(portrait.storage_key)!} alt="Current portrait" className="h-40 w-auto border" style={{ borderColor: "var(--border)" }} />
        )}
        <AdminForm action={uploadSiteFile} submitLabel="Upload portrait">
          <input type="hidden" name="type" value="portrait" />
          <input type="file" name="file" accept="image/jpeg,image/png,image/webp" className={input} />
        </AdminForm>
        {portrait && (
          <form action={removeSiteFile}>
            <input type="hidden" name="type" value="portrait" />
            <ConfirmButton message="Go back to the default portrait?" className="text-xs underline" >
              Remove uploaded portrait
            </ConfirmButton>
          </form>
        )}
      </Card>

      <Card title="Resume" hint="The “Download Resume” button on the hero. PDF only, max 3.5 MB.">
        {resume ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Current: {resume.original_name} ·{" "}
            <a href="/api/resume" className="underline text-[var(--accent)]">test download</a>
          </p>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>No resume uploaded yet.</p>
        )}
        <AdminForm action={uploadSiteFile} submitLabel="Upload resume">
          <input type="hidden" name="type" value="resume" />
          <input type="file" name="file" accept="application/pdf" className={input} />
        </AdminForm>
        {resume && (
          <form action={removeSiteFile}>
            <input type="hidden" name="type" value="resume" />
            <ConfirmButton message="Remove the uploaded resume?" className="text-xs underline">
              Remove uploaded resume
            </ConfirmButton>
          </form>
        )}
      </Card>
    </div>
  );
}
