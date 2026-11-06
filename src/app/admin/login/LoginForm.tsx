"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="block text-xs font-semibold mb-1.5" style={{ color: "var(--text-secondary)" }}>Password</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full border px-3 py-2 text-sm bg-transparent outline-none focus:border-[var(--accent)]"
          style={{ borderColor: "var(--border)", color: "var(--text-primary)" }}
        />
      </label>
      {state.error && <p role="alert" className="text-sm text-red-400">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-apple btn-apple-primary w-full px-5 py-2.5 text-sm">
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
