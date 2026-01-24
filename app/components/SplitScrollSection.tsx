"use client";
import { motion } from "framer-motion";
import { useRef } from "react";
import { AnimatedGridPattern } from "./AnimatedGridPattern";

const services = [
  {
    id: "01",
    title: "Pentesting",
    description: "We simulate real-world attack scenarios to uncover vulnerabilities before malicious actors do. Our penetration testing goes beyond automated scans—we chain exploits, test privilege escalation, and provide actionable remediation guidance with proof of concept."
  },
  {
    id: "02",
    title: "Web app development",
    description: "We build modern, responsive web applications with clean code and scalable architecture. From concept to deployment, we deliver performant solutions that solve real business problems while maintaining security best practices throughout the development lifecycle."
  },
  {
    id: "03",
    title: "Management systems",
    description: "We design and implement custom management systems tailored to your workflow. Whether it's content management, inventory tracking, or internal tools, we create intuitive interfaces backed by robust data models that grow with your organization."
  },
  {
    id: "04",
    title: "Cloud auditing",
    description: "We review your cloud infrastructure for misconfigurations, overly permissive access, and security gaps. Our audits cover IAM policies, network segmentation, data encryption, and compliance—delivering a prioritized roadmap to strengthen your cloud posture."
  },
  {
    id: "05",
    title: "Compliance & frameworks",
    description: "We help you navigate security frameworks like SOC 2, ISO 27001, and GDPR. From gap assessments to remediation tracking, we translate complex requirements into practical steps your team can implement without derailing product development."
  }
];

export default function SplitScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={containerRef} className="relative bg-black text-white">
      <div className="flex flex-col lg:flex-row relative">
        {/* Left Side - Scrolling Content */}
        <div className="w-full lg:w-1/2 px-5 sm:px-8 md:px-12 lg:px-16 py-8 lg:py-16 space-y-16 sm:space-y-20 md:space-y-24 relative z-10">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false, amount: 0.3 }}
              className="min-h-[70vh] sm:min-h-[80vh] lg:min-h-screen flex flex-col justify-center space-y-4 sm:space-y-5 md:space-y-6"
            >
              <span className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
                {service.id}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light leading-tight font-[family-name:var(--font-space-grotesk)]">
                {service.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-400 max-w-2xl">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Right Side - Fixed Background */}
        <div className="hidden lg:block lg:w-1/2 lg:h-screen lg:sticky lg:top-0 lg:self-start">
          <div className="relative w-full h-full overflow-hidden">
            <AnimatedGridPattern
              numSquares={30}
              maxOpacity={0.3}
              duration={3}
              repeatDelay={1}
              className="absolute inset-0 h-full w-full fill-gray-700/20 stroke-gray-700/20"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
