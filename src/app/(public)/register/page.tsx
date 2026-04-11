"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Phone, Mail, Eye, EyeOff, CheckCircle2,
  Shield, ArrowRight, ChevronLeft, Loader2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

type Step = "details" | "otp" | "password" | "done";

const SPORTS_INTERESTS = [
  "Cricket", "Football", "Athletics", "Swimming", "Badminton",
  "Kabaddi", "Volleyball", "Basketball", "Tennis", "Wrestling",
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);

  const [form, setForm] = useState({
    fullName: "",
    mobile: "",
    email: "",
    aadhaarLast4: "",
    district: "",
    password: "",
    confirmPassword: "",
    sportsInterests: [] as string[],
    agreeTerms: false,
    agreeComms: false,
  });

  const districts = [
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar",
    "Jamnagar", "Junagadh", "Anand", "Mehsana", "Kutch", "Amreli",
  ];

  const update = (field: string, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleSport = (sport: string) => {
    setForm((prev) => ({
      ...prev,
      sportsInterests: prev.sportsInterests.includes(sport)
        ? prev.sportsInterests.filter((s) => s !== sport)
        : [...prev.sportsInterests, sport],
    }));
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.fullName || !form.mobile || !form.aadhaarLast4) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.mobile.length < 10) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setStep("otp");
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length < 6) {
      setError("Enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setStep("password");
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agreeTerms) {
      setError("You must agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setStep("done");
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

  if (step === "done") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h1>
          <p className="text-slate-500 mb-2">Welcome to G-VIMS, <span className="font-semibold text-slate-800">{form.fullName}</span>.</p>
          <p className="text-slate-400 text-sm mb-8">
            Your citizen account is ready. You can now discover and book sports venues across Gujarat.
          </p>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs font-medium text-blue-800 mb-2">What you can do now:</p>
            <ul className="text-xs text-blue-700 space-y-1.5">
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Browse 1,184 sports venues across 33 districts</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Book Pay & Play slots instantly</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Submit event booking requests</li>
              <li className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5" /> Track your bookings and payment history</li>
            </ul>
          </div>
          <button
            onClick={() => router.push("/venues")}
            className="w-full py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-colors"
          >
            Explore Venues
          </button>
          <Link href="/login" className="block mt-3 text-sm text-blue-700 hover:underline">
            Sign in to your account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-blue-800 mb-4">
            <User className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Create Citizen Account</h1>
          <p className="text-slate-500 text-sm mt-1">
            Access Gujarat's 1,184+ sports venues
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["details", "otp", "password"] as Step[]).map((s, i) => (
            <React.Fragment key={s}>
              <div className={cn(
                "h-2 w-2 rounded-full transition-all",
                step === s ? "bg-blue-800 w-6" :
                (["details","otp","password"].indexOf(step) > i) ? "bg-green-500" : "bg-slate-200"
              )} />
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Details */}
        {step === "details" && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-700 border-b border-slate-100 pb-2">Personal Information</h2>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                    placeholder="As per Aadhaar card"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Mobile Number <span className="text-red-500">*</span></label>
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
                  <label className="text-xs font-medium text-slate-700">Aadhaar Last 4 <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={form.aadhaarLast4}
                      onChange={(e) => update("aadhaarLast4", e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="XXXX"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="your@email.com (optional)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Home District</label>
                <select
                  value={form.district}
                  onChange={(e) => update("district", e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                >
                  <option value="">Select district</option>
                  {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-700">Sports Interests (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS_INTERESTS.map((sport) => (
                    <button
                      key={sport}
                      type="button"
                      onClick={() => toggleSport(sport)}
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                        form.sportsInterests.includes(sport)
                          ? "bg-blue-800 text-white border-blue-800"
                          : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                      )}
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Phone className="h-4 w-4" />}
              {loading ? "Sending OTP…" : "Send OTP to Mobile"}
            </button>

            <p className="text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-800 font-medium hover:underline">Sign in</Link>
            </p>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <button
                type="button"
                onClick={() => setStep("details")}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>

              <div className="text-center py-2">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Verify Your Mobile</h2>
                <p className="text-sm text-slate-500 mt-1">
                  OTP sent to <span className="font-medium text-slate-800">+91 {form.mobile}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Valid for 10 minutes · UIDAI Aadhaar OTP</p>
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
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || otpDigits.join("").length < 6}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>
        )}

        {/* Step 3: Password */}
        {step === "password" && (
          <form onSubmit={handleCreateAccount} className="space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
              <button
                type="button"
                onClick={() => setStep("otp")}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-900"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>

              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                <span className="text-xs font-medium text-green-800">Mobile verified successfully</span>
              </div>

              <h2 className="text-sm font-semibold text-slate-700">Set Your Password</h2>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Password <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    placeholder="Min. 8 characters"
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
                {form.password && (
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full transition-all",
                          form.password.length >= i * 2
                            ? form.password.length >= 10 ? "bg-green-500" : "bg-orange-400"
                            : "bg-slate-200"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Confirm Password <span className="text-red-500">*</span></label>
                <input
                  type="password"
                  value={form.confirmPassword}
                  onChange={(e) => update("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  required
                />
                {form.confirmPassword && form.confirmPassword !== form.password && (
                  <p className="text-xs text-red-500">Passwords do not match</p>
                )}
              </div>

              <div className="space-y-2 pt-1">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeTerms}
                    onChange={(e) => update("agreeTerms", e.target.checked)}
                    className="mt-0.5 accent-blue-800"
                  />
                  <span className="text-xs text-slate-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-700 hover:underline">Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="text-blue-700 hover:underline">Privacy Policy</a>
                    {" "}(DPDP Act 2023 compliant) <span className="text-red-500">*</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.agreeComms}
                    onChange={(e) => update("agreeComms", e.target.checked)}
                    className="mt-0.5 accent-blue-800"
                  />
                  <span className="text-xs text-slate-600">
                    Send me booking confirmations and venue updates via SMS/email
                  </span>
                </label>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-800 text-white font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {loading ? "Creating Account…" : "Create Account"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
