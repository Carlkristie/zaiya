"use client";
import LiquidReveal from "./LiquidReveal";
import { motion } from "framer-motion";
import imageLight from '../src/assets/dark-background.webp';
import imageDark from '../src/assets/dark-background2.webp';

export default function HeroSection() {
  return (
<LiquidReveal
  imageB={imageLight.src}
  imageA={imageDark.src}
  className="bg-slate-100"
  tintColor="rgba(221, 100, 255, 0.4)" 
  // or try: "rgba(255, 150, 100, 0.4)" for orange
  // or try: "rgba(200, 100, 255, 0.4)" for purple
>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-6 items-center justify-center px-4 text-center max-w-5xl mx-auto"
      >
        <div className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg font-[family-name:var(--font-inter)] tracking-tight leading-[0.95]">
          Precision Engineering for the Modern Web.
        </div>
        <div className="font-light text-lg md:text-2xl text-white/90 drop-shadow leading-relaxed max-w-3xl tracking-wide">
          High-performance web solutions where aesthetic beauty meets robust architecture. Built to scale.
        </div>
        <button className="mt-4 bg-white/90 backdrop-blur-sm rounded-full w-fit text-slate-800 px-8 py-3 shadow-lg hover:bg-white transition-all text-sm tracking-wider uppercase">
          Start Your Project
        </button>
      </motion.div>
    </LiquidReveal>
  );
}
