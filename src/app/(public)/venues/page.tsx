"use client";
import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search, MapPin, Star, Zap, Filter, X,
  Grid3X3, List, ChevronRight, Clock, SlidersHorizontal,
  CheckCircle2, ArrowRight, Sparkles
} from "lucide-react";
import { MOCK_VENUES } from "@/lib/mock-data";
import { gradeColor, gradeLabel, cn, getSportEmoji } from "@/lib/utils";
import { useVIMSStore } from "@/hooks/useVIMSStore";

const SPORT_PILLS = [
  { label: "All", emoji: "🏅", key: "All" },
  { label: "Cricket", emoji: "🏏", key: "Cricket" },
  { label: "Football", emoji: "⚽", key: "Football" },
  { label: "Swimming", emoji: "🏊", key: "Swimming" },
  { label: "Badminton", emoji: "🏸", key: "Badminton" },
  { label: "Athletics", emoji: "🏃", key: "Athletics" },
  { label: "Basketball", emoji: "🏀", key: "Basketball" },
  { label: "Kabaddi", emoji: "🤼", key: "Kabaddi" },
  { label: "Volleyball", emoji: "🏐", key: "Volleyball" },
];

const DISTRICTS = ["All Districts", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"];
const SORT_OPTS = ["Relevance", "Rating: High to Low", "Price: Low to High", "Newest First"];

export default function PublicVenuesPage() {
  const store = useVIMSStore();
  const [search, setSearch] = useState("");
  const [activeSport, setActiveSport] = useState("All");
  const [district, setDistrict] = useState("All Districts");
  const [payplayOnly, setPayplayOnly] = useState(false);
  const [indoorFilter, setIndoorFilter] = useState<"all" | "INDOOR" | "OUTDOOR">("all");
  const [sort, setSort] = useState("Relevance");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

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

    if (activeSport !== "All") {
      list = list.filter(
        (v) => v.primarySport === activeSport || v.supportedSports.includes(activeSport)
      );
    }

    if (district !== "All Districts") {
      list = list.filter((v) =>
        v.fullAddress.toLowerCase().includes(district.toLowerCase())
      );
    }

    if (payplayOnly) {
      list = list.filter((v) => store.payplayStates[v.id] ?? v.payplayEnabled);
    }

    if (indoorFilter !== "all") {
      list = list.filter((v) => v.indoorOutdoor === indoorFilter);
    }

    if (sort === "Rating: High to Low") list = [...list].sort((a, b) => b.communityRating - a.communityRating);
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => minPrice(a) - minPrice(b));

    return list;
  }, [search, activeSport, district, payplayOnly, indoorFilter, sort, store.payplayStates]);

  const ppCount = MOCK_VENUES.filter((v) => store.payplayStates[v.id] ?? v.payplayEnabled).length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <div className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 py-14 md:py-20">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <Sparkles className="h-3 w-3" /> Gujarat's Official Sports Venue Platform
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3 leading-tight">
              Book Sports Venues<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                Anywhere in Gujarat
              </span>
            </h1>
            <p className="text-blue-200 text-base md:text-lg max-w-xl mx-auto">
              1,184 government-managed venues · 33 districts · instant Pay &amp; Play booking
            </p>
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 z-10" />
            <input
              ref={searchRef}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search venues, sports, or districts…"
              className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-slate-900 text-base placeholder:text-slate-400 shadow-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sport pills */}
          <div className="flex items-center gap-2 justify-center flex-wrap px-2">
            {SPORT_PILLS.map((s) => (
              <button
                key={s.key}
                onClick={() => setActiveSport(s.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border",
                  activeSport === s.key
                    ? "bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/25"
                    : "bg-white/10 border-white/20 text-white/80 hover:bg-white/20"
                )}
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stats strip ───────────────────────────────────────── */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm font-medium">
          {[
            { v: "1,184", l: "Total Venues" },
            { v: "33", l: "Districts" },
            { v: ppCount.toString(), l: "Pay & Play Enabled" },
            { v: "9", l: "Sports" },
          ].map((s) => (
            <span key={s.l} className="flex items-center gap-1.5">
              <span className="font-bold text-base">{s.v}</span>
              <span className="text-orange-100">{s.l}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filter sidebar */}
          <aside className={cn(
            "shrink-0 transition-all",
            filtersOpen ? "w-64" : "w-0 overflow-hidden",
            "lg:w-56 lg:overflow-visible"
          )}>
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-5 sticky top-24">
              <h3 className="font-bold text-slate-900 text-sm">Filters</h3>

              {/* Pay & Play */}
              <div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <div
                    onClick={() => setPayplayOnly((v) => !v)}
                    className={cn(
                      "relative h-5 w-9 rounded-full transition-colors cursor-pointer",
                      payplayOnly ? "bg-purple-600" : "bg-slate-200"
                    )}
                  >
                    <div className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
                      payplayOnly ? "translate-x-4" : "translate-x-0.5"
                    )} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-800 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-purple-600" /> Pay & Play only
                    </div>
                    <div className="text-xs text-slate-500">Instant booking</div>
                  </div>
                </label>
              </div>

              {/* Indoor/Outdoor */}
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Venue Type</p>
                <div className="space-y-1.5">
                  {[["all", "All"], ["INDOOR", "Indoor"], ["OUTDOOR", "Outdoor"]].map(([val, label]) => (
                    <label key={val} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="indoor"
                        checked={indoorFilter === val}
                        onChange={() => setIndoorFilter(val as "all" | "INDOOR" | "OUTDOOR")}
                        className="accent-blue-800"
                      />
                      <span className="text-sm text-slate-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* District */}
              <div>
                <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">District</p>
                <div className="space-y-1.5">
                  {DISTRICTS.map((d) => (
                    <label key={d} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="district"
                        checked={district === d}
                        onChange={() => setDistrict(d)}
                        className="accent-blue-800"
                      />
                      <span className="text-sm text-slate-700">{d}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <button
                onClick={() => { setActiveSport("All"); setDistrict("All Districts"); setPayplayOnly(false); setIndoorFilter("all"); setSearch(""); }}
                className="text-xs text-blue-700 hover:underline w-full text-left"
              >
                Reset all filters
              </button>
            </div>
          </aside>

          {/* Right — results */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFiltersOpen((v) => !v)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <p className="text-sm text-slate-600 font-medium">
                  <span className="text-slate-900 font-bold">{venues.length}</span> venues found
                  {activeSport !== "All" && <span className="ml-1 text-blue-700">· {activeSport}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800"
                >
                  {SORT_OPTS.map((o) => <option key={o}>{o}</option>)}
                </select>
                <div className="flex rounded-xl border border-slate-200 overflow-hidden">
                  <button
                    onClick={() => setView("grid")}
                    className={cn("p-2 transition-colors", view === "grid" ? "bg-blue-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setView("list")}
                    className={cn("p-2 transition-colors", view === "list" ? "bg-blue-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {venues.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                <div className="text-5xl mb-3">🏟️</div>
                <h3 className="font-bold text-slate-800 mb-1">No venues match your filters</h3>
                <p className="text-slate-500 text-sm">Try adjusting or resetting filters</p>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {venues.map((venue) => (
                  <VenueCard key={venue.id} venue={venue} payplay={store.payplayStates[venue.id] ?? venue.payplayEnabled} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {venues.map((venue) => (
                  <VenueListRow key={venue.id} venue={venue} payplay={store.payplayStates[venue.id] ?? venue.payplayEnabled} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function VenueCard({ venue, payplay }: { venue: (typeof MOCK_VENUES)[0]; payplay: boolean }) {
  const price = minPrice(venue);
  return (
    <Link href={`/venues/${venue.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-slate-100 transition-all duration-300 hover:-translate-y-0.5">
        {/* Image / gradient header */}
        <div className={cn("relative h-44 bg-gradient-to-br", sportGradient(venue.primarySport))}>
          <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/50 via-transparent to-transparent">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-2xl">{getSportEmoji(venue.primarySport)}</span>
              {venue.supportedSports.filter((s) => s !== venue.primarySport).slice(0, 2).map((s) => (
                <span key={s} className="bg-white/20 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white/30">
                  {s}
                </span>
              ))}
            </div>
          </div>
          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-sm bg-white/90", gradeColor(venue.grade))}>
              Grade {gradeLabel(venue.grade)}
            </span>
          </div>
          {payplay && (
            <div className="absolute top-3 right-3">
              <span className="flex items-center gap-1 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                <Zap className="h-2.5 w-2.5" /> Instant
              </span>
            </div>
          )}
        </div>

        {/* Card body */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-800 transition-colors line-clamp-2">
              {venue.nameEn}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-amber-50 border border-amber-200 rounded-lg px-1.5 py-0.5">
              <Star className="h-3 w-3 text-amber-500 fill-current" />
              <span className="text-xs font-bold text-amber-700">{venue.communityRating}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
            <MapPin className="h-3 w-3 text-slate-400" />
            {venue.fullAddress.split(",").slice(-2).join(",").trim()}
          </div>

          {/* Sport tags */}
          <div className="flex gap-1 flex-wrap mb-3">
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
              {venue.primarySport}
            </span>
            {venue.supportedSports.filter((s) => s !== venue.primarySport).slice(0, 1).map((s) => (
              <span key={s} className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                {s}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div>
              {price > 0 ? (
                <div>
                  <span className="text-base font-bold text-slate-900">₹{(price / 100).toLocaleString("en-IN")}</span>
                  <span className="text-xs text-slate-400">/hr</span>
                </div>
              ) : (
                <span className="text-xs text-slate-500">Contact for pricing</span>
              )}
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
              View details <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function VenueListRow({ venue, payplay }: { venue: (typeof MOCK_VENUES)[0]; payplay: boolean }) {
  const price = minPrice(venue);
  return (
    <Link href={`/venues/${venue.id}`} className="group block">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-4 flex gap-4">
        {/* Color strip */}
        <div className={cn("rounded-xl w-16 h-16 shrink-0 bg-gradient-to-br flex items-center justify-center text-2xl", sportGradient(venue.primarySport))}>
          {getSportEmoji(venue.primarySport)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-0.5">
            <h3 className="font-bold text-slate-900 group-hover:text-blue-800 transition-colors truncate">{venue.nameEn}</h3>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="h-3.5 w-3.5 text-amber-500 fill-current" />
              <span className="text-sm font-bold text-slate-700">{venue.communityRating}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
            <MapPin className="h-3 w-3" />
            {venue.fullAddress}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md">{venue.primarySport}</span>
            {payplay && <span className="text-[11px] font-semibold px-2 py-0.5 bg-purple-50 text-purple-700 rounded-md flex items-center gap-1"><Zap className="h-2.5 w-2.5" />Pay & Play</span>}
            <span className={cn("text-[11px] px-2 py-0.5 rounded-full border", gradeColor(venue.grade))}>Grade {gradeLabel(venue.grade)}</span>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0">
          {price > 0 && (
            <div className="text-right">
              <div className="font-bold text-slate-900">₹{(price / 100).toLocaleString("en-IN")}</div>
              <div className="text-xs text-slate-400">per hour</div>
            </div>
          )}
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-700 group-hover:text-blue-900">
            View <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function sportGradient(sport: string) {
  const map: Record<string, string> = {
    Cricket: "from-green-800 via-green-700 to-emerald-600",
    Swimming: "from-sky-700 via-blue-700 to-cyan-600",
    Badminton: "from-violet-800 via-purple-700 to-purple-600",
    Football: "from-emerald-900 via-green-800 to-lime-700",
    Athletics: "from-orange-700 via-amber-600 to-yellow-600",
    Basketball: "from-orange-800 via-red-700 to-orange-600",
    Volleyball: "from-teal-700 via-teal-600 to-cyan-500",
    Tennis: "from-lime-700 via-green-600 to-teal-600",
    Kabaddi: "from-rose-800 via-red-700 to-rose-600",
  };
  return map[sport] ?? "from-blue-900 via-blue-800 to-indigo-700";
}

function minPrice(venue: (typeof MOCK_VENUES)[0]) {
  if (!venue.subVenues.length) return 0;
  return Math.min(...venue.subVenues.map((sv) => sv.baseRatePaise));
}
