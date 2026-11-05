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
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-[padding,background-color,border-color,backdrop-filter] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          scrolled ? "py-2.5" : "py-5"
        }`}
        style={{
          backgroundColor: scrolled
            ? "color-mix(in srgb, var(--bg-primary) 68%, transparent)"
            : "transparent",
          borderColor: scrolled ? "var(--border)" : "transparent",
          backdropFilter: scrolled ? "saturate(180%) blur(22px)" : "saturate(100%) blur(0px)",
          WebkitBackdropFilter: scrolled ? "saturate(180%) blur(22px)" : "saturate(100%) blur(0px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            whileTap={{ scale: 0.96 }}
            transition={spring}
            className="flex items-center gap-3 group rounded-lg outline-offset-4"
          >
            <div
              className="w-8 h-8 flex items-center justify-center border text-xs font-bold tracking-widest transition-colors duration-300 group-hover:bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1" onMouseLeave={() => setHovered(null)}>
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
            {renderThemeToggle("ml-2")}
          </div>

          {/* Mobile controls */}
          <div className="flex md:hidden items-center gap-1">
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
              className="fixed top-[4.25rem] left-3 right-3 z-50 rounded-2xl border p-2 shadow-2xl shadow-black/30"
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
