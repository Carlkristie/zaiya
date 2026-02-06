"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    quote: "Zaiya didn't just build our platform — they made it bulletproof. The pentest findings alone saved us from a potential breach.",
    author: "Sarah Chen",
    role: "CTO, Meridian Health",
    metric: "0 critical vulnerabilities post-launch",
  },
  {
    quote: "The speed and quality of delivery was unlike anything we've experienced. They shipped in 6 weeks what our previous team couldn't do in 6 months.",
    author: "Marcus Webb",
    role: "Founder, Stackline",
    metric: "6x faster delivery",
  },
  {
    quote: "Their cloud audit uncovered 47 misconfigurations we had no idea about. The remediation roadmap was crystal clear and prioritized.",
    author: "Priya Patel",
    role: "VP Engineering, Cloudburst",
    metric: "47 issues resolved in 2 weeks",
  },
  {
    quote: "Working with Zaiya felt like having a senior engineering team embedded in our company. Transparent, fast, and relentlessly thorough.",
    author: "David Okonkwo",
    role: "CEO, Forge Digital",
    metric: "99.9% uptime since launch",
  },
];

const marqueeRow1 = [
  "Penetration Testing",
  "Cloud Security",
  "SOC 2 Compliance",
  "Web Applications",
  "Infrastructure Auditing",
  "Secure Architecture",
  "Incident Response",
  "DevSecOps",
];

function MarqueeBand() {
  return (
    <div className="relative overflow-hidden py-4 border-t border-b border-slate-800/50 bg-black">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...marqueeRow1, ...marqueeRow1].map((item, i) => (
          <span
            key={i}
            className="mx-8 text-sm tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] flex items-center gap-6"
          >
            {item}
            <span className="w-1.5 h-1.5 rounded-full bg-slate-700 inline-block" />
          </span>
        ))}
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section
      ref={containerRef}
      className="relative bg-black text-white py-20 sm:py-28 md:py-36 overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-16 sm:mb-20 md:mb-28">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <span className="text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-4 block">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)]">
              Trusted by teams
              <br />
              <span className="text-slate-500">that ship.</span>
            </h2>
          </div>
          <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed">
            We don&apos;t chase vanity metrics. Our clients measure us by uptime,
            security posture, and speed to market.
          </p>
        </motion.div>
      </div>

      {/* Testimonial cards */}
      <motion.div style={{ y }} className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="group relative bg-slate-950 border border-slate-800/60 rounded-2xl p-6 sm:p-8 md:p-10 hover:border-slate-700 transition-colors duration-500"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden rounded-tr-2xl">
                <div className="absolute top-0 right-0 w-[1px] h-12 bg-gradient-to-b from-slate-600 to-transparent" />
                <div className="absolute top-0 right-0 h-[1px] w-12 bg-gradient-to-l from-slate-600 to-transparent" />
              </div>

              {/* Quote */}
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-300 mb-8 font-light">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author + metric */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-white">{t.author}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{t.role}</div>
                </div>
                <div className="px-3 py-1.5 rounded-full border border-slate-700 text-[11px] tracking-wider uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] whitespace-nowrap">
                  {t.metric}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Marquee band */}
      <div className="mt-20 sm:mt-28 md:mt-36">
        <MarqueeBand />
      </div>
    </section>
  );
}
