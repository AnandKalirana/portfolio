import { adminProjects } from "@/lib/admin-data";
import { saveProject } from "../../actions";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field, Item, PublishedField, RowActions } from "@/components/admin/fields";

type P = Awaited<ReturnType<typeof adminProjects>>[number];

function ProjectFields({ p }: { p?: P }) {
  return (
    <>
      {p && <input type="hidden" name="id" value={p.id} />}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Name" name="name" defaultValue={p?.name} required />
        <Field label="Category" name="category" defaultValue={p?.category} required />
      </div>
      <Field label="Description" name="description" defaultValue={p?.description} textarea required />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Tech stack" name="technologies" defaultValue={p?.technologies?.join(", ")} hint="Comma or new-line separated" />
        <Field label="Tags" name="tags" defaultValue={p?.tags?.join(", ")} hint="Comma or new-line separated" />
        <Field label="GitHub URL" name="github_url" defaultValue={p?.github_url} />
        <Field label="Live demo URL" name="demo_url" defaultValue={p?.demo_url} />
      </div>
      <Field label="Preview image" name="image_url" defaultValue={p?.image_url} hint="https:// URL or /projects/name.webp. Image uploads arrive with storage." />
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Image background" name="screenshot_bg" defaultValue={p?.screenshot_bg ?? "#0F1923"} />
        <Field label="Accent colour" name="accent_color" defaultValue={p?.accent_color ?? "#C9822B"} />
      </div>
      <PublishedField checked={p?.published ?? true} />
    </>
  );
}

export default async function ProjectsAdmin() {
  const projects = await adminProjects();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Projects</h1>
      {projects.map((p) => (
        <Item
          key={p.id}
          title={p.name}
          subtitle={p.category}
          published={p.published}
          actions={<RowActions table="projects" id={p.id} published={p.published} itemLabel={p.name} />}
        >
          <AdminForm action={saveProject}>
            <ProjectFields p={p} />
          </AdminForm>
        </Item>
      ))}
      <Item title="＋ Add project">
        <AdminForm key={projects.length} action={saveProject} submitLabel="Add project">
          <ProjectFields />
        </AdminForm>
      </Item>
    </div>
  );
}
