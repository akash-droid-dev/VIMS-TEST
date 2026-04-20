"use client";
import React from "react";
import Link from "next/link";
import {
  Trophy, Shield, Globe, Users, MapPin, Zap, CheckCircle2,
  ArrowRight, ChevronRight, Star, Building2, BarChart3,
  Heart, Phone, Mail, FileText, Sparkles, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView, staggerStyle, fadeInStyle } from "@/hooks/useScrollAnimation";

const COVERAGE = [
  { name: "Maharashtra", venues: 412, payplay: 98 },
  { name: "Delhi NCR",   venues: 156, payplay: 87 },
  { name: "Gujarat",     venues: 234, payplay: 78 },
  { name: "Karnataka",   venues: 198, payplay: 64 },
  { name: "Tamil Nadu",  venues: 223, payplay: 71 },
  { name: "Rajasthan",   venues: 178, payplay: 53 },
  { name: "West Bengal", venues: 167, payplay: 49 },
  { name: "Telangana",   venues: 143, payplay: 41 },
];

const FEATURES = [
  {
    icon: Building2,
    title: "8,500+ Venues Mapped",
    desc: "Every government-managed sports venue across all 36 states & UTs, verified via KYV (Know Your Venue) field survey.",
    color: "bg-blue-50 text-blue-800",
  },
  {
    icon: Zap,
    title: "Pay & Play — Instant Booking",
    desc: "Citizens can book a slot at any Pay & Play enabled venue instantly — no paperwork, no waiting, just play.",
    color: "bg-purple-50 text-purple-800",
  },
  {
    icon: Shield,
    title: "GIGW 3.0 & DPDP Compliant",
    desc: "Built to Government of India web guidelines. Full DPDP Act 2023 data privacy compliance. RPwD-accessible design.",
    color: "bg-green-50 text-green-800",
  },
  {
    icon: Globe,
    title: "Multilingual — EN / हि / Regional",
    desc: "Full interface available in English, Hindi, and major regional languages. Every citizen of India can access the platform.",
    color: "bg-orange-50 text-orange-800",
  },
  {
    icon: BarChart3,
    title: "Real-Time Admin Dashboard",
    desc: "DSOs, SPOCs, and Commissionerate officers have live dashboards for venue approval, booking management, and revenue.",
    color: "bg-rose-50 text-rose-800",
  },
  {
    icon: Lock,
    title: "Aadhaar-Linked Identity",
    desc: "Citizen registration uses Aadhaar OTP verification. All bookings are tied to verified identities for accountability.",
    color: "bg-indigo-50 text-indigo-800",
  },
];

const TEAM = [
  { name: "Sports Authority of India",   role: "Platform Owner & Operator", icon: Trophy },
  { name: "Ministry of Youth Affairs & Sports", role: "Policy & Oversight", icon: Shield },
  { name: "NIC India",                   role: "Technology Partner",        icon: Globe },
  { name: "District Sports Officers",    role: "Ground Operations",         icon: Users },
];

