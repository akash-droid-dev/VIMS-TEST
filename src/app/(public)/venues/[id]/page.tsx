"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, Users, Clock, Zap, Phone, Shield, CheckCircle2,
  AlertTriangle, ChevronRight, ArrowLeft, Share2, Heart, Calendar,
  ExternalLink, ChevronLeft, Info, X, Dumbbell, Wifi,
  Car, Camera, Accessibility
} from "lucide-react";
import { MOCK_VENUES, MOCK_PAYPLAY_SLOTS } from "@/lib/mock-data";
import { gradeColor, gradeLabel, formatDate, formatCurrency, cn, getSportEmoji, venueTypeLabel } from "@/lib/utils";
import { useVIMSStore } from "@/hooks/useVIMSStore";
import { toggleSavedVenue, trackRecentlyViewed } from "@/lib/store";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildNextDays(count: number) {
  const days = [];
  const today = new Date(2026, 3, 11); // Apr 11 2026
  for (let i = 0; i < count; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }
  return days;
}

const SAMPLE_REVIEWS = [
  { name: "Priya S.", rating: 5, date: "8 Apr 2026", comment: "Excellent facility! The pool is well-maintained and staff are very helpful. Will definitely come back.", avatar: "PS" },
  { name: "Rahul M.", rating: 4, date: "2 Apr 2026", comment: "Good venue overall. Changing rooms could be cleaner but the main facility is top-notch.", avatar: "RM" },
  { name: "Anjali K.", rating: 5, date: "25 Mar 2026", comment: "Booked via Pay & Play — seamless experience. The slot booking system works perfectly.", avatar: "AK" },
  { name: "Dev P.", rating: 4, date: "19 Mar 2026", comment: "Professional-grade equipment. Great for serious athletes.", avatar: "DP" },
];

const TIME_SLOTS = [
  { id: "t1", label: "06:00 – 07:00", booked: false, peak: false },
  { id: "t2", label: "07:00 – 08:00", booked: true, peak: true },
  { id: "t3", label: "08:00 – 09:00", booked: false, peak: true },
  { id: "t4", label: "09:00 – 10:00", booked: false, peak: false },
  { id: "t5", label: "16:00 – 17:00", booked: true, peak: true },
  { id: "t6", label: "17:00 – 18:00", booked: false, peak: true },
  { id: "t7", label: "18:00 – 19:00", booked: false, peak: true },
  { id: "t8", label: "19:00 – 20:00", booked: false, peak: false },
];

function sportGradient(sport: string) {
  const map: Record<string, string> = {
    Cricket: "from-green-800 via-green-700 to-emerald-600",
    Swimming: "from-sky-700 via-blue-700 to-cyan-600",
    Badminton: "from-violet-800 via-purple-700 to-purple-600",
    Football: "from-emerald-900 via-green-800 to-lime-700",
    Athletics: "from-orange-700 via-amber-600 to-yellow-600",
  };
  return map[sport] ?? "from-blue-900 via-blue-800 to-indigo-700";
}

