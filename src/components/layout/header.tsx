"use client";
import React from "react";
import { Menu, Bell, Search, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  alertCount?: number;
  actions?: React.ReactNode;
}

const LANG_OPTIONS = ["English", "ગુજરાતી", "हिंदी"];

export function Header({ title, subtitle, onMenuClick, alertCount = 0, actions }: HeaderProps) {
  const [lang, setLang] = React.useState("English");
  const [searchOpen, setSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-slate-200 bg-white px-4 shadow-sm" role="banner">
      {/* Mobile menu button */}
      <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden shrink-0" aria-label="Open navigation">
        <Menu className="h-5 w-5" />
      </Button>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-900 truncate">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 truncate">{subtitle}</p>}
      </div>

      {/* Search (expandable on mobile) */}
      <div className={cn("transition-all duration-200", searchOpen ? "w-64" : "w-0 overflow-hidden sm:w-48")}>
        <Input
          placeholder="Search venues, bookings…"
          className="h-8 text-xs"
          aria-label="Search"
        />
      </div>
      <Button variant="ghost" size="icon" onClick={() => setSearchOpen((v) => !v)} className="sm:hidden shrink-0" aria-label="Toggle search">
        <Search className="h-4 w-4" />
      </Button>

      {/* Language switcher */}
      <div className="hidden md:flex items-center gap-1">
        <Globe className="h-4 w-4 text-slate-400" />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-xs bg-transparent border-none text-slate-600 focus:outline-none cursor-pointer"
          aria-label="Select language"
        >
          {LANG_OPTIONS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative shrink-0" aria-label={`${alertCount} notifications`}>
        <Bell className="h-5 w-5 text-slate-600" />
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        )}
      </Button>

      {/* Page-level actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}
