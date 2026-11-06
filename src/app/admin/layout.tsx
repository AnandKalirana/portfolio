import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Admin — Anand Kalirana",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
      <Suspense fallback={<p className="p-8 text-sm" style={{ color: "var(--text-secondary)" }}>Loading…</p>}>
        {children}
      </Suspense>
    </div>
  );
}
