"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, CalendarCheck, Zap, Calendar,
  ShieldCheck, FileSearch, Users, Settings, LogOut, Trophy,
  ChevronRight, X,
} from "lucide-react";
import { cn, initials, tierLabel } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { UserTier } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4 text-blue-600"   />,
  Building2:       <Building2       className="h-4 w-4 text-cyan-600"   />,
  CalendarCheck:   <CalendarCheck   className="h-4 w-4 text-emerald-600" />,
  Zap:             <Zap             className="h-4 w-4 text-purple-600"  />,
  Calendar:        <Calendar        className="h-4 w-4 text-indigo-600"  />,
  ShieldCheck:     <ShieldCheck     className="h-4 w-4 text-amber-600"   />,
  FileSearch:      <FileSearch      className="h-4 w-4 text-orange-600"  />,
  Users:           <Users           className="h-4 w-4 text-pink-600"    />,
  Settings:        <Settings        className="h-4 w-4 text-slate-500"   />,
};

interface SidebarNavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string | number;
}

interface SidebarProps {
  navItems: SidebarNavItem[];
  user: { name: string; tier: UserTier; email: string };
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ navItems, user, isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-20 bg-black/20 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 flex flex-col transition-transform duration-300",
          "bg-white border-r border-slate-100",
          "shadow-xl shadow-slate-200/60",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 bg-orange-500/30 rounded-xl blur-md" />
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-lg shadow-orange-500/25">
              <Trophy className="h-5 w-5 text-white" />
            </div>
          </div>
          <div>
            <div className="font-black text-[15px] text-slate-900 leading-none tracking-tight">I-VIMS</div>
            <div className="text-[10px] text-slate-400 leading-none mt-1 tracking-widest uppercase">India Sports</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5" aria-label="Sidebar navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "nav-active text-blue-700 font-semibold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={cn("shrink-0 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-105")}>
                  {iconMap[item.icon]}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white shadow-sm shadow-orange-500/30">
                    {item.badge}
                  </span>
                ) : isActive ? (
                  <ChevronRight className="h-3 w-3 text-blue-500 opacity-60" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-slate-100 px-3 py-4 space-y-1">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 bg-slate-50">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-sm" />
              <Avatar className="h-8 w-8 relative">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xs font-bold">
                  {initials(user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate tracking-wide">{tierLabel(user.tier)}</p>
            </div>
          </div>
          <button
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-slate-400 hover:bg-slate-50 hover:text-red-600 transition-all duration-200"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
