"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.5], [48, 0]);

  return (
    <section ref={containerRef} className="relative bg-white">
      <motion.div
        style={{ scale, borderRadius }}
        className="relative bg-slate-950 text-white py-24 sm:py-32 md:py-40 overflow-hidden origin-center"
      >
        {/* Ambient gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        </div>

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }} />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Eyebrow */}
            <span className="inline-block text-xs tracking-[0.3em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-6 sm:mb-8">
              Let&apos;s build something
            </span>

            {/* Main headline */}
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[0.95] font-[family-name:var(--font-space-grotesk)] mb-6 sm:mb-8">
              Ready to ship
              <br />
              <span className="italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500">
                with confidence?
              </span>
            </h2>

            {/* Subtext */}
            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 sm:mb-14">
              Book a free 30-minute strategy call. No pitch decks, no fluff —
              just a conversation about your goals and how we can help you get
              there faster, and more securely.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group relative bg-white text-slate-900 px-8 sm:px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide overflow-hidden shadow-2xl shadow-white/10"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Book a call
                  <motion.svg
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
                  </motion.svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>

              <motion.a
                href="mailto:info@zaiya.com"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="group px-8 sm:px-10 py-4 rounded-full font-medium text-sm sm:text-base tracking-wide border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-colors duration-300"
              >
                <span className="flex items-center gap-3">
                  info@zaiya.com
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
                </span>
              </motion.a>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
