"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
          <Link href="#" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="#" className="hover:text-gray-600">
            About
          </Link>
          <Link href="#" className="hover:text-gray-600">
            Services
          </Link>
          <Link href="#" className="hover:text-gray-600">
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

      {/* Mobile Menu Button */}
      <button 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"/>
            <path d="M6 6l12 12"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 8h16"/>
            <path d="M4 16h16"/>
          </svg>
        )}
      </button>

      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-4 md:hidden">
          <div className="flex flex-col space-y-3">
            <Link href="#" className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="#" className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              About
            </Link>
            <Link href="#" className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Services
            </Link>
            <Link href="#" className="px-4 py-3 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors font-medium" onClick={() => setMobileMenuOpen(false)}>
              Contact
            </Link>
            <button className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-800 text-white px-4 py-3 rounded-xl font-medium">
              Get a quote
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>
      )}


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
