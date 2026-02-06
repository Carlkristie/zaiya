"use client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";

/* ─── Team Data ─── */
const team = [
  {
    name: "Alex Reyes",
    role: "Founder & Lead Engineer",
    bio: "Full-stack architect with 12+ years in security-first development. Previously led engineering at two Y Combinator startups.",
    specialties: ["System Architecture", "Security Engineering", "Technical Strategy"],
  },
  {
    name: "Jordan Nakamura",
    role: "Head of Security",
    bio: "OSCP-certified pentester and former red team operator. Has uncovered critical vulnerabilities in Fortune 500 infrastructure.",
    specialties: ["Penetration Testing", "Red Teaming", "Threat Modeling"],
  },
  {
    name: "Lena Voronova",
    role: "Lead Developer",
    bio: "React & Next.js specialist focused on performance and accessibility. Ships pixel-perfect interfaces at production scale.",
    specialties: ["Frontend Architecture", "Performance", "Accessibility"],
  },
  {
    name: "Marcus Chen",
    role: "Cloud & DevOps Lead",
    bio: "AWS Solutions Architect and Kubernetes specialist. Designs infrastructure that scales from zero to millions of requests.",
    specialties: ["AWS / GCP / Azure", "Infrastructure as Code", "CI/CD"],
  },
];

