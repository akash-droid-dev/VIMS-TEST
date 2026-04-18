"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search, Filter, Plus, Clock, CheckCircle2, XCircle,
  AlertTriangle, ChevronRight, Download, Calendar, ArrowUpRight,
  Inbox, CheckCheck, Ban, Eye, MessageSquare, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_BOOKINGS } from "@/lib/mock-data";
import { useVIMSStore } from "@/hooks/useVIMSStore";
import { updateLiveBookingState, type LiveBooking } from "@/lib/store";
import {
  bookingStateColor, formatDate, formatCurrency, slaHealth, slaColor, cn
} from "@/lib/utils";
import type { BookingTrack, BookingState } from "@/types";

const TRACK_COLORS: Record<BookingTrack, string> = {
  GOVERNMENT: "bg-blue-100 text-blue-800",
  FEDERATION: "bg-purple-100 text-purple-800",
  COMMERCIAL: "bg-orange-100 text-orange-800",
  PAY_AND_PLAY: "bg-green-100 text-green-800",
};

const SLA_WINDOWS: Record<BookingTrack, string> = {
  GOVERNMENT: "14 working days",
  FEDERATION: "7 working days",
  COMMERCIAL: "48 hours",
  PAY_AND_PLAY: "Instant",
};

const LIVE_STATE_COLORS: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function BookingsPage() {
  const router = useRouter();
  const store = useVIMSStore();
  const liveBookings = store.liveBookings ?? [];

  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("ALL");
  const [filterTrack, setFilterTrack] = useState("ALL");

  // Review panel state
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [reviewAction, setReviewAction] = useState<"APPROVED" | "REJECTED" | null>(null);
  const [reviewRemarks, setReviewRemarks] = useState("");

  const filtered = useMemo(() => {
    return MOCK_BOOKINGS.filter((b) => {
      const matchSearch =
        !search ||
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.venueName.toLowerCase().includes(search.toLowerCase()) ||
        (b.eventName ?? "").toLowerCase().includes(search.toLowerCase()) ||
        b.requesterName.toLowerCase().includes(search.toLowerCase());
      const matchState = filterState === "ALL" || b.state === filterState;
      const matchTrack = filterTrack === "ALL" || b.track === filterTrack;
      return matchSearch && matchState && matchTrack;
    });
  }, [search, filterState, filterTrack]);

  const pending = MOCK_BOOKINGS.filter((b) => ["SUBMITTED", "UNDER_REVIEW", "PENDING_PAYMENT"].includes(b.state));
  const livePending = liveBookings.filter((b) => b.state === "SUBMITTED" || b.state === "UNDER_REVIEW");

  const handleLiveReview = (booking: LiveBooking, action: "APPROVED" | "REJECTED") => {
    setReviewingId(booking.id);
    setReviewAction(action);
    setReviewRemarks("");
  };

  const confirmLiveReview = (bookingId: string) => {
    if (!reviewAction) return;
    updateLiveBookingState(bookingId, reviewAction, "Admin (SPOC)", reviewRemarks || undefined);
    setReviewingId(null);
    setReviewAction(null);
    setReviewRemarks("");
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Booking Management</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Approval cockpit — {pending.length + livePending.length} pending action
            {livePending.length > 0 && (
              <span className="ml-2 inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                <Zap className="h-3 w-3" /> {livePending.length} live submission{livePending.length !== 1 ? "s" : ""}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {
            const rows = [
              ["Booking ID","Event","Venue","Track","Requester","State","Amount","Start","End"],
              ...MOCK_BOOKINGS.map((b) => [
                b.id, b.eventName ?? "", b.venueName, b.track,
                b.requesterName, b.state,
                (b.amountPaise / 100).toFixed(2),
                b.startAt, b.endAt,
              ]),
            ];
            const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `GVIMS_Bookings_${new Date().toISOString().slice(0,10)}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm" onClick={() => router.push("/admin/bookings/new")}><Plus className="h-4 w-4" /> New Booking</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Bookings", value: MOCK_BOOKINGS.length + liveBookings.length, icon: Calendar, color: "text-blue-800", bg: "bg-blue-50" },
          { label: "Pending Action", value: pending.length + livePending.length, icon: Clock, color: "text-orange-700", bg: "bg-orange-50" },
          { label: "Approved", value: MOCK_BOOKINGS.filter((b) => b.state === "APPROVED").length + liveBookings.filter((b) => b.state === "APPROVED").length, icon: CheckCircle2, color: "text-green-700", bg: "bg-green-50" },
          { label: "Rejected", value: MOCK_BOOKINGS.filter((b) => b.state === "REJECTED").length + liveBookings.filter((b) => b.state === "REJECTED").length, icon: XCircle, color: "text-red-700", bg: "bg-red-50" },
        ].map((s) => (
          <Card key={s.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`h-9 w-9 rounded-lg ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── LIVE CITIZEN SUBMISSIONS (real-time from public portal) ── */}
      {liveBookings.length > 0 && (
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <CardTitle className="text-base font-bold text-emerald-800">
                Live Citizen Submissions
              </CardTitle>
              <span className="ml-auto text-xs text-emerald-600 bg-emerald-100 px-2.5 py-0.5 rounded-full font-semibold">
                {liveBookings.length} total · {livePending.length} pending
              </span>
            </div>
            <p className="text-xs text-emerald-600 mt-0.5">Real-time submissions from the public booking portal — updates instantly when citizens submit</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-emerald-100">
              {liveBookings.map((booking) => (
                <div key={booking.id} className="px-4 py-3">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 text-sm">{booking.eventName || "(No event name)"}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", LIVE_STATE_COLORS[booking.state] ?? "bg-slate-100 text-slate-700")}>
                          {booking.state.replace("_", " ")}
                        </span>
                        {booking.bookingTrack && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-100 text-slate-600">
                            {booking.bookingTrack.replace("_", " ")}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1 text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{booking.venueName}</span>
                        {booking.subVenueName && <span>· {booking.subVenueName}</span>}
                        {booking.startDate && <span>· {booking.startDate}{booking.endDate && ` → ${booking.endDate}`}</span>}
                      </div>
                      <div className="flex flex-wrap gap-x-4 mt-0.5 text-xs text-slate-400">
                        <span>{booking.contactPerson}{booking.orgName ? ` · ${booking.orgName}` : ""}</span>
                        <span>{booking.mobile}</span>
                        <span className="font-mono text-blue-600">{booking.refNo}</span>
                      </div>
                      {booking.reviewRemarks && (
                        <p className="mt-1 text-xs text-slate-500 italic">Remarks: {booking.reviewRemarks}</p>
                      )}
                    </div>

                    {/* Action buttons / review panel */}
                    <div className="shrink-0">
                      {reviewingId === booking.id ? (
                        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm w-72">
                          <p className="text-xs font-semibold text-slate-700 mb-2">
                            {reviewAction === "APPROVED" ? "✓ Approve" : "✗ Reject"} Booking
                          </p>
                          <textarea
                            value={reviewRemarks}
                            onChange={(e) => setReviewRemarks(e.target.value)}
                            placeholder="Add remarks (optional)..."
                            rows={2}
                            className="w-full text-xs px-2.5 py-2 border border-slate-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmLiveReview(booking.id)}
                              className={cn(
                                "flex-1 text-xs font-semibold py-1.5 rounded-lg transition-colors",
                                reviewAction === "APPROVED"
                                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                  : "bg-red-600 hover:bg-red-700 text-white"
                              )}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => { setReviewingId(null); setReviewAction(null); }}
                              className="flex-1 text-xs font-semibold py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {(booking.state === "SUBMITTED" || booking.state === "UNDER_REVIEW") && (
                            <>
                              <button
                                onClick={() => handleLiveReview(booking, "APPROVED")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                <CheckCheck className="h-3 w-3" /> Approve
                              </button>
                              <button
                                onClick={() => handleLiveReview(booking, "REJECTED")}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                <Ban className="h-3 w-3" /> Reject
                              </button>
                            </>
                          )}
                          {booking.state === "APPROVED" && (
                            <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold px-2 py-1">
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approved
                            </span>
                          )}
                          {booking.state === "REJECTED" && (
                            <span className="flex items-center gap-1 text-xs text-red-600 font-semibold px-2 py-1">
                              <XCircle className="h-3.5 w-3.5" /> Rejected
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {liveBookings.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 border-dashed">
          <Inbox className="h-5 w-5 text-slate-400" />
          <p className="text-sm text-slate-500">No live submissions yet. When citizens submit booking requests via the public portal, they will appear here in real-time.</p>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by ID, venue, event, requester…" className="pl-9 h-8 text-sm" />
        </div>
        <Select value={filterState} onValueChange={setFilterState}>
          <SelectTrigger className="w-40 h-8 text-sm"><SelectValue placeholder="All States" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All States</SelectItem>
            {["DRAFT","SUBMITTED","UNDER_REVIEW","PENDING_PAYMENT","APPROVED","REJECTED","CANCELLED","COMPLETED","DISPUTED"].map((s) => (
              <SelectItem key={s} value={s}>{s.replace("_"," ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterTrack} onValueChange={setFilterTrack}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="All Tracks" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tracks</SelectItem>
            {["GOVERNMENT","FEDERATION","COMMERCIAL","PAY_AND_PLAY"].map((t) => (
              <SelectItem key={t} value={t}>{t.replace("_"," ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-500">{filtered.length} results</span>
      </div>

      {/* Pending approvals highlight */}
      {pending.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">{pending.length} bookings require your attention</span>
            </div>
            <div className="space-y-2">
              {pending.map((b) => {
                const slah = b.slaDeadline ? slaHealth(b.slaDeadline) : "OK";
                return (
                  <Link key={b.id} href={`/admin/bookings/${b.id}`}>
                    <div className="flex items-center gap-3 p-2 bg-white rounded-lg hover:shadow-sm transition-all cursor-pointer">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">{b.eventName}</p>
                        <p className="text-xs text-slate-500">{b.venueName} · {b.requesterName}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRACK_COLORS[b.track]}`}>{b.track.replace("_"," ")}</span>
                        {b.slaDeadline && (
                          <span className={`text-xs font-medium ${slaColor(slah)}`}>
                            {slah === "BREACHED" ? "⚠️ Breached" : slah === "WARNING" ? "⏰ Near SLA" : "✓ On time"}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bookings table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Booking</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Track</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Requester</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Dates</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Amount</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">SLA</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((booking) => {
                  const slah = booking.slaDeadline ? slaHealth(booking.slaDeadline) : "OK";
                  return (
                    <tr key={booking.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-900 text-sm">{booking.eventName ?? booking.id}</p>
                          <p className="text-xs text-slate-500">{booking.venueName}</p>
                          <p className="text-xs text-slate-400">{booking.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TRACK_COLORS[booking.track]}`}>
                          {booking.track.replace("_"," ")}
                        </span>
                        <p className="text-xs text-slate-400 mt-0.5">{SLA_WINDOWS[booking.track]}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <p className="text-sm text-slate-900">{booking.requesterName}</p>
                        <p className="text-xs text-slate-500">{booking.requesterOrg ?? "—"}</p>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs text-slate-600">
                        <div>{formatDate(booking.startAt)}</div>
                        <div className="text-slate-400">to {formatDate(booking.endAt)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bookingStateColor(booking.state)}`}>
                          {booking.state.replace("_"," ")}
                        </span>
                        {booking.pendingOn && (
                          <p className="text-xs text-slate-400 mt-0.5">Pending: {booking.pendingOn}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-sm font-medium text-slate-900">
                        {formatCurrency(booking.amountPaise)}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {booking.slaDeadline ? (
                          <span className={`text-xs font-medium ${slaColor(slah)}`}>
                            {slah === "BREACHED" ? "Breached" : slah === "WARNING" ? "Near SLA" : formatDate(booking.slaDeadline)}
                          </span>
                        ) : <span className="text-xs text-slate-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/bookings/${booking.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">No bookings match your filters.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
