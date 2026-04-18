"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy, Eye, EyeOff, Shield, Smartphone,
  Activity, Building2, MapPin, Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, tierLabel } from "@/lib/utils";
import type { UserTier } from "@/types";

const DEMO_ROLES: { tier: UserTier; name: string; desc: string; icon: string }[] = [
  { tier: "SUPER_ADMIN",    name: "Prashant Verma IAS", desc: "Full system access",   icon: "🔐" },
  { tier: "SPOC",           name: "Snehal Mehta",        desc: "Data custodian",        icon: "📊" },
  { tier: "DSO",            name: "Dilip Kumar IAS",     desc: "Delhi district",        icon: "🏛️" },
  { tier: "VENUE_MANAGER",  name: "Rajesh Patel",        desc: "JN Stadium Delhi",      icon: "🏟️" },
  { tier: "FIELD_OFFICER",  name: "Arjun Singh",         desc: "Mumbai field officer",  icon: "📋" },
  { tier: "AUDITOR",        name: "CAG Audit Team",       desc: "Read-only ledger",      icon: "🔍" },
];

const HERO_STATS = [
  { value: "8,500+", label: "Total Venues",      Icon: Building2, grad: "from-blue-500 to-blue-600",    delay: "0s"    },
  { value: "36",    label: "States / UTs",       Icon: MapPin,    grad: "from-orange-500 to-amber-400",  delay: "0.08s" },
  { value: "4,100+", label: "Bookings/month",    Icon: Activity,  grad: "from-emerald-500 to-teal-400",  delay: "0.16s" },
  { value: "1,800+", label: "Pay & Play Venues", Icon: Zap,       grad: "from-purple-500 to-violet-500", delay: "0.24s" },
];

