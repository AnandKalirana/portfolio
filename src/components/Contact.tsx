"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import { GithubIcon, LinkedinIcon, MailIcon, PhoneIcon, MapPinIcon } from "@/components/Icons";

type FormState = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [formState, setFormState] = useState<FormState>("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [botcheck, setBotcheck] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    else if (formData.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    return newErrors;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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
      // The access key is designed to be public and only routes mail to my inbox.
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          from_name: "Portfolio Contact Form",
          subject: `[Portfolio] ${formData.subject.trim()}`,
          name: formData.name.trim(),
          email: formData.email.trim(), // visitor's address, so replying goes straight to them
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

  const contactDetails = [
    {
      icon: <MailIcon size={15} />,
      label: "Email",
      value: "anandkaliranajat05@gmail.com",
      href: "mailto:anandkaliranajat05@gmail.com",
    },
    {
      icon: <PhoneIcon size={15} />,
      label: "Phone",
      value: "+91 7977426160",
      href: "tel:+917977426160",
    },
    {
      icon: <MapPinIcon size={15} />,
      label: "Location",
      value: "Mumbai, India",
      href: null,
    },
    {
      icon: <GithubIcon size={15} />,
      label: "GitHub",
      value: "github.com/AnandKalirana",
      href: "https://github.com/AnandKalirana",
    },
    {
      icon: <LinkedinIcon size={15} />,
      label: "LinkedIn",
      value: "linkedin.com/in/anand-kalirana",
      href: "https://www.linkedin.com/in/anand-kalirana-572212310/",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-28 lg:py-36"
      style={{ backgroundColor: "var(--bg-secondary)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ backgroundColor: "var(--border)" }}
      />

      {/* Subtle world map background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        {/* Section header */}
        <div ref={ref} className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="section-number">06</span>
            <div className="w-8 h-px" style={{ backgroundColor: "var(--border)" }} />
            <span className="editorial-label">Get In Touch</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl lg:text-6xl font-bold tracking-tight leading-tight mb-5"
            style={{ color: "var(--text-primary)" }}
          >
            Have an idea?{" "}
            <span className="font-serif-italic font-normal" style={{ color: "var(--accent)" }}>
              Let&apos;s connect.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm leading-relaxed max-w-lg"
            style={{ color: "var(--text-secondary)" }}
          >
            I&apos;m always open to discussing interesting projects, internship
            opportunities, collaborations, and engineering challenges.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-12 items-start">
          {/* Left — contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-2"
          >
            {contactDetails.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-3 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                <div style={{ color: "var(--accent)" }}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="editorial-label text-[10px] mb-0.5">{item.label}</div>
                  {item.href ? (
                    <a
                      href={item.href}
                      target={item.href.startsWith("http") ? "_blank" : undefined}
                      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="text-sm font-medium truncate block hover:underline transition-colors"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                      {item.value}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {formState === "success" ? (
              <div
                className="border p-8 flex flex-col items-center text-center gap-4"
                style={{ borderColor: "var(--border)", backgroundColor: "var(--elevated)" }}
              >
                <CheckCircle size={36} style={{ color: "var(--accent)" }} strokeWidth={1.5} />
                <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                  Message Sent!
                </h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Thanks for reaching out. Your message is in my inbox and I&apos;ll get back to you as soon as possible.
                </p>
                <button
                  onClick={() => setFormState("idle")}
                  className="text-sm font-semibold flex items-center gap-2 group"
                  style={{ color: "var(--accent)" }}
                >
                  Send Another Message
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <input
                  type="text"
                  name="botcheck"
                  value={botcheck}
                  onChange={(e) => setBotcheck(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  className="hidden"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    label="Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Your name"
                  />
                  <FormField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    placeholder="your@email.com"
                  />
                </div>
                <FormField
                  label="Subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  error={errors.subject}
                  placeholder="What's this about?"
                />
                <FormField
                  label="Message"
                  name="message"
                  type="textarea"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  placeholder="Tell me about your project or opportunity..."
                  rows={5}
                />

                {formState === "error" && (
                  <div
                    className="flex items-center gap-2 text-sm p-3 border"
                    style={{ borderColor: "#ef4444", color: "#ef4444", backgroundColor: "rgba(239,68,68,0.06)" }}
                  >
                    <AlertCircle size={14} />
                    Something went wrong. Please try again or email me directly at anandkaliranajat05@gmail.com.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formState === "loading"}
                  className="btn-apple btn-apple-primary px-6 py-3 text-sm group disabled:opacity-60"
                >
                  {formState === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-200 group-hover:translate-x-1"
                      />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  name,
  type,
  value,
  onChange,
  error,
  placeholder,
  rows,
}: {
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  placeholder?: string;
  rows?: number;
}) {
  const inputClasses = `w-full px-4 py-3 text-sm border outline-none transition-all duration-200 resize-none`;
  const inputStyle = {
    backgroundColor: "var(--bg-primary)",
    borderColor: error ? "#ef4444" : "var(--border)",
    color: "var(--text-primary)",
  };

  return (
    <div>
      <label
        htmlFor={name}
        className="editorial-label block mb-1.5"
      >
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          rows={rows || 4}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          style={inputStyle}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={inputClasses}
          style={inputStyle}
        />
      )}
      {error && (
        <p className="text-xs mt-1 flex items-center gap-1" style={{ color: "#ef4444" }}>
          <AlertCircle size={11} />
          {error}
        </p>
      )}
    </div>
  );
}
