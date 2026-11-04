"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const experiences = [
  {
    number: "01",
    org: "Agastya International Foundation",
    role: "IoT Intern",
    period: "2024",
    type: "Internship",
    category: "IoT / Embedded",
    description:
      "Worked on IoT-based projects, focusing on sensor integration and real-time data acquisition. Contributed to building connected systems that support science education initiatives.",
    side: "left",
  },
  {
    number: "02",
    org: "JPMorgan Chase & Co.",
    role: "Software Engineering Virtual Experience",
    period: "2024",
    type: "Virtual Program",
    category: "Software Engineering",
    description:
      "Completed a software engineering job simulation, building realistic solutions and solving real-world business problems. Gained exposure to professional engineering workflows and financial technology.",
    side: "right",
  },
  {
    number: "03",
    org: "Threat Prism",
    role: "Cybersecurity Analyst (Trainee)",
    period: "Sep 2024 — Present",
    type: "Trainee",
    category: "Cybersecurity",
    description:
      "Learning threat analysis, vulnerability assessment, and security monitoring. Developing practical skills in identifying and assessing security risks across networks and systems.",
    side: "left",
  },
];

export default function Experience() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="experience"
      className="relative py-28 lg:py-36 border-t border-b"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="section-number">04</span>
              <div className="w-8 h-px" style={{ backgroundColor: "var(--border)" }} />
              <span className="editorial-label">Experience Timeline</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Learning.{" "}
              <br />
              Building.{" "}
              <span className="font-serif-italic font-normal" style={{ color: "var(--accent)" }}>
                Growing.
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
              Hands-on experience through internships, research and real-world
              problem solving. Each experience has shaped how I approach
              engineering challenges.
            </p>
          </motion.div>
        </div>

        {/* Desktop timeline */}
        <div className="hidden lg:block relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: "var(--border)" }}
          />

          <div className="space-y-16">
            {experiences.map((exp, i) => {
              const entryRef = useRef(null);
              const entryInView = useInView(entryRef, { once: true, margin: "-40px" });
              const isLeft = exp.side === "left";

              return (
                <div key={exp.number} ref={entryRef} className="relative grid grid-cols-2 gap-8">
                  {/* Timeline node */}
                  <div className="absolute left-1/2 top-6 -translate-x-1/2 z-10">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={entryInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                      className="w-10 h-10 flex items-center justify-center border-2 text-xs font-bold"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                        fontFamily: "monospace",
                      }}
                    >
                      {exp.number}
                    </motion.div>
                  </div>

                  {/* Left content */}
                  <div className={`${!isLeft ? "opacity-0 pointer-events-none" : ""} flex justify-end pr-12`}>
                    {isLeft && (
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={entryInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                        className="max-w-sm w-full"
                      >
                        <ExperienceCard exp={exp} />
                      </motion.div>
                    )}
                  </div>

                  {/* Right content */}
                  <div className={`${isLeft ? "opacity-0 pointer-events-none" : ""} pl-12`}>
                    {!isLeft && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={entryInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                        className="max-w-sm w-full"
                      >
                        <ExperienceCard exp={exp} />
                      </motion.div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile timeline */}
        <div className="lg:hidden relative">
          <div
            className="absolute left-5 top-0 bottom-0 w-px"
            style={{ backgroundColor: "var(--border)" }}
          />
          <div className="space-y-10">
            {experiences.map((exp, i) => {
              const mobileRef = useRef(null);
              const mobileInView = useInView(mobileRef, { once: true, margin: "-40px" });

              return (
                <div key={exp.number} ref={mobileRef} className="relative pl-16">
                  {/* Node */}
                  <div className="absolute left-0 top-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={mobileInView ? { scale: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="w-10 h-10 flex items-center justify-center border-2 text-xs font-bold"
                      style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--accent)",
                        color: "var(--accent)",
                        fontFamily: "monospace",
                      }}
                    >
                      {exp.number}
                    </motion.div>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={mobileInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <ExperienceCard exp={exp} />
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ exp }: { exp: typeof experiences[0] }) {
  return (
    <div
      className="border p-5"
      style={{
        backgroundColor: "var(--elevated)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="text-xs font-semibold mb-0.5" style={{ color: "var(--accent)" }}>
            {exp.period}
          </div>
          <h3
            className="text-base font-bold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {exp.role}
          </h3>
          <div
            className="text-sm mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {exp.org}
          </div>
        </div>
      </div>

      <p
        className="text-sm leading-relaxed mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        {exp.description}
      </p>

      <div className="flex items-center gap-2">
        <span
          className="text-xs px-2 py-0.5 border font-medium"
          style={{
            borderColor: "rgba(201,130,43,0.3)",
            color: "var(--accent)",
            backgroundColor: "rgba(201,130,43,0.06)",
          }}
        >
          {exp.category}
        </span>
        <span
          className="text-xs px-2 py-0.5 border"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          {exp.type}
        </span>
      </div>
    </div>
  );
}
