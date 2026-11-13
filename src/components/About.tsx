import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { Token } from "@astryxdesign/core/Token";
import { MetadataList, MetadataListItem } from "@astryxdesign/core/MetadataList";
import { Reveal } from "@/components/console/Reveal";
import { SectionHead } from "@/components/console/SectionHead";

const highlights = [
  { label: "Degree", value: "B.Tech in Internet of Things" },
  { label: "Institution", value: "Thakur College of Engg." },
  { label: "Location", value: "Mumbai, India" },
  { label: "Certification", value: "IIT Bombay (Python, 2025)" },
  { label: "Focus", value: "Hardware, Web & Security" },
  { label: "Status", value: "Open to Internships" },
];

const areas = [
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
];

const exploring = ["Embedded Security", "Edge AI", "WebSockets", "DevSecOps"];

export default function About() {
  return (
    <section id="about" className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <SectionHead index="02" label="About Me">
          Engineering ideas into
          <br />
          <span className="serif-accent">real-world solutions.</span>
        </SectionHead>

        <div className="grid lg:grid-cols-[1fr_360px] gap-14 lg:gap-20 items-start">
          {/* focus areas as a register of modules */}
          <ol className="max-w-2xl">
            {areas.map((item, i) => (
              <li key={item.area}>
                <Reveal delay={i * 0.07}>
                  <div className="group grid grid-cols-[3.25rem_1fr] gap-4 py-7 border-t hair last:border-b">
                    <span className="mono text-xs pt-1 transition-colors group-hover:!text-[var(--color-text-accent)]" style={{ color: "var(--color-text-secondary)" }}>
                      M{String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <Heading level={3} className="text-base font-semibold mb-2 tracking-tight">
                        {item.area}
                      </Heading>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                        {item.desc}
                      </p>
                      <span
                        aria-hidden
                        className="block h-px w-0 mt-5 transition-all duration-500 group-hover:w-24"
                        style={{ background: "var(--color-accent)" }}
                      />
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>

          {/* profile as a config sheet */}
          <Reveal delay={0.15} className="lg:sticky lg:top-24">
            <Card padding={5} variant="default">
              <div className="flex items-center justify-between mb-5">
                <span className="tag !text-[var(--color-text-accent)]">profile.cfg</span>
                <span className="tag">6 fields</span>
              </div>
              <MetadataList label={{ width: 112 }}>
                {highlights.map((h) => (
                  <MetadataListItem key={h.label} label={h.label}>
                    {h.value}
                  </MetadataListItem>
                ))}
              </MetadataList>

              <div className="mt-6 pt-5 border-t hair">
                <div className="tag mb-3">Currently Exploring</div>
                <div className="flex flex-wrap gap-2">
                  {exploring.map((tag) => (
                    <Token key={tag} label={tag} size="sm" />
                  ))}
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
