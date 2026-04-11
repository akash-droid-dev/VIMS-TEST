"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  CalendarDays, MapPin, Clock, CheckCircle2, XCircle,
  AlertTriangle, Download, RefreshCw, ChevronRight, Zap,
  Trophy, Search, Filter, ArrowUpRight, Star, Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

type BookingStatus = "CONFIRMED" | "PENDING" | "CANCELLED" | "COMPLETED" | "UNDER_REVIEW";

interface MyBooking {
  id: string;
  venue: string;
  district: string;
  sport: string;
  date: string;
  time: string;
  slots: number;
  track: "PAY_AND_PLAY" | "GOVERNMENT" | "FEDERATION" | "COMMERCIAL";
  status: BookingStatus;
  amount: number;
  receiptNo?: string;
  canCancel: boolean;
  canRate: boolean;
  rated?: number;
}

const MOCK_MY_BOOKINGS: MyBooking[] = [
  {
    id: "BK-2026-00891",
    venue: "SAG Aquatics Centre",
    district: "Ahmedabad",
    sport: "Swimming",
    date: "12 Apr 2026",
    time: "07:00 – 08:00",
    slots: 1,
    track: "PAY_AND_PLAY",
    status: "CONFIRMED",
    amount: 8000,
    receiptNo: "RCP-2026-04-00891",
    canCancel: true,
    canRate: false,
  },
  {
    id: "BK-2026-00745",
    venue: "Rajkot Athletics Track",
    district: "Rajkot",
    sport: "Athletics",
    date: "08 Apr 2026",
    time: "06:00 – 07:30",
    slots: 2,
    track: "PAY_AND_PLAY",
    status: "COMPLETED",
    amount: 5000,
    receiptNo: "RCP-2026-04-00745",
    canCancel: false,
    canRate: true,
    rated: 4,
  },
  {
    id: "BK-2026-00623",
    venue: "Surat Indoor Stadium",
    district: "Surat",
    sport: "Badminton",
    date: "15 Apr 2026",
    time: "18:00 – 20:00",
    slots: 1,
    track: "COMMERCIAL",
    status: "UNDER_REVIEW",
    amount: 25000,
    canCancel: true,
    canRate: false,
  },
  {
    id: "BK-2026-00412",
    venue: "Vadodara Football Ground",
    district: "Vadodara",
    sport: "Football",
    date: "28 Mar 2026",
    time: "16:00 – 18:00",
    slots: 1,
    track: "PAY_AND_PLAY",
    status: "COMPLETED",
    amount: 12000,
    receiptNo: "RCP-2026-03-00412",
    canCancel: false,
    canRate: true,
    rated: 5,
  },
  {
    id: "BK-2026-00301",
    venue: "Gandhinagar Sports Complex",
    district: "Gandhinagar",
    sport: "Volleyball",
    date: "10 Mar 2026",
    time: "17:00 – 19:00",
    slots: 1,
    track: "PAY_AND_PLAY",
    status: "CANCELLED",
    amount: 6000,
    canCancel: false,
    canRate: false,
  },
];

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: React.ElementType }> = {
  CONFIRMED: { label: "Confirmed", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 },
  PENDING: { label: "Pending", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: Clock },
  CANCELLED: { label: "Cancelled", color: "text-red-700 bg-red-50 border-red-200", icon: XCircle },
  COMPLETED: { label: "Completed", color: "text-blue-700 bg-blue-50 border-blue-200", icon: Trophy },
  UNDER_REVIEW: { label: "Under Review", color: "text-orange-700 bg-orange-50 border-orange-200", icon: AlertTriangle },
};

const TRACK_COLORS: Record<string, string> = {
  PAY_AND_PLAY: "text-purple-700 bg-purple-50",
  COMMERCIAL: "text-blue-700 bg-blue-50",
  GOVERNMENT: "text-emerald-700 bg-emerald-50",
  FEDERATION: "text-orange-700 bg-orange-50",
};

const TRACK_LABELS: Record<string, string> = {
  PAY_AND_PLAY: "Pay & Play",
  COMMERCIAL: "Commercial",
  GOVERNMENT: "Government",
  FEDERATION: "Federation",
};

