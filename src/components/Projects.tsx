import { ArrowRight } from "lucide-react";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Token } from "@astryxdesign/core/Token";
import { GithubIcon, ExternalLinkIcon } from "@/components/Icons";
import { Reveal } from "@/components/console/Reveal";
import { SectionHead } from "@/components/console/SectionHead";
import type { Project } from "@/lib/portfolio-data";

function slug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** A project shown as a deployed unit: a browser-framed screen next to its spec sheet. */
function Unit({ project, flip }: { project: Project; flip: boolean }) {
  return (
    <article className="group grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-14 items-center py-12 lg:py-16 border-t hair first:border-t-0">
      {/* screen */}
      <Reveal x={flip ? 24 : -24} y={0} className={flip ? "lg:order-2" : ""}>
        <div
          className="brackets scanline relative overflow-hidden border"
          style={{ background: project.screenshotBg, borderColor: "var(--color-border-emphasized)" }}
        >
          <div
            className="relative z-[4] flex items-center gap-1.5 px-3 h-9 border-b"
            style={{ background: "rgba(0,0,0,0.38)", borderColor: "rgba(255,255,255,0.08)" }}
          >
            <span className="w-2 h-2 rounded-full bg-red-400/70" />
            <span className="w-2 h-2 rounded-full bg-yellow-400/70" />
            <span className="w-2 h-2 rounded-full bg-green-400/70" />
            <span className="mono ml-3 text-[10px] tracking-wider text-white/55 truncate">
              unit-{project.number} / {slug(project.name)}
            </span>
          </div>
          <div className="relative aspect-[16/10]">
            {project.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={project.image}
                alt={`${project.name} preview`}
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center">
                <span className="mono text-xs tracking-[0.2em] text-white/40">NO PREVIEW</span>
              </div>
            )}
          </div>
        </div>
      </Reveal>

      {/* spec sheet */}
      <Reveal delay={0.1} x={flip ? -16 : 16} y={0} className={flip ? "lg:order-1" : ""}>
        <div className="flex items-center gap-3 mb-4">
          <span className="tag !text-[var(--color-text-accent)]">Unit {project.number}</span>
          <span className="h-px w-8" style={{ background: "var(--color-border-emphasized)" }} />
          <span className="tag">{project.category}</span>
        </div>

        <Heading level={3} className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
          {project.name}
        </Heading>

        <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.map((tag) => (
            <Token key={tag} label={tag} size="sm" color="orange" />
          ))}
        </div>

        <dl className="mb-7">
          <dt className="tag mb-2">Stack</dt>
          <dd className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="mono text-[11px] px-2 py-0.5 border hair" style={{ color: "var(--color-text-secondary)" }}>
                {t}
              </span>
            ))}
          </dd>
        </dl>

        <div className="flex flex-wrap gap-3">
          <Button
            label="View on GitHub"
            variant="secondary"
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            icon={<GithubIcon size={14} />}
          />
          {project.demo && (
            <Button
              label="Live Demo"
              variant="ghost"
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              icon={<ExternalLinkIcon size={14} />}
            />
          )}
        </div>
      </Reveal>
    </article>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="projects" className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <SectionHead
          index="03"
          label="Featured Projects"
          aside={
            <div className="flex flex-col items-start lg:items-end gap-4">
              <p className="text-sm leading-relaxed max-w-sm lg:text-right" style={{ color: "var(--color-text-secondary)" }}>
                A selection of projects where I applied engineering thinking to solve practical problems.
              </p>
              <Button
                label="View All Projects"
                variant="secondary"
                size="sm"
                href="https://github.com/anandkalirana"
                target="_blank"
                rel="noopener noreferrer"
                icon={<ArrowRight size={14} />}
              />
            </div>
          }
        >
          Selected work.{" "}
          <span className="serif-accent">Real-world thinking.</span>
        </SectionHead>

        <div>
          {projects.map((p, i) => (
            <Unit key={p.name} project={p} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
