"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Phone, Eye, EyeOff, ArrowRight, Loader2,
  AlertCircle, Shield, LogIn, ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";

type LoginMode = "password" | "otp";

export default function CitizenLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const [form, setForm] = useState({
    mobile: "",
    password: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.mobile || !form.password) {
      setError("Enter your mobile number and password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    sessionStorage.setItem("citizenMobile", form.mobile);
    router.push("/venues");
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.mobile.length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setOtpSent(true);
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    sessionStorage.setItem("citizenMobile", form.mobile);
    router.push("/venues");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value.slice(-1);
    setOtpDigits(next);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      (nextInput as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-800 mb-4">
            <LogIn className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Citizen Sign In</h1>
          <p className="text-slate-500 text-sm mt-1">Access your G-VIMS account</p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
          {(["password", "otp"] as LoginMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setError(""); setOtpSent(false); }}
              className={cn(
                "flex-1 py-2 rounded-lg text-sm font-medium transition-all",
                mode === m ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {m === "password" ? "Password" : "Mobile OTP"}
            </button>
          ))}
        </div>

        {/* Password login */}
        {mode === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+91</span>
                <input
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700">Password</label>
                <a href="#" className="text-xs text-blue-700 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="Your password"
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        )}

        {/* OTP login */}
        {mode === "otp" && !otpSent && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                We'll send a one-time password to your registered mobile number via UIDAI Aadhaar OTP.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Registered Mobile Number</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-medium">+91</span>
                <input
                  value={form.mobile}
                  onChange={(e) => update("mobile", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="98765 43210"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
              {loading ? "Sending OTP…" : "Send OTP"}
            </button>
          </form>
        )}

        {mode === "otp" && otpSent && (
          <form onSubmit={handleOtpLogin} className="space-y-4">
            <button
              type="button"
              onClick={() => { setOtpSent(false); setOtpDigits(["","","","","",""]); }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Change number
            </button>

            <div className="text-center py-2">
              <p className="text-sm text-slate-600">
                OTP sent to <span className="font-semibold text-slate-900">+91 {form.mobile}</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Valid for 10 minutes</p>
            </div>

            <div className="flex justify-center gap-2">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKey(i, e)}
                  className="h-12 w-10 text-center rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-800 transition-colors"
                />
              ))}
            </div>

            <p className="text-center text-xs text-slate-400">
              Didn't receive?{" "}
              <button type="button" className="text-blue-700 hover:underline">Resend OTP</button>
            </p>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 px-3 py-2 rounded-xl">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpDigits.join("").length < 6}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Verifying…" : "Verify & Sign In"}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-slate-400">or</span>
          </div>
        </div>

        <p className="text-center text-sm text-slate-600">
          New to G-VIMS?{" "}
          <Link href="/register" className="text-blue-800 font-semibold hover:underline">
            Create account
          </Link>
        </p>

        {/* Admin login note */}
        <div className="mt-8 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center">
          <p className="text-xs text-slate-500">
            Are you a government officer?{" "}
            <Link href="/admin/login" className="text-blue-700 hover:underline font-medium">
              Admin / Staff Sign In →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
