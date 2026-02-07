"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "../src/assets/logo.jpeg";

const footerLinks = {
  services: [
    { name: "Penetration Testing", href: "/services" },
    { name: "Web Development", href: "/services" },
    { name: "Cloud Auditing", href: "/services" },
    { name: "Compliance", href: "/services" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* Top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16 sm:mb-20">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-6">
              <Image
                src={logo}
                alt="ZAIYA Logo"
                width={36}
                height={36}
                className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded"
              />
              <span className="text-xl sm:text-2xl font-semibold tracking-tight">
                ZAIYA
              </span>
            </Link>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-sm mb-8">
              Precision engineering for the modern web. High-performance solutions
              where security meets beautiful design.
            </p>

            {/* Status indicator */}
            <div className="flex items-center gap-2.5 text-xs tracking-wider uppercase text-slate-500 font-[family-name:var(--font-geist-mono)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              All systems operational
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-xs tracking-[0.2em] uppercase text-slate-500 font-[family-name:var(--font-geist-mono)] mb-5">
              Get in touch
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@zaiya.com"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                >
                  info@zaiya.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1234567890"
                  className="text-sm text-slate-400 hover:text-white transition-colors duration-200"
                >
                  +1 234 567 890
                </a>
              </li>
            </ul>

            {/* Social links */}
            <div className="flex items-center gap-4 mt-6">
              {["X", "LI", "GH"].map((label) => (
                <a
                  key={label}
                  href="#"
                  className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center text-xs font-medium text-slate-500 hover:border-slate-600 hover:text-white transition-colors duration-200 font-[family-name:var(--font-geist-mono)]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800/60 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-600 font-[family-name:var(--font-geist-mono)]">
            © {new Date().getFullYear()} ZAIYA. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-xs text-slate-600 hover:text-slate-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
