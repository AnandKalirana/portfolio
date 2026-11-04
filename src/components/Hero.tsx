"use client";

import { motion } from "framer-motion";
import { Github, Download, ChevronDown } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Background technical grid */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top decorative line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--border)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full pt-28 pb-16">
        <div className="grid lg:grid-cols-[1fr_420px] gap-16 items-center min-h-[calc(100vh-7rem)]">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            {/* Editorial label */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-8"
            >
              <div
                className="w-6 h-px"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span className="editorial-label">
                IoT Engineer &amp; Cybersecurity Enthusiast
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Building secure
              <br />
              connected systems
              <br />
              that make an{" "}
              <span
                className="font-serif-italic font-normal"
                style={{ color: "var(--accent)" }}
              >
                impact.
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-base lg:text-lg leading-relaxed max-w-lg mb-10"
              style={{ color: "var(--text-secondary)" }}
            >
              Engineering student passionate about IoT, full-stack development
              and cybersecurity. I build solutions at the intersection of
              hardware, software and security.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://github.com/anandkalirana"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold transition-all duration-200 group"
                style={{
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg-primary)",
                }}
              >
                <Github size={15} strokeWidth={2} />
                View GitHub Profile
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="/resume.pdf"
                download
                className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold border transition-all duration-200 group"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <Download size={15} strokeWidth={1.5} />
                Download Resume
              </a>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              custom={5}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mt-16"
            >
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <ChevronDown size={16} strokeWidth={1.5} style={{ color: "var(--text-secondary)" }} />
              </motion.div>
              <span className="editorial-label">Scroll to explore</span>
            </motion.div>
          </div>

          {/* Right side — Portrait placeholder + editorial elements */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative hidden lg:flex flex-col items-center"
          >
            {/* Portrait area */}
            <div className="relative w-full">
              {/* Main portrait frame */}
              <div
                className="relative w-full aspect-[3/4] overflow-hidden"
                style={{
                  backgroundColor: "var(--elevated)",
                  border: "1px solid var(--border)",
                }}
              >
                {/* Typography composition for portrait placeholder */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div
                    className="text-[10rem] font-black leading-none select-none opacity-5"
                    style={{ color: "var(--text-primary)" }}
                  >
                    AK
                  </div>
                </div>
                
                {/* Editorial overlay label */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-5"
                  style={{
                    background: "linear-gradient(to top, var(--bg-primary) 0%, transparent 100%)",
                  }}
                >
                  <div className="editorial-label text-center">
                    Portrait — Add your photo here
                  </div>
                </div>

                {/* Corner marks */}
                <div className="absolute top-3 left-3 w-4 h-4 border-t border-l" style={{ borderColor: "var(--accent)" }} />
                <div className="absolute top-3 right-3 w-4 h-4 border-t border-r" style={{ borderColor: "var(--accent)" }} />
                <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l" style={{ borderColor: "var(--accent)" }} />
                <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r" style={{ borderColor: "var(--accent)" }} />
              </div>

              {/* Floating editorial label — Design / Build / Secure */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -right-6 top-1/3 border px-3 py-5"
                style={{
                  backgroundColor: "var(--accent)",
                  borderColor: "transparent",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                <span className="text-xs font-bold tracking-widest text-white">
                  DESIGN / BUILD / SECURE
                </span>
              </motion.div>

              {/* Decorative dot grid */}
              <div
                className="absolute -bottom-4 -left-4 w-24 h-24 opacity-30"
                style={{
                  backgroundImage: `radial-gradient(circle, var(--text-secondary) 1px, transparent 1px)`,
                  backgroundSize: "8px 8px",
                }}
              />

              {/* Small meta card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute -left-8 top-1/4 border px-3 py-2"
                style={{
                  backgroundColor: "var(--elevated)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="editorial-label text-xs mb-1">STATUS</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs font-medium" style={{ color: "var(--text-primary)" }}>
                    Open to Opportunities
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--border)" }}
      />
    </section>
  );
}
