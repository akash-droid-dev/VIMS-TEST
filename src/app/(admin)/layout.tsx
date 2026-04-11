"use client";
import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { getSidebarNav } from "@/lib/rbac";
import type { UserTier } from "@/types";
import { MOCK_BOOKINGS } from "@/lib/mock-data";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userTier, setUserTier] = useState<UserTier>("SUPER_ADMIN");
  const [userName, setUserName] = useState("Prashant Verma");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const tier = (sessionStorage.getItem("vims_user_tier") as UserTier) || "SUPER_ADMIN";
      const name = sessionStorage.getItem("vims_user_name") || "Prashant Verma";
      setUserTier(tier);
      setUserName(name);
    }
  }, []);

  const navItems = getSidebarNav(userTier).map((item) => ({
    ...item,
    badge:
      item.href === "/bookings"
        ? MOCK_BOOKINGS.filter((b) => b.state === "SUBMITTED" || b.state === "UNDER_REVIEW").length
        : undefined,
  }));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        navItems={navItems}
        user={{ name: userName, tier: userTier, email: "admin@sag.guj.gov.in" }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Header
          title="G-VIMS Admin Console"
          onMenuClick={() => setSidebarOpen(true)}
          alertCount={3}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6" role="main">
          {children}
        </main>
      </div>
    </div>
  );
}
