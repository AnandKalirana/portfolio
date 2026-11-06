import { deleteRow, moveRow, togglePublished } from "@/app/admin/actions";
import { ConfirmButton } from "@/components/admin/AdminForm";

const inputCls =
  "w-full border px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--accent)] transition-colors";
const box = { borderColor: "var(--border)", color: "var(--text-primary)" } as const;

export function Field({
  label,
  name,
  defaultValue,
  textarea,
  rows = 4,
  hint,
  required,
  type = "text",
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  textarea?: boolean;
  rows?: number;
  hint?: string;
  required?: boolean;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
        {required && " *"}
      </span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue ?? ""} rows={rows} className={inputCls} style={box} />
      ) : (
        <input name={name} defaultValue={defaultValue ?? ""} type={type} className={inputCls} style={box} />
      )}
      {hint && (
        <span className="block text-xs mt-1" style={{ color: "var(--text-secondary)", opacity: 0.8 }}>
          {hint}
        </span>
      )}
    </label>
  );
}

export function PublishedField({ checked = true }: { checked?: boolean }) {
  return (
    <label className="flex items-center gap-2 text-sm" style={{ color: "var(--text-primary)" }}>
      <input type="checkbox" name="published" defaultChecked={checked} className="accent-[var(--accent)]" />
      Visible on the public site
    </label>
  );
}

const smallBtn =
  "text-xs px-2.5 py-1 border transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]";

/** Move up/down, show/hide and delete for one row. */
export function RowActions({
  table,
  id,
  published,
  itemLabel,
}: {
  table: "projects" | "experiences" | "skill_groups";
  id: string;
  published: boolean;
  itemLabel: string;
}) {
  const hidden = (
    <>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
    </>
  );
  const s = { borderColor: "var(--border)", color: "var(--text-secondary)" };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form action={moveRow}>
        {hidden}
        <input type="hidden" name="dir" value="up" />
        <button className={smallBtn} style={s} aria-label={`Move ${itemLabel} up`}>↑</button>
      </form>
      <form action={moveRow}>
        {hidden}
        <input type="hidden" name="dir" value="down" />
        <button className={smallBtn} style={s} aria-label={`Move ${itemLabel} down`}>↓</button>
      </form>
      <form action={togglePublished}>
        {hidden}
        <button className={smallBtn} style={s}>{published ? "Hide" : "Show"}</button>
      </form>
      <form action={deleteRow}>
        {hidden}
        <ConfirmButton message={`Delete "${itemLabel}"? This cannot be undone.`} className={`${smallBtn} !text-red-400`}>
          Delete
        </ConfirmButton>
      </form>
    </div>
  );
}

export function Item({
  title,
  subtitle,
  published,
  open,
  children,
  actions,
}: {
  title: string;
  subtitle?: string;
  published?: boolean;
  open?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="border" style={{ borderColor: "var(--border)", backgroundColor: "var(--elevated)" }}>
      <details open={open}>
        <summary className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 cursor-pointer select-none">
          <span>
            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{title}</span>
            {subtitle && (
              <span className="text-xs ml-3" style={{ color: "var(--text-secondary)" }}>{subtitle}</span>
            )}
            {published === false && (
              <span className="text-xs ml-3 px-1.5 py-0.5 border" style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}>
                Hidden
              </span>
            )}
          </span>
        </summary>
        <div className="px-4 pb-5 pt-2 border-t" style={{ borderColor: "var(--border)" }}>
          {children}
        </div>
      </details>
      {actions && <div className="px-4 py-3 border-t" style={{ borderColor: "var(--border)" }}>{actions}</div>}
    </div>
  );
}
