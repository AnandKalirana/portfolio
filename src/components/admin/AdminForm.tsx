"use client";

import { useState, useTransition } from "react";
import type { FormState } from "@/app/admin/actions";

export function AdminForm({
  action,
  submitLabel = "Save",
  children,
}: {
  action: (prev: FormState, data: FormData) => Promise<FormState>;
  submitLabel?: string;
  children: React.ReactNode;
}) {
  const [state, setState] = useState<FormState>({});
  const [pending, startTransition] = useTransition();

  return (
    // Manual submit (not <form action>) so React does not wipe the fields on a validation error.
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(async () => {
          setState(await action(state, data));
        });
      }}
    >
      {children}
      <div className="flex items-center gap-4 pt-1">
        <button type="submit" disabled={pending} className="btn-apple btn-apple-primary px-5 py-2 text-sm">
          {pending ? "Saving…" : submitLabel}
        </button>
        {state.error && (
          <span role="alert" className="text-sm text-red-400">
            {state.error}
          </span>
        )}
        {state.ok && !state.error && (
          <span role="status" className="text-sm text-green-400">
            {state.ok}
          </span>
        )}
      </div>
    </form>
  );
}

export function ConfirmButton({
  message,
  className,
  children,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
