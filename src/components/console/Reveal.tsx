"use client";

import { motion } from "framer-motion";

/** Fades and lifts content in once as it scrolls into view. Motion is skipped for reduced-motion users. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  x = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  x?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
