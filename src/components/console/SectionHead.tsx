import { Heading } from "@astryxdesign/core/Heading";
import { Reveal } from "./Reveal";

/** `[02] ── PROFILE` label + big heading, with an optional aside (right on desktop). */
export function SectionHead({
  index,
  label,
  children,
  aside,
}: {
  index: string;
  label: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <header className="mb-12 lg:mb-16 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
      <div>
        <Reveal x={-10} y={0}>
          <div className="flex items-center gap-3 mb-5">
            <span className="tag !text-accent">[{index}]</span>
            <span className="h-px w-10" style={{ background: "var(--color-border-emphasized)" }} />
            <span className="tag">{label}</span>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <Heading
            level={2}
            className="text-[2rem] sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]"
          >
            {children}
          </Heading>
        </Reveal>
      </div>
      {aside && <Reveal delay={0.16}>{aside}</Reveal>}
    </header>
  );
}
