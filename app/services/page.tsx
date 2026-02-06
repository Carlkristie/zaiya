"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ─── Service Data ─── */
const services = [
  {
    id: "01",
    title: "Penetration Testing",
    tagline: "Breach before they do.",
    description:
      "We simulate real-world attack scenarios to uncover vulnerabilities before malicious actors do. Our testing goes beyond automated scans — we chain exploits, test privilege escalation, and map your entire attack surface.",
    capabilities: [
      "Web & API penetration testing",
      "Network infrastructure assessment",
      "Social engineering simulations",
      "Privilege escalation testing",
      "Detailed PoC & remediation reports",
      "Re-testing after fixes applied",
    ],
    process: [
      { phase: "Scope", detail: "Define targets, rules of engagement, and success criteria" },
      { phase: "Recon", detail: "Map attack surface, enumerate assets, and identify entry points" },
      { phase: "Exploit", detail: "Chain vulnerabilities, escalate privileges, and demonstrate impact" },
      { phase: "Report", detail: "Deliver prioritized findings with actionable remediation steps" },
    ],
    color: "from-red-500/20 to-orange-500/20",
    accent: "text-red-400",
    borderAccent: "border-red-500/20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Web App Development",
    tagline: "Code that performs.",
    description:
      "We build modern, responsive web applications with clean architecture and security baked in from day one. From concept to deployment — performant solutions that solve real business problems.",
    capabilities: [
      "Next.js & React applications",
      "Full-stack TypeScript development",
      "Headless CMS integration",
      "E-commerce platforms",
      "Progressive web apps (PWAs)",
      "Performance optimization & Core Web Vitals",
    ],
    process: [
      { phase: "Discovery", detail: "Understand your goals, users, and technical requirements" },
      { phase: "Architecture", detail: "Design scalable system architecture and data models" },
      { phase: "Build", detail: "Iterative development with weekly demos and feedback loops" },
      { phase: "Launch", detail: "Deploy with monitoring, zero-downtime, and post-launch support" },
    ],
    color: "from-blue-500/20 to-cyan-500/20",
    accent: "text-blue-400",
    borderAccent: "border-blue-500/20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
        <line x1="14" y1="4" x2="10" y2="20" />
      </svg>
    ),
  },
  {
    id: "03",
    title: "Management Systems",
    tagline: "Your workflow, systematized.",
    description:
      "Custom management systems tailored to your operations. Whether it's content management, inventory tracking, or internal tools — intuitive interfaces backed by robust data models that grow with you.",
    capabilities: [
      "Custom CRM & ERP solutions",
      "Inventory & asset management",
      "Workflow automation tools",
      "Dashboard & analytics platforms",
      "Role-based access control",
      "API integrations with existing tools",
    ],
    process: [
      { phase: "Audit", detail: "Map current workflows, bottlenecks, and integration points" },
      { phase: "Design", detail: "Prototype user flows and validate with stakeholders" },
      { phase: "Develop", detail: "Build incrementally with real data and user testing" },
      { phase: "Migrate", detail: "Seamless data migration, training, and rollout" },
    ],
    color: "from-emerald-500/20 to-teal-500/20",
    accent: "text-emerald-400",
    borderAccent: "border-emerald-500/20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Cloud Auditing",
    tagline: "See what's exposed.",
    description:
      "We review your cloud infrastructure for misconfigurations, overly permissive access, and security gaps. Our audits cover IAM policies, network segmentation, data encryption, and compliance posture.",
    capabilities: [
      "AWS, Azure & GCP security reviews",
      "IAM policy & permissions audit",
      "Network segmentation analysis",
      "Data encryption & key management",
      "Cost optimization recommendations",
      "Infrastructure-as-Code review",
    ],
    process: [
      { phase: "Inventory", detail: "Catalog all cloud resources, accounts, and access patterns" },
      { phase: "Assess", detail: "Evaluate configurations against CIS benchmarks and best practices" },
      { phase: "Prioritize", detail: "Rank findings by risk severity, blast radius, and effort" },
      { phase: "Remediate", detail: "Deliver runbook-style fixes and verify implementation" },
    ],
    color: "from-purple-500/20 to-violet-500/20",
    accent: "text-purple-400",
    borderAccent: "border-purple-500/20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        <path d="m10 15 2-2 2 2" />
        <path d="M12 13v5" />
      </svg>
    ),
  },
  {
    id: "05",
    title: "Compliance & Frameworks",
    tagline: "Audit-ready, always.",
    description:
      "We help you navigate security frameworks like SOC 2, ISO 27001, and GDPR. From gap assessments to evidence collection — we translate complex requirements into practical steps your team can execute.",
    capabilities: [
      "SOC 2 Type I & II readiness",
      "ISO 27001 implementation",
      "GDPR compliance audits",
      "HIPAA security assessments",
      "Policy & procedure development",
      "Evidence collection & automation",
    ],
    process: [
      { phase: "Gap analysis", detail: "Assess current state against target framework requirements" },
      { phase: "Roadmap", detail: "Create prioritized implementation plan with milestones" },
      { phase: "Implement", detail: "Build policies, controls, and evidence collection pipelines" },
      { phase: "Certify", detail: "Support auditor interactions and address findings" },
    ],
    color: "from-amber-500/20 to-yellow-500/20",
    accent: "text-amber-400",
    borderAccent: "border-amber-500/20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
];

