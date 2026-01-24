"use client";
import { motion } from "framer-motion";
import { useState } from "react";

interface ProblemCard {
  id: string;
  pain: string;
  outcome: string;
  steps: string[];
}

const problems: ProblemCard[] = [
  {
    id: "1",
    pain: "Slow sites that lose leads",
    outcome: "Fast pages that convert and rank.",
    steps: [
      "Audit current performance bottlenecks and user drop-off points",
      "Optimize assets, caching, and code splitting for sub-2s load times",
      "Monitor real user metrics and continuously improve Core Web Vitals"
    ]
  },
  {
    id: "2",
    pain: "Security uncertainty",
    outcome: "Clear risk picture with a practical plan.",
    steps: [
      "Assess your current security posture and identify vulnerabilities",
      "Prioritize findings by real-world impact and exploitability",
      "Deliver actionable fixes with retesting to confirm resolution"
    ]
  },
  {
    id: "3",
    pain: "Messy handoffs",
    outcome: "A smooth process with weekly visibility.",
    steps: [
      "Set clear milestones with defined deliverables and timelines",
      "Provide weekly progress updates via your preferred channel",
      "Document decisions and maintain transparent communication throughout"
    ]
  }
];

export default function ProblemSolutionSection() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const toggleCard = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const isCardExpanded = (id: string) => {
    // On desktop (hover), show hovered card. On mobile (click), show expanded card
    return hoveredCard === id || expandedCard === id;
  };

  return (
    <section className="relative bg-white text-slate-900 py-16 sm:py-20 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-10 sm:mb-12 md:mb-16 lg:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light leading-tight font-[family-name:var(--font-space-grotesk)] text-slate-800 mb-4 sm:mb-5 md:mb-6">
            Problems we solve
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-2">
            Common pains transformed into clear outcomes, with a transparent process you can trust.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 items-start">
          {problems.map((problem, index) => (
            <motion.div
              key={problem.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              onMouseEnter={() => setHoveredCard(problem.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-white border border-slate-200 rounded-xl sm:rounded-2xl overflow-visible hover:shadow-xl transition-shadow duration-300 relative"
            >
              <div className="p-5 sm:p-6 md:p-8">
                <div className="mb-4 sm:mb-5 md:mb-6">
                  <div className="text-slate-400 line-through text-base sm:text-lg mb-2 sm:mb-3">
                    {problem.pain}
                  </div>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl">→</span>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-medium text-slate-800 leading-tight font-[family-name:var(--font-space-grotesk)]">
                      {problem.outcome}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => toggleCard(problem.id)}
                  className="w-full text-left text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-between group lg:pointer-events-none"
                >
                  <span>What you get</span>
                  <motion.span
                    animate={{ rotate: isCardExpanded(problem.id) ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-lg sm:text-xl group-hover:translate-y-0.5 transition-transform"
                  >
                    ↓
                  </motion.span>
                </button>
              </div>

              <motion.div
                initial={false}
                animate={{
                  height: isCardExpanded(problem.id) ? "auto" : 0,
                  opacity: isCardExpanded(problem.id) ? 1 : 0
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="px-5 sm:px-6 md:px-8 pb-5 sm:pb-6 md:pb-8 space-y-3 sm:space-y-4 pt-2 border-t border-slate-200 mx-5 sm:mx-6 md:mx-8">
                  {problem.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex gap-2 sm:gap-3">
                      <span className="flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-800 text-white text-[10px] sm:text-xs flex items-center justify-center font-medium mt-0.5">
                        {stepIndex + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
