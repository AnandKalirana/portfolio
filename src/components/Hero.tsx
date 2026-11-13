"use client";

import { useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { StatusDot } from "@astryxdesign/core/StatusDot";
import { GithubIcon, DownloadIcon } from "@/components/Icons";

const MAX_TILT = 5; // degrees

/**
 * Leans its children toward the mouse pointer (max ~5deg) and springs back on leave.
 * Mouse only: touch and reduced-motion users get a static frame.
 */
function PortraitTilt({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 170, damping: 20, mass: 0.6 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  const rotateY = useTransform(sx, (v) => v * MAX_TILT);
  const rotateX = useTransform(sy, (v) => -v * MAX_TILT);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set(((e.clientX - r.left) / r.width - 0.5) * 2);
    py.set(((e.clientY - r.top) / r.height - 0.5) * 2);
  };
  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div className="w-full" style={{ perspective: 1200 }} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div style={{ rotateX, rotateY }}>{children}</motion.div>
    </div>
  );
}

const rise = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export default function Hero({
  portraitSrc = "/portrait.jpg",
  resumeHref = "/api/resume",
}: {
  portraitSrc?: string;
  resumeHref?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imgSrc = failedSrc === portraitSrc ? null : portraitSrc;

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden lg:pl-[76px]">
      <div className="absolute inset-0 blueprint blueprint-fade opacity-60" aria-hidden />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-16 lg:pt-16">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-14 lg:gap-16 items-center">
          {/* ---------- left: boot sequence + headline ---------- */}
          <div className="flex flex-col justify-center">
            <motion.div
              custom={0}
              variants={rise}
              initial="hidden"
              animate="show"
              className="mono text-[11px] sm:text-xs leading-relaxed mb-8 border-l pl-4"
              style={{ borderColor: "var(--color-accent)" }}
            >
              <div style={{ color: "var(--color-text-secondary)" }}>
                <span style={{ color: "var(--color-text-accent)" }}>$</span> boot anand-kalirana
                <span className="ml-3" style={{ color: "var(--color-success, #4ade80)" }}>
                  ok
                </span>
              </div>
              <div className="uppercase tracking-[0.14em] caret" style={{ color: "var(--color-text-primary)" }}>
                <span style={{ color: "var(--color-text-accent)" }}>$</span> IoT Engineer &amp; Cybersecurity Enthusiast
              </div>
            </motion.div>

            <motion.div custom={1} variants={rise} initial="hidden" animate="show">
              <Heading
                level={1}
                className="text-[2.15rem] sm:text-6xl lg:text-[4.25rem] font-bold leading-[1.06] tracking-[-0.03em] mb-8"
              >
                Building secure
                <br />
                connected systems
                <br />
                that make an <span className="serif-accent">impact.</span>
              </Heading>
            </motion.div>

            <motion.p
              custom={2}
              variants={rise}
              initial="hidden"
              animate="show"
              className="text-base lg:text-lg leading-relaxed max-w-lg mb-10"
              style={{ color: "var(--color-text-secondary)" }}
            >
              I build connected systems and full-stack applications, exploring the intersection of intelligent
              hardware, software engineering and cybersecurity.
            </motion.p>

            <motion.div custom={3} variants={rise} initial="hidden" animate="show" className="flex flex-wrap gap-3">
              <Button
                label="View GitHub Profile"
                variant="primary"
                size="lg"
                href="https://github.com/AnandKalirana"
                target="_blank"
                rel="noopener noreferrer"
                icon={<GithubIcon size={16} />}
              />
              <Button label="Download Resume" variant="secondary" size="lg" href={resumeHref} icon={<DownloadIcon size={16} />} />
            </motion.div>

            <motion.div
              custom={5}
              variants={rise}
              initial="hidden"
              animate="show"
              className="hidden lg:flex items-center gap-3 mt-16 tag"
            >
              <motion.span
                aria-hidden
                animate={{ y: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                ↓
              </motion.span>
              Scroll to explore
            </motion.div>
          </div>

          {/* ---------- right: portrait in a scope frame ---------- */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm mx-auto lg:max-w-none"
          >
            <PortraitTilt>
              <div className="relative w-full">
                <div
                  className="brackets scanline relative w-full aspect-[4/5] lg:aspect-[3/4] overflow-hidden border"
                  style={{ background: "var(--color-background-card)", borderColor: "var(--color-border-emphasized)" }}
                >
                  {imgSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={imgSrc}
                      alt="Anand Kalirana"
                      className="w-full h-full object-cover object-[42%_100%] origin-[42%_100%] scale-[1.12] grayscale contrast-125 brightness-95"
                      onError={() => setFailedSrc(portraitSrc)}
                    />
                  ) : (
                    <div className="absolute inset-0 grid place-items-center">
                      <div className="text-[9rem] font-black leading-none select-none opacity-10 tracking-tighter">AK</div>
                    </div>
                  )}
                  {/* crosshair */}
                  <span aria-hidden className="absolute left-1/2 top-0 bottom-0 w-px opacity-20" style={{ background: "var(--color-accent)" }} />
                  <span aria-hidden className="absolute top-1/2 left-0 right-0 h-px opacity-20" style={{ background: "var(--color-accent)" }} />
                </div>

                <div className="flex items-center justify-between mt-3 tag">
                  <span>Fig. 01 — Portrait</span>
                  <span className="hidden sm:inline">Mumbai · 19.07°N 72.87°E</span>
                </div>

                {/* vertical badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute right-2 lg:-right-6 top-[28%] px-3 py-5"
                  style={{
                    background: "var(--color-accent)",
                    color: "var(--color-on-accent)",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  <span className="text-xs font-bold tracking-widest">DESIGN / BUILD / SECURE</span>
                </motion.div>

                {/* status card */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="absolute left-3 bottom-14 lg:bottom-auto lg:-left-6 lg:top-[62%] border px-3 py-2"
                  style={{ background: "var(--color-background-card)", borderColor: "var(--color-border-emphasized)" }}
                >
                  <div className="tag mb-1">Status</div>
                  <div className="flex items-center gap-2">
                    <StatusDot variant="success" label="Online" isPulsing />
                    <span className="text-xs font-medium">Open to Opportunities</span>
                  </div>
                </motion.div>
              </div>
            </PortraitTilt>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
