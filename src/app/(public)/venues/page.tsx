"use client";
import React, { useState, useMemo, useRef, useEffect, Suspense, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search, MapPin, Star, Zap, X,
  Grid3X3, List, ChevronRight, SlidersHorizontal,
  CheckCircle2, ArrowRight, Sparkles, Sliders,
  Building2, Trophy, Waves, Dumbbell, Wind, Activity,
} from "lucide-react";
import { MOCK_VENUES } from "@/lib/mock-data";
import { gradeColor, gradeLabel, cn, getSportEmoji } from "@/lib/utils";
import { useVIMSStore } from "@/hooks/useVIMSStore";
import { useInView, staggerStyle } from "@/hooks/useScrollAnimation";
import { useLanguage } from "@/context/LanguageContext";
import { TiltCard } from "@/components/ui/tilt-card";
import { useSound } from "@/hooks/useSound";
import { VenueCarousel } from "@/components/ui/venue-carousel";
import { getVenueImages } from "@/lib/venue-images";

const SPORT_PILLS = [
  { label: "All",        emoji: "🏅", key: "All",        color: "bg-slate-100 text-slate-700 border-slate-200"         },
  { label: "Cricket",    emoji: "🏏", key: "Cricket",    color: "bg-green-50 text-green-700 border-green-200"          },
  { label: "Football",   emoji: "⚽", key: "Football",   color: "bg-emerald-50 text-emerald-700 border-emerald-200"    },
  { label: "Swimming",   emoji: "🏊", key: "Swimming",   color: "bg-sky-50 text-sky-700 border-sky-200"                },
  { label: "Badminton",  emoji: "🏸", key: "Badminton",  color: "bg-violet-50 text-violet-700 border-violet-200"       },
  { label: "Athletics",  emoji: "🏃", key: "Athletics",  color: "bg-orange-50 text-orange-700 border-orange-200"       },
  { label: "Basketball", emoji: "🏀", key: "Basketball", color: "bg-amber-50 text-amber-700 border-amber-200"          },
  { label: "Kabaddi",    emoji: "🤼", key: "Kabaddi",    color: "bg-rose-50 text-rose-700 border-rose-200"             },
  { label: "Volleyball", emoji: "🏐", key: "Volleyball", color: "bg-teal-50 text-teal-700 border-teal-200"             },
];

const STATES = [
  "All States",
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu",
  "Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman & Nicobar","Chandigarh","Delhi","Jammu & Kashmir","Ladakh",
  "Lakshadweep","Puducherry",
];
const SORT_OPTS = ["Relevance","Rating: High to Low","Price: Low to High","Newest First"];

function minPrice(venue: (typeof MOCK_VENUES)[0]) {
  if (!venue.subVenues.length) return 0;
  return Math.min(...venue.subVenues.map((sv) => sv.baseRatePaise));
}

function sportGradient(sport: string) {
  const map: Record<string, string> = {
    Cricket:    "from-green-600  via-green-500    to-emerald-500",
    Swimming:   "from-sky-600    via-blue-500     to-cyan-500",
    Badminton:  "from-violet-600 via-purple-500   to-purple-400",
    Football:   "from-emerald-700 via-green-600   to-lime-500",
    Athletics:  "from-orange-600 via-amber-500    to-yellow-400",
    Basketball: "from-orange-700 via-red-600      to-orange-500",
    Volleyball: "from-teal-600   via-teal-500     to-cyan-400",
    Tennis:     "from-lime-600   via-green-500    to-teal-400",
    Kabaddi:    "from-rose-700   via-red-600      to-rose-500",
    Wrestling:  "from-amber-700  via-orange-600   to-red-500",
  };
  return map[sport] ?? "from-blue-700 via-blue-600 to-indigo-500";
}

