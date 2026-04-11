"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  MapPin, Star, Users, Clock, Zap, Phone, Shield, CheckCircle2,
  AlertTriangle, ChevronRight, ArrowLeft, Share2, Heart, Calendar,
  Building2, Waves, Award, ChevronLeft, Info, ExternalLink
} from "lucide-react";
import { MOCK_VENUES, MOCK_PAYPLAY_SLOTS } from "@/lib/mock-data";
import { gradeColor, gradeLabel, formatDate, formatCurrency, cn, venueTypeLabel } from "@/lib/utils";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = ["Apr 15", "Apr 16", "Apr 17", "Apr 18", "Apr 19", "Apr 20", "Apr 21"];

export default function PublicVenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const venue = MOCK_VENUES.find((v) => v.id === id) ?? MOCK_VENUES[1]; // default to aquatics
  const [selectedDate, setSelectedDate] = useState(0);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "slots" | "sub-venues" | "reviews">("overview");

  const slots = MOCK_PAYPLAY_SLOTS;
  const availableSlots = slots.filter((s) => s.available).length;

  if (!venue.payplayEnabled && venue.lifecycleState !== "ACTIVE") {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🏟️</div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Venue Not Available</h2>
        <p className="text-slate-500 mb-6">This venue is currently not open for citizen booking.</p>
        <Link href="/venues" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Browse Venues
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
        <Link href="/venues" className="hover:text-blue-800 transition-colors">Venues</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/venues?district=${venue.lgdDistrictCode}`} className="hover:text-blue-800">{venue.lgdDistrictCode}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-slate-900 font-medium truncate">{venue.nameEn}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Image gallery placeholder */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 h-64 md:h-80 group">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl opacity-40 group-hover:scale-110 transition-transform duration-500">
                {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "INDOOR_HALL" ? "🏸" : "⚽"}
              </span>
            </div>
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border backdrop-blur-sm bg-white/90 ${gradeColor(venue.grade)}`}>
                Grade {gradeLabel(venue.grade)}
              </span>
              {venue.payplayEnabled && (
                <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-600 text-white">
                  <Zap className="h-3 w-3" /> Instant Booking
                </span>
              )}
            </div>
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setSaved((v) => !v)}
                className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                aria-label={saved ? "Remove from saved" : "Save venue"}
              >
                <Heart className={cn("h-4 w-4 transition-colors", saved ? "fill-red-500 text-red-500" : "text-slate-600")} />
              </button>
              <button className="h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors" aria-label="Share">
                <Share2 className="h-4 w-4 text-slate-600" />
              </button>
            </div>
            {/* Photo count pill */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
              View 12 Photos
            </div>
          </div>

          {/* Venue header */}
          <div>
            <div className="flex items-start justify-between gap-4 flex-wrap mb-2">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{venue.nameEn}</h1>
                <p className="text-slate-500 text-sm">{venue.nameGu}</p>
              </div>
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-1.5">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} className={cn("h-3.5 w-3.5", i <= Math.floor(venue.communityRating) ? "text-amber-400 fill-current" : "text-slate-300")} />
                  ))}
                </div>
                <span className="font-bold text-slate-900 text-sm">{venue.communityRating}</span>
                <span className="text-slate-500 text-xs">(247 reviews)</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-blue-600" />{venue.fullAddress}</span>
            </div>

            {/* Quick info strip */}
            <div className="flex flex-wrap gap-3 mt-3">
              {[
                { label: venueTypeLabel(venue.venueType), icon: Building2 },
                { label: venue.ownershipType, icon: Shield },
                { label: venue.indoorOutdoor === "INDOOR" ? "Indoor" : venue.indoorOutdoor === "OUTDOOR" ? "Outdoor" : "Mixed", icon: Building2 },
                { label: `${venue.capacitySeating.toLocaleString("en-IN")} seats`, icon: Users },
              ].map((item) => (
                <span key={item.label} className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                  <item.icon className="h-3.5 w-3.5 text-slate-500" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
            {(["overview", "slots", "sub-venues", "reviews"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                  activeTab === tab
                    ? "border-blue-800 text-blue-800"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                )}
              >
                {tab === "sub-venues" ? "Sub-Venues" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "slots" && venue.payplayEnabled && (
                  <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full font-semibold">
                    {availableSlots} free
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {activeTab === "overview" && (
            <div className="space-y-5">
              {/* About */}
              <div>
                <h2 className="font-semibold text-slate-900 mb-2">About This Venue</h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {venue.shortHistory ?? `${venue.nameEn} is one of Gujarat's premier sports facilities, managed by ${venue.operatorName}. It offers world-class infrastructure for ${venue.supportedSports.join(", ")} enthusiasts across the state.`}
                </p>
              </div>

              {/* Sports offered */}
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Sports &amp; Activities</h2>
                <div className="flex flex-wrap gap-2">
                  <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 bg-blue-600 text-white rounded-full font-medium">
                    ⭐ {venue.primarySport}
                  </span>
                  {venue.supportedSports.filter((s) => s !== venue.primarySport).map((s) => (
                    <span key={s} className="text-sm px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full border border-slate-200">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Facilities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Changing Rooms", available: true },
                    { label: "First Aid Room", available: true },
                    { label: "Parking", available: venue.parkingCapacity > 0 },
                    { label: "Women-Only Zone", available: (venue.womenOnlyZones ?? 0) > 0 },
                    { label: "Wheelchair Access", available: venue.capacityWheelchair > 0 },
                    { label: "CCTV Security", available: true },
                    { label: "Drinking Water", available: true },
                    { label: "Cafeteria", available: venue.venueType === "STADIUM" },
                    { label: "Helipad", available: venue.helipad ?? false },
                  ].map((f) => (
                    <div key={f.label} className={cn("flex items-center gap-2 p-2.5 rounded-xl border text-sm", f.available ? "border-green-200 bg-green-50 text-green-800" : "border-slate-200 bg-slate-50 text-slate-400 line-through")}>
                      {f.available ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> : <div className="h-4 w-4 rounded-full border-2 border-slate-300 shrink-0" />}
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Location map placeholder */}
              <div>
                <h2 className="font-semibold text-slate-900 mb-3">Location</h2>
                <div className="rounded-2xl bg-slate-100 border border-slate-200 h-40 flex flex-col items-center justify-center gap-2 text-slate-500 text-sm">
                  <MapPin className="h-8 w-8 text-blue-400" />
                  <span className="font-medium">Map view (OLA Maps SDK)</span>
                  <span className="text-xs">{venue.coordinates.lat}°N, {venue.coordinates.lng}°E</span>
                  <a href={`https://maps.google.com?q=${venue.coordinates.lat},${venue.coordinates.lng}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-blue-600 hover:underline mt-1">
                    Open in Google Maps <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Compliance & Safety */}
              <div>
                <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" /> Safety &amp; Compliance
                </h2>
                <div className="space-y-2">
                  {venue.complianceCertificates.slice(0, 3).map((cert) => (
                    <div key={cert.type} className={cn("flex items-center gap-3 p-3 rounded-xl border text-sm", {
                      "border-green-200 bg-green-50": cert.state === "VALID",
                      "border-yellow-200 bg-yellow-50": cert.state === "EXPIRING_SOON",
                      "border-red-200 bg-red-50": cert.state === "EXPIRED",
                    })}>
                      {cert.state === "VALID" ? <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" /> : <AlertTriangle className="h-4 w-4 text-yellow-600 shrink-0" />}
                      <span className={cert.state === "VALID" ? "text-green-800" : cert.state === "EXPIRING_SOON" ? "text-yellow-800" : "text-red-800"}>
                        {cert.type} — {cert.issuingBody}
                      </span>
                      {cert.state === "VALID" && <span className="ml-auto text-xs text-green-600 font-medium">Valid until {formatDate(cert.expiryDate)}</span>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "slots" && (
            <div className="space-y-4">
              {!venue.payplayEnabled ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Clock className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium text-slate-700">Pay &amp; Play Not Available</p>
                  <p className="text-sm text-slate-500 mt-1">This venue accepts formal bookings only. Contact the venue for enquiries.</p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">Choose a Date</h2>
                    <span className="text-sm text-slate-500">{availableSlots} slots available today</span>
                  </div>

                  {/* Date selector */}
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {DATES.map((date, i) => (
                      <button key={i} onClick={() => setSelectedDate(i)}
                        className={cn("flex flex-col items-center min-w-14 py-2.5 rounded-xl border text-xs font-medium transition-all shrink-0", {
                          "bg-blue-800 text-white border-blue-800": selectedDate === i,
                          "bg-white text-slate-700 border-slate-200 hover:border-blue-300": selectedDate !== i,
                        })}>
                        <span className="text-[10px] opacity-70">{DAY_LABELS[i]}</span>
                        <span className="text-base font-bold">{date.split(" ")[1]}</span>
                        <span className="text-[10px] opacity-70">{date.split(" ")[0]}</span>
                      </button>
                    ))}
                  </div>

                  {/* Sub-venue selector */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Select Area</label>
                    <div className="flex gap-2 flex-wrap">
                      {venue.subVenues.filter((sv) => sv.bookable).map((sv) => (
                        <button key={sv.id} className="px-4 py-2 rounded-xl border border-slate-200 text-sm hover:border-blue-400 hover:bg-blue-50 transition-colors">
                          {sv.name}
                          <span className="ml-2 text-xs text-slate-500">₹{sv.baseRatePaise / 100}/hr</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Slots grid */}
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Available Slots — {DATES[selectedDate]}</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {slots.map((slot) => (
                        <Link key={slot.id} href={slot.available ? `/venues/${venue.id}/book?slot=${slot.id}&date=${DATES[selectedDate]}` : "#"}>
                          <button
                            disabled={!slot.available}
                            className={cn("w-full p-2.5 rounded-xl border text-xs font-medium transition-all", {
                              "border-green-300 bg-green-50 text-green-800 hover:bg-green-100 hover:border-green-400 hover:shadow-sm cursor-pointer": slot.available,
                              "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed": !slot.available,
                            })}
                          >
                            <div className="font-bold">{slot.startTime}</div>
                            <div className="text-[10px] mt-0.5">{slot.available ? `₹${slot.pricePaise / 100}` : "Booked"}</div>
                          </button>
                        </Link>
                      ))}
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-green-200 border border-green-300" /> Available</span>
                      <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-slate-200 border border-slate-300" /> Booked</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === "sub-venues" && (
            <div className="space-y-3">
              {venue.subVenues.map((sv) => (
                <div key={sv.id} className="border border-slate-200 rounded-2xl p-4 hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-slate-900">{sv.name}</h3>
                      <p className="text-xs text-slate-500">{sv.type.replace("_"," ")}</p>
                    </div>
                    {sv.bookable ? (
                      <span className="text-xs bg-green-100 text-green-800 border border-green-200 px-2 py-1 rounded-full font-medium">Bookable</span>
                    ) : (
                      <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Not bookable</span>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="font-bold text-slate-900">{sv.capacity.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Capacity</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="font-bold text-slate-900">₹{(sv.baseRatePaise / 100).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">Base rate/hr</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <p className="font-bold text-slate-900">{sv.type.replace("_"," ").split(" ")[0]}</p>
                      <p className="text-xs text-slate-500">Type</p>
                    </div>
                  </div>
                  {sv.bookable && venue.payplayEnabled && (
                    <Link href={`/venues/${venue.id}/book?subvenue=${sv.id}`}>
                      <button className="mt-3 w-full py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                        <Zap className="h-4 w-4" /> Book This Space
                      </button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-4">
              {/* Rating summary */}
              <div className="flex gap-6 p-4 bg-amber-50 rounded-2xl border border-amber-200">
                <div className="text-center">
                  <div className="text-4xl font-bold text-slate-900">{venue.communityRating}</div>
                  <div className="flex justify-center mt-1">
                    {[1,2,3,4,5].map((i) => <Star key={i} className={cn("h-4 w-4", i <= Math.floor(venue.communityRating) ? "text-amber-400 fill-current" : "text-slate-300")} />)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">247 reviews</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[[5, 68], [4, 22], [3, 7], [2, 2], [1, 1]].map(([stars, pct]) => (
                    <div key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-4 text-right text-slate-600">{stars}★</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-amber-400 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="w-6 text-slate-500">{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample reviews */}
              {[
                { name: "Priya S.", stars: 5, date: "Apr 2026", text: "Excellent facilities! The pool is very well maintained and the staff is helpful. Aadhaar OTP booking was seamless.", sport: "Swimming" },
                { name: "Rahul M.", stars: 4, date: "Mar 2026", text: "Great venue for badminton. Courts are in good condition. Changing rooms could be better. Overall very satisfied.", sport: "Badminton" },
                { name: "Kavita P.", stars: 5, date: "Mar 2026", text: "Booked via Pay & Play — entire process took under 2 minutes. The women-only zone is a great feature.", sport: "Swimming" },
              ].map((review, i) => (
                <div key={i} className="border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-800">
                      {review.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                      <div className="flex items-center gap-1.5">
                        <div className="flex">{[1,2,3,4,5].map((i) => <Star key={i} className={cn("h-3 w-3", i <= review.stars ? "text-amber-400 fill-current" : "text-slate-300")} />)}</div>
                        <span className="text-xs text-slate-400">{review.date}</span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">{review.sport}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right — booking sidebar */}
        <div className="space-y-4">
          {/* Book card */}
          {venue.payplayEnabled ? (
            <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-5 sticky top-20">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="h-5 w-5 text-purple-600" />
                <span className="text-lg font-bold text-slate-900">Instant Booking</span>
              </div>
              <p className="text-sm text-slate-500 mb-4">Confirm in under 60 seconds via Aadhaar OTP</p>

              <div className="space-y-3 mb-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1 block">Select Date</label>
                  <input type="date" min="2026-04-11" className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" defaultValue="2026-04-15" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1 block">Select Time Slot</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {slots.filter((s) => s.available).slice(0, 6).map((s) => (
                      <option key={s.id} value={s.id}>{s.startTime} — {s.endTime} · ₹{s.pricePaise / 100}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1 block">Area / Sub-Venue</label>
                  <select className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500">
                    {venue.subVenues.filter((sv) => sv.bookable).map((sv) => (
                      <option key={sv.id} value={sv.id}>{sv.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 py-3 border-y border-slate-200 mb-4 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>1 hour · Training Pool</span>
                  <span>₹200</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (18%)</span>
                  <span>₹36</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>Total</span>
                  <span>₹236</span>
                </div>
              </div>

              <Link href={`/venues/${venue.id}/book`}>
                <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-base transition-colors">
                  Book Now — ₹236
                </button>
              </Link>
              <p className="text-xs text-center text-slate-400 mt-2 flex items-center justify-center gap-1">
                <Shield className="h-3 w-3" /> Secured by Aadhaar OTP · Instant confirmation
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-5">
              <h3 className="font-bold text-slate-900 mb-1">Formal Booking</h3>
              <p className="text-sm text-slate-500 mb-4">Submit a booking request with event details. Approval within 7–14 working days.</p>
              <button className="w-full py-2.5 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors text-sm">
                Submit Booking Request
              </button>
            </div>
          )}

          {/* Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4">
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Contact & Emergency</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-4 w-4 text-slate-400" />
                <span>{venue.emergencyNumber}</span>
                <span className="text-xs text-red-500 ml-auto">24/7</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span className="text-xs truncate">{venue.localPolicePS}</span>
              </div>
            </div>
          </div>

          {/* Operated by */}
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="h-4 w-4 text-blue-600" />
              <p className="text-xs font-semibold text-blue-800">Operated by</p>
            </div>
            <p className="text-sm font-medium text-slate-900">{venue.operatorName}</p>
            <p className="text-xs text-slate-500">{venue.owningBody}</p>
            <p className="text-xs text-blue-600 mt-2">Verified by G-VIMS · Sports Authority of Gujarat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
