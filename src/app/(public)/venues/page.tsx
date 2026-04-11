"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, MapPin, Star, Zap, Filter, SlidersHorizontal,
  Grid3X3, List, ChevronDown, Users, Clock, X, Sparkles,
  Building2, Trophy, Waves, Dumbbell, Bike, Target
} from "lucide-react";
import { MOCK_VENUES } from "@/lib/mock-data";
import { gradeColor, gradeLabel, formatCurrency, venueTypeLabel, cn } from "@/lib/utils";

const SPORTS_FILTER = ["All Sports", "Cricket", "Football", "Basketball", "Volleyball", "Badminton", "Tennis", "Swimming", "Athletics"];
const DISTRICT_FILTER = ["All Districts", "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar"];
const SORT_OPTIONS = ["Relevance", "Rating: High to Low", "Distance: Nearest", "Price: Low to High"];

const SPORT_ICONS: Record<string, React.ReactNode> = {
  Cricket: <Trophy className="h-5 w-5" />,
  Swimming: <Waves className="h-5 w-5" />,
  Badminton: <Target className="h-5 w-5" />,
  Football: <Building2 className="h-5 w-5" />,
  Athletics: <Bike className="h-5 w-5" />,
};

const HERO_SPORTS = [
  { label: "Cricket", emoji: "🏏", count: 124 },
  { label: "Football", emoji: "⚽", count: 89 },
  { label: "Swimming", emoji: "🏊", count: 43 },
  { label: "Badminton", emoji: "🏸", count: 212 },
  { label: "Athletics", emoji: "🏃", count: 76 },
  { label: "Basketball", emoji: "🏀", count: 98 },
  { label: "Kabaddi", emoji: "🤼", count: 67 },
  { label: "Volleyball", emoji: "🏐", count: 134 },
];

