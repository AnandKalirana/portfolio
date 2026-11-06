import { adminExperiences } from "@/lib/admin-data";
import { saveExperience } from "../../actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field, Item, PublishedField, RowActions } from "@/components/admin/fields";

type E = Awaited<ReturnType<typeof adminExperiences>>[number];

function ExperienceFields({ e }: { e?: E }) {
  return (
    <>
      {e && <input type="hidden" name="id" value={e.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Organisation" name="company" defaultValue={e?.company} required />
        <Field label="Role" name="role" defaultValue={e?.role} required />
        <Field label="Period" name="period" defaultValue={e?.period} hint="e.g. Dec 2025 — Feb 2026" required />
        <Field label="Type / status" name="status" defaultValue={e?.status} hint="e.g. Internship, In Development" />
        <Field label="Category" name="category" defaultValue={e?.category} />
      </div>
      <Field label="Description" name="description" defaultValue={e?.description} textarea required />
      <PublishedField checked={e?.published ?? true} />
    </>
  );
}

export default async function ExperienceAdmin() {
  const items = await adminExperiences();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Experience</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
        Numbering and left/right placement on the timeline follow the order below.
      </p>
      {items.map((e) => (
        <Item
          key={e.id}
          title={e.company}
          subtitle={e.period}
          published={e.published}
          actions={<RowActions table="experiences" id={e.id} published={e.published} itemLabel={e.company} />}
        >
          <AdminForm action={saveExperience}>
            <ExperienceFields e={e} />
          </AdminForm>
        </Item>
      ))}
      <Item title="＋ Add experience">
        <AdminForm key={items.length} action={saveExperience} submitLabel="Add experience">
          <ExperienceFields />
        </AdminForm>
      </Item>
    </div>
  );
}