/* ─── Expandable Service Card ─── */
function ServiceCard({
  service,
  index,
  isExpanded,
  onToggle,
}: {
  service: (typeof services)[0];
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      {/* Card */}
      <div
        className={`relative border ${
          isExpanded ? "border-slate-700 bg-slate-900/80" : "border-slate-800/60 bg-slate-900/30"
        } rounded-2xl sm:rounded-3xl overflow-hidden transition-colors duration-500 hover:border-slate-700`}
      >
        {/* Gradient glow on hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`}
        />

        {/* Header — always visible */}
        <button
          onClick={onToggle}
          className="relative z-10 w-full text-left p-6 sm:p-8 md:p-10 flex items-start sm:items-center gap-5 sm:gap-6 md:gap-8"
        >
          {/* Index + icon */}
          <div className="flex flex-col items-center gap-3 flex-shrink-0">
            <span className="text-xs font-[family-name:var(--font-geist-mono)] text-slate-600">
              {service.id}
            </span>
            <div className={`${service.accent} opacity-70 group-hover:opacity-100 transition-opacity`}>
              {service.icon}
            </div>
          </div>

          {/* Title + tagline */}
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light font-[family-name:var(--font-space-grotesk)] text-white leading-tight mb-1 sm:mb-2">
              {service.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-[family-name:var(--font-geist-mono)] tracking-wide">
              {service.tagline}
            </p>
          </div>

          {/* Expand indicator */}
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-slate-800 group-hover:border-slate-600 transition-colors">
            <motion.svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-slate-500 group-hover:text-white transition-colors"
              animate={{ rotate: isExpanded ? 45 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </motion.svg>
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="relative z-10 px-6 sm:px-8 md:px-10 pb-8 sm:pb-10 md:pb-12">
                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8 sm:mb-10" />

                {/* Description */}
                <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-3xl mb-10 sm:mb-12">
                  {service.description}
                </p>

                {/* Two columns: Capabilities + Process */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                  {/* Capabilities */}
                  <div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-5 sm:mb-6">
                      Capabilities
                    </h3>
                    <ul className="space-y-3 sm:space-y-4">
                      {service.capabilities.map((cap, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.06, duration: 0.4 }}
                          className="flex items-start gap-3 text-sm sm:text-base text-slate-300"
                        >
                          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${service.accent} bg-current flex-shrink-0`} />
                          {cap}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Process */}
                  <div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-5 sm:mb-6">
                      How it works
                    </h3>
                    <div className="space-y-5 sm:space-y-6">
                      {service.process.map((step, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                          className="flex gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <span className={`w-8 h-8 rounded-full border ${service.borderAccent} flex items-center justify-center text-xs font-medium ${service.accent} font-[family-name:var(--font-geist-mono)]`}>
                              {i + 1}
                            </span>
                            {i < service.process.length - 1 && (
                              <div className="w-px flex-1 bg-slate-800 mt-2" />
                            )}
                          </div>
                          <div className="pb-2">
                            <h4 className="text-sm sm:text-base font-medium text-white mb-1">
                              {step.phase}
                            </h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                              {step.detail}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ─── Floating Particles Background ─── */
function FloatingParticles() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/[0.03]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Main Services Page ─── */
export default function ServicesPage() {
  const [expandedService, setExpandedService] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -80]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.95]);

  const toggleService = (id: string) => {
    setExpandedService(expandedService === id ? null : id);
  };

  return (
    <div className="relative bg-slate-950 text-white min-h-screen">
      <Navbar />
      <FloatingParticles />

      {/* ──── Hero ──── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-blue-600/5 via-purple-600/8 to-cyan-600/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
          className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 text-center"
        >
          {/* Eyebrow */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-6 sm:mb-8"
          >
            Our Services
          </motion.span>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.92] font-[family-name:var(--font-space-grotesk)] mb-6 sm:mb-8"
          >
            What we
            <br />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-600">
              build & break.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14"
          >
            From building high-performance web apps to breaking into them — we
            cover the full spectrum of modern software and security engineering.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.2em] uppercase text-slate-600 font-[family-name:var(--font-geist-mono)]">
              Scroll to explore
            </span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="w-5 h-8 rounded-full border border-slate-700 flex items-start justify-center p-1"
            >
              <motion.div className="w-1 h-2 rounded-full bg-slate-500" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ──── Services List ──── */}
      <section className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pb-24 sm:pb-32">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 mb-12 sm:mb-16"
        >
          <span className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)]">
            Services
          </span>
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-xs text-slate-600 font-[family-name:var(--font-geist-mono)]">
            {services.length.toString().padStart(2, "0")} offerings
          </span>
        </motion.div>

        {/* Cards */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {services.map((service, i) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={i}
              isExpanded={expandedService === service.id}
              onToggle={() => toggleService(service.id)}
            />
          ))}
        </div>
      </section>

      {/* ──── Why Us Band ──── */}
      <section className="relative overflow-hidden bg-white">
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-24 sm:py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
            >
              <span className="text-xs tracking-[0.2em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-6 block">
                Why Zaiya
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[1.05] font-[family-name:var(--font-space-grotesk)] text-slate-900">
                We don&apos;t just build
                <br />
                things that{" "}
                <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-400">
                  work.
                </span>
              </h2>
              <p className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-md">
                We build things that are fast, secure, and engineered to last.
                Every line of code goes through security review. Every
                deployment is zero-downtime.
              </p>
            </motion.div>

            {/* Right — differentiators */}
            <div className="space-y-8 sm:space-y-10">
              {[
                {
                  title: "Security-first engineering",
                  detail:
                    "Every project includes threat modeling, dependency auditing, and a security review. It's not an add-on — it's how we work.",
                },
                {
                  title: "Transparent process",
                  detail:
                    "Weekly updates, shared Kanban boards, and direct access to the engineers doing the work. No account managers in between.",
                },
                {
                  title: "Full lifecycle ownership",
                  detail:
                    "From discovery through post-launch monitoring, we own the outcome. Not just the deliverable.",
                },
                {
                  title: "No vendor lock-in",
                  detail:
                    "We use open standards and document everything. Your codebase, your infrastructure, your data — always yours.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <div className="flex gap-4">
                    <span className="flex-shrink-0 text-xs font-[family-name:var(--font-geist-mono)] text-slate-300 mt-1">
                      {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-2 group-hover:text-slate-700 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──── CTA ──── */}
      <section className="relative py-24 sm:py-32 md:py-40 overflow-hidden">
        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-purple-600/5 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[300px] bg-blue-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-6 block">
              Start a project
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] mb-6 sm:mb-8">
              Let&apos;s talk about
              <br />
              <span className="italic font-normal">what you need.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14">
              Whether it&apos;s a security audit, a new product build, or both —
              we&apos;ll scope it honestly and move fast.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white text-slate-900 px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide overflow-hidden shadow-2xl shadow-white/10"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book a call
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:translate-x-1 transition-transform"
                  >
                    <path d="m5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
              <Link
                href="/"
                className="group px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide border border-slate-700 text-slate-400 hover:border-slate-500 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center gap-3">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:-translate-x-1 transition-transform"
                  >
                    <path d="m19 12H5" />
                    <path d="m12 19-7-7 7-7" />
                  </svg>
                  Back to home
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ──── Footer ──── */}
      <Footer />
    </div>
  );
}
