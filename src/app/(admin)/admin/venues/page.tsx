"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Plus, Filter, Download, MapPin, Star, Calendar,
  CheckCircle2, Clock, XCircle, AlertCircle, Building2,
  SlidersHorizontal, ChevronDown, Eye, Edit, Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { MOCK_VENUES } from "@/lib/mock-data";
import {
  gradeColor, gradeLabel, lifecycleColor, venueTypeLabel,
  formatDate, cn
} from "@/lib/utils";
import type { VenueLifecycleState, VenueType } from "@/types";

const LIFECYCLE_OPTIONS: VenueLifecycleState[] = [
  "PROPOSED", "UNDER_REVIEW", "ACTIVE", "SUSPENDED", "REVOKED",
];

const DISTRICT_OPTIONS = [
  "All States", "Gujarat", "Maharashtra", "Delhi", "Karnataka",
  "Tamil Nadu", "Rajasthan", "West Bengal", "Uttar Pradesh",
  "Madhya Pradesh", "Telangana", "Kerala", "Punjab", "Haryana",
];

export default function VenuesPage() {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("ALL");
  const [filterDistrict, setFilterDistrict] = useState("All States");
  const [view, setView] = useState<"card" | "table">("card");
  const [filterPayPlay, setFilterPayPlay] = useState("ALL");

  const filtered = useMemo(() => {
    return MOCK_VENUES.filter((v) => {
      const matchSearch =
        !search ||
        v.nameEn.toLowerCase().includes(search.toLowerCase()) ||
        v.id.toLowerCase().includes(search.toLowerCase()) ||
        v.primarySport.toLowerCase().includes(search.toLowerCase()) ||
        v.owningBody.toLowerCase().includes(search.toLowerCase());
      const matchState = filterState === "ALL" || v.lifecycleState === filterState;
      const matchDistrict = filterDistrict === "All States" || v.fullAddress.toLowerCase().includes(filterDistrict.toLowerCase());
      const matchPayPlay =
        filterPayPlay === "ALL" ||
        (filterPayPlay === "ENABLED" && v.payplayEnabled) ||
        (filterPayPlay === "DISABLED" && !v.payplayEnabled);
      return matchSearch && matchState && matchDistrict && matchPayPlay;
    });
  }, [search, filterState, filterDistrict, filterPayPlay]);

  const stateCount = (state: string) =>
    MOCK_VENUES.filter((v) => v.lifecycleState === state).length;

  return (
    <div className="space-y-5">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Venues</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {MOCK_VENUES.length} registered · {MOCK_VENUES.filter((v) => v.lifecycleState === "ACTIVE").length} active
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
          <Link href="/admin/venues/new">
            <Button size="sm"><Plus className="h-4 w-4" /> New Venue</Button>
          </Link>
        </div>
      </div>

      {/* State summary pills */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "All", value: "ALL", count: MOCK_VENUES.length, color: "bg-slate-100 text-slate-700" },
          { label: "Active", value: "ACTIVE", count: stateCount("ACTIVE"), color: "bg-green-100 text-green-800" },
          { label: "Under Review", value: "UNDER_REVIEW", count: stateCount("UNDER_REVIEW"), color: "bg-yellow-100 text-yellow-800" },
          { label: "Proposed", value: "PROPOSED", count: stateCount("PROPOSED"), color: "bg-blue-100 text-blue-800" },
          { label: "Suspended", value: "SUSPENDED", count: stateCount("SUSPENDED"), color: "bg-orange-100 text-orange-800" },
        ].map((pill) => (
          <button
            key={pill.value}
            onClick={() => setFilterState(pill.value)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filterState === pill.value
                ? "border-blue-800 ring-1 ring-blue-800 " + pill.color
                : "border-transparent " + pill.color + " hover:border-slate-300"
            )}
          >
            {pill.label}
            <span className="font-bold">{pill.count}</span>
          </button>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, sport, owner…"
            className="pl-9 h-8 text-sm"
            aria-label="Search venues"
          />
        </div>
        <Select value={filterDistrict} onValueChange={setFilterDistrict}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="State" />
          </SelectTrigger>
          <SelectContent>
            {DISTRICT_OPTIONS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPayPlay} onValueChange={setFilterPayPlay}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Pay & Play" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Venues</SelectItem>
            <SelectItem value="ENABLED">P&P Enabled</SelectItem>
            <SelectItem value="DISABLED">P&P Disabled</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
          <button onClick={() => setView("card")} className={cn("px-3 py-1.5 text-xs", view === "card" ? "bg-blue-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50")}>
            Cards
          </button>
          <button onClick={() => setView("table")} className={cn("px-3 py-1.5 text-xs", view === "table" ? "bg-blue-800 text-white" : "bg-white text-slate-600 hover:bg-slate-50")}>
            Table
          </button>
        </div>
        <span className="text-xs text-slate-500">{filtered.length} results</span>
      </div>

      {/* Card view */}
      {view === "card" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((venue) => (
            <Card key={venue.id} className="hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer group">
              <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl flex-shrink-0">
                      {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "INDOOR_HALL" ? "🏸" : venue.venueType === "ATHLETICS_TRACK" ? "🏃" : "⚽"}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 text-sm leading-tight truncate">{venue.nameEn}</h3>
                      <p className="text-xs text-slate-500 truncate">{venue.nameGu}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor(venue.grade)}`}>
                      Grade {gradeLabel(venue.grade)}
                    </span>
                  </div>
                </div>

                {/* Status badges */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lifecycleColor(venue.lifecycleState)}`}>
                    {venue.lifecycleState.replace("_", " ")}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {venue.ownershipType}
                  </span>
                  {venue.payplayEnabled && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-medium flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5" /> P&P
                    </span>
                  )}
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    {venue.lgdDistrictCode} District
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="h-3 w-3 text-slate-400" />
                    {venueTypeLabel(venue.venueType)}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Star className="h-3 w-3 text-amber-400" />
                    {venue.communityRating}/5
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    Audit: {formatDate(venue.lastAuditDate)}
                  </div>
                </div>

                {/* Audit score */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Audit Score</span>
                    <span className="font-medium text-slate-900">{venue.auditScore}/40</span>
                  </div>
                  <Progress
                    value={(venue.auditScore / 40) * 100}
                    indicatorColor={venue.auditScore >= 32 ? "bg-green-500" : venue.auditScore >= 20 ? "bg-yellow-500" : "bg-red-500"}
                  />
                </div>

                {/* KYV progress (if not complete) */}
                {venue.kyvProgress < 100 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">KYV Progress</span>
                      <span className="font-medium text-orange-600">{venue.kyvProgress}%</span>
                    </div>
                    <Progress value={venue.kyvProgress} indicatorColor="bg-orange-500" />
                  </div>
                )}

                {/* Compliance summary */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>{venue.subVenues.length} sub-venues</span>
                  <span>
                    {venue.complianceCertificates.filter((c) => c.state === "EXPIRED").length > 0 && (
                      <span className="text-red-600 font-medium mr-2">
                        {venue.complianceCertificates.filter((c) => c.state === "EXPIRED").length} expired cert
                      </span>
                    )}
                    {venue.complianceCertificates.filter((c) => c.state === "EXPIRING_SOON").length > 0 && (
                      <span className="text-yellow-600 font-medium">
                        {venue.complianceCertificates.filter((c) => c.state === "EXPIRING_SOON").length} expiring
                      </span>
                    )}
                    {venue.complianceCertificates.every((c) => c.state === "VALID") && (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> All valid
                      </span>
                    )}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link href={`/admin/venues/${venue.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Eye className="h-3 w-3" /> View
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs">
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Venue</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">District</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Type</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Grade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">P&P</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((venue) => (
                    <tr key={venue.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-base flex-shrink-0">
                            {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : "🏸"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">{venue.nameEn}</p>
                            <p className="text-xs text-slate-500">{venue.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 hidden md:table-cell">{venue.lgdDistrictCode}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-xs text-slate-600">{venueTypeLabel(venue.venueType)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${lifecycleColor(venue.lifecycleState)}`}>
                          {venue.lifecycleState.replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${gradeColor(venue.grade)}`}>
                          {gradeLabel(venue.grade)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {venue.payplayEnabled ? (
                          <span className="flex items-center gap-1 text-xs text-purple-700 font-medium">
                            <Zap className="h-3 w-3" /> On
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">Off</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <Link href={`/admin/venues/${venue.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </Link>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <Edit className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-12 text-center text-slate-500 text-sm">
                  No venues match your filters.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
