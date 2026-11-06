import { adminSkillGroups } from "@/lib/admin-data";
import { saveSkillGroup } from "../../actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field, Item, PublishedField, RowActions } from "@/components/admin/fields";

// Admin pages read the session and database on every request; skip instant-navigation validation.
export const instant = false;

type G = Awaited<ReturnType<typeof adminSkillGroups>>[number];

function GroupFields({ g }: { g?: G }) {
  return (
    <>
      {g && <input type="hidden" name="id" value={g.id} />}
      <Field label="Group title" name="title" defaultValue={g?.title} required />
      <Field label="Skills" name="skills" defaultValue={g?.skills?.join("\n")} textarea rows={6} hint="One per line (commas also work). Order is kept." />
      <Field label="Icon (SVG path data)" name="icon_path" defaultValue={g?.icon_path} textarea rows={2} hint="Optional. Leave as is unless you want a different icon." />
      <PublishedField checked={g?.published ?? true} />
    </>
  );
}

export default async function SkillsAdmin() {
  const groups = await adminSkillGroups();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Skills</h1>
      {groups.map((g) => (
        <Item
          key={g.id}
          title={g.title}
          subtitle={`${g.skills.length} skills`}
          published={g.published}
          actions={<RowActions table="skill_groups" id={g.id} published={g.published} itemLabel={g.title} />}
        >
          <AdminForm action={saveSkillGroup}>
            <GroupFields g={g} />
          </AdminForm>
        </Item>
      ))}
      <Item title="＋ Add skill group">
        <AdminForm key={groups.length} action={saveSkillGroup} submitLabel="Add group">
          <GroupFields />
        </AdminForm>
      </Item>
    </div>
  );
}
