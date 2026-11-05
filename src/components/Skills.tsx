
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { SkillGroup } from "@/lib/portfolio-data";

function SkillCard({
  group,
  index,
}: {
  group: SkillGroup;
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: "easeOut",
      }}
      className="border p-6 group hover:border-opacity-60 transition-colors duration-300"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--elevated)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-start gap-3 mb-6 pb-5 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="w-10 h-10 flex items-center justify-center border flex-shrink-0"
          style={{ borderColor: "var(--border)", color: "var(--accent)" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path d={group.iconPath} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <div className="section-number mb-0.5">{group.number}</div>
          <h3
            className="text-sm font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {group.title}
          </h3>
        </div>
      </div>

      {/* Skills list */}
      <ul className="space-y-3">
        {group.skills.map((skill, si) => (
          <motion.li
            key={skill}
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.3,
              delay: 0.2 + index * 0.08 + si * 0.05,
            }}
            className="flex items-center gap-3"
          >
            <div
              className="w-1 h-1 flex-shrink-0"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              {skill}
            </span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="skills"
      className="relative py-28 lg:py-36"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--border)" }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="section-number">05</span>
              <div
                className="w-8 h-px"
                style={{ backgroundColor: "var(--border)" }}
              />
              <span className="editorial-label">Technical Skills</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              The toolkit I use to{" "}
              <span
                className="font-serif-italic font-normal"
                style={{ color: "var(--accent)" }}
              >
                build &amp; secure.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-end pb-2"
          >
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              A blend of IoT, full-stack development and cybersecurity expertise.
              Technologies verified against real project experience.
            </p>
          </motion.div>
        </div>

        {/* Skill columns */}
        <div className="grid md:grid-cols-3 gap-6">
          {skillGroups.map((group, i) => (
            <SkillCard key={group.number} group={group} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
