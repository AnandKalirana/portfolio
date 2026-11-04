"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const highlights = [
  { label: "Focus Area", value: "IoT & Full-Stack" },
  { label: "Education", value: "B.Tech IoT, 3rd Year" },
  { label: "Location", value: "India" },
  { label: "Status", value: "Seeking Internships" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      ref={ref}
      className="relative py-28 lg:py-36 border-b"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-3 mb-12"
        >
          <span className="section-number">02</span>
          <div className="w-8 h-px" style={{ backgroundColor: "var(--border)" }} />
          <span className="editorial-label">About Me</span>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_320px] gap-16 items-start">
          {/* Left — text */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-8"
              style={{ color: "var(--text-primary)" }}
            >
              Engineering ideas into
              <br />
              <span className="font-serif-italic font-normal" style={{ color: "var(--accent)" }}>
                real-world solutions.
              </span>
            </motion.h2>

            <div className="space-y-5 max-w-2xl">
              {[
                {
                  area: "Internet of Things & Embedded Systems",
                  desc: "Passionate about connecting the physical and digital worlds. I work with microcontrollers like Arduino and ESP32, design sensor networks, and implement protocols such as MQTT and CoAP to build intelligent, responsive IoT systems.",
                },
                {
                  area: "Full-Stack Web Development",
                  desc: "I build end-to-end web applications using Next.js, React, Node.js, and Express. From crafting responsive interfaces to architecting backend APIs, I focus on creating software that is both functional and maintainable.",
                },
                {
                  area: "Backend Engineering & API Development",
                  desc: "I design RESTful APIs with Express and Node.js, work with relational databases like PostgreSQL and MySQL via Prisma, and build backend systems with an eye on performance and scalability.",
                },
                {
                  area: "Cybersecurity & Secure Engineering",
                  desc: "My interest in cybersecurity drives me to understand network security, vulnerability assessment, and threat analysis — and to integrate security best practices into every layer of the systems I build.",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.area}
                  initial={{ opacity: 0, y: 15 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="flex gap-4 pb-5 border-b last:border-b-0"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div
                    className="w-px self-stretch mt-1 flex-shrink-0"
                    style={{ backgroundColor: "var(--accent)", opacity: 0.6 }}
                  />
                  <div>
                    <div
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.area}
                    </div>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — highlights card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="sticky top-28"
          >
            <div
              className="border p-6"
              style={{
                backgroundColor: "var(--elevated)",
                borderColor: "var(--border)",
              }}
            >
              <div className="editorial-label mb-5">Profile</div>
              <div className="space-y-4">
                {highlights.map((h) => (
                  <div
                    key={h.label}
                    className="flex items-start justify-between gap-4 pb-4 border-b last:border-b-0 last:pb-0"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <span
                      className="text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {h.label}
                    </span>
                    <span
                      className="text-xs font-semibold text-right"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {h.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Accent line */}
              <div
                className="mt-6 pt-5 border-t"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="editorial-label mb-2">Currently Exploring</div>
                <div className="flex flex-wrap gap-2">
                  {["Embedded Security", "Edge AI", "WebSockets", "DevSecOps"].map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-1 border"
                      style={{
                        borderColor: "var(--border)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
