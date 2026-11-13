"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, useScroll, useSpring, MotionConfig } from "framer-motion";
import { Moon, Search, Sun } from "lucide-react";
import { IconButton } from "@astryxdesign/core/IconButton";
import { CommandPalette } from "@astryxdesign/core/CommandPalette";
import { createStaticSource } from "@astryxdesign/core/Typeahead";
import type { SearchableItem } from "@astryxdesign/core/Typeahead";
import { Kbd } from "@astryxdesign/core/Kbd";
import { useColorMode } from "./ColorMode";

const sections = [
  { id: "hero", n: "01", label: "Home" },
  { id: "about", n: "02", label: "About" },
  { id: "projects", n: "03", label: "Projects" },
  { id: "experience", n: "04", label: "Experience" },
  { id: "skills", n: "05", label: "Skills" },
  { id: "contact", n: "06", label: "Contact" },
];

type Aux = { group: string; hint?: string };
type Item = SearchableItem<Aux>;

const items: Item[] = [
  ...sections.map((s) => ({
    id: `go:${s.id}`,
    label: s.label,
    auxiliaryData: { group: "Jump to", hint: s.n },
  })),
  { id: "act:resume", label: "Download resume", auxiliaryData: { group: "Actions", hint: "PDF" } },
  { id: "act:github", label: "Open GitHub profile", auxiliaryData: { group: "Actions", hint: "↗" } },
  { id: "act:linkedin", label: "Open LinkedIn", auxiliaryData: { group: "Actions", hint: "↗" } },
  { id: "act:email", label: "Send an email", auxiliaryData: { group: "Actions", hint: "@" } },
  { id: "act:theme", label: "Toggle light / dark", auxiliaryData: { group: "Actions", hint: "◐" } },
];

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Chrome() {
  const { mode, toggle } = useColorMode();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const mark = window.innerHeight * 0.4;
        let current = "hero";
        for (const s of sections) {
          const el = document.getElementById(s.id);
          if (el && el.getBoundingClientRect().top <= mark) current = s.id;
        }
        setActive(current);
      });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const source = useMemo(() => createStaticSource<Item>(items), []);

  const run = (id: string) => {
    setOpen(false);
    if (id.startsWith("go:")) return goTo(id.slice(3));
    if (id === "act:resume") window.location.href = "/api/resume";
    if (id === "act:github") window.open("https://github.com/AnandKalirana", "_blank", "noopener,noreferrer");
    if (id === "act:linkedin")
      window.open("https://www.linkedin.com/in/anand-kalirana-572212310/", "_blank", "noopener,noreferrer");
    if (id === "act:email") window.location.href = "mailto:anandkaliranajat05@gmail.com";
    if (id === "act:theme") toggle();
  };

  const themeBtn = (
    <IconButton
      label={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      icon={mode === "dark" ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
      variant="ghost"
      onClick={toggle}
    />
  );
  const paletteBtn = (
    <IconButton
      label="Open menu and search"
      icon={<Search size={16} strokeWidth={1.6} />}
      variant="ghost"
      onClick={() => setOpen(true)}
    />
  );

  return (
    <MotionConfig reducedMotion="user">
      {/* ---------- desktop: signal rail ---------- */}
      <aside
        aria-label="Primary"
        className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[76px] flex-col items-center justify-between py-6 border-r hair"
        style={{
          background: "color-mix(in srgb, var(--color-background-body) 78%, transparent)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
      >
        <div className="flex flex-col items-center gap-5">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
            className="mono w-10 h-10 grid place-items-center border text-xs font-bold tracking-wider transition-colors hover:bg-[color-mix(in_srgb,var(--color-accent)_14%,transparent)]"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-text-accent)" }}
          >
            AK
          </button>
          <span
            className="tag !tracking-[0.3em] whitespace-nowrap"
            style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
          >
            Anand Kalirana
          </span>
        </div>

        <nav className="relative flex flex-col items-center gap-5 py-2">
          <span className="absolute top-3 bottom-3 w-px rail-line" aria-hidden />
          <motion.span
            aria-hidden
            className="absolute top-3 bottom-3 w-px origin-top"
            style={{ scaleY: progress, background: "var(--color-accent)" }}
          />
          {sections.map((s) => {
            const on = active === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(s.id)}
                aria-label={s.label}
                aria-current={on ? "true" : undefined}
                className="group relative mono grid place-items-center w-8 h-8 border text-[10px] font-semibold transition-all duration-300"
                style={{
                  background: "var(--color-background-body)",
                  borderColor: on ? "var(--color-accent)" : "var(--color-border-emphasized)",
                  color: on ? "var(--color-text-accent)" : "var(--color-text-secondary)",
                  boxShadow: on ? "0 0 0 4px color-mix(in srgb, var(--color-accent) 16%, transparent)" : "none",
                }}
              >
                {s.n}
                <span
                  className="tag pointer-events-none absolute left-full ml-4 whitespace-nowrap border px-2.5 py-1 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0"
                  style={{
                    background: "var(--color-background-card)",
                    borderColor: "var(--color-border-emphasized)",
                    color: "var(--color-text-primary)",
                  }}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="flex flex-col items-center gap-1.5">
          {paletteBtn}
          {themeBtn}
          <span className="mt-1 hidden xl:block">
            <Kbd keys="mod+k" />
          </span>
        </div>
      </aside>

      {/* ---------- mobile: top bar ---------- */}
      <header
        className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between pl-4 pr-2 border-b hair"
        style={{
          background: "color-mix(in srgb, var(--color-background-body) 82%, transparent)",
          backdropFilter: "blur(14px) saturate(160%)",
          WebkitBackdropFilter: "blur(14px) saturate(160%)",
        }}
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span
            className="mono w-8 h-8 grid place-items-center border text-[10px] font-bold tracking-wider"
            style={{ borderColor: "var(--color-accent)", color: "var(--color-text-accent)" }}
          >
            AK
          </span>
          <span className="text-sm font-semibold tracking-tight whitespace-nowrap">Anand Kalirana</span>
        </button>
        <div className="flex items-center">
          {themeBtn}
          {paletteBtn}
        </div>
        <motion.span
          aria-hidden
          className="absolute bottom-[-1px] left-0 right-0 h-px origin-left"
          style={{ scaleX: progress, background: "var(--color-accent)" }}
        />
      </header>

      <CommandPalette<Item>
        isOpen={open}
        onOpenChange={setOpen}
        searchSource={source}
        label="Menu and search"
        width={560}
        emptySearchText="Nothing matches that."
        emptyBootstrapText="Type to search sections and actions"
        onValueChange={run}
        renderItem={(item) => (
          <div className="flex w-full items-center justify-between gap-6">
            <span>{item.label}</span>
            {item.auxiliaryData?.hint && <span className="tag">{item.auxiliaryData.hint}</span>}
          </div>
        )}
      />
    </MotionConfig>
  );
}
