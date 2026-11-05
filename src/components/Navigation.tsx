"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

// Apple-style motion: quick, slightly springy, never bouncy.
const spring = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 };

const subscribeNoop = () => () => {};

export default function Navigation() {
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribeNoop, () => true, () => false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      let current = "";
      for (const { href } of navLinks) {
        const el = document.getElementById(href.slice(1));
        if (el && window.scrollY >= el.offsetTop - 120) current = href.slice(1);
      }
      setActiveSection(current);
    };
    const frame = requestAnimationFrame(handleScroll); // correct state on reload mid-page
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const isDark = theme === "dark";

  const renderThemeToggle = (className = "") =>
    mounted ? (
      <motion.button
        onClick={() => setTheme(isDark ? "light" : "dark")}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.88 }}
        transition={spring}
        className={`nav-icon-btn ${className}`}
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? "sun" : "moon"}
            initial={{ opacity: 0, rotate: -70, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 70, scale: 0.5 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex"
          >
            {isDark ? <Sun size={16} strokeWidth={1.6} /> : <Moon size={16} strokeWidth={1.6} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    ) : (
      <span className="w-9 h-9" />
    );

  return (
    <MotionConfig reducedMotion="user">
      <motion.nav
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ...spring, delay: 0.05 }}
        className={`fixed inset-x-0 z-50 flex justify-center px-3 pointer-events-none transition-[top] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          scrolled ? "top-3" : "top-4"
        }`}
      >
        {/* Floating glass capsule */}
        <div
          className="pointer-events-auto w-full md:w-auto flex items-center justify-between md:justify-start gap-1 rounded-full border p-1.5 transition-[background-color,box-shadow] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{
            backgroundColor: `color-mix(in srgb, var(--bg-primary) ${scrolled ? 74 : 52}%, transparent)`,
            borderColor: "var(--border)",
            boxShadow: scrolled
              ? "0 10px 32px -14px rgba(0,0,0,0.5)"
              : "0 0 0 0 rgba(0,0,0,0)",
            backdropFilter: "saturate(180%) blur(22px)",
            WebkitBackdropFilter: "saturate(180%) blur(22px)",
          }}
        >
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="flex items-center gap-2.5 group rounded-full pr-3 outline-offset-2"
          >
            <div
              className="w-8 h-8 flex items-center justify-center rounded-full border text-[10px] font-bold tracking-wider transition-colors duration-300 group-hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                fontFamily: "monospace",
              }}
            >
              AK
            </div>
            <span
              className="text-sm font-medium tracking-tight hidden sm:block"
              style={{ color: "var(--text-primary)" }}
            >
              Anand Kalirana
            </span>
          </motion.a>

          {/* Divider */}
          <div
            className="hidden md:block w-px h-5 mr-1"
            style={{ backgroundColor: "var(--border)" }}
          />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5" onMouseLeave={() => setHovered(null)}>
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const active = activeSection === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  onMouseEnter={() => setHovered(id)}
                  onFocus={() => setHovered(id)}
                  onBlur={() => setHovered(null)}
                  className="relative px-3.5 py-1.5 text-sm font-medium tracking-tight rounded-full outline-offset-2 transition-colors duration-300"
                  style={{
                    color: active
                      ? "var(--accent)"
                      : hovered === id
                      ? "var(--text-primary)"
                      : "var(--text-secondary)",
                  }}
                >
                  {active && (
                    <motion.span
                      layoutId="navActive"
                      transition={spring}
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--accent) 13%, transparent)",
                      }}
                    />
                  )}
                  {hovered === id && !active && (
                    <motion.span
                      layoutId="navHover"
                      transition={spring}
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: "color-mix(in srgb, var(--text-primary) 7%, transparent)",
                      }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </a>
              );
            })}
          </div>
          <div className="hidden md:block">{renderThemeToggle("ml-1")}</div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-0.5">
            {renderThemeToggle()}
            <motion.button
              onClick={() => setMobileOpen((o) => !o)}
              whileTap={{ scale: 0.88 }}
              transition={spring}
              className="nav-icon-btn"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <span className="relative block w-[18px] h-[10px]">
                <motion.span
                  className="absolute left-0 right-0 h-[1.5px] rounded-full bg-current"
                  animate={mobileOpen ? { top: 4, rotate: 45 } : { top: 0, rotate: 0 }}
                  transition={spring}
                />
                <motion.span
                  className="absolute left-0 right-0 h-[1.5px] rounded-full bg-current"
                  animate={mobileOpen ? { top: 4, rotate: -45 } : { top: 8, rotate: 0 }}
                  transition={spring}
                />
              </span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu — floating glass sheet */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="scrim"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30"
              style={{ backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            />
            <motion.div
              key="sheet"
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={spring}
              style={{
                transformOrigin: "top center",
                backgroundColor: "color-mix(in srgb, var(--bg-primary) 82%, transparent)",
                borderColor: "var(--border)",
                backdropFilter: "saturate(180%) blur(28px)",
                WebkitBackdropFilter: "saturate(180%) blur(28px)",
              }}
              className="fixed top-[4.75rem] left-3 right-3 z-50 rounded-3xl border p-2 shadow-2xl shadow-black/30"
            >
              {navLinks.map((link, i) => {
                const active = activeSection === link.href.slice(1);
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...spring, delay: 0.04 + i * 0.035 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[17px] font-semibold tracking-tight"
                    style={{
                      color: active ? "var(--accent)" : "var(--text-primary)",
                      backgroundColor: active
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "transparent",
                    }}
                  >
                    {link.label}
                    {active && (
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: "var(--accent)" }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
