import { Heading } from "@astryxdesign/core/Heading";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { Reveal } from "@/components/console/Reveal";
import { SectionHead } from "@/components/console/SectionHead";
import type { SkillGroup } from "@/lib/portfolio-data";

/** Each skill group is a "port scan" card: header + one row per skill. */
export default function Skills({ skillGroups }: { skillGroups: SkillGroup[] }) {
  return (
    <section id="skills" className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <SectionHead index="05" label="Technical Skills">
          The toolkit I use to <span className="serif-accent">build &amp; secure.</span>
        </SectionHead>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skillGroups.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.07} y={20}>
              <div className="h-full border" style={{ background: "var(--color-background-card)", borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-3 p-5 border-b hair">
                  <span className="w-10 h-10 grid place-items-center border hair shrink-0" style={{ color: "var(--color-accent)" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden>
                      <path d={group.iconPath} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <div className="tag !text-[var(--color-text-accent)]">scan {group.number}</div>
                    <Heading level={3} className="text-sm font-bold leading-tight">
                      {group.title}
                    </Heading>
                  </div>
                  <span className="mono text-[10px] ml-auto" style={{ color: "var(--color-text-secondary)" }}>
                    {group.skills.length} open
                  </span>
                </div>
                <ul className="p-5 space-y-3">
                  {group.skills.map((skill) => (
                    <li key={skill} className="flex items-center gap-3 text-sm">
                      <StatusDot variant="success" label="active" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
