"use client";
import LiquidReveal from "./LiquidReveal";
import { motion } from "framer-motion";
import imageLight from '../src/assets/light-background.png';
import imageDark from '../src/assets/dark-background.png';

export default function HeroSection() {
  return (
    <LiquidReveal
      imageB={imageLight.src}   // Base image
      imageA={imageDark.src}     // Reveal image
      className="bg-slate-100"
    >
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center px-4 sm:px-6 md:px-8 text-center max-w-5xl mx-auto pt-16 sm:pt-12 md:pt-0"
      >
        <div className="text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-medium text-white drop-shadow-lg font-[family-name:var(--font-inter)] tracking-tight leading-[1.1] sm:leading-[1] md:leading-[0.95]">
          Precision Engineering for the Modern Web.
        </div>
        <div className="font-light text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 drop-shadow leading-relaxed max-w-3xl tracking-wide px-2">
          High-performance web solutions where aesthetic beauty meets robust architecture. Built to scale.
        </div>
        <button className="mt-2 sm:mt-3 md:mt-4 bg-white/90 backdrop-blur-sm rounded-full w-fit text-slate-800 px-6 sm:px-7 md:px-8 py-2.5 sm:py-3 shadow-lg hover:bg-white transition-all text-xs sm:text-sm tracking-wider uppercase">
          Start Your Project
        </button>
      </motion.div>
    </LiquidReveal>
  );
}
