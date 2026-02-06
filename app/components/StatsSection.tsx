"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
  { value: 99.9, suffix: "%", label: "Uptime guaranteed", prefix: "" },
  { value: 200, suffix: "+", label: "Vulnerabilities patched", prefix: "" },
  { value: 48, suffix: "h", label: "Average response time", prefix: "<" },
  { value: 30, suffix: "+", label: "Projects delivered", prefix: "" },
];

function AnimatedCounter({
  value,
  suffix,
  prefix,
  isInView,
}: {
  value: number;
  suffix: string;
  prefix: string;
  isInView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const duration = 2000;
    const startTime = performance.now();
    const isDecimal = value % 1 !== 0;

    function tick(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
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

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  return (
    <section className="relative bg-white text-slate-900 overflow-hidden">
      {/* Top decorative line */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      <div
        ref={ref}
        className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 py-20 sm:py-28 md:py-36"
      >
        {/* Section label */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-xs tracking-[0.3em] uppercase text-slate-400 font-[family-name:var(--font-geist-mono)] mb-12 sm:mb-16 block"
        >
          By the numbers
        </motion.span>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              viewport={{ once: true }}
              className="relative group"
            >
              {/* Large number */}
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-tight font-[family-name:var(--font-space-grotesk)] text-slate-900 mb-3">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  prefix={stat.prefix}
                  isInView={isInView}
                />
              </div>

              {/* Accent bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                viewport={{ once: true }}
                className="w-8 h-px bg-slate-900 origin-left mb-3"
              />

              {/* Label */}
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>
    </section>
  );
}
