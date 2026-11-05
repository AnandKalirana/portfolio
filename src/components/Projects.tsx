"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { GithubIcon, ExternalLinkIcon } from "@/components/Icons";

const projects = [
  {
    number: "01",
    category: "Full-Stack System",
    name: "RentLedger",
    description:
      "A multi-tenant rental management platform designed to simplify landlord and tenant operations. Features tenant-level data isolation, JWT authentication, rent payment tracking, proof uploads, and automated notifications via WhatsApp Cloud API.",
    tech: ["Next.js", "TypeScript", "Node.js", "Express.js", "PostgreSQL", "Prisma"],
    github: "https://github.com/AnandKalirana",
    demo: null,
    image: null as string | null,
    screenshotBg: "#0F1923",
    accentColor: "#C9822B",
    tags: ["Multi-Tenant Isolation", "Payment Workflows", "JWT Auth", "WhatsApp API"],
  },
  {
    number: "02",
    category: "Full-Stack Application",
    name: "Personal Book Tracker",
    description:
      "A personal library and reading management platform that helps users catalog books, record reading milestones, and track history. Features full CRUD workflows, Google Books API integration, ratings, and deployed via Railway.",
    tech: ["React.js", "Node.js", "Express.js", "MySQL", "Google Books API"],
    github: "https://github.com/AnandKalirana",
    demo: null,
    image: null as string | null,
    screenshotBg: "#0D1B2A",
    accentColor: "#C9822B",
    tags: ["Reading Status", "Google Books API", "CRUD Workflows", "Railway"],
  },
];

function ProjectCard({ project, index }: { project: typeof projects[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      className="group relative border overflow-hidden transition-all duration-300 hover:border-opacity-60"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--elevated)",
      }}
    >
      {/* Project screenshot / visual */}
      <div
        className="relative w-full aspect-[16/9] overflow-hidden"
        style={{ backgroundColor: project.screenshotBg }}
      >
        {project.image ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={project.image}
            alt={`${project.name} preview`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <>
          {/* Mockup grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "30px 30px",
            }}
          />

          {/* Browser chrome mockup */}
          <div className="absolute inset-4 border border-white/10 rounded-sm overflow-hidden">
            <div
              className="h-7 flex items-center gap-1.5 px-3 border-b border-white/10"
              style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
            >
              <div className="w-2 h-2 rounded-full bg-red-400/60" />
              <div className="w-2 h-2 rounded-full bg-yellow-400/60" />
              <div className="w-2 h-2 rounded-full bg-green-400/60" />
              <div className="flex-1 mx-3 h-3 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
            </div>
          
            {/* Mockup content */}
            <div className="p-4 h-full" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
              {/* Sidebar + content layout */}
              <div className="flex gap-3 h-full">
                <div className="w-1/4 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => {
                    const widths = ["80%", "65%", "75%", "55%", "70%"];
                    return (
                      <div
                        key={i}
                        className="h-2 rounded-sm"
                        style={{
                          backgroundColor:
                            i === 1
                              ? project.accentColor + "80"
                              : "rgba(255,255,255,0.08)",
                          width: widths[i - 1],
                        }}
                      />
                    );
                  })}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="h-10 border border-white/5 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.03)" }} />
                    ))}
                  </div>
                  <div className="h-2 w-3/4 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                  <div className="h-2 w-1/2 rounded-sm" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
                </div>
              </div>
            </div>
          </div>
          </>
        )}

        {/* Category label overlay */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-bold tracking-widest uppercase px-2 py-1"
            style={{ backgroundColor: project.accentColor, color: "white" }}
          >
            {project.number}
          </span>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white text-black hover:bg-gray-100 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            <GithubIcon size={13} />
            GitHub
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold border border-white text-white hover:bg-white/10 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLinkIcon size={13} />
              Live Demo
            </a>
          )}
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="editorial-label mb-1" style={{ color: "var(--text-secondary)" }}>
              {project.category}
            </div>
            <h3
              className="text-xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {project.name}
            </h3>
          </div>
          <span
            className="text-2xl font-black opacity-10 leading-none flex-shrink-0"
            style={{ color: "var(--text-primary)" }}
          >
            {project.number}
          </span>
        </div>

        <p
          className="text-sm leading-relaxed mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 border"
              style={{
                borderColor: "rgba(201,130,43,0.3)",
                color: "var(--accent)",
                backgroundColor: "rgba(201,130,43,0.06)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tech.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-0.5 border"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)" }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center gap-5 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs font-semibold transition-all duration-200 group/link"
            style={{ color: "var(--text-primary)" }}
          >
            <GithubIcon size={13} />
            <span>View on GitHub</span>
            <ArrowRight
              size={12}
              className="transition-transform duration-200 group-hover/link:translate-x-1"
            />
          </a>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold transition-all duration-200 group/link"
              style={{ color: "var(--text-secondary)" }}
            >
              <ExternalLinkIcon size={13} />
              <span>Live Demo</span>
              <ArrowRight
                size={12}
                className="transition-transform duration-200 group-hover/link:translate-x-1"
              />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="projects"
      className="relative py-28 lg:py-36"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ backgroundColor: "var(--border)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <span className="section-number">03</span>
              <div className="w-8 h-px" style={{ backgroundColor: "var(--border)" }} />
              <span className="editorial-label">Featured Projects</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Selected work.{" "}
              <span className="font-serif-italic font-normal" style={{ color: "var(--accent)" }}>
                Real-world thinking.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-start lg:items-end gap-4"
          >
            <p
              className="text-sm leading-relaxed max-w-sm lg:text-right"
              style={{ color: "var(--text-secondary)" }}
            >
              A selection of projects where I applied engineering thinking to
              solve practical problems.
            </p>
            <a
              href="https://github.com/anandkalirana"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-semibold border px-4 py-2 transition-all duration-200 group"
              style={{
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            >
              View All Projects
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>

        {/* Project grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.name} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
