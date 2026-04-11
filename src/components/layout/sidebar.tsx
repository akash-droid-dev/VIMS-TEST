"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Building2, CalendarCheck, Zap, Calendar,
  ShieldCheck, FileSearch, Users, Settings, LogOut, Trophy,
  ChevronRight, X
} from "lucide-react";
import { cn, initials, tierLabel, tierColor } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserTier } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  CalendarCheck: <CalendarCheck className="h-4 w-4" />,
  Zap: <Zap className="h-4 w-4" />,
  Calendar: <Calendar className="h-4 w-4" />,
  ShieldCheck: <ShieldCheck className="h-4 w-4" />,
  FileSearch: <FileSearch className="h-4 w-4" />,
  Users: <Users className="h-4 w-4" />,
  Settings: <Settings className="h-4 w-4" />,
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
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={cn(
          "fixed top-0 left-0 z-30 h-full w-64 flex flex-col bg-slate-900 text-white transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Main Navigation"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <Trophy className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm leading-tight">G-VIMS</div>
            <div className="text-xs text-slate-400 leading-tight">Gujarat Sports Platform</div>
          </div>
          {onClose && (
            <button onClick={onClose} className="ml-auto p-1 rounded-md hover:bg-slate-700 lg:hidden" aria-label="Close sidebar">
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
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors group",
                  isActive
                    ? "bg-blue-800 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className={cn("shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-white")}>
                  {iconMap[item.icon]}
                </span>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-500 px-1 text-xs font-bold text-white">
                    {item.badge}
                  </span>
                )}
                {isActive && <ChevronRight className="h-3 w-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-slate-700 px-3 py-4">
          <div className="flex items-center gap-3 rounded-lg px-2 py-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-blue-700 text-white text-xs">
                {initials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{tierLabel(user.tier)}</p>
            </div>
          </div>
          <button
            className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
}