export default function PublicVenuesPage() {
  const [search, setSearch] = useState("");
  const [sport, setSport] = useState("All Sports");
  const [district, setDistrict] = useState("All Districts");
  const [payplayOnly, setPayplayOnly] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [sort, setSort] = useState("Relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    return MOCK_VENUES.filter((v) => {
      if (v.lifecycleState !== "ACTIVE") return false;
      const matchSearch = !search ||
        v.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        v.primarySport.toLowerCase().includes(search.toLowerCase()) ||
        v.lgdDistrictCode.toLowerCase().includes(search.toLowerCase());
      const matchSport = sport === "All Sports" || v.supportedSports.includes(sport) || v.primarySport === sport;
      const matchPayplay = !payplayOnly || v.payplayEnabled;
      return matchSearch && matchSport && matchPayplay;
    });
  }, [search, sport, district, payplayOnly]);

  return (
    <div>
      {/* Hero section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs mb-4">
              <Sparkles className="h-3 w-3 text-orange-400" />
              <span>1,184 venues across Gujarat</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Find &amp; Book Sports Venues in Gujarat
            </h1>
            <p className="text-blue-200 text-lg mb-8">
              Discover government and private sports facilities, book slots instantly, and play your favourite sport near you.
            </p>

            {/* Main search bar */}
            <div className="flex gap-2 p-2 bg-white rounded-2xl shadow-xl">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Sport, venue name, or area…"
                  className="flex-1 text-slate-900 placeholder:text-slate-400 focus:outline-none text-sm"
                  aria-label="Search venues"
                />
              </div>
              <div className="flex items-center gap-2 px-3 border-l border-slate-200">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Ahmedabad"
                  className="w-28 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                  aria-label="Location"
                />
              </div>
              <button className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold text-sm transition-colors">
                Search
              </button>
            </div>
          </div>

          {/* Sport pills */}
          <div className="flex gap-3 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {HERO_SPORTS.map((s) => (
              <button
                key={s.label}
                onClick={() => setSport(s.label === sport ? "All Sports" : s.label)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border shrink-0",
                  sport === s.label
                    ? "bg-white text-blue-900 border-white"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                <span>{s.emoji}</span>
                {s.label}
                <span className={cn("text-xs px-1.5 py-0.5 rounded-full", sport === s.label ? "bg-blue-100 text-blue-800" : "bg-white/20")}>{s.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="bg-orange-500 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-8 overflow-x-auto text-sm">
          {[
            { label: "Active Venues", value: "892" },
            { label: "Districts Covered", value: "33 / 33" },
            { label: "Pay & Play Venues", value: "234" },
            { label: "Bookings This Month", value: "523" },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-bold text-base">{s.value}</span>
              <span className="text-orange-100 text-xs">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter bar + results */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={cn("flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all",
              showFilters ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-700 border-slate-200 hover:border-blue-300")}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(sport !== "All Sports" || payplayOnly) && (
              <span className="h-5 w-5 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center">
                {(sport !== "All Sports" ? 1 : 0) + (payplayOnly ? 1 : 0)}
              </span>
            )}
          </button>

          {/* Active filter chips */}
          {sport !== "All Sports" && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
              {sport}
              <button onClick={() => setSport("All Sports")} aria-label="Remove sport filter"><X className="h-3 w-3" /></button>
            </span>
          )}
          {payplayOnly && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-800 rounded-full text-xs font-medium border border-purple-200">
              <Zap className="h-3 w-3" /> Pay & Play only
              <button onClick={() => setPayplayOnly(false)} aria-label="Remove filter"><X className="h-3 w-3" /></button>
            </span>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-slate-500">{filtered.length} venues</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-800 cursor-pointer"
              aria-label="Sort venues"
            >
              {SORT_OPTIONS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button onClick={() => setView("grid")} className={cn("p-2 transition-colors", view === "grid" ? "bg-blue-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50")} aria-label="Grid view">
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button onClick={() => setView("list")} className={cn("p-2 transition-colors", view === "list" ? "bg-blue-800 text-white" : "bg-white text-slate-500 hover:bg-slate-50")} aria-label="List view">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable filters panel */}
        {showFilters && (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">Sport</label>
                <select value={sport} onChange={(e) => setSport(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-800">
                  {SPORTS_FILTER.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">District</label>
                <select value={district} onChange={(e) => setDistrict(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-800">
                  {DISTRICT_FILTER.map((d) => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">Ownership</label>
                <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-800">
                  <option>All</option>
                  <option>Government</option>
                  <option>Private</option>
                  <option>PPP</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2 block">Availability</label>
                <label className="flex items-center gap-2 cursor-pointer mt-2">
                  <input type="checkbox" checked={payplayOnly} onChange={(e) => setPayplayOnly(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500" />
                  <span className="text-sm text-slate-700 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5 text-purple-600" /> Pay & Play only
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Venue grid */}
        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`}>
                <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group">
                  {/* Image placeholder */}
                  <div className="relative h-44 bg-gradient-to-br from-blue-100 to-slate-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-30 group-hover:scale-110 transition-transform duration-500">
                      {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "INDOOR_HALL" ? "🏸" : venue.venueType === "ATHLETICS_TRACK" ? "🏃" : "⚽"}
                    </div>
                    {/* Badges on image */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full border backdrop-blur-sm bg-white/80 ${gradeColor(venue.grade)}`}>
                        Grade {gradeLabel(venue.grade)}
                      </span>
                    </div>
                    {venue.payplayEnabled && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-purple-600 text-white">
                          <Zap className="h-3 w-3" /> Book Now
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                        {venue.ownershipType}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-1.5">
                      <h2 className="font-bold text-slate-900 text-base leading-tight group-hover:text-blue-800 transition-colors flex-1 pr-2">
                        {venue.nameEn}
                      </h2>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                        <span className="text-sm font-semibold text-slate-900">{venue.communityRating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{venue.nameGu}</p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                      <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                      <span className="truncate">{venue.fullAddress.split(",").slice(-2).join(",").trim()}</span>
                    </div>

                    {/* Sport tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium border border-blue-100">
                        {venue.primarySport}
                      </span>
                      {venue.supportedSports.slice(1, 3).map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">{s}</span>
                      ))}
                      {venue.supportedSports.length > 3 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">+{venue.supportedSports.length - 3}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-slate-500">
                        <Users className="h-3 w-3 inline mr-1" />
                        Capacity: {venue.capacitySeating.toLocaleString("en-IN")}
                      </div>
                      {venue.payplayEnabled ? (
                        <div className="text-sm font-bold text-purple-700">
                          from ₹200/hr
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400">Formal booking</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          /* List view */
          <div className="space-y-3">
            {filtered.map((venue) => (
              <Link key={venue.id} href={`/venues/${venue.id}`}>
                <article className="bg-white rounded-2xl border border-slate-200 p-4 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex gap-4">
                  <div className="h-20 w-24 rounded-xl bg-gradient-to-br from-blue-100 to-slate-100 flex items-center justify-center text-3xl flex-shrink-0">
                    {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "INDOOR_HALL" ? "🏸" : "⚽"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h2 className="font-bold text-slate-900 text-base hover:text-blue-800 transition-colors truncate">{venue.nameEn}</h2>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-current" />
                        <span className="text-sm font-semibold">{venue.communityRating}</span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor(venue.grade)}`}>
                          {gradeLabel(venue.grade)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                      <MapPin className="h-3 w-3" /> {venue.fullAddress.split(",").slice(-2).join(",").trim()}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{venue.primarySport}</span>
                      {venue.payplayEnabled && <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100 font-medium"><Zap className="h-3 w-3" /> Book Now</span>}
                      <span className="text-xs text-slate-400">{venue.capacitySeating.toLocaleString()} seats</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0 flex flex-col justify-between">
                    {venue.payplayEnabled ? (
                      <div className="text-base font-bold text-purple-700">from ₹200/hr</div>
                    ) : (
                      <div className="text-xs text-slate-400 mt-1">Formal booking</div>
                    )}
                    <button className="mt-2 px-4 py-1.5 bg-blue-800 text-white rounded-xl text-xs font-medium hover:bg-blue-900 transition-colors">
                      View Details
                    </button>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No venues found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your filters or search for a different sport or area.</p>
            <button onClick={() => { setSearch(""); setSport("All Sports"); setPayplayOnly(false); }}
              className="px-6 py-2.5 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
