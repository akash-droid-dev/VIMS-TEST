"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Zap, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle2,
  Clock, Users, Calendar, TrendingUp, MapPin, Shield, Eye
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_VENUES, MOCK_PAYPLAY_SLOTS } from "@/lib/mock-data";
import { formatDate, formatCurrency, gradeColor, gradeLabel, cn } from "@/lib/utils";

export default function PayPlayPage() {
  const [venueStates, setVenueStates] = useState<Record<string, boolean>>(
    Object.fromEntries(MOCK_VENUES.map((v) => [v.id, v.payplayEnabled]))
  );
  const [confirmDialog, setConfirmDialog] = useState<{ venueId: string; enable: boolean } | null>(null);
  const [confirmOtp, setConfirmOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const enabledCount = Object.values(venueStates).filter(Boolean).length;

  const handleToggleRequest = (venueId: string, enable: boolean) => {
    setConfirmDialog({ venueId, enable });
    setConfirmOtp("");
  };

  const handleConfirm = async () => {
    if (!confirmDialog) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setVenueStates((prev) => ({ ...prev, [confirmDialog.venueId]: confirmDialog.enable }));
    setConfirmDialog(null);
    setLoading(false);
  };

  const venue = confirmDialog ? MOCK_VENUES.find((v) => v.id === confirmDialog.venueId) : null;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Zap className="h-6 w-6 text-purple-600" /> Pay & Play
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">DSO-controlled citizen slot booking toggle cockpit</p>
        </div>
        <Badge variant="purple" className="text-sm px-3 py-1.5">
          {enabledCount} of {MOCK_VENUES.length} venues enabled
        </Badge>
      </div>

      {/* Authority notice */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-purple-900">Authority Reminder</p>
            <p className="text-sm text-purple-700">
              Only DSO / DSC for the respective district can enable or disable Pay & Play. Super Admin has override authority.
              All toggle actions require NIC e-Sign and are immutably logged in the audit ledger.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Enabled Venues", value: enabledCount, icon: Zap, color: "text-purple-700", bg: "bg-purple-50" },
          { label: "Slots Today", value: "47", icon: Calendar, color: "text-blue-700", bg: "bg-blue-50" },
          { label: "Bookings (Apr)", value: "312", icon: Users, color: "text-green-700", bg: "bg-green-50" },
          { label: "Revenue (Apr)", value: "₹3.2L", icon: TrendingUp, color: "text-orange-700", bg: "bg-orange-50" },
        ].map((s) => (
          <Card key={s.label}>
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

      {/* Venue toggle table */}
      <Card>
        <CardHeader>
          <CardTitle>Venue Pay & Play Controls</CardTitle>
          <CardDescription>Toggle citizen slot booking per venue — requires DSO authority and e-Sign</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Venue</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Grade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">District</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Last Changed</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Toggle</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {MOCK_VENUES.filter((v) => v.lifecycleState === "ACTIVE").map((venue) => {
                  const enabled = venueStates[venue.id] ?? false;
                  const hasComplianceIssue = venue.complianceCertificates.some((c) => c.state === "EXPIRED");
                  return (
                    <tr key={venue.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-xl bg-purple-50 flex items-center justify-center text-lg flex-shrink-0">
                            {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : "🏸"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{venue.nameEn}</p>
                            <p className="text-xs text-slate-500 truncate max-w-40">{venue.primarySport} · {venue.ownershipType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor(venue.grade)}`}>
                          {gradeLabel(venue.grade)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-xs hidden lg:table-cell">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {venue.lgdDistrictCode}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-500 hidden lg:table-cell">
                        {venue.payplayToggledAt ? (
                          <>
                            <div>{formatDate(venue.payplayToggledAt)}</div>
                            <div className="text-slate-400">{venue.payplayToggledBy}</div>
                          </>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium w-fit", enabled ? "bg-purple-100 text-purple-800" : "bg-slate-100 text-slate-600")}>
                            {enabled ? "Enabled" : "Disabled"}
                          </span>
                          {hasComplianceIssue && (
                            <span className="text-xs text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" /> Compliance issue
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={enabled}
                            onCheckedChange={(v) => handleToggleRequest(venue.id, v)}
                            disabled={hasComplianceIssue}
                            aria-label={`Toggle Pay and Play for ${venue.nameEn}`}
                          />
                          {hasComplianceIssue && (
                            <span className="text-xs text-red-500">Blocked</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Link href={`/admin/venues/${venue.id}`}>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Today's slots preview */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Slot Grid — SAG Aquatics Centre (Training Pool)</CardTitle>
          <CardDescription>Apr 15, 2026 · Real-time availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
            {MOCK_PAYPLAY_SLOTS.map((slot) => (
              <div
                key={slot.id}
                className={cn("rounded-lg p-2 text-center border text-xs", {
                  "bg-green-50 border-green-200 text-green-800": slot.available,
                  "bg-red-50 border-red-200 text-red-700": !slot.available,
                })}
              >
                <div className="font-semibold">{slot.startTime}</div>
                <div className="text-[10px] mt-0.5">{slot.available ? "Free" : "Booked"}</div>
                <div className="text-[10px] text-slate-500">₹{slot.pricePaise / 100}</div>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-green-200" /> Available</span>
            <span className="flex items-center gap-1.5"><div className="h-3 w-3 rounded bg-red-200" /> Booked</span>
          </div>
        </CardContent>
      </Card>

      {/* Toggle confirmation dialog */}
      <Dialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className={cn("h-5 w-5", confirmDialog?.enable ? "text-purple-600" : "text-slate-500")} />
              {confirmDialog?.enable ? "Enable" : "Disable"} Pay & Play
            </DialogTitle>
            <DialogDescription>
              {confirmDialog?.enable
                ? "This will make the venue publicly discoverable for citizen slot booking."
                : "Citizens will no longer be able to book slots at this venue."}
            </DialogDescription>
          </DialogHeader>
          {venue && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <p className="font-semibold text-slate-900 text-sm">{venue.nameEn}</p>
              <p className="text-xs text-slate-500">{venue.lgdDistrictCode} · {venue.primarySport}</p>
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="confirm-otp">Aadhaar OTP Confirmation *</Label>
            <Input
              id="confirm-otp"
              type="text"
              placeholder="Enter 6-digit OTP to confirm"
              value={confirmOtp}
              onChange={(e) => setConfirmOtp(e.target.value)}
              maxLength={6}
              className="text-center tracking-widest text-lg"
            />
            <p className="text-xs text-slate-500">This action will be NIC e-signed and immutably logged.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialog(null)}>Cancel</Button>
            <Button
              className={cn(confirmDialog?.enable ? "bg-purple-700 hover:bg-purple-800" : "bg-slate-700 hover:bg-slate-800")}
              onClick={handleConfirm}
              loading={loading}
              disabled={confirmOtp.length !== 6}
            >
              {confirmDialog?.enable ? "Enable & e-Sign" : "Disable & e-Sign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