/* ─── Values Data ─── */
const values = [
  {
    title: "Security-First",
    description:
      "Every line of code, every architecture decision, every deployment — security isn't an afterthought, it's the foundation everything is built on.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Radical Transparency",
    description:
      "No black boxes, no hand-waving. We document everything, explain our reasoning, and give you full visibility into every phase of the process.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  {
    title: "Relentless Quality",
    description:
      "We don't ship 'good enough.' Every project undergoes rigorous testing, code review, and security auditing before it reaches production.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    title: "Speed Without Sacrifice",
    description:
      "Fast iteration doesn't mean cutting corners. Our workflows, tooling, and experience let us deliver at startup speed with enterprise-grade reliability.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
];

/* ─── Timeline Data ─── */
const timeline = [
  {
    year: "2019",
    title: "The beginning",
    description: "Started as a two-person freelance operation, taking on security audits and small web projects for local startups.",
  },
  {
    year: "2021",
    title: "First major client",
    description: "Landed our first enterprise engagement — a full-stack rebuild with integrated penetration testing for a Series B fintech.",
  },
  {
    year: "2023",
    title: "Team expansion",
    description: "Grew to a core team of specialists across security, development, and cloud infrastructure. Opened our first dedicated office.",
  },
  {
    year: "2025",
    title: "Where we are now",
    description: "30+ projects delivered, trusted by teams across healthcare, fintech, and SaaS. Building the studio we always wanted to hire.",
  },
];

/* ─── Animated Counter ─── */
function AnimatedCounter({
  value,
  suffix,
  prefix = "",
  isInView,
}: {
  value: number;
  suffix: string;
  prefix?: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = value % 1 !== 0;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span className="tabular-nums">
      {prefix}
      {count % 1 !== 0 ? count.toFixed(1) : count}
      {suffix}
    </span>
  );
}

/* ─── Team Card Component ─── */
function TeamCard({ member, index }: { member: (typeof team)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-slate-50 border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:border-slate-300/80 transition-all duration-500 overflow-hidden cursor-default"
      style={{
        boxShadow: isHovered
          ? "0 20px 60px -15px rgba(100, 116, 139, 0.18), 0 8px 24px -8px rgba(100, 116, 139, 0.1)"
          : "0 0 0 0 transparent",
        transform: isHovered ? "translateY(-6px)" : "translateY(0px)",
        transition: "box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.5s",
      }}
    >
      {/* Mouse-following radial glow */}
      <div
        className="absolute pointer-events-none rounded-2xl sm:rounded-3xl inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(320px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), rgba(59, 130, 246, 0.03) 50%, transparent 100%)`,
        }}
      />

      {/* Top edge shine on hover */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-300/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Corner accent — animated */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden rounded-tr-2xl sm:rounded-tr-3xl">
        <div className="absolute top-0 right-0 w-[1px] h-10 bg-gradient-to-b from-slate-300 to-transparent group-hover:from-purple-400/60 transition-colors duration-500" />
        <div className="absolute top-0 right-0 h-[1px] w-10 bg-gradient-to-l from-slate-300 to-transparent group-hover:from-purple-400/60 transition-colors duration-500" />
      </div>

      {/* Index number */}
      <span className="text-xs tracking-[0.2em] uppercase text-slate-300 group-hover:text-purple-400/70 font-[family-name:var(--font-geist-mono)] mb-6 block transition-colors duration-500">
        {String(index + 1).padStart(2, "0")}
      </span>

      {/* Avatar placeholder */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full mb-5">
        {/* Outer ring — expands on hover */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-400/0 via-blue-400/0 to-cyan-400/0 group-hover:from-purple-400/40 group-hover:via-blue-400/30 group-hover:to-cyan-400/40 transition-all duration-700 opacity-0 group-hover:opacity-100 blur-[1px]" />
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-200 to-slate-300 group-hover:from-slate-100 group-hover:to-slate-200 border border-slate-200 group-hover:border-purple-300/40 flex items-center justify-center transition-all duration-500">
          <span className="text-lg sm:text-xl font-light text-slate-500 group-hover:text-slate-700 font-[family-name:var(--font-space-grotesk)] transition-colors duration-500">
            {member.name.split(" ").map((n) => n[0]).join("")}
          </span>
        </div>
      </div>

      {/* Name & role */}
      <h3 className="text-lg sm:text-xl font-medium text-slate-900 mb-1 font-[family-name:var(--font-space-grotesk)] group-hover:text-slate-950 transition-colors duration-300">
        {member.name}
      </h3>
      <p className="text-sm text-slate-400 mb-4 group-hover:text-purple-500/80 transition-colors duration-500">
        {member.role}
      </p>

      {/* Bio */}
      <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600 transition-colors duration-500">
        {member.bio}
      </p>

      {/* Specialties */}
      <div className="flex flex-wrap gap-2">
        {member.specialties.map((s, i) => (
          <span
            key={s}
            className="px-2.5 py-1 rounded-full border border-slate-200 text-[10px] sm:text-[11px] tracking-wider uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] group-hover:border-purple-200/60 group-hover:text-purple-500/70 group-hover:bg-purple-50/50 transition-all duration-500"
            style={{ transitionDelay: `${i * 50}ms` }}
          >
            {s}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main About Page ─── */
export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, amount: 0.4 });

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <div className="relative bg-slate-950 text-white">
      <Navbar />

      {/* ═══════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Ambient orbs — reduced blur for iOS perf */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative max-w-5xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 text-center pt-32 sm:pt-40 pb-20"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-block text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-6 sm:mb-8"
          >
            About Zaiya
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] mb-6 sm:mb-8"
          >
            We build things
            <br />
            <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
              that don&apos;t break.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Zaiya is a precision engineering studio specializing in secure web
            development and offensive security. We exist to build software that
            performs under pressure — and protect what matters most.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-16 sm:mt-24 flex flex-col items-center gap-2"
          >
            <span className="text-[10px] tracking-[0.3em] uppercase text-slate-600 font-[family-name:var(--font-geist-mono)]">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MISSION STATEMENT
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 bg-white">
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.25) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-4 block">
                Our mission
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </motion.div>

            {/* Right content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-[1.15] font-[family-name:var(--font-space-grotesk)] text-slate-900 mb-8">
                Most agencies choose between{" "}
                <span className="text-slate-400">speed and security.</span>{" "}
                We refused to make that compromise.
              </h2>
              <div className="space-y-5 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl">
                <p>
                  Zaiya was founded on a simple belief: the best software is built
                  by people who understand how it breaks. Our team includes
                  offensive security specialists who think like attackers and
                  full-stack engineers who ship production-grade code under
                  pressure.
                </p>
                <p>
                  We don&apos;t outsource, we don&apos;t hand off, and we
                  don&apos;t disappear after launch. Every project gets our full
                  attention — from architecture through deployment and beyond.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MINI STATS BAR
      ═══════════════════════════════════════════════════ */}
      <section className="relative bg-white border-t border-b border-slate-200">
        <div
          ref={statsRef}
          className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: 6, suffix: "+", label: "Years in business" },
              { value: 30, suffix: "+", label: "Projects delivered" },
              { value: 200, suffix: "+", label: "Vulnerabilities found" },
              { value: 99.9, suffix: "%", label: "Client satisfaction" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight font-[family-name:var(--font-space-grotesk)] text-slate-900 mb-2">
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={statsInView}
                  />
                </div>
                <p className="text-xs sm:text-sm text-slate-400">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          VALUES
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 bg-slate-950">
        {/* Ambient orb — reduced blur for iOS perf */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16 sm:mb-20 md:mb-28"
          >
            <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-4 block">
              What drives us
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] text-white">
              Our values
            </h2>
          </motion.div>

          {/* Values grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
                className="group relative bg-slate-900/30 border border-slate-800/60 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 hover:border-slate-700 transition-all duration-500"
              >
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-2xl sm:rounded-3xl pointer-events-none" />

                <div className="relative">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-slate-800/60 border border-slate-700/40 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:border-slate-600 transition-all duration-500 mb-6">
                    {value.icon}
                  </div>

                  <h3 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                    {value.title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TIMELINE
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden bg-slate-950">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 sm:mb-20 md:mb-28"
          >
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-4 block">
                Our journey
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] text-white">
                How we got here
              </h2>
            </div>
            <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed">
              From a two-person side project to a full-service studio.
              Here&apos;s the short version.
            </p>
          </motion.div>

          {/* Timeline items */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-800 via-slate-700 to-slate-800 hidden sm:block" />

            <div className="space-y-12 sm:space-y-16 md:space-y-0">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: i * 0.1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  className={`relative md:grid md:grid-cols-2 md:gap-16 md:mb-20 ${
                    i % 2 === 0 ? "" : "md:direction-rtl"
                  }`}
                >
                  {/* Content — alternates sides on desktop */}
                  <div
                    className={`pl-10 sm:pl-16 md:pl-0 ${
                      i % 2 === 0
                        ? "md:text-right md:pr-16"
                        : "md:col-start-2 md:pl-16"
                    }`}
                  >
                    {/* Year */}
                    <span className="text-3xl sm:text-4xl md:text-5xl font-light font-[family-name:var(--font-space-grotesk)] text-slate-700 mb-2 block">
                      {item.year}
                    </span>
                    <h3 className="text-lg sm:text-xl font-medium text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                      {item.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>

                  {/* Timeline dot */}
                  <div className="absolute left-2.5 sm:left-4.5 md:left-1/2 md:-translate-x-1/2 top-1 sm:top-2">
                    <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-slate-800 border-2 border-slate-600 group-hover:border-white transition-colors" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TEAM
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 bg-white">
        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16 sm:mb-20 md:mb-28"
          >
            <div>
              <span className="text-xs tracking-[0.3em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-4 block">
                The team
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] text-slate-900">
                Small team,
                <br />
                <span className="text-slate-400">big output.</span>
              </h2>
            </div>
            <p className="text-slate-500 text-base md:text-lg max-w-md leading-relaxed">
              Every person on our team ships code, talks to clients, and takes
              ownership. No middlemen, no handoffs.
            </p>
          </motion.div>

          {/* Team grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {team.map((member, i) => (
              <TeamCard key={member.name} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          APPROACH / PHILOSOPHY STRIP
      ═══════════════════════════════════════════════════ */}
      <section className="relative bg-white">
        {/* Subtle geometric pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-28 md:py-36">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <span className="text-xs tracking-[0.3em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-4 block">
                Our approach
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="lg:col-span-8"
            >
              <div className="space-y-8">
                {[
                  {
                    q: "How do you work with clients?",
                    a: "Direct communication, weekly standups, and full visibility into progress. You'll work with the same engineers from kickoff to launch — never an account manager reading from a script.",
                  },
                  {
                    q: "What sets Zaiya apart from other agencies?",
                    a: "We're engineers who specialize in security. Most agencies bolt on security at the end. We architect it in from the start. Our team includes certified pentesters who review every project before it ships.",
                  },
                  {
                    q: "Do you work with early-stage startups?",
                    a: "Absolutely. Some of our best work has been with pre-seed and seed-stage companies. We help you ship fast without accumulating security or technical debt that slows you down later.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="border-b border-slate-200 pb-8">
                    <h3 className="text-base sm:text-lg font-medium text-slate-900 mb-3 font-[family-name:var(--font-space-grotesk)]">
                      {faq.q}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA
      ═══════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-28 md:py-36 overflow-hidden">
        {/* Ambient orbs — reduced blur for iOS perf */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/8 rounded-full blur-3xl" />
        </div>

        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-6 sm:mb-8">
              Work with us
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] mb-6 sm:mb-8">
              Interested in
              <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
                working together?
              </span>
            </h2>

            <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10 sm:mb-14">
              Whether you need a security audit, a new platform, or a team that
              can handle both — let&apos;s talk.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white text-slate-900 px-8 sm:px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide overflow-hidden shadow-2xl shadow-white/10"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Get in touch
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
                href="/services"
                className="group px-8 sm:px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors duration-300 flex items-center gap-3"
              >
                View our services
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-50 group-hover:opacity-100 transition-opacity"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
