"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../src/assets/logo.jpeg";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 w-full max-w-[1400px] mx-auto gap-2 sm:gap-4">
      <nav className="flex-1 flex items-center justify-between bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full shadow-md">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2 pl-1 sm:pl-2">
          <Image
            src={logo}
            alt="ZAIYA Logo"
            width={32}
            height={32}
            className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
          />
          <span className="text-lg sm:text-xl md:text-2xl font-semibold text-[#1a1a1a] tracking-tight">
            ZAIYA
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="hidden lg:flex items-center gap-8 text-[15px] font-medium text-slate-600">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/about" className="hover:text-gray-600">
            About
          </Link>
          <Link href="/services" className="hover:text-gray-600">
            Services
          </Link>
          <Link href="/contact" className="hover:text-gray-600">
            Contact
          </Link>
        </div>
      {/* Get a Quote Button - Desktop */}
      <button className="hidden md:flex items-center gap-2 lg:gap-3 bg-white/90 px-3 lg:px-5 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 relative overflow-hidden group">
        <div className="absolute inset-0 bg-slate-700 rounded-full origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        <span className="font-medium text-slate-600 text-sm lg:text-[15px] relative z-10 group-hover:text-white transition-colors duration-300">Get a quote</span>
        <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-700 flex items-center justify-center text-white relative z-10 group-hover:bg-slate-800 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </button>

      {/* Mobile Menu Button - Animated */}
      <motion.button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-700 hover:bg-slate-800 transition-colors relative overflow-hidden"
        aria-label="Toggle menu"
        whileTap={{ scale: 0.9 }}
      >
        <div className="relative w-5 h-5">
          <motion.span
            className="absolute h-0.5 w-5 bg-white left-0 top-[6px]"
            animate={{
              rotate: mobileMenuOpen ? 45 : 0,
              y: mobileMenuOpen ? 3 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute h-0.5 w-5 bg-white left-0 top-[10px]"
            animate={{
              opacity: mobileMenuOpen ? 0 : 1,
              x: mobileMenuOpen ? -20 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
          <motion.span
            className="absolute h-0.5 w-5 bg-white left-0 top-[14px]"
            animate={{
              rotate: mobileMenuOpen ? -45 : 0,
              y: mobileMenuOpen ? -3 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </motion.button>

      </nav>

      {/* Mobile Menu Fullscreen Overlay */}  
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 md:hidden overflow-hidden"
          >
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
              <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
            </div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-md rounded-full border border-white/20"
            >
              <motion.span
                className="absolute w-6 h-0.5 bg-white"
                style={{ rotate: 45 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-white"
                style={{ rotate: -45 }}
              />
            </motion.button>

            {/* Menu Content */}
            <div className="relative h-full flex flex-col justify-center px-8 py-20">
              {/* Navigation Links */}
              <nav className="space-y-2">
                {[
                  { name: 'Home', index: '01', href: '/' },
                  { name: 'About', index: '02', href: '/about' },
                  { name: 'Services', index: '03', href: '/services' },
                  { name: 'Contact', index: '04', href: '/contact' }
                ].map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
                  >
                    <Link 
                      href={item.href} 
                      onClick={() => setMobileMenuOpen(false)}
                      className="group flex items-center gap-4 py-3 overflow-hidden"
                    >
                      <span className="text-sm font-mono text-white/40 group-hover:text-purple-400 transition-colors">
                        {item.index}
                      </span>
                      <span className="text-4xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300">
                        {item.name}
                      </span>
                      <motion.div
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                        initial={{ x: -10 }}
                        whileHover={{ x: 0 }}
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M5 12h14"/>
                          <path d="m12 5 7 7-7 7"/>
                        </svg>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-16"
              >
                <button className="group relative w-full bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Get a quote
                    <motion.svg 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      animate={{ x: [0, 5, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <path d="M5 12h14"/>
                      <path d="m12 5 7 7-7 7"/>
                    </motion.svg>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </button>
              </motion.div>

              {/* Footer Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-auto pt-8 border-t border-white/10"
              >
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>info@zaiya.com</span>
                  <span>+1 234 567 890</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 8h16M4 16h16"
      />
    </svg>
  );
}