export default function AboutPage() {
  const { ref: heroRef, inView: heroIn } = useInView(0.1);
  const { ref: statsRef, inView: statsIn } = useInView(0.1);
  const { ref: missionRef, inView: missionIn } = useInView(0.1);
  const { ref: featRef, inView: featIn } = useInView(0.08);
  const { ref: distRef, inView: distIn } = useInView(0.08);
  const { ref: teamRef, inView: teamIn } = useInView(0.1);
  const { ref: ctaRef, inView: ctaIn } = useInView(0.1);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-blue-950 via-slate-900 to-orange-950 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div ref={heroRef} className="relative max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
          <div style={fadeInStyle(heroIn, 0)} className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="h-3 w-3" /> Government of India · Ministry of Youth Affairs & Sports
          </div>
          <h1 style={fadeInStyle(heroIn, 100)} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-5 leading-tight">
            India&apos;s Official<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Sports Venue Platform
            </span>
          </h1>
          <p style={fadeInStyle(heroIn, 200)} className="text-blue-200 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            VIMS — the India Venue &amp; Infrastructure Management System — is the Government of India's unified digital platform for discovering, booking, and managing all government-owned sports venues across 36 states &amp; UTs.
          </p>
          <div style={fadeInStyle(heroIn, 300)} className="flex flex-wrap justify-center gap-4 mt-8">
            <Link href="/venues" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5">
              Explore Venues <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all">
              Register as Citizen <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="bg-orange-500 text-white">
        <div ref={statsRef} className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { n: "8,500+", l: "Total Venues",      sub: "Across India" },
              { n: "36",     l: "States & UTs",       sub: "100% coverage" },
              { n: "1,800+", l: "Pay & Play Venues",  sub: "Instant booking" },
              { n: "40+",    l: "Sports Disciplines", sub: "Olympic to grassroots" },
            ].map((s, idx) => (
              <div key={s.l} style={staggerStyle(idx, statsIn, 80)} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-0.5">{s.n}</div>
                <div className="text-sm font-semibold text-orange-100">{s.l}</div>
                <div className="text-xs text-orange-200 mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mission ───────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div ref={missionRef} className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div style={fadeInStyle(missionIn, 0)}>
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                <Trophy className="h-3 w-3" /> Our Mission
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-5 leading-tight">
                Making Sports<br />Accessible to Every<br />
                <span className="text-blue-800">Indian Citizen</span>
              </h2>
              <p className="text-slate-600 text-base leading-relaxed mb-4">
                I-VIMS was conceived under the Ministry of Youth Affairs &amp; Sports, Government of India, to solve a fundamental challenge: India has over 8,500 sports venues, but citizens had no unified way to discover, access, or book them.
              </p>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                Today, I-VIMS connects citizens, district sports officers, venue managers, and government administrators on a single transparent platform — from a ₹80/hr swimming slot in Surat to the iconic Eden Gardens in Kolkata.
              </p>
              <div className="space-y-3">
                {[
                  "Transparent booking process with full audit trail",
                  "SLA-bound approval workflows for all booking tracks",
                  "Real-time compliance monitoring and KYV alerts",
                  "Aadhaar-verified citizen identity across India",
                ].map((point) => (
                  <div key={point} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
            </div>
            <div style={fadeInStyle(missionIn, 150)} className="space-y-4">
              {[
                { label: "Phase 1A", desc: "Venue mapping + KYV registration for all 8,500+ venues nationwide", done: true },
                { label: "Phase 1B", desc: "Pay & Play enablement — citizen slot booking across all 36 states & UTs", done: true },
                { label: "Phase 2",  desc: "Mobile app for field officers + GPS-based venue verification nationwide", done: false },
                { label: "Phase 3",  desc: "Integration with SAI athlete registry, Khelo India, and NSRS portal", done: false },
              ].map((phase) => (
                <div key={phase.label} className={cn("p-4 rounded-xl border", phase.done ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200")}>
                  <div className="flex items-center gap-2 mb-1">
                    {phase.done
                      ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      : <div className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />
                    }
                    <span className={cn("text-sm font-bold", phase.done ? "text-green-800" : "text-slate-500")}>{phase.label}</span>
                    {phase.done && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium ml-auto">Live</span>}
                  </div>
                  <p className="text-xs text-slate-600 ml-6">{phase.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Key Features ──────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div ref={featRef}>
          <div style={fadeInStyle(featIn)} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Platform Capabilities</h2>
            <p className="text-slate-500">Built on open government standards with citizen-first design</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((feat, idx) => (
              <div
                key={feat.title}
                style={staggerStyle(idx, featIn, 70)}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4", feat.color)}>
                  <feat.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── State Coverage ────────────────────────────────────── */}
      <div className="bg-white border-t border-b border-slate-200">
        <div ref={distRef} className="max-w-6xl mx-auto px-4 py-16">
          <div style={fadeInStyle(distIn)} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">State Coverage</h2>
            <p className="text-slate-500">Top states by venue count and Pay &amp; Play availability</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COVERAGE.map((d, idx) => (
              <div
                key={d.name}
                style={staggerStyle(idx, distIn, 60)}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md transition-all hover:border-blue-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-800" />
                    <span className="font-bold text-slate-900 text-sm">{d.name}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Total Venues</span>
                    <span className="font-bold text-slate-900">{d.venues}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: distIn ? `${(d.venues / 412) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-purple-600" />Pay &amp; Play</span>
                    <span className="font-bold text-purple-700">{d.payplay}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={fadeInStyle(distIn, 200)} className="text-center mt-6">
            <Link href="/venues" className="inline-flex items-center gap-1.5 text-sm text-blue-700 font-medium hover:underline">
              View all 36 states &amp; UTs <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stakeholders ──────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 py-16">
        <div ref={teamRef}>
          <div style={fadeInStyle(teamIn)} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Platform Stakeholders</h2>
            <p className="text-slate-500">I-VIMS is a collaboration across central and state government departments</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {TEAM.map((t, idx) => (
              <div key={t.name} style={staggerStyle(idx, teamIn, 80)} className="bg-white rounded-xl border border-slate-200 p-5 text-center hover:shadow-md transition-all">
                <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center mx-auto mb-3">
                  <t.icon className="h-6 w-6 text-blue-800" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-0.5">{t.name}</h3>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div style={fadeInStyle(teamIn, 200)} className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-900 text-base mb-4">Get in Touch</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: Phone, label: "Helpline",      value: "1800-110-0025",          sub: "Mon–Sat, 9am–6pm IST" },
                { icon: Mail, label: "Email Support",  value: "support@ivims.sai.gov.in", sub: "Response within 48 hours" },
                { icon: FileText, label: "RTI Portal", value: "rtionline.gov.in",        sub: "Right to Information" },
              ].map((c) => (
                <div key={c.label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50">
                  <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                    <c.icon className="h-4 w-4 text-blue-800" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">{c.label}</p>
                    <p className="text-sm font-semibold text-slate-900">{c.value}</p>
                    <p className="text-xs text-slate-400">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white">
        <div ref={ctaRef} className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div style={staggerStyle(0, ctaIn)} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-5">
            <Heart className="h-3 w-3 text-orange-400" /> India Sports, One Platform
          </div>
          <h2 style={staggerStyle(1, ctaIn)} className="text-3xl md:text-4xl font-extrabold mb-4">
            Start Exploring Today
          </h2>
          <p style={staggerStyle(2, ctaIn)} className="text-blue-200 text-base mb-8 max-w-xl mx-auto">
            8,500+ government sports venues. 36 states &amp; UTs. One platform. Free citizen registration.
          </p>
          <div style={staggerStyle(3, ctaIn)} className="flex flex-wrap gap-4 justify-center">
            <Link href="/venues" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5">
              Browse All Venues <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all">
              Create Free Account <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
