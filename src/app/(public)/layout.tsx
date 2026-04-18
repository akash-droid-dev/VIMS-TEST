"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy, Menu, X, Search, User,
  Globe, LogIn, Heart, CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVIMSStore } from "@/hooks/useVIMSStore";
import { useLanguage } from "@/context/LanguageContext";
import { type Lang, LANG_LABELS } from "@/lib/i18n";

const NAV_LINKS = [
  { label: "Discover Venues", href: "/venues"                },
  { label: "Pay & Play",       href: "/venues?filter=payplay" },
  { label: "Events",           href: "/events"                },
  { label: "About",            href: "/about"                 },
];

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchStr,   setSearchStr]   = useState("");
  const store = useVIMSStore();
  const { lang, setLang, t } = useLanguage();
  const savedCount = store.savedVenues.length;

  useEffect(() => { setSearchStr(typeof window !== "undefined" ? window.location.search : ""); }, [pathname]);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faff]">

      {/* Government top bar */}
      <div className="hidden md:flex items-center justify-between bg-slate-50 border-b border-slate-200/70 text-slate-500 text-xs px-6 py-1.5">
        <span className="font-medium">Ministry of Youth Affairs &amp; Sports · Government of India</span>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <Globe className="h-3 w-3" />
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="bg-transparent border-none text-slate-500 text-xs focus:outline-none cursor-pointer hover:text-slate-800 appearance-none"
            >
              {(["en", "gu", "hi"] as Lang[]).map((l) => (
                <option key={l} value={l} className="bg-white text-slate-800">{LANG_LABELS[l]}</option>
              ))}
            </select>
          </div>
          <span>Helpline: 1800-233-4567</span>
        </div>
      </div>

      {/* Main header */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300 border-b",
        scrolled
          ? "bg-white/95 backdrop-blur-2xl border-slate-200/80 shadow-lg shadow-slate-200/40"
          : "bg-white border-slate-200/60"
      )}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-3">

          {/* Logo */}
          <Link href="/venues" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/25 rounded-xl blur-md group-hover:blur-lg transition-all" />
              <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-md shadow-orange-500/25">
                <Trophy className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-base font-black text-slate-900 leading-tight tracking-tight">I-VIMS</div>
              <div className="text-[10px] text-slate-400 leading-tight tracking-widest uppercase">India Sports</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5 ml-3" aria-label="Main navigation">
            {[
              { label: t("nav_discover"), href: "/venues",               exact: false },
              { label: t("nav_payplay"),  href: "/venues?filter=payplay", exact: true  },
              { label: t("nav_events"),   href: "/events",                exact: true  },
              { label: t("nav_about"),    href: "/about",                 exact: true  },
            ].map((link) => {
              const isPayPlay = link.href.includes("filter=payplay");
              const isActive  = isPayPlay
                ? pathname === "/venues" && searchStr.includes("filter=payplay")
                : link.exact
                  ? pathname === link.href
                  : pathname === "/venues" && !searchStr.includes("filter=payplay") && pathname.startsWith("/venues");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                    isActive
                      ? "text-blue-700 bg-blue-50 border border-blue-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Search — desktop */}
          <div className="flex-1 mx-4 hidden md:block max-w-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search venues or sports…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 bg-white shadow-sm hover:border-slate-300 transition-all"
              />
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            <Link
              href="/my-bookings"
              className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors hidden sm:flex items-center justify-center"
            >
              <Heart className="h-5 w-5" />
              {savedCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {savedCount}
                </span>
              )}
            </Link>

            <Link
              href="/my-bookings"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 transition-all shadow-sm"
            >
              <CalendarDays className="h-3.5 w-3.5" /> {t("nav_my_bookings")}
            </Link>

            <Link
              href="/register"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm"
            >
              <User className="h-3.5 w-3.5" /> {t("nav_register")}
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20 hover:-translate-y-px"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">{t("nav_sign_in")}</span>
            </Link>

            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 py-4 space-y-1.5 shadow-lg">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
                placeholder="Search venues…"
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400"
              />
            </div>
            {NAV_LINKS.map((link) => {
              const isPayPlay = link.href.includes("filter=payplay");
              const isActive  = isPayPlay
                ? pathname === "/venues" && searchStr.includes("filter=payplay")
                : pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-slate-100 pt-3 mt-2">
              <div className="flex items-center justify-between px-1 py-1">
                <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" /> Language
                </span>
                <div className="flex gap-1.5">
                  {(["en", "gu", "hi"] as Lang[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
                        lang === l
                          ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20"
                          : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-800"
                      )}
                    >
                      {l === "en" ? "EN" : l === "gu" ? "ગુ" : "हि"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 mt-1 flex gap-2">
              <Link href="/register" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all">Register</Link>
              <Link href="/login"    onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20">Sign In</Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500/30 rounded-xl blur-sm" />
                  <div className="relative h-9 w-9 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                    <Trophy className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div>
                  <div className="text-white font-black tracking-tight">I-VIMS</div>
                  <div className="text-[10px] text-slate-500 tracking-widest uppercase">India Sports</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                India's national sports venue platform — 8,500+ venues, 36 states &amp; UTs, one platform.
              </p>
            </div>

            {[
              { title: "Discover",    links: ["All Venues", "Pay & Play", "By Sport", "By State", "Maps View"] },
              { title: "Support",     links: ["Help Center", "Accessibility", "RTI Portal", "Feedback", "Contact Us"] },
              { title: "Government",  links: ["SAG", "Commissionerate", "Khelo India", "MYAS", "Sports Policy"] },
              { title: "Legal",       links: ["Privacy Policy", "Terms of Use", "DPDP Act 2023", "GIGW 3.0", "Cookie Policy"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-slate-300 text-sm font-bold mb-3">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l) => (
                    <li key={l}><a href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-600">
            <span>© 2026 Sports Authority of India · Ministry of Youth Affairs &amp; Sports</span>
            <div className="flex items-center gap-5">
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="h-2 w-2 rounded-full bg-emerald-400 block animate-pulse-dot" />
                All systems operational
              </span>
              <span>GIGW 3.0 · RPwD Act · DPDP Act 2023</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