export default function LoginPage() {
  const router = useRouter();
  const [loginMode, setLoginMode] = useState<"password" | "otp">("password");
  const [showPass, setShowPass] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserTier>("SUPER_ADMIN");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    sessionStorage.setItem("vims_user_tier", selectedRole);
    sessionStorage.setItem(
      "vims_user_name",
      DEMO_ROLES.find((r) => r.tier === selectedRole)?.name ?? "Admin"
    );
    router.push("/admin/dashboard");
  };

  const sendOtp = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setOtpSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#f8faff]">

      {/* ── Left branding panel ────────────────────────────────── */}
      <div className="hidden lg:flex flex-col w-[54%] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 40%, #4f46e5 100%)",
        }}
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-400/20 blur-[80px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[300px] h-[300px] rounded-full bg-indigo-300/15 blur-[70px]" />
        <div className="absolute top-[40%] left-[20%] w-[200px] h-[200px] rounded-full bg-violet-400/15 blur-[60px]" />

        <div className="relative z-10 flex flex-col h-full px-16 py-14 justify-between">

          {/* Logo */}
          <div className="flex items-center gap-4" style={{ animation: "fadeSlideUp 0.6s ease-out both" }}>
            <div className="relative">
              <div className="absolute inset-0 bg-orange-400/40 rounded-2xl blur-xl" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-2xl shadow-orange-500/40">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <div>
              <div className="text-[1.75rem] font-black text-white tracking-tight leading-none">I-VIMS</div>
              <div className="text-sm text-blue-200 font-medium tracking-widest uppercase mt-0.5">India Sports Platform</div>
            </div>
          </div>

          {/* Hero text */}
          <div className="space-y-6" style={{ animation: "fadeSlideUp 0.6s ease-out 0.1s both" }}>
            <div className="inline-flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 block animate-pulse-dot" />
              <span className="text-emerald-300 text-sm font-medium">System Live · 6,800+ active venues</span>
            </div>

            <h2 className="text-[3.8rem] font-black text-white leading-[1.02] tracking-tight drop-shadow-sm">
              India&apos;s<br />
              <span style={{
                background: "linear-gradient(135deg, #fde68a 0%, #f59e0b 50%, #fbbf24 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Digital Sports
              </span><br />
              Spine
            </h2>

            <p className="text-blue-100 text-[1.05rem] leading-relaxed max-w-lg">
              Unified venue management, bookings, compliance, and citizen Pay&amp;Play —{" "}
              <span className="text-white font-semibold">8,500+ venues</span>,{" "}
              <span className="text-white font-semibold">36 states &amp; UTs</span>, one platform.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4" style={{ animation: "fadeSlideUp 0.6s ease-out 0.22s both" }}>
            {HERO_STATS.map((s) => (
              <div
                key={s.label}
                style={{ animation: `fadeSlideUp 0.6s ease-out ${s.delay} both` }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 card-hover cursor-default group"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${s.grad} shadow-lg`}>
                    <s.Icon className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${s.grad} leading-none`}>
                  {s.value}
                </div>
                <div className="text-blue-200 text-sm mt-1.5 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2" style={{ animation: "fadeSlideUp 0.6s ease-out 0.36s both" }}>
            <Shield className="h-3.5 w-3.5 text-blue-300/60" />
            <span className="text-xs text-blue-200/60">
              Digital India SSO · NIC e-Sign · ISO 27001 Compliant · MeitY Certified
            </span>
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent pointer-events-none" />

      {/* ── Right login panel ──────────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-14 bg-[#f8faff]">
        <div className="w-full max-w-[440px] animate-scale-in">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 shadow-md shadow-orange-500/25">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-xl font-black text-slate-900">I-VIMS</div>
              <div className="text-xs text-blue-600 tracking-widest uppercase">India Sports Platform</div>
            </div>
          </div>

          {/* White login card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-200/80">

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-slate-900 mb-1.5">Welcome back</h1>
              <p className="text-slate-500 text-sm">Sign in to the G-VIMS Admin Console</p>
            </div>

            {/* Mode toggle */}
            <div className="flex rounded-xl bg-slate-100 border border-slate-200 p-1 mb-6">
              {(["password", "otp"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setLoginMode(mode)}
                  className={cn(
                    "flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-200",
                    loginMode === mode
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "text-slate-500 hover:text-slate-800"
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
                    <Label htmlFor="email" className="text-slate-600 text-xs font-semibold uppercase tracking-widest">
                      Email / User ID
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="user@sai.gov.in"
                      defaultValue="admin@sai.gov.in"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-600 text-xs font-semibold uppercase tracking-widest">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPass ? "text" : "password"}
                        defaultValue="demo-password"
                        className="pr-11"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <Label htmlFor="mobile" className="text-slate-600 text-xs font-semibold uppercase tracking-widest">
                      Aadhaar-linked Mobile
                    </Label>
                    <div className="flex gap-2">
                      <Input id="mobile" type="tel" placeholder="+91 98765 43210" className="flex-1" />
                      <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpSent}
                        className="px-4 h-10 rounded-xl border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-60 whitespace-nowrap shadow-sm"
                      >
                        {otpSent ? "Sent ✓" : "Send OTP"}
                      </button>
                    </div>
                  </div>
                  {otpSent && (
                    <div className="space-y-1.5">
                      <Label htmlFor="otp" className="text-slate-600 text-xs font-semibold uppercase tracking-widest">
                        Enter OTP
                      </Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="6-digit OTP"
                        maxLength={6}
                        className="text-center tracking-[0.5em] text-lg"
                      />
                    </div>
                  )}
                </>
              )}

              {/* Demo role selector */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest mb-3">
                  <Shield className="h-3 w-3 text-blue-600" />
                  <span className="text-blue-600">Demo Access</span>
                  <span className="text-slate-400">— Select Role</span>
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEMO_ROLES.map((role) => (
                    <button
                      key={role.tier}
                      type="button"
                      onClick={() => setSelectedRole(role.tier)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all duration-200",
                        selectedRole === role.tier
                          ? "border-blue-400 bg-blue-50 shadow-md shadow-blue-500/10"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                      )}
                    >
                      <span className="text-base leading-none">{role.icon}</span>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-slate-800 truncate block">{role.name}</span>
                        <span className="text-[10px] text-slate-400 truncate block">{role.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full h-12 rounded-xl font-bold text-white text-sm transition-all duration-300",
                  "bg-gradient-to-r from-blue-600 to-indigo-600",
                  "hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-0.5",
                  "shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
                  "disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                )}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in…
                  </div>
                ) : (
                  "Sign In to G-VIMS →"
                )}
              </button>
            </form>

            <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400">
              <Smartphone className="h-3.5 w-3.5" />
              <span>Secured by Digital India SSO · NIC e-Sign enabled</span>
            </div>
          </div>

          <p className="mt-5 text-center text-[11px] text-slate-400">
            Sports Authority of India · Ministry of Youth Affairs &amp; Sports, Government of India
          </p>
        </div>
      </div>
    </div>
  );
}
