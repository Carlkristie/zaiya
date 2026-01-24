"use client";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function SecurityOverlaySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { amount: 0.5 });
  const [displayedText, setDisplayedText] = useState("");
  
  const fullText = "Security is not an add on. It is built in from day one.";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 1]);

  useEffect(() => {
    if (!isInView) {
      setDisplayedText("");
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={containerRef} className="relative">
      {/* Overlay that slides up */}
      <motion.div
        className="sticky top-0 h-screen w-full bg-black z-10 flex items-center justify-center"
      >
        <div
          ref={textRef}
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-light text-white text-center px-6 sm:px-8 md:px-12 max-w-4xl leading-relaxed sm:leading-relaxed md:leading-relaxed font-inter"
        >
          {displayedText}
          <span className="inline-block w-0.5 h-6 sm:h-8 md:h-10 lg:h-12 bg-white ml-1 animate-pulse" />
        </div>
      </motion.div>
    </div>
  );
}
