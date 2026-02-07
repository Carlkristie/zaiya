"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  const isInView = useInView(containerRef, { margin: "-10% 0px -10% 0px" });
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const rightSideOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <section ref={containerRef} data-scroll-pin className="relative bg-black text-white">
      {/* Right Side - Fixed Background (skip on mobile for performance) */}
      {isInView && (
        <motion.div 
          style={{ opacity: rightSideOpacity }}
          className="fixed top-0 right-0 w-full lg:w-1/2 h-screen overflow-hidden pointer-events-none"
        >
          <AnimatedGridPattern
            numSquares={15}
            maxOpacity={0.3}
            duration={3}
            repeatDelay={1}
            className="absolute inset-0 h-full w-full fill-gray-700/20 stroke-gray-700/20"
          />
        </motion.div>
      )}

      {/* Left Side - Scrolling Content */}
      <div className="w-full lg:w-1/2 px-5 sm:px-8 md:px-12 lg:px-16 py-12 sm:py-16 md:py-20 lg:py-16 space-y-12 sm:space-y-16 md:space-y-20 lg:space-y-24 relative z-10">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-tight font-[family-name:var(--font-space-grotesk)]"
        >
          What we do
        </motion.h2>
        
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false, amount: 0.3 }}
            className={`min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] lg:min-h-screen flex flex-col space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 ${index === 0 ? 'justify-start' : 'justify-center'}`}
          >
            <span className="text-xs sm:text-sm tracking-widest text-gray-400 uppercase">
              {service.id}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light leading-tight font-[family-name:var(--font-space-grotesk)]">
              {service.title}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-gray-400 max-w-2xl">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
