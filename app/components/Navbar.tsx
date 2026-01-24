import Link from "next/link";
import Image from "next/image";
import logo from "../src/assets/logo.jpeg";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 w-full max-w-[1400px] mx-auto gap-4">
      <nav className="flex-1 flex items-center justify-between bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-md">
        {/* Logo Section */}
        <Link href="/" className="flex items-center gap-2 pl-2">
          <Image
            src={logo}
            alt="ZAIYA Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
          />
          <span className="text-2xl font-semibold text-[#1a1a1a] tracking-tight">
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
      {/* Get a Quote Button */}
      <button className="hidden sm:flex items-center gap-3 bg-white/90 px-5 py-1.5 rounded-full shadow-sm hover:shadow-md transition-shadow border border-gray-200 relative overflow-hidden group">
        <div className="absolute inset-0 bg-slate-700 rounded-full origin-right transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></div>
        <span className="font-medium text-slate-600 text-[15px] relative z-10 group-hover:text-white transition-colors duration-300">Get a quote</span>
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white relative z-10 group-hover:bg-slate-800 transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="m12 5 7 7-7 7"/>
          </svg>
        </div>
      </button>

      </nav>


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