export default function PublicVenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const store = useVIMSStore();
  const venue = MOCK_VENUES.find((v) => v.id === id) ?? MOCK_VENUES[1];
  const payplayEnabled = store.payplayStates[venue.id] ?? venue.payplayEnabled;

  const [activeTab, setActiveTab] = useState<"overview" | "slots" | "sub-venues" | "reviews">("overview");
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedSubVenue, setSelectedSubVenue] = useState(venue.subVenues[0]?.id ?? "");
  const [saved, setSaved] = useState(store.savedVenues.includes(venue.id));
  const [shareMsg, setShareMsg] = useState("");

  const days = buildNextDays(7);

  useEffect(() => {
    trackRecentlyViewed(venue.id);
  }, [venue.id]);

  useEffect(() => {
    setSaved(store.savedVenues.includes(venue.id));
  }, [store.savedVenues, venue.id]);

  const handleSave = () => {
    toggleSavedVenue(venue.id);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareMsg("Link copied!");
    setTimeout(() => setShareMsg(""), 2000);
  };

  const selectedSV = venue.subVenues.find((sv) => sv.id === selectedSubVenue) ?? venue.subVenues[0];
  const slotPrice = selectedSV?.baseRatePaise ?? 0;
  const convenience = Math.round(slotPrice * 0.02);
  const gst = Math.round((slotPrice + convenience) * 0.18);
  const total = slotPrice + convenience + gst;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: stars === 5 ? 142 : stars === 4 ? 73 : stars === 3 ? 22 : stars === 2 ? 7 : 3,
  }));
  const totalReviews = ratingBreakdown.reduce((s, r) => s + r.count, 0);

  return (
    <div>
      {/* ── Hero image area ──────────────────────────────────── */}
      <div className={cn("relative h-64 md:h-80 bg-gradient-to-br overflow-hidden", sportGradient(venue.primarySport))}>
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "32px 32px"
        }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-9xl opacity-20 select-none">{getSportEmoji(venue.primarySport)}</span>
        </div>
        {/* Gradient overlay bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Top buttons */}
        <div className="absolute top-4 left-4">
          <Link href="/venues" className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-full hover:bg-black/50 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" /> All Venues
          </Link>
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleSave}
            className={cn("h-9 w-9 rounded-full backdrop-blur-sm flex items-center justify-center shadow transition-colors", saved ? "bg-red-500 text-white" : "bg-black/30 text-white hover:bg-black/50")}
          >
            <Heart className={cn("h-4 w-4", saved ? "fill-white" : "")} />
          </button>
          <button onClick={handleShare} className="relative h-9 w-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center shadow hover:bg-black/50 transition-colors">
            <Share2 className="h-4 w-4" />
            {shareMsg && (
              <span className="absolute -bottom-7 right-0 text-xs bg-black text-white px-2 py-1 rounded-lg whitespace-nowrap">{shareMsg}</span>
            )}
          </button>
        </div>

        {/* Bottom info overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="flex gap-2 mb-2 flex-wrap">
              <span className={cn("text-xs font-bold px-2.5 py-0.5 rounded-full border backdrop-blur-sm bg-white/90", gradeColor(venue.grade))}>
                Grade {gradeLabel(venue.grade)}
              </span>
              {payplayEnabled && (
                <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
                  <Zap className="h-3 w-3" /> Instant Booking
                </span>
              )}
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30">
                {venue.indoorOutdoor === "INDOOR" ? "Indoor" : venue.indoorOutdoor === "OUTDOOR" ? "Outdoor" : "Mixed"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-white drop-shadow-sm">{venue.nameEn}</h1>
            <p className="text-white/70 text-sm">{venue.nameGu}</p>
          </div>
          <span className="text-xs text-white/60 hidden sm:block">📸 12 photos</span>
        </div>
      </div>

      {/* ── Main layout ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-5">
          <Link href="/venues" className="hover:text-blue-700 transition-colors">Venues</Link>
          <ChevronRight className="h-3 w-3" />
          <span>{venue.lgdDistrictCode}</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-700 font-medium truncate">{venue.nameEn}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left column ─────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-0">
            {/* Rating + quick info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{venue.nameEn}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    {venue.fullAddress}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                    <div className="flex">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.floor(venue.communityRating) ? "text-amber-400 fill-current" : "text-slate-300")} />
                      ))}
                    </div>
                    <span className="font-bold text-amber-700 text-sm">{venue.communityRating}</span>
                    <span className="text-amber-600 text-xs">({totalReviews})</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: Users, label: `${venue.capacitySeating.toLocaleString("en-IN")} seats` },
                  { icon: Shield, label: venue.ownershipType },
                  { icon: Camera, label: venueTypeLabel(venue.venueType) },
                  { icon: Car, label: `${venue.parkingCapacity} parking spots` },
                ].map((item) => (
                  <span key={item.label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                    <item.icon className="h-3.5 w-3.5 text-slate-500" /> {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200 overflow-x-auto">
                {(["overview", "slots", "sub-venues", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 min-w-max px-5 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all",
                      activeTab === tab
                        ? "border-blue-800 text-blue-800 bg-blue-50/50"
                        : "border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    )}
                  >
                    {tab === "sub-venues" ? "Sub-Venues" : tab === "slots" ? (
                      <span className="flex items-center gap-1.5">
                        Slots
                        {payplayEnabled && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-bold">Live</span>}
                        {!payplayEnabled && <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-full">Off</span>}
                      </span>
                    ) : tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="p-5">
                {/* ── Overview tab ── */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2">About This Venue</h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {venue.shortHistory ?? `${venue.nameEn} is one of Gujarat's premier sports facilities, managed by ${venue.operatorName ?? "SAG"}. Offering world-class infrastructure for ${venue.supportedSports.join(", ")} enthusiasts, this venue has been a cornerstone of Gujarat's sports development journey.`}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-3">Sports &amp; Activities</h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-800 text-white rounded-full font-semibold">
                          {getSportEmoji(venue.primarySport)} {venue.primarySport}
                          <span className="text-blue-200 text-xs">Primary</span>
                        </span>
                        {venue.supportedSports.filter((s) => s !== venue.primarySport).map((s) => (
                          <span key={s} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                            {getSportEmoji(s)} {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-3">Facilities &amp; Amenities</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {[
                          { label: "Changing Rooms", icon: Dumbbell, ok: true },
                          { label: "First Aid Room", icon: Shield, ok: true },
                          { label: `Parking (${venue.parkingCapacity})`, icon: Car, ok: venue.parkingCapacity > 0 },
                          { label: "Women-Only Zone", icon: Users, ok: (venue.womenOnlyZones ?? 0) > 0 },
                          { label: "Wheelchair Access", icon: Accessibility, ok: venue.capacityWheelchair > 0 },
                          { label: "CCTV Security", icon: Camera, ok: true },
                          { label: "Drinking Water", icon: CheckCircle2, ok: true },
                          { label: "Wi-Fi", icon: Wifi, ok: venue.venueType === "STADIUM" || venue.venueType === "INDOOR_HALL" },
                          { label: "Helipad", icon: CheckCircle2, ok: venue.helipad ?? false },
                        ].map((f) => (
                          <div key={f.label} className={cn(
                            "flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium",
                            f.ok ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-400"
                          )}>
                            {f.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0" /> : <X className="h-3.5 w-3.5 text-slate-300 shrink-0" />}
                            {f.label}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-3">Location &amp; Access</h3>
                      <div className="rounded-2xl bg-gradient-to-br from-slate-100 to-blue-50 border border-slate-200 h-36 flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                        <MapPin className="h-7 w-7 text-blue-400" />
                        <span className="font-medium text-slate-700">{venue.fullAddress}</span>
                        <a href={`https://maps.google.com?q=${venue.coordinates.lat},${venue.coordinates.lng}`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-medium">
                          Open in Google Maps <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                      {venue.nearestTransit && (
                        <p className="text-xs text-slate-500 mt-2 flex items-start gap-1">
                          <Info className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                          Nearest transit: {venue.nearestTransit}
                        </p>
                      )}
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-green-600" /> Safety &amp; Compliance
                      </h3>
                      <div className="space-y-2">
                        {venue.complianceCertificates.map((cert) => (
                          <div key={cert.type} className={cn("flex items-center gap-3 p-3 rounded-xl border text-sm", {
                            "border-green-200 bg-green-50": cert.state === "VALID",
                            "border-yellow-200 bg-yellow-50": cert.state === "EXPIRING_SOON",
                            "border-red-200 bg-red-50": cert.state === "EXPIRED",
                          })}>
                            {cert.state === "VALID" ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <span className={cn("font-medium", cert.state === "VALID" ? "text-green-800" : cert.state === "EXPIRING_SOON" ? "text-yellow-800" : "text-red-800")}>
                                {cert.type}
                              </span>
                              <span className="text-xs ml-1.5 opacity-70">— {cert.issuingBody}</span>
                            </div>
                            {cert.state === "VALID" && <span className="text-xs text-green-700 font-medium shrink-0">Valid until {formatDate(cert.expiryDate)}</span>}
                            {cert.state === "EXPIRING_SOON" && <span className="text-xs text-yellow-700 font-medium shrink-0">Expiring {formatDate(cert.expiryDate)}</span>}
                            {cert.state === "EXPIRED" && <span className="text-xs text-red-700 font-bold shrink-0">Expired</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Slots tab ── */}
                {activeTab === "slots" && (
                  <div className="space-y-5">
                    {!payplayEnabled ? (
                      <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                        <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                        <p className="font-semibold text-slate-700">Pay &amp; Play Not Enabled</p>
                        <p className="text-sm text-slate-500 mt-1">This venue accepts formal bookings only. Use the contact number below to enquire.</p>
                        <a href={`tel:${venue.emergencyNumber}`} className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-blue-700 hover:underline">
                          <Phone className="h-4 w-4" /> {venue.emergencyNumber}
                        </a>
                      </div>
                    ) : (
                      <>
                        {/* Sub-venue selector */}
                        {venue.subVenues.filter((sv) => sv.bookable).length > 1 && (
                          <div>
                            <p className="text-sm font-semibold text-slate-800 mb-2">Select Area / Court</p>
                            <div className="flex gap-2 flex-wrap">
                              {venue.subVenues.filter((sv) => sv.bookable).map((sv) => (
                                <button
                                  key={sv.id}
                                  onClick={() => setSelectedSubVenue(sv.id)}
                                  className={cn(
                                    "px-4 py-2 rounded-xl border text-sm font-medium transition-all",
                                    selectedSubVenue === sv.id
                                      ? "border-blue-800 bg-blue-50 text-blue-800"
                                      : "border-slate-200 bg-white text-slate-700 hover:border-blue-300"
                                  )}
                                >
                                  {sv.name}
                                  <span className="ml-2 text-xs text-slate-500">₹{(sv.baseRatePaise / 100).toFixed(0)}/hr</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Date strip */}
                        <div>
                          <p className="text-sm font-semibold text-slate-800 mb-2">Select Date</p>
                          <div className="flex gap-2 overflow-x-auto pb-1">
                            {days.map((d, i) => (
                              <button
                                key={i}
                                onClick={() => { setSelectedDayIdx(i); setSelectedSlot(null); }}
                                className={cn(
                                  "flex flex-col items-center min-w-[52px] py-2.5 rounded-xl border text-xs font-medium transition-all shrink-0",
                                  selectedDayIdx === i
                                    ? "bg-blue-800 text-white border-blue-800 shadow-md"
                                    : "bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:bg-blue-50"
                                )}
                              >
                                <span className="text-[10px] opacity-70">{DAY_LABELS[i]}</span>
                                <span className="text-base font-bold">{d.getDate()}</span>
                                <span className="text-[10px] opacity-70">{d.toLocaleString("en-IN", { month: "short" })}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Slot grid */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-800">Available Slots</p>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-slate-200" /> Booked</span>
                              <span className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-amber-100 border border-amber-300" /> Peak</span>
                              <span className="flex items-center gap-1"><div className="h-2.5 w-2.5 rounded-sm bg-blue-50 border border-blue-300" /> Available</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {TIME_SLOTS.map((slot) => (
                              <button
                                key={slot.id}
                                disabled={slot.booked}
                                onClick={() => setSelectedSlot(slot.id === selectedSlot ? null : slot.id)}
                                className={cn(
                                  "py-2.5 rounded-xl border text-xs font-medium text-center transition-all",
                                  slot.booked
                                    ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed line-through"
                                    : selectedSlot === slot.id
                                    ? "border-blue-800 bg-blue-800 text-white shadow-md"
                                    : slot.peak
                                    ? "border-amber-200 bg-amber-50 text-amber-800 hover:border-amber-400"
                                    : "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-400"
                                )}
                              >
                                {slot.label}
                                {slot.peak && !slot.booked && <div className="text-[9px] mt-0.5 opacity-70">Peak hour</div>}
                                {slot.booked && <div className="text-[9px] mt-0.5">Booked</div>}
                              </button>
                            ))}
                          </div>
                        </div>

                        {selectedSlot && (
                          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between">
                            <div className="text-sm">
                              <p className="font-semibold text-blue-900">
                                {days[selectedDayIdx].toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                                {" · "}
                                {TIME_SLOTS.find((s) => s.id === selectedSlot)?.label}
                              </p>
                              <p className="text-blue-700 text-xs">{selectedSV?.name} · ₹{(total / 100).toFixed(2)} total</p>
                            </div>
                            <Link
                              href={`/venues/${venue.id}/book`}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 transition-colors"
                            >
                              <Zap className="h-4 w-4" /> Book Now
                            </Link>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* ── Sub-venues tab ── */}
                {activeTab === "sub-venues" && (
                  <div className="space-y-3">
                    {venue.subVenues.length === 0 ? (
                      <div className="text-center py-8 text-slate-400">No sub-venues configured for this facility.</div>
                    ) : (
                      venue.subVenues.map((sv) => (
                        <div key={sv.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-blue-200 transition-all">
                          <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-700 font-bold text-sm">
                            {sv.type === "POOL" ? "🏊" : sv.type === "COURT" ? "🏸" : sv.type === "MAIN_ARENA" ? "🏟️" : sv.type === "PRACTICE_GROUND" ? "⚽" : "🏃"}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold text-slate-900 text-sm">{sv.name}</p>
                              <span className="text-[10px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded-full font-medium">{sv.type.replace("_", " ")}</span>
                              {sv.bookable ? (
                                <span className="text-[10px] px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium flex items-center gap-0.5"><CheckCircle2 className="h-2.5 w-2.5" /> Bookable</span>
                              ) : (
                                <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">Not bookable</span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> Capacity: {sv.capacity}</span>
                              {sv.dependencyLocks.length > 0 && (
                                <span className="flex items-center gap-1 text-amber-600">
                                  <Info className="h-3 w-3" /> Locks main arena when booked
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-bold text-slate-900 text-sm">₹{(sv.baseRatePaise / 100).toFixed(0)}</div>
                            <div className="text-xs text-slate-500">per hour</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* ── Reviews tab ── */}
                {activeTab === "reviews" && (
                  <div className="space-y-5">
                    {/* Rating breakdown */}
                    <div className="flex gap-6 flex-wrap">
                      <div className="text-center">
                        <div className="text-5xl font-extrabold text-slate-900">{venue.communityRating}</div>
                        <div className="flex justify-center mt-1">
                          {[1,2,3,4,5].map((i) => (
                            <Star key={i} className={cn("h-4 w-4", i <= Math.round(venue.communityRating) ? "text-amber-400 fill-current" : "text-slate-200")} />
                          ))}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">{totalReviews} reviews</div>
                      </div>
                      <div className="flex-1 min-w-48 space-y-1.5">
                        {ratingBreakdown.map((rb) => (
                          <div key={rb.stars} className="flex items-center gap-2 text-xs">
                            <span className="text-slate-600 shrink-0">{rb.stars}★</span>
                            <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-2 bg-amber-400 rounded-full transition-all"
                                style={{ width: `${(rb.count / totalReviews) * 100}%` }}
                              />
                            </div>
                            <span className="text-slate-400 shrink-0 w-6 text-right">{rb.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5 space-y-4">
                      {SAMPLE_REVIEWS.map((review, i) => (
                        <div key={i} className="flex gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0">
                            {review.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="font-semibold text-slate-900 text-sm">{review.name}</span>
                              <div className="flex">
                                {[1,2,3,4,5].map((i) => (
                                  <Star key={i} className={cn("h-3 w-3", i <= review.rating ? "text-amber-400 fill-current" : "text-slate-200")} />
                                ))}
                              </div>
                              <span className="text-xs text-slate-400">{review.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed">{review.comment}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column — sticky booking sidebar ─────────── */}
          <div>
            <div className="sticky top-20 space-y-4">
              {payplayEnabled ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Zap className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">Instant Booking</p>
                      <p className="text-xs text-purple-600 font-medium">Pay & Play enabled</p>
                    </div>
                  </div>

                  {selectedSV && (
                    <>
                      <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between text-slate-600">
                          <span>{selectedSV.name}</span>
                          <span>₹{(selectedSV.baseRatePaise / 100).toFixed(0)}/hr</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-xs">
                          <span>Convenience fee (2%)</span>
                          <span>₹{(convenience / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-500 text-xs">
                          <span>GST (18%)</span>
                          <span>₹{(gst / 100).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-2">
                          <span>Total / session</span>
                          <span>₹{(total / 100).toFixed(2)}</span>
                        </div>
                      </div>

                      <Link
                        href={`/venues/${venue.id}/book`}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-blue-800 text-white font-bold text-sm hover:bg-blue-900 transition-colors shadow-md hover:shadow-lg"
                      >
                        <Calendar className="h-4 w-4" /> Book a Slot
                      </Link>
                    </>
                  )}

                  <p className="text-[10px] text-slate-400 text-center mt-3">
                    Cancellation up to 24 hrs before slot · No-show forfeits payment
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-5">
                  <p className="font-bold text-slate-900 text-sm mb-1">Request Booking</p>
                  <p className="text-xs text-slate-500 mb-4">This venue accepts formal bookings via the Government track (14-day SLA).</p>
                  <a
                    href={`tel:${venue.emergencyNumber}`}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition-colors"
                  >
                    <Phone className="h-4 w-4" /> Contact Venue
                  </a>
                </div>
              )}

              {/* Quick info card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Venue Info</p>
                {[
                  { label: "Emergency", value: venue.emergencyNumber },
                  { label: "Manager", value: venue.venueManager?.name },
                  { label: "Police Station", value: venue.localPolicePS },
                ].map((item) => item.value && (
                  <div key={item.label} className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wide">{item.label}</span>
                    <span className="text-xs text-slate-700 font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
