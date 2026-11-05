"use client";

import { motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/Icons";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="relative border-t py-8"
      style={{
        backgroundColor: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-5">
        {/* Left — logo + copyright */}
        <div className="flex items-center gap-4">
          <div
            className="w-7 h-7 flex items-center justify-center border text-xs font-bold"
            style={{
              borderColor: "var(--border)",
              color: "var(--accent)",
              fontFamily: "monospace",
            }}
          >
            AK
          </div>
          <div>
            <div
              className="text-xs font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              © 2025 Anand Kalirana. All rights reserved.
            </div>
            <div
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Designed &amp; Built with precision
            </div>
          </div>
        </div>

        {/* Right — links + back to top */}
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/AnandKalirana"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
            aria-label="GitHub"
          >
            <GithubIcon size={16} />
          </a>
          <a
            href="https://linkedin.com/in/anandkalirana"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors duration-200 hover:opacity-70"
            style={{ color: "var(--text-secondary)" }}
            aria-label="LinkedIn"
          >
            <LinkedinIcon size={16} />
          </a>

          <div className="w-px h-4" style={{ backgroundColor: "var(--border)" }} />

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 text-xs font-semibold transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            aria-label="Back to top"
          >
            <ArrowUp size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">Back to top</span>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
