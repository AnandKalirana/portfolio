"use client";

import { useState } from "react";
import { Button } from "@astryxdesign/core/Button";
import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { TextInput } from "@astryxdesign/core/TextInput";
import { TextArea } from "@astryxdesign/core/TextArea";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon } from "@/components/Icons";
import { Reveal } from "@/components/console/Reveal";
import { SectionHead } from "@/components/console/SectionHead";

type FormState = "idle" | "loading" | "success" | "error";
type Fields = { name: string; email: string; subject: string; message: string };

const contactDetails = [
  { icon: <MailIcon size={15} />, label: "Email", value: "anandkaliranajat05@gmail.com", href: "mailto:anandkaliranajat05@gmail.com" },
  { icon: <PhoneIcon size={15} />, label: "Phone", value: "+91 7977426160", href: "tel:+917977426160" },
  { icon: <MapPinIcon size={15} />, label: "Location", value: "Mumbai, India", href: null },
  { icon: <GithubIcon size={15} />, label: "GitHub", value: "github.com/AnandKalirana", href: "https://github.com/AnandKalirana" },
  { icon: <LinkedinIcon size={15} />, label: "LinkedIn", value: "linkedin.com/in/anand-kalirana", href: "https://www.linkedin.com/in/anand-kalirana-572212310/" },
];

export default function Contact() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState<Fields>({ name: "", email: "", subject: "", message: "" });
  const [botcheck, setBotcheck] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = "Please enter a valid email";
    if (!formData.subject.trim()) e.subject = "Subject is required";
    if (!formData.message.trim()) e.message = "Message is required";
    else if (formData.message.trim().length < 10) e.message = "Message must be at least 10 characters";
    return e;
  };

  const set = (key: keyof Fields) => (value: string) => {
    setFormData((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length > 0) {
      setErrors(v);
      return;
    }
    // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
    if (botcheck) {
      setFormState("success");
      return;
    }
    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      console.error("NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY is not set");
      setFormState("error");
      return;
    }
    setFormState("loading");
    try {
      // Web3Forms free plan only accepts submissions sent from the browser.
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "Portfolio Contact Form",
          subject: `[Portfolio] ${formData.subject.trim()}`,
          name: formData.name.trim(),
          email: formData.email.trim(),
          message: formData.message.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error("send failed");
      setFormState("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  };

  const step = formState === "success" ? 3 : formState === "loading" ? 2 : 1;
  const steps = ["SYN", "SYN-ACK", "ACK"];

  const field = (key: keyof Fields) => ({
    value: formData[key],
    onChange: set(key),
    htmlName: key,
    isRequired: true,
    status: errors[key] ? { type: "error" as const, message: errors[key] } : undefined,
  });
  return (
    <section id="contact" className="relative lg:pl-[76px] border-t hair">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 lg:py-32">
        <SectionHead index="06" label="Get In Touch">
          Have an idea? <span className="serif-accent">Let&apos;s connect.</span>
        </SectionHead>

        <div className="grid lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="text-sm leading-relaxed max-w-md mb-8" style={{ color: "var(--color-text-secondary)" }}>
              I&apos;m always open to discussing interesting projects, internship opportunities, collaborations, and engineering challenges.
            </p>
            <ul className="border-t hair">
              {contactDetails.map((d) => (
                <li key={d.label} className="flex items-center gap-4 py-4 border-b hair">
                  <span style={{ color: "var(--color-accent)" }}>{d.icon}</span>
                  <span className="tag w-20 shrink-0">{d.label}</span>
                  {d.href ? (
                    <a
                      href={d.href}
                      {...(d.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="text-sm break-all hover:underline underline-offset-4"
                    >
                      {d.value}
                    </a>
                  ) : (
                    <span className="text-sm">{d.value}</span>
                  )}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="border p-6 lg:p-8" style={{ background: "var(--color-background-card)", borderColor: "var(--color-border)" }}>
              <ol className="flex items-center gap-2 mb-8" aria-label="Message status">
                {steps.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span
                      className="mono text-[10px] tracking-widest px-2 py-1 border"
                      style={{
                        borderColor: i < step ? "var(--color-accent)" : "var(--color-border)",
                        color: i < step ? "var(--color-text-accent)" : "var(--color-text-secondary)",
                      }}
                    >
                      {s}
                    </span>
                    {i < 2 && <span className="h-px w-5" style={{ background: i < step - 1 ? "var(--color-accent)" : "var(--color-border)" }} />}
                  </li>
                ))}
              </ol>

              {formState === "success" ? (
                <div className="py-10 text-center" role="status">
                  <CheckCircle className="mx-auto mb-4" size={36} style={{ color: "var(--color-accent)" }} />
                  <Heading level={3} className="text-xl font-bold mb-2">Message Sent!</Heading>
                  <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
                    Thanks for reaching out. I&apos;ll get back to you soon.
                  </p>
                  <Button label="Send Another Message" variant="secondary" onClick={() => setFormState("idle")} />
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <TextInput label="Name" {...field("name")} />
                    </div>
                    <div>
                      <TextInput label="Email" {...field("email")} />
                    </div>
                  </div>
                  <div>
                    <TextInput label="Subject" {...field("subject")} />
                  </div>
                  <div>
                    <TextArea label="Message" rows={5} {...field("message")} />
                  </div>
                  <input
                    type="text"
                    name="botcheck"
                    value={botcheck}
                    onChange={(e) => setBotcheck(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden
                    className="hidden"
                  />
                  {formState === "error" && (
                    <p role="alert" className="flex items-start gap-2 text-sm" style={{ color: "var(--color-text-accent)" }}>
                      <AlertCircle size={16} className="mt-0.5 shrink-0" />
                      Something went wrong. Please try again or email me directly at anandkaliranajat05@gmail.com.
                    </p>
                  )}
                  <Button
                    type="submit"
                    label={formState === "loading" ? "Sending…" : "Send Message"}
                    variant="primary"
                    size="lg"
                    isDisabled={formState === "loading"}
                    icon={<ArrowRight size={16} />}
                  />
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
