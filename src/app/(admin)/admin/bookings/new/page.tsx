"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft, Calendar, Building2, Users, FileText,
  CheckCircle2, Loader2, AlertCircle, Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MOCK_VENUES } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TRACKS = [
  { value: "GOVERNMENT", label: "Government Track", desc: "State / Central government events", color: "bg-blue-100 text-blue-800", sla: "14 working days" },
  { value: "FEDERATION", label: "Federation Track", desc: "Registered sports federation events", color: "bg-purple-100 text-purple-800", sla: "7 working days" },
  { value: "COMMERCIAL", label: "Commercial Track", desc: "Private/corporate events", color: "bg-orange-100 text-orange-800", sla: "48 hours" },
  { value: "PAY_AND_PLAY", label: "Pay & Play Track", desc: "Citizen instant booking", color: "bg-green-100 text-green-800", sla: "Instant" },
];

export default function NewBookingPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    track: "",
    venueId: "",
    subVenueId: "",
    eventName: "",
    requesterName: "",
    requesterOrg: "",
    requesterMobile: "",
    requesterEmail: "",
    startDate: "",
    endDate: "",
    startTime: "09:00",
    endTime: "18:00",
    expectedAttendees: "",
    notes: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedVenue = MOCK_VENUES.find((v) => v.id === form.venueId);
  const subVenues = selectedVenue?.subVenues ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.track || !form.venueId || !form.requesterName || !form.startDate || !form.endDate) {
      setError("Please fill all required fields.");
      return;
    }
    if (form.startDate > form.endDate) {
      setError("End date must be after start date.");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1400));
    setSaving(false);
    setSaved(true);
  };

  if (saved) {
    const bookingId = `BK-${Date.now().toString().slice(-6)}`;
    return (
      <div className="max-w-lg mx-auto py-16 text-center">
        <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Created!</h2>
        <p className="text-slate-500 mb-1">
          <span className="font-semibold text-slate-800">{form.eventName || "New Event"}</span>
        </p>
        <p className="text-slate-400 text-sm mb-2">
          Booking ID: <span className="font-mono font-medium text-slate-700">{bookingId}</span>
        </p>
        <p className="text-slate-400 text-sm mb-8">
          The booking has been submitted and is pending SPOC review.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.push("/admin/bookings")}>View All Bookings</Button>
          <Button onClick={() => { setSaved(false); setForm({ track:"",venueId:"",subVenueId:"",eventName:"",requesterName:"",requesterOrg:"",requesterMobile:"",requesterEmail:"",startDate:"",endDate:"",startTime:"09:00",endTime:"18:00",expectedAttendees:"",notes:"" }); }}>
            New Booking
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">New Booking</h2>
          <p className="text-slate-500 text-sm mt-0.5">Create a venue booking request across any track</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Track Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-blue-800" /> Booking Track <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TRACKS.map((track) => (
                <button
                  key={track.value}
                  type="button"
                  onClick={() => update("track", track.value)}
                  className={cn(
                    "text-left p-4 rounded-xl border-2 transition-all",
                    form.track === track.value
                      ? "border-blue-800 bg-blue-50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-slate-900">{track.label}</span>
                    <Badge className={cn("text-[10px] px-1.5", track.color)}>{track.sla}</Badge>
                  </div>
                  <p className="text-xs text-slate-500">{track.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Venue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4 text-blue-800" /> Venue Selection <span className="text-red-500">*</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Venue <span className="text-red-500">*</span></label>
              <Select value={form.venueId} onValueChange={(v) => { update("venueId", v); update("subVenueId", ""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a venue" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_VENUES.filter((v) => v.lifecycleState === "ACTIVE").map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.nameEn} — {v.lgdDistrictCode}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {subVenues.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Sub-Venue / Track</label>
                <Select value={form.subVenueId} onValueChange={(v) => update("subVenueId", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sub-venue (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subVenues.map((sv) => (
                      <SelectItem key={sv.id} value={sv.id}>
                        {sv.name} — Capacity: {sv.capacity.toLocaleString()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedVenue && (
              <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-xl text-xs text-slate-600">
                <span className="font-medium text-slate-800">{selectedVenue.primarySport}</span>
                <span>·</span>
                <span>{selectedVenue.indoorOutdoor}</span>
                <span>·</span>
                <span>Capacity: {selectedVenue.capacitySeating.toLocaleString()}</span>
                <span>·</span>
                <span className={cn("font-medium", selectedVenue.payplayEnabled ? "text-green-700" : "text-slate-500")}>
                  {selectedVenue.payplayEnabled ? "Pay & Play ✓" : "No Pay & Play"}
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-blue-800" /> Event Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Event Name</label>
              <Input value={form.eventName} onChange={(e) => update("eventName", e.target.value)} placeholder="e.g., State Cricket Championship 2026" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Start Date <span className="text-red-500">*</span></label>
                <Input type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} required min={new Date().toISOString().slice(0,10)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">End Date <span className="text-red-500">*</span></label>
                <Input type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} required min={form.startDate || new Date().toISOString().slice(0,10)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Start Time</label>
                <Input type="time" value={form.startTime} onChange={(e) => update("startTime", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">End Time</label>
                <Input type="time" value={form.endTime} onChange={(e) => update("endTime", e.target.value)} />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Expected Attendees</label>
              <Input type="number" value={form.expectedAttendees} onChange={(e) => update("expectedAttendees", e.target.value)} placeholder="Estimated audience count" min={0} />
            </div>
          </CardContent>
        </Card>

        {/* Requester */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4 text-blue-800" /> Requester Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Requester Name <span className="text-red-500">*</span></label>
                <Input value={form.requesterName} onChange={(e) => update("requesterName", e.target.value)} placeholder="Full name" required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Organization</label>
                <Input value={form.requesterOrg} onChange={(e) => update("requesterOrg", e.target.value)} placeholder="Department / Association" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Mobile</label>
                <Input value={form.requesterMobile} onChange={(e) => update("requesterMobile", e.target.value)} placeholder="+91 98765 43210" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Email</label>
                <Input type="email" value={form.requesterEmail} onChange={(e) => update("requesterEmail", e.target.value)} placeholder="requester@org.in" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-700">Additional Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => update("notes", e.target.value)}
                rows={3}
                placeholder="Any special requirements, setup needs, or remarks…"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex gap-3 justify-end pb-6">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={saving} className="min-w-36">
            {saving
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
              : <><Calendar className="h-4 w-4" /> Create Booking</>
            }
          </Button>
        </div>
      </form>
    </div>
  );
}
