"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function NextPageArrow() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative bg-slate-950 py-16 sm:py-20 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16">
        <Link
          href="/services"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group flex items-center justify-center relative"
        >
          {/* Full-width line that expands */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-slate-800 top-1/2"
            animate={{
              background: isHovered
                ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)"
                : "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Center content */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-4 bg-slate-950 px-8 sm:px-12"
            animate={{ scale: isHovered ? 1.05 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {/* Label — visible on hover */}
            <motion.span
              className="text-xs tracking-[0.3em] uppercase font-[family-name:var(--font-geist-mono)] text-slate-500 overflow-hidden"
              initial={false}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 8,
                height: isHovered ? "auto" : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              Explore our services
            </motion.span>

            {/* Arrow circle */}
            <motion.div
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer overflow-hidden"
              animate={{
                borderColor: isHovered ? "rgba(255,255,255,0.3)" : "rgba(51,65,85,1)",
              }}
              transition={{ duration: 0.3 }}
            >
              {/* Background fill on hover */}
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              />

              {/* Arrow icon */}
              <motion.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10"
                animate={{
                  stroke: isHovered ? "#0f172a" : "#94a3b8",
                  x: isHovered ? 2 : 0,
                }}
                transition={{ duration: 0.3 }}
              >
                <path d="M5 12h14" />
                <path d="m12 5 7 7-7 7" />
              </motion.svg>
            </motion.div>

            {/* "Next" label below */}
            <motion.span
              className="text-sm text-slate-600 font-[family-name:var(--font-space-grotesk)] tracking-wider"
              animate={{
                color: isHovered ? "rgba(255,255,255,0.7)" : "rgba(71,85,105,1)",
              }}
              transition={{ duration: 0.3 }}
            >
              Services
            </motion.span>
          </motion.div>
        </Link>
      </div>
    </section>
  );
}