/* ── VenueCard with pocket-animation trigger ─────────────────── */
function VenueCard({ venue, payplay }: { venue: (typeof MOCK_VENUES)[0]; payplay: boolean }) {
  const price = minPrice(venue);
  const { playCardReveal, playHover } = useSound();
  const [pressing, setPressing] = useState(false);
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setPressing(true);
    playCardReveal();
    setTimeout(() => {
      router.push(`/venues/${venue.id}`);
    }, 220);
  }, [playCardReveal, router, venue.id]);

  return (
    <TiltCard intensity={8} scale={1.02} className="group block">
      <div
        onClick={handleClick}
        onMouseEnter={playHover}
        className={cn(
          "bg-white border border-slate-200/80 rounded-2xl overflow-hidden cursor-pointer",
          "shadow-sm hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 relative",
          pressing && "animate-card-press"
        )}
      >
        <div className="shimmer-overlay" />
        {/* Hero image carousel */}
        {(() => {
          const imgs = getVenueImages(venue.id, venue.images ?? []);
          return imgs.length > 0 ? (
            <VenueCarousel images={imgs} className="h-44 bg-slate-900">
              <div className="absolute inset-0 flex items-end p-4 z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-2xl drop-shadow-lg">{getSportEmoji(venue.primarySport)}</span>
                  {venue.supportedSports.filter((s) => s !== venue.primarySport).slice(0, 2).map((s) => (
                    <span key={s} className="bg-black/30 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm bg-black/30 text-white border-white/30">
                  Grade {gradeLabel(venue.grade)}
                </span>
              </div>
              {payplay && (
                <div className="absolute top-3 right-10 z-10">
                  <span className="flex items-center gap-1 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-purple-500/40">
                    <Zap className="h-2.5 w-2.5" /> Instant
                  </span>
                </div>
              )}
            </VenueCarousel>
          ) : (
            <div className={cn("relative h-44 overflow-hidden", cn("bg-gradient-to-br", sportGradient(venue.primarySport)))}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-30 select-none">{getSportEmoji(venue.primarySport)}</span>
              </div>
            </div>
          );
        })()}

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
              {venue.nameEn}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-1.5 py-0.5">
              <Star className="h-3 w-3 text-amber-500 fill-current" />
              <span className="text-xs font-bold text-amber-700">{venue.communityRating}</span>
            </div>
          </div>
          <div className="flex items-center justify-between gap-1 mb-3">
            <div className="flex items-center gap-1 text-xs text-slate-400 min-w-0">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{venue.fullAddress.split(",").slice(-2).join(",").trim()}</span>
            </div>
            <a
              href={`https://maps.google.com?q=${venue.coordinates.lat},${venue.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 text-[10px] text-blue-500 hover:text-blue-700 font-semibold whitespace-nowrap hover:underline"
            >
              Map ↗
            </a>
          </div>
          <div className="flex gap-1.5 flex-wrap mb-3">
            <span className="text-[11px] font-semibold px-2 py-0.5 chip-blue rounded-md">{venue.primarySport}</span>
            {venue.supportedSports.filter((s) => s !== venue.primarySport).slice(0, 1).map((s) => (
              <span key={s} className="text-[11px] px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-md">{s}</span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              {price > 0 ? (
                <div>
                  <span className="text-base font-black text-slate-900">₹{(price / 100).toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400">/hr</span>
                </div>
              ) : (
                <span className="text-xs text-slate-400">Contact for pricing</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
              View details <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

function VenueListRow({ venue, payplay }: { venue: (typeof MOCK_VENUES)[0]; payplay: boolean }) {
  const price = minPrice(venue);
  const { playCardReveal } = useSound();
  const router = useRouter();

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    playCardReveal();
    setTimeout(() => router.push(`/venues/${venue.id}`), 180);
  }, [playCardReveal, router, venue.id]);

  return (
    <div onClick={handleClick} className="group block cursor-pointer">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex gap-4 card-hover shadow-sm">
        <div className={cn("rounded-xl w-16 h-16 shrink-0 bg-gradient-to-br flex items-center justify-center text-2xl", sportGradient(venue.primarySport))}>
          {getSportEmoji(venue.primarySport)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors truncate">{venue.nameEn}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
              <span className="text-sm font-bold text-amber-700">{venue.communityRating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400 mb-2">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{venue.fullAddress}</span>
            <a
              href={`https://maps.google.com?q=${venue.coordinates.lat},${venue.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="shrink-0 text-[10px] text-blue-500 hover:text-blue-700 font-semibold whitespace-nowrap hover:underline ml-1"
            >
              Map ↗
            </a>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 chip-blue rounded-md">{venue.primarySport}</span>
            {payplay && (
              <span className="text-[11px] font-semibold px-2 py-0.5 chip-purple rounded-md flex items-center gap-1">
                <Zap className="h-2.5 w-2.5" /> Pay & Play
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0">
          {price > 0 && (
            <div className="text-right">
              <div className="font-black text-slate-900">₹{(price / 100).toLocaleString("en-IN")}</div>
              <div className="text-xs text-slate-400">per hour</div>
            </div>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:text-blue-700">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Premium Filter Sidebar ──────────────────────────────────── */
function FilterSidebar({
  payplayOnly, setPayplayOnly,
  activeSport, setActiveSport,
  indoorFilter, setIndoorFilter,
  district, setDistrict,
  onReset,
}: {
  payplayOnly: boolean; setPayplayOnly: (v: boolean) => void;
  activeSport: string; setActiveSport: (v: string) => void;
  indoorFilter: "all"|"INDOOR"|"OUTDOOR"; setIndoorFilter: (v: "all"|"INDOOR"|"OUTDOOR") => void;
  district: string; setDistrict: (v: string) => void;
  onReset: () => void;
}) {
  const router = useRouter();
  const { playClick } = useSound();

  const handlePayPlayToggle = () => {
    playClick();
    if (payplayOnly) {
      router.push("/venues");
    } else {
      router.push("/venues?filter=payplay");
    }
  };

  return (
    <div className="relative animate-filter-in">
      {/* Glassmorphism container */}
      <div className="rounded-3xl overflow-hidden sticky top-20"
        style={{
          background: "linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,255,0.98) 100%)",
          border: "1px solid rgba(255,255,255,0.9)",
          boxShadow: "0 8px 32px rgba(99,102,241,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)",
        }}
      >
        {/* Decorative gradient top band */}
        <div className="h-1 bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />

        <div className="p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Sliders className="h-4 w-4 text-white" />
              </div>
              <span className="font-black text-slate-800 text-sm tracking-tight">Smart Filters</span>
            </div>
            <button
              onClick={() => { onReset(); playClick(); }}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-colors"
            >
              Reset all
            </button>
          </div>

          {/* Pay & Play — Premium redirect card */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Instant Booking</p>
            <button
              onClick={handlePayPlayToggle}
              className={cn(
                "w-full rounded-2xl p-4 transition-all duration-400 text-left border-2",
                payplayOnly
                  ? "bg-gradient-to-br from-violet-600 to-purple-700 border-violet-400 shadow-xl shadow-violet-500/30 text-white"
                  : "bg-white border-slate-200 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/10"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={cn("flex items-center gap-2", payplayOnly ? "text-white" : "text-slate-800")}>
                  <div className={cn("h-7 w-7 rounded-xl flex items-center justify-center", payplayOnly ? "bg-white/20" : "bg-violet-100")}>
                    <Zap className={cn("h-3.5 w-3.5", payplayOnly ? "text-white" : "text-violet-600")} />
                  </div>
                  <span className="text-sm font-bold">Pay & Play</span>
                </div>
                {/* Toggle pill */}
                <div className={cn(
                  "relative h-5 w-9 rounded-full transition-colors duration-300",
                  payplayOnly ? "bg-white/30" : "bg-slate-200"
                )}>
                  <div className={cn(
                    "absolute top-0.5 h-4 w-4 rounded-full shadow transition-all duration-300",
                    payplayOnly ? "translate-x-4 bg-white" : "translate-x-0.5 bg-slate-400"
                  )} />
                </div>
              </div>
              <p className={cn("text-[11px] leading-snug", payplayOnly ? "text-purple-200" : "text-slate-500")}>
                {payplayOnly ? "Showing instant-booking venues only →" : "Book instantly, pay online, play today"}
              </p>
            </button>
          </div>

          {/* Sport filter */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Sport</p>
            <div className="grid grid-cols-2 gap-1.5">
              {SPORT_PILLS.slice(0, 8).map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setActiveSport(s.key); playClick(); }}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200",
                    activeSport === s.key
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-md shadow-blue-500/20"
                      : `${s.color} hover:scale-[1.03]`
                  )}
                >
                  <span className="text-base leading-none">{s.emoji}</span>
                  <span className="truncate">{s.label}</span>
                </button>
              ))}
            </div>
            {activeSport !== "All" && (
              <button onClick={() => { setActiveSport("All"); playClick(); }} className="mt-2 flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-700">
                <X className="h-3 w-3" /> Clear sport filter
              </button>
            )}
          </div>

          {/* Venue type */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">Venue Type</p>
            <div className="flex gap-1.5">
              {(["all", "INDOOR", "OUTDOOR"] as const).map((v) => {
                const icons = { all: <Building2 className="h-3 w-3" />, INDOOR: <Wind className="h-3 w-3" />, OUTDOOR: <Activity className="h-3 w-3" /> };
                const labels = { all: "All", INDOOR: "Indoor", OUTDOOR: "Outdoor" };
                return (
                  <button
                    key={v}
                    onClick={() => { setIndoorFilter(v); playClick(); }}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1 py-2 rounded-xl text-xs font-semibold border transition-all duration-200",
                      indoorFilter === v
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:border-blue-200 hover:text-blue-600"
                    )}
                  >
                    {icons[v]} {labels[v]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* State */}
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2.5">State / UT</p>
            <select
              value={district}
              onChange={(e) => { setDistrict(e.target.value); playClick(); }}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 shadow-sm hover:border-slate-300 transition-all"
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Active filter count indicator */}
          {(activeSport !== "All" || indoorFilter !== "all" || district !== "All States") && (
            <div className="rounded-xl bg-indigo-50 border border-indigo-100 px-3 py-2 flex items-center justify-between">
              <span className="text-xs text-indigo-700 font-semibold">
                {[activeSport !== "All", indoorFilter !== "all", district !== "All States"].filter(Boolean).length} filter{[activeSport !== "All", indoorFilter !== "all", district !== "All States"].filter(Boolean).length > 1 ? "s" : ""} active
              </span>
              <button onClick={() => { onReset(); playClick(); }} className="text-[11px] text-indigo-500 hover:text-indigo-700 font-semibold">
                Clear
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Main page inner ─────────────────────────────────────────── */
function VenuesPageInner() {
  const searchParams  = useSearchParams();
  const urlFilter     = searchParams.get("filter");
  const router        = useRouter();

  const store = useVIMSStore();
  const { t } = useLanguage();
  const { ref: gridRef, inView: gridInView } = useInView(0.05);
  const { playClick, playHover, playCardReveal } = useSound();

  const [search,       setSearch]       = useState("");
  const [activeSport,  setActiveSport]  = useState("All");
  const [district,     setDistrict]     = useState("All States");
  const [payplayOnly,  setPayplayOnly]  = useState(urlFilter === "payplay");
  const [indoorFilter, setIndoorFilter] = useState<"all"|"INDOOR"|"OUTDOOR">("all");
  const [sort,         setSort]         = useState("Relevance");
  const [view,         setView]         = useState<"grid"|"list">("grid");
  const [filtersOpen,  setFiltersOpen]  = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPayplayOnly(urlFilter === "payplay"); }, [urlFilter]);

  const venues = useMemo(() => {
    let list = MOCK_VENUES.filter((v) => v.lifecycleState === "ACTIVE");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((v) =>
        v.nameEn.toLowerCase().includes(q) ||
        v.primarySport.toLowerCase().includes(q) ||
        v.lgdDistrictCode.toLowerCase().includes(q) ||
        v.fullAddress.toLowerCase().includes(q)
      );
    }
    if (activeSport !== "All") list = list.filter((v) => v.primarySport === activeSport || v.supportedSports.includes(activeSport));
    if (district !== "All States") list = list.filter((v) => v.fullAddress.toLowerCase().includes(district.toLowerCase()));
    if (payplayOnly) list = list.filter((v) => store.payplayStates[v.id] ?? v.payplayEnabled);
    if (indoorFilter !== "all") list = list.filter((v) => v.indoorOutdoor === indoorFilter);
    if (sort === "Rating: High to Low") list = [...list].sort((a, b) => b.communityRating - a.communityRating);
    if (sort === "Price: Low to High")  list = [...list].sort((a, b) => minPrice(a) - minPrice(b));
    return list;
  }, [search, activeSport, district, payplayOnly, indoorFilter, sort, store.payplayStates]);

  const ppCount       = MOCK_VENUES.filter((v) => store.payplayStates[v.id] ?? v.payplayEnabled).length;
  const isPayPlayMode = urlFilter === "payplay";

  const handleReset = () => {
    setActiveSport("All");
    setDistrict("All States");
    setPayplayOnly(false);
    setIndoorFilter("all");
    setSearch("");
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">

      {/* Pay & Play banner */}
      {isPayPlayMode && (
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-12 px-4">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
          <div className="orb orb-purple w-[400px] h-[400px] top-[-100%] right-[-5%] opacity-40" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 text-purple-100 text-xs font-bold px-4 py-2 rounded-full mb-4 animate-fade-up">
              <Zap className="h-3.5 w-3.5" /> Instant Booking Available
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ animation: "fadeSlideUp 0.5s ease-out 0.1s both" }}>
              Pay &amp; Play Venues
            </h1>
            <p className="text-purple-100 text-lg" style={{ animation: "fadeSlideUp 0.5s ease-out 0.2s both" }}>
              Book instantly, pay online, play today
            </p>
            <div className="flex items-center justify-center gap-8 mt-5 text-sm" style={{ animation: "fadeSlideUp 0.5s ease-out 0.3s both" }}>
              {["Instant confirmation","Online payment","No paperwork"].map((f) => (
                <span key={f} className="flex items-center gap-2 text-white/90">
                  <CheckCircle2 className="h-4 w-4 text-purple-200" /> {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      {!isPayPlayMode && (
        <div className="relative overflow-hidden mesh-hero">
          <div className="orb orb-blue   w-[600px] h-[600px] top-[-30%] right-[-5%] animate-float-slow" />
          <div className="orb orb-gold   w-[350px] h-[350px] bottom-[-20%] left-[-5%] animate-float" style={{ animationDelay: "3s" }} />
          <div className="orb orb-purple w-[250px] h-[250px] top-[20%] right-[35%] animate-float-slow" style={{ animationDelay: "6s" }} />

          <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-24">
            <div className="text-center mb-10 animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold px-4 py-2 rounded-full mb-5">
                <Sparkles className="h-3.5 w-3.5" /> {t("hero_badge")}
              </div>
              <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-[1.0] text-slate-900">
                {t("hero_title").split("India")[0]}<span className="gradient-text-gold">India</span>
              </h1>
              <p className="text-slate-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">{t("hero_subtitle")}</p>
            </div>

            <div className="relative max-w-2xl mx-auto mb-8" style={{ animation: "fadeSlideUp 0.6s ease-out 0.15s both" }}>
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("hero_search")}
                className="w-full pl-14 pr-12 py-4 rounded-2xl bg-white border border-slate-200 text-slate-900 text-base placeholder:text-slate-400 shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 px-2 scrollbar-hide justify-start lg:justify-center" style={{ animation: "fadeSlideUp 0.6s ease-out 0.25s both" }}>
              {SPORT_PILLS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => { setActiveSport(s.key); playClick(); }}
                  onMouseEnter={playHover}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border flex-shrink-0",
                    activeSport === s.key
                      ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/25"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                  )}
                >
                  <span>{s.emoji}</span>{s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats strip */}
      <div className={cn("border-y", isPayPlayMode ? "bg-purple-50 border-purple-200" : "bg-orange-50 border-orange-100")}>
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex flex-wrap items-center justify-center gap-x-8 gap-y-1">
          {[
            { v: "8,500+", l: t("stat_total_venues") },
            { v: "36",     l: t("stat_districts") },
            { v: ppCount.toString(), l: t("stat_payplay") },
            { v: "9",     l: t("stat_sports") },
          ].map((s) => (
            <span key={s.l} className="flex items-center gap-1.5 text-sm font-medium">
              <span className={cn("font-black text-base", isPayPlayMode ? "text-purple-700" : "text-orange-600")}>{s.v}</span>
              <span className="text-slate-500">{s.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">

          {/* Mobile filter overlay */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
                onClick={() => setFiltersOpen(false)}
              />
              <div className="absolute left-0 top-0 h-full w-72 max-w-[88vw] bg-white shadow-2xl overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10">
                  <span className="font-bold text-slate-900 text-sm">Filters</span>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <div className="p-4">
                  <FilterSidebar
                    payplayOnly={payplayOnly} setPayplayOnly={setPayplayOnly}
                    activeSport={activeSport} setActiveSport={setActiveSport}
                    indoorFilter={indoorFilter} setIndoorFilter={setIndoorFilter}
                    district={district} setDistrict={setDistrict}
                    onReset={handleReset}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block shrink-0 w-60">
            <FilterSidebar
              payplayOnly={payplayOnly} setPayplayOnly={setPayplayOnly}
              activeSport={activeSport} setActiveSport={setActiveSport}
              indoorFilter={indoorFilter} setIndoorFilter={setIndoorFilter}
              district={district} setDistrict={setDistrict}
              onReset={handleReset}
            />
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-sm font-medium text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <p className="text-sm text-slate-500">
                  <span className="text-slate-900 font-bold">{venues.length}</span>{" "}
                  {t("venues_found")}
                  {activeSport !== "All" && <span className="ml-1.5 text-blue-600 font-semibold">· {activeSport}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 shadow-sm"
                >
                  {SORT_OPTS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                  {(["grid","list"] as const).map((v) => (
                    <button
                      key={v}
                      onClick={() => { setView(v); playClick(); }}
                      className={cn("p-2 transition-colors", view === v ? "bg-blue-600 text-white" : "bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-700")}
                    >
                      {v === "grid" ? <Grid3X3 className="h-4 w-4" /> : <List className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {venues.length === 0 ? (
              <div className="text-center py-24 bg-white border border-dashed border-slate-300 rounded-2xl">
                <div className="text-5xl mb-3">🏟️</div>
                <h3 className="font-bold text-slate-800 mb-2">No venues match your filters</h3>
                <p className="text-slate-400 text-sm">Try adjusting or resetting filters</p>
              </div>
            ) : view === "grid" ? (
              <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {venues.map((venue, idx) => (
                  <div key={venue.id} style={staggerStyle(idx, gridInView, 70)}>
                    <VenueCard venue={venue} payplay={store.payplayStates[venue.id] ?? venue.payplayEnabled} />
                  </div>
                ))}
              </div>
            ) : (
              <div ref={gridRef} className="space-y-3">
                {venues.map((venue, idx) => (
                  <div key={venue.id} style={staggerStyle(idx, gridInView, 60)}>
                    <VenueListRow venue={venue} payplay={store.payplayStates[venue.id] ?? venue.payplayEnabled} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublicVenuesPage() {
  return (
    <Suspense>
      <VenuesPageInner />
    </Suspense>
  );
}
