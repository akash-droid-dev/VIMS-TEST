"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays, MapPin, Users, Trophy, Zap, ArrowRight,
  ChevronRight, Clock, CheckCircle2, Building2,
  Search, Sparkles, Globe, Shield
} from "lucide-react";
import { cn, getSportEmoji } from "@/lib/utils";
import { useInView, staggerStyle, fadeInStyle } from "@/hooks/useScrollAnimation";

const TRACKS = [
  {
    key: "GOVERNMENT",
    label: "Government Events",
    icon: Shield,
    color: "from-blue-600 to-blue-800",
    badge: "bg-blue-100 text-blue-800",
    desc: "Central & state government sponsored events, national championships, and SAI programmes",
    sla: "14 working days",
    examples: ["Khelo India Games", "National Athletics Championship", "SAI Selection Trials"],
  },
  {
    key: "FEDERATION",
    label: "Federation Events",
    icon: Trophy,
    color: "from-purple-600 to-purple-800",
    badge: "bg-purple-100 text-purple-800",
    desc: "Registered national and state sports federation tournaments and ranking competitions",
    sla: "7 working days",
    examples: ["BCCI Domestic Matches", "Hockey India League", "Federation Ranking Events"],
  },
  {
    key: "COMMERCIAL",
    label: "Commercial Events",
    icon: Building2,
    color: "from-orange-500 to-orange-700",
    badge: "bg-orange-100 text-orange-800",
    desc: "Corporate events, IPL/franchise matches, private tournaments and sports festivals",
    sla: "48 hours",
    examples: ["IPL Pre-Season Training", "Corporate Cricket League", "Sports Festivals"],
  },
  {
    key: "PAY_AND_PLAY",
    label: "Pay & Play",
    icon: Zap,
    color: "from-green-500 to-emerald-700",
    badge: "bg-green-100 text-green-800",
    desc: "Instant citizen bookings for individual or small group sessions at any enabled venue",
    sla: "Instant",
    examples: ["Swimming Sessions", "Badminton Courts", "Athletics Track Time"],
  },
];

const UPCOMING_EVENTS = [
  {
    id: "EVT-001",
    title: "Khelo India Youth Games 2026",
    venue: "Jawaharlal Nehru Stadium, New Delhi",
    date: "22–30 Apr 2026",
    sport: "Athletics",
    track: "GOVERNMENT",
    participants: 5000,
    status: "APPROVED",
    state: "Delhi",
  },
  {
    id: "EVT-002",
    title: "National Badminton Championship",
    venue: "Kanteerava Indoor Stadium, Bengaluru",
    date: "18–22 Apr 2026",
    sport: "Badminton",
    track: "FEDERATION",
    participants: 640,
    status: "APPROVED",
    state: "Karnataka",
  },
  {
    id: "EVT-003",
    title: "Mumbai Triathlon 2026",
    venue: "Wankhede Stadium Grounds, Mumbai",
    date: "20 Apr 2026",
    sport: "Swimming",
    track: "COMMERCIAL",
    participants: 800,
    status: "UNDER_REVIEW",
    state: "Maharashtra",
  },
  {
    id: "EVT-004",
    title: "Hockey India Sub-Junior Nationals",
    venue: "Major Dhyan Chand Stadium, Delhi",
    date: "14–20 Apr 2026",
    sport: "Football",
    track: "FEDERATION",
    participants: 320,
    status: "APPROVED",
    state: "Delhi",
  },
  {
    id: "EVT-005",
    title: "SAI Selection Trials — Kabaddi",
    venue: "SAG Complex, Gandhinagar",
    date: "28 Apr 2026",
    sport: "Kabaddi",
    track: "GOVERNMENT",
    participants: 240,
    status: "APPROVED",
    state: "Gujarat",
  },
  {
    id: "EVT-006",
    title: "IPL 2026 Training Camp — RCB",
    venue: "M. Chinnaswamy Stadium, Bengaluru",
    date: "2–5 May 2026",
    sport: "Cricket",
    track: "COMMERCIAL",
    participants: 50,
    status: "APPROVED",
    state: "Karnataka",
  },
  {
    id: "EVT-007",
    title: "Bengal Ranji Practice Camp",
    venue: "Eden Gardens, Kolkata",
    date: "10–14 May 2026",
    sport: "Cricket",
    track: "FEDERATION",
    participants: 80,
    status: "UNDER_REVIEW",
    state: "West Bengal",
  },
  {
    id: "EVT-008",
    title: "Tamil Nadu Athletics Open",
    venue: "MA Chidambaram Stadium, Chennai",
    date: "25 Apr 2026",
    sport: "Athletics",
    track: "GOVERNMENT",
    participants: 450,
    status: "APPROVED",
    state: "Tamil Nadu",
  },
];