export default function MyBookingsPage() {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past" | "all">("all");
  const [search, setSearch] = useState("");
  const [ratingModal, setRatingModal] = useState<string | null>(null);
  const [hoverRating, setHoverRating] = useState(0);
  const [givenRating, setGivenRating] = useState(0);

  const filtered = MOCK_MY_BOOKINGS.filter((b) => {
    if (activeTab === "upcoming" && !["CONFIRMED", "PENDING", "UNDER_REVIEW"].includes(b.status)) return false;
    if (activeTab === "past" && !["COMPLETED", "CANCELLED"].includes(b.status)) return false;
    if (search && !b.venue.toLowerCase().includes(search.toLowerCase()) && !b.id.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    total: MOCK_MY_BOOKINGS.length,
    completed: MOCK_MY_BOOKINGS.filter((b) => b.status === "COMPLETED").length,
    upcoming: MOCK_MY_BOOKINGS.filter((b) => ["CONFIRMED", "UNDER_REVIEW"].includes(b.status)).length,
    spent: MOCK_MY_BOOKINGS.filter((b) => b.status !== "CANCELLED").reduce((s, b) => s + b.amount, 0),
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Bookings</h1>
          <p className="text-slate-500 text-sm mt-0.5">Your venue booking history and upcoming sessions</p>
        </div>
        <Link
          href="/venues"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-medium hover:bg-blue-900 transition-colors"
        >
          <Zap className="h-4 w-4" /> Book a Slot
        </Link>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: stats.total, icon: CalendarDays, color: "text-blue-700 bg-blue-50" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-green-700 bg-green-50" },
          { label: "Upcoming", value: stats.upcoming, icon: Clock, color: "text-orange-700 bg-orange-50" },
          { label: "Total Spent", value: `₹${(stats.spent / 100).toFixed(0)}`, icon: Receipt, color: "text-purple-700 bg-purple-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3">
            <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex rounded-xl bg-slate-100 p-1">
          {([["all", "All"], ["upcoming", "Upcoming"], ["past", "Past"]] as [string, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setActiveTab(val as "all" | "upcoming" | "past")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                activeTab === val ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search venue or booking ID…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
          />
        </div>
      </div>

      {/* Booking list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <CalendarDays className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="font-medium text-slate-600">No bookings found</p>
          <p className="text-sm mt-1">Try adjusting your filters or book a new slot</p>
          <Link href="/venues" className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-blue-800 text-white text-sm font-medium hover:bg-blue-900 transition-colors">
            Explore Venues <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const status = STATUS_CONFIG[booking.status];
            const StatusIcon = status.icon;
            return (
              <div key={booking.id} className="bg-white border border-slate-200 rounded-2xl p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start gap-4">
                  {/* Sport icon */}
                  <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl shrink-0">
                    {booking.sport === "Swimming" ? "🏊" : booking.sport === "Athletics" ? "🏃" :
                      booking.sport === "Football" ? "⚽" : booking.sport === "Badminton" ? "🏸" : "🏐"}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{booking.venue}</h3>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <MapPin className="h-3 w-3" />
                          {booking.district}
                          <span className="mx-1">·</span>
                          {booking.sport}
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-medium px-2 py-0.5 rounded-full border flex items-center gap-1",
                        status.color
                      )}>
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </span>
                    </div>

                    <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2">
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {booking.date}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {booking.time}
                      </div>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", TRACK_COLORS[booking.track])}>
                        {TRACK_LABELS[booking.track]}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{booking.id}</span>
                        <span className="text-sm font-semibold text-slate-900">
                          ₹{(booking.amount / 100).toFixed(0)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {booking.canRate && !booking.rated && (
                          <button
                            onClick={() => setRatingModal(booking.id)}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-orange-200 text-xs font-medium text-orange-700 hover:bg-orange-50 transition-colors"
                          >
                            <Star className="h-3 w-3" /> Rate
                          </button>
                        )}
                        {booking.rated && (
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star key={s} className={cn("h-3 w-3", s <= booking.rated! ? "text-orange-400 fill-orange-400" : "text-slate-200")} />
                            ))}
                          </div>
                        )}
                        {booking.receiptNo && (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                            <Download className="h-3 w-3" /> Receipt
                          </button>
                        )}
                        {booking.canCancel && (
                          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-200 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors">
                            <XCircle className="h-3 w-3" /> Cancel
                          </button>
                        )}
                        {booking.status === "UNDER_REVIEW" && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" /> Awaiting DSO
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Rating modal */}
      {ratingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-base font-bold text-slate-900 mb-1">Rate Your Experience</h3>
            <p className="text-sm text-slate-500 mb-5">
              {MOCK_MY_BOOKINGS.find((b) => b.id === ratingModal)?.venue}
            </p>
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setGivenRating(s)}
                  className="transition-transform hover:scale-110"
                >
                  <Star className={cn(
                    "h-8 w-8 transition-colors",
                    s <= (hoverRating || givenRating) ? "text-orange-400 fill-orange-400" : "text-slate-200"
                  )} />
                </button>
              ))}
            </div>
            <textarea
              placeholder="Optional — share your experience (max 200 chars)"
              maxLength={200}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setRatingModal(null); setGivenRating(0); setHoverRating(0); }}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => { setRatingModal(null); setGivenRating(0); setHoverRating(0); }}
                disabled={givenRating === 0}
                className="flex-1 py-2 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-50"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
