import { Heading } from "@astryxdesign/core/Heading";
import { Token } from "@astryxdesign/core/Token";
import { Reveal } from "@/components/console/Reveal";
import { SectionHead } from "@/components/console/SectionHead";
import type { ExperienceItem } from "@/lib/portfolio-data";

/** Experience as an event log: period + node on a rail, entry card on the right. */
export default function Experience({ experiences }: { experiences: ExperienceItem[] }) {
  return (
    <section id="experience" className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <SectionHead
          index="04"
          label="Experience"
          aside={
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-text-secondary)" }}>
              Hands-on experience through internships, research and real-world problem solving. Each experience has shaped how I approach engineering challenges.
            </p>
          }
        >
          Learning. Building. <span className="serif-accent">Growing.</span>
        </SectionHead>

        <ol className="relative">
          <span aria-hidden className="rail-line absolute left-[19px] lg:left-[calc(10rem+19px)] top-2 bottom-2 w-px" />
          {experiences.map((exp, i) => (
            <li key={`${exp.org}-${exp.number}`} className="relative grid lg:grid-cols-[10rem_1fr] gap-x-8 pb-10 last:pb-0">
              <Reveal delay={i * 0.05} x={-10} y={0} className="hidden lg:block pt-3 pr-4 text-right">
                <div className="mono text-xs tracking-wider" style={{ color: "var(--color-text-accent)" }}>
                  {exp.period}
                </div>
              </Reveal>
              <div className="relative pl-14 lg:pl-14">
                <span
                  className="mono absolute left-0 top-1 w-10 h-10 grid place-items-center text-xs font-bold border-2"
                  style={{
                    background: "var(--color-background-body)",
                    borderColor: "var(--color-accent)",
                    color: "var(--color-text-accent)",
                  }}
                >
                  {exp.number}
                </span>
                <Reveal delay={0.08} y={16}>
                  <div className="border p-5 lg:p-6" style={{ background: "var(--color-background-card)", borderColor: "var(--color-border)" }}>
                    <div className="mono text-xs tracking-wider mb-2 lg:hidden" style={{ color: "var(--color-text-accent)" }}>
                      {exp.period}
                    </div>
                    <Heading level={3} className="text-lg font-bold leading-tight tracking-tight">
                      {exp.role}
                    </Heading>
                    <div className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
                      {exp.org}
                    </div>
                    <p className="text-sm leading-relaxed mt-4 mb-5" style={{ color: "var(--color-text-secondary)" }}>
                      {exp.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Token label={exp.category} size="sm" color="orange" />
                      <Token label={exp.type} size="sm" />
                    </div>
                  </div>
                </Reveal>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