const TRACK_COLOR: Record<string, string> = {
  GOVERNMENT:  "bg-blue-100 text-blue-800",
  FEDERATION:  "bg-purple-100 text-purple-800",
  COMMERCIAL:  "bg-orange-100 text-orange-800",
  PAY_AND_PLAY:"bg-green-100 text-green-800",
};
const STATUS_COLOR: Record<string, string> = {
  APPROVED:     "bg-green-100 text-green-800",
  UNDER_REVIEW: "bg-amber-100 text-amber-800",
  DRAFT:        "bg-slate-100 text-slate-600",
};

export default function EventsPage() {
  const [activeTrack, setActiveTrack] = useState("ALL");
  const [search, setSearch] = useState("");

  const { ref: heroRef, inView: heroIn } = useInView(0.1);
  const { ref: tracksRef, inView: tracksIn } = useInView(0.1);
  const { ref: eventsRef, inView: eventsIn } = useInView(0.05);
  const { ref: howRef, inView: howIn } = useInView(0.1);
  const { ref: ctaRef, inView: ctaIn } = useInView(0.1);

  const filtered = UPCOMING_EVENTS.filter((e) => {
    if (activeTrack !== "ALL" && e.track !== activeTrack) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase()) &&
        !e.venue.toLowerCase().includes(search.toLowerCase()) &&
        !e.state.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl pointer-events-none" />
        <div ref={heroRef} className="relative max-w-5xl mx-auto px-4 py-16 md:py-24 text-center">
          <div style={fadeInStyle(heroIn, 0)} className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <CalendarDays className="h-3 w-3" /> India Sports Events Platform
          </div>
          <h1 style={fadeInStyle(heroIn, 100)} className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            Discover &amp; Host<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
              Sports Events
            </span>
          </h1>
          <p style={fadeInStyle(heroIn, 200)} className="text-blue-200 text-lg max-w-2xl mx-auto mb-8">
            Government, federation, commercial and Pay &amp; Play events across 8,500+ India sports venues. Apply to host or discover events near you.
          </p>
          <div style={fadeInStyle(heroIn, 300)} className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5">
              Apply to Host Event <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/venues" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all">
              Browse Venues <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Stats */}
          <div style={fadeInStyle(heroIn, 400)} className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-white/10">
            {[
              { n: "8,500+",  l: "Venues Available" },
              { n: "4",       l: "Booking Tracks" },
              { n: "36",      l: "States & UTs" },
              { n: "Instant", l: "Pay & Play" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <div className="text-2xl font-extrabold text-white">{s.n}</div>
                <div className="text-xs text-blue-300 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Booking Tracks ────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div ref={tracksRef} className="max-w-6xl mx-auto px-4 py-14">
          <div style={fadeInStyle(tracksIn)} className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Four Ways to Book</h2>
            <p className="text-slate-500">Choose the right track for your event type</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {TRACKS.map((track, idx) => (
              <div
                key={track.key}
                style={staggerStyle(idx, tracksIn, 80)}
                className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className={cn("absolute inset-x-0 top-0 h-1 bg-gradient-to-r rounded-t-2xl", track.color)} />
                <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br text-white", track.color)}>
                  <track.icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm">{track.label}</h3>
                <p className="text-xs text-slate-500 mb-3 leading-relaxed">{track.desc}</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <Clock className="h-3 w-3 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">SLA: {track.sla}</span>
                </div>
                <ul className="space-y-1">
                  {track.examples.map((ex) => (
                    <li key={ex} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <div className="h-1 w-1 rounded-full bg-slate-300" /> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Upcoming Events ───────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div ref={eventsRef}>
          {/* Header */}
          <div style={fadeInStyle(eventsIn)} className="flex items-center justify-between flex-wrap gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1">Upcoming Events</h2>
              <p className="text-slate-500">Approved and pending events across India</p>
            </div>
            <Link href="/register" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 transition-colors">
              <CalendarDays className="h-4 w-4" /> Apply to Host
            </Link>
          </div>

          {/* Filter bar */}
          <div style={fadeInStyle(eventsIn, 100)} className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 mb-6 shadow-sm">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events, venues, or states…"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["ALL", "GOVERNMENT", "FEDERATION", "COMMERCIAL", "PAY_AND_PLAY"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTrack(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                    activeTrack === t ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-200 hover:border-blue-300"
                  )}
                >
                  {t === "ALL" ? "All" : t === "PAY_AND_PLAY" ? "Pay & Play" : t.charAt(0) + t.slice(1).toLowerCase().replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Event cards */}
          <div className="space-y-4">
            {filtered.map((event, idx) => (
              <div
                key={event.id}
                style={staggerStyle(idx, eventsIn, 70)}
                className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-200 transition-all duration-300 flex gap-4 items-start"
              >
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-2xl shrink-0">
                  {getSportEmoji(event.sport)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                    <h3 className="font-bold text-slate-900 text-base">{event.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", TRACK_COLOR[event.track])}>
                        {event.track === "PAY_AND_PLAY" ? "Pay & Play" : event.track.charAt(0) + event.track.slice(1).toLowerCase()}
                      </span>
                      <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", STATUS_COLOR[event.status])}>
                        {event.status === "UNDER_REVIEW" ? "Under Review" : event.status.charAt(0) + event.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-slate-400" />{event.venue}</span>
                    <span className="flex items-center gap-1.5"><CalendarDays className="h-3 w-3 text-slate-400" />{event.date}</span>
                    <span className="flex items-center gap-1.5"><Users className="h-3 w-3 text-slate-400" />{event.participants.toLocaleString()} participants</span>
                  </div>
                </div>
                <Link href="/register" className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                  View <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium text-slate-600">No events match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── How It Works ──────────────────────────────────────── */}
      <div className="bg-white border-t border-slate-200">
        <div ref={howRef} className="max-w-5xl mx-auto px-4 py-16">
          <div style={fadeInStyle(howIn)} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">How to Book an Event Venue</h2>
            <p className="text-slate-500">Simple 4-step process for any booking track</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "1", icon: Globe,        title: "Register",         desc: "Create your free I-VIMS citizen or organisation account with Aadhaar OTP",   color: "bg-blue-50 text-blue-800" },
              { step: "2", icon: Search,       title: "Find Venue",       desc: "Browse 8,500+ venues by sport, state, or facility type across India",         color: "bg-purple-50 text-purple-800" },
              { step: "3", icon: CalendarDays, title: "Submit Request",   desc: "Fill the booking form for your event track and preferred dates",               color: "bg-orange-50 text-orange-800" },
              { step: "4", icon: CheckCircle2, title: "Get Approved",     desc: "DSO/SPOC reviews and approves your booking with NIC e-Sign",                  color: "bg-green-50 text-green-800" },
            ].map((step, idx) => (
              <div key={step.step} style={staggerStyle(idx, howIn, 90)} className="text-center">
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-4", step.color)}>
                  <step.icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-bold text-slate-400 mb-1">STEP {step.step}</div>
                <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 text-white">
        <div ref={ctaRef} className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div style={staggerStyle(0, ctaIn)} className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
            <Sparkles className="h-3 w-3" /> Ready to host?
          </div>
          <h2 style={staggerStyle(1, ctaIn)} className="text-3xl md:text-4xl font-extrabold mb-4">
            Host Your Next Event on I-VIMS
          </h2>
          <p style={staggerStyle(2, ctaIn)} className="text-blue-200 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of organisers using India&apos;s official sports booking platform. Government rates, transparent process, real-time tracking.
          </p>
          <div style={staggerStyle(3, ctaIn)} className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-all shadow-lg hover:-translate-y-0.5">
              Register Now <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/venues" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all">
              View Venues <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
