"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy, Menu, X, Search, MapPin, User, Bell,
  Globe, ChevronDown, LogIn, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Discover Venues", href: "/venues" },
  { label: "Pay & Play", href: "/venues?filter=payplay" },
  { label: "Events", href: "/venues?filter=events" },
  { label: "About VIMS", href: "#" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top bar */}
      <div className="hidden md:flex items-center justify-between bg-blue-900 text-blue-200 text-xs px-6 py-1.5">
        <span>Government of Gujarat · Commissionerate of Sports, Youth & Cultural Activities</span>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> EN · ગુ · हि</span>
          <span>Helpline: 1800-233-4567</span>
        </div>
      </div>

      {/* Main header */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/venues" className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-bold text-slate-900 leading-tight">G-VIMS</div>
              <div className="text-[10px] text-slate-500 leading-tight">Gujarat Sports Venues</div>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search venues, sports, districts…"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-blue-800 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 ml-auto lg:ml-0">
            {/* Register / Login */}
            <Link href="/register" className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <User className="h-4 w-4" /> Register
            </Link>
            <Link href="/login" className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-800 text-white text-sm font-medium hover:bg-blue-900 transition-colors">
              <LogIn className="h-4 w-4" /> <span className="hidden sm:inline">Sign In</span>
            </Link>
            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search venues…" className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <span className="text-white font-bold">G-VIMS</span>
              </div>
              <p className="text-xs leading-relaxed">Gujarat's unified sports venue platform — 1,184 venues, 33 districts.</p>
            </div>
            {[
              { title: "Discover", links: ["All Venues", "Pay & Play", "By Sport", "By District"] },
              { title: "Support", links: ["Help Center", "Accessibility", "RTI", "Feedback"] },
              { title: "Government", links: ["SAG", "Commissionerate", "Khelo India", "MYAS"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-sm font-semibold mb-3">{col.title}</h4>
                <ul className="space-y-1.5">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <span>© 2026 Sports Authority of Gujarat · Government of Gujarat</span>
            <span>GIGW 3.0 compliant · RPwD Act accessible · DPDP Act 2023 compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
