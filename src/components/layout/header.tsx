"use client";
import React from "react";
import { Menu, Bell, Search, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { type Lang, LANG_LABELS } from "@/lib/i18n";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  alertCount?: number;
  actions?: React.ReactNode;
}

const LANG_MAP: Record<string, Lang> = {
  "English":  "en",
  "ગુજરાતી": "gu",
  "हिंदी":    "hi",
};

export function Header({ title, subtitle, onMenuClick, alertCount = 0, actions }: HeaderProps) {
  const { lang, setLang } = useLanguage();
  const [searchOpen, setSearchOpen] = React.useState(false);

  const displayLang = Object.entries(LANG_MAP).find(([, v]) => v === lang)?.[0] ?? "English";

  return (
    <header
      className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-slate-100 bg-white/95 backdrop-blur-xl px-4 shadow-sm"
      role="banner"
    >
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-slate-800 truncate">{title}</h1>
        {subtitle && <p className="text-[11px] text-slate-400 truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className={cn("transition-all duration-300", searchOpen ? "w-64" : "w-0 overflow-hidden sm:w-44")}>
        <input
          placeholder="Search venues, bookings…"
          className="h-8 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs text-slate-700 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          aria-label="Search"
        />
      </div>
      <button
        onClick={() => setSearchOpen((v) => !v)}
        className="sm:hidden shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
        aria-label="Toggle search"
      >
        <Search className="h-4 w-4" />
      </button>

      {/* Language switcher */}
      <div className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-50 transition-colors">
        <Globe className="h-3.5 w-3.5 text-slate-400" />
        <select
          value={displayLang}
          onChange={(e) => setLang(LANG_MAP[e.target.value] ?? "en")}
          className="text-xs bg-transparent border-none text-slate-500 hover:text-slate-800 focus:outline-none cursor-pointer"
          aria-label="Select language"
        >
          {Object.keys(LANG_MAP).map((l) => (
            <option key={l} value={l} className="bg-white text-slate-800">{l}</option>
          ))}
        </select>
      </div>

      {/* Notifications */}
      <button
        className="relative shrink-0 h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-all"
        aria-label={`${alertCount} notifications`}
      >
        <Bell className="h-4 w-4" />
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        )}
      </button>

      {/* Page-level actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
