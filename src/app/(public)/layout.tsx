"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy, Menu, X, Search, MapPin, User, Bell,
  Globe, LogIn, Zap, Heart, CalendarDays, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVIMSStore } from "@/hooks/useVIMSStore";

const NAV_LINKS = [
  { label: "Discover Venues", href: "/venues" },
  { label: "Pay & Play", href: "/venues?filter=payplay" },
  { label: "Events", href: "/venues?filter=events" },
  { label: "About", href: "#" },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const store = useVIMSStore();

  const savedCount = store.savedVenues.length;
  const isOnVenuePage = pathname === "/venues" || pathname.startsWith("/venues/");

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Government top bar */}
      <div className="hidden md:flex items-center justify-between bg-blue-950 text-blue-200 text-xs px-6 py-1.5">
        <span>Government of Gujarat · Commissionerate of Sports, Youth &amp; Cultural Activities</span>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-white transition-colors">
            <Globe className="h-3 w-3" /> EN · ગુ · हि
          </button>
          <span>Helpline: 1800-233-4567</span>
        </div>
      </div>

      {/* Main header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-200 border-b",
        scrolled ? "bg-white/95 backdrop-blur-xl shadow-md border-slate-200" : "bg-white border-slate-200"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">
          {/* Logo */}
          <Link href="/venues" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-sm">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-extrabold text-slate-900 leading-tight">G-VIMS</div>
              <div className="text-[10px] text-slate-400 leading-tight font-medium">Gujarat Sports</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-2" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href || (link.href === "/venues" && pathname.startsWith("/venues"))
                    ? "text-blue-800 bg-blue-50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search — desktop */}
          <div className="flex-1 mx-4 hidden md:block max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search venues or sports…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent bg-slate-50 hover:bg-white transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            {/* Saved venues */}
            <Link href="/my-bookings" className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors hidden sm:flex items-center justify-center">
              <Heart className="h-5 w-5" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {savedCount}
                </span>
              )}
            </Link>

            {/* My bookings */}
            <Link
              href="/my-bookings"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <CalendarDays className="h-3.5 w-3.5" /> My Bookings
            </Link>

            {/* Register */}
            <Link href="/register" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              <User className="h-3.5 w-3.5" /> Register
            </Link>

            {/* Sign In */}
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 transition-colors shadow-sm"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Link>

            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 text-slate-600"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1 shadow-lg">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="text" placeholder="Search venues…" className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800" />
            </div>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                className={cn("block px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                  pathname === link.href ? "bg-blue-50 text-blue-800" : "text-slate-700 hover:bg-slate-50"
                )}>
                {link.label}
              </Link>
            ))}
            <div className="border-t border-slate-100 pt-2 mt-2 flex gap-2">
              <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700">Register</Link>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-blue-800 text-white text-sm font-semibold">Sign In</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-orange-500 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-extrabold">G-VIMS</div>
                  <div className="text-[10px] text-slate-500">Gujarat Sports Platform</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed">Gujarat's unified sports venue platform — 1,184 venues, 33 districts, one platform.</p>
            </div>

            {[
              { title: "Discover", links: ["All Venues", "Pay & Play", "By Sport", "By District", "Maps View"] },
              { title: "Support", links: ["Help Center", "Accessibility", "RTI Portal", "Feedback", "Contact Us"] },
              { title: "Government", links: ["SAG", "Commissionerate", "Khelo India", "MYAS", "Sports Policy"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Use", "DPDP Act 2023", "GIGW 3.0", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white text-sm font-bold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => <li key={l}><a href="#" className="text-xs hover:text-white transition-colors">{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <span>© 2026 Sports Authority of Gujarat · Government of Gujarat</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-green-400"><div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /> All systems operational</span>
              <span>GIGW 3.0 · RPwD Act · DPDP Act 2023</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
