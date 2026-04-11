"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Eye, EyeOff, Shield, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { cn, tierLabel, tierColor } from "@/lib/utils";
import type { UserTier } from "@/types";

const DEMO_ROLES: { tier: UserTier; name: string; desc: string }[] = [
  { tier: "SUPER_ADMIN", name: "Prashant Verma IAS", desc: "Full system access" },
  { tier: "SPOC", name: "Snehal Mehta", desc: "Data custodian" },
  { tier: "DSO", name: "Dilip Kumar IAS", desc: "Ahmedabad district" },
  { tier: "VENUE_MANAGER", name: "Rajesh Patel", desc: "Motera Stadium" },
  { tier: "FIELD_OFFICER", name: "Arjun Bhai Patel", desc: "AHM data collector" },
  { tier: "AUDITOR", name: "CAG Audit Team", desc: "Read-only ledger" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = React.useState<"password" | "otp">("password");
  const [showPass, setShowPass] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<UserTier>("SUPER_ADMIN");
  const [loading, setLoading] = React.useState(false);
  const [otpSent, setOtpSent] = React.useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    // Store selected role in sessionStorage for demo
    sessionStorage.setItem("vims_user_tier", selectedRole);
    sessionStorage.setItem("vims_user_name", DEMO_ROLES.find((r) => r.tier === selectedRole)?.name ?? "Admin");
    router.push("/admin/dashboard");
  };

  const sendOtp = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setOtpSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left — branding panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-12 justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
              <Trophy className="h-7 w-7 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">G-VIMS</div>
              <div className="text-sm text-blue-300">Gujarat Sports Platform</div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Gujarat's Digital<br />Sports Spine
          </h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-8">
            Unified venue management, bookings, compliance, and citizen Pay &amp; Play — 1,184 venues, 33 districts, one platform.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Active Venues", value: "892" },
              { label: "Districts", value: "33" },
              { label: "Bookings/month", value: "523" },
              { label: "Pay & Play enabled", value: "234" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 rounded-xl p-4">
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-blue-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-xs text-blue-400">
          Powered by Sports Authority of Gujarat · Commissionerate of Sports, Youth &amp; Cultural Activities
        </div>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-900">G-VIMS</div>
              <div className="text-xs text-slate-500">Gujarat Sports Platform</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
            <p className="text-slate-500 text-sm mb-6">Sign in to the G-VIMS Admin Console</p>

            {/* Login mode toggle */}
            <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
              {(["password", "otp"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLoginMode(mode)}
                  className={cn(
                    "flex-1 py-2 text-sm font-medium rounded-md transition-colors",
                    loginMode === mode ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  {mode === "password" ? "Password" : "Aadhaar OTP"}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginMode === "password" ? (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email / User ID</Label>
                    <Input id="email" type="email" placeholder="user@sag.guj.gov.in" defaultValue="admin@sag.guj.gov.in" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={showPass ? "text" : "password"} defaultValue="••••••••" className="pr-10" required />
                      <button type="button" onClick={() => setShowPass((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile">Aadhaar-linked Mobile</Label>
                    <div className="flex gap-2">
                      <Input id="mobile" type="tel" placeholder="+91 98765 43210" className="flex-1" />
                      <Button type="button" variant="outline" onClick={sendOtp} loading={loading && !otpSent} disabled={otpSent}>
                        {otpSent ? "Sent ✓" : "Send OTP"}
                      </Button>
                    </div>
                  </div>
                  {otpSent && (
                    <div className="space-y-1.5">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input id="otp" type="text" placeholder="6-digit OTP" maxLength={6} className="text-center tracking-widest text-lg" />
                    </div>
                  )}
                </>
              )}

              {/* Demo role selector */}
              <div className="rounded-xl border border-dashed border-slate-300 p-4 bg-slate-50">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5" /> Demo — Select Role
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_ROLES.map((role) => (
                    <button
                      key={role.tier}
                      type="button"
                      onClick={() => setSelectedRole(role.tier)}
                      className={cn(
                        "flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-all",
                        selectedRole === role.tier
                          ? "border-blue-800 bg-blue-50 ring-1 ring-blue-800"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <span className="text-xs font-semibold text-slate-900 truncate w-full">{role.name}</span>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded-full font-medium mt-0.5", tierColor(role.tier))}>
                        {tierLabel(role.tier)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full" loading={loading}>
                Sign In to G-VIMS
              </Button>
            </form>

            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Secured by Digital Gujarat SSO · NIC e-Sign enabled</span>
            </div>
          </div>

          <p className="mt-4 text-center text-xs text-slate-400">
            Gujarat Sports Authority · Commissionerate of Sports, Youth &amp; Cultural Activities
          </p>
        </div>
      </div>
    </div>
  );
}
