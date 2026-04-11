"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, MapPin, Users, Star, Calendar, Shield, CheckCircle2,
  AlertTriangle, XCircle, Building2, Zap, Edit, FileText, Award,
  Phone, Mail, Camera, Trees, Clock, ChevronRight, Download,
  History, Package, Clipboard
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { MOCK_VENUES, MOCK_BOOKINGS } from "@/lib/mock-data";
import {
  gradeColor, gradeLabel, lifecycleColor, formatDate, formatDateTime,
  complianceColor, venueTypeLabel, cn
} from "@/lib/utils";

const KYV_STEPS = [
  "Field Collection",
  "Photo Upload",
  "GPS Verification",
  "Document Upload",
  "SPOC Review",
  "Activation",
];

export default function VenueDetailPage() {
  const { id } = useParams<{ id: string }>();
  const venue = MOCK_VENUES.find((v) => v.id === id) ?? MOCK_VENUES[0];
  const venueBookings = MOCK_BOOKINGS.filter((b) => b.venueId === venue.id);
  const [payplayEnabled, setPayplayEnabled] = useState(venue.payplayEnabled);

  const complianceScore = Math.round(
    (venue.complianceCertificates.filter((c) => c.state === "VALID").length /
      Math.max(venue.complianceCertificates.length, 1)) *
      100
  );

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Link href="/admin/venues">
          <Button variant="ghost" size="sm" className="shrink-0">
            <ArrowLeft className="h-4 w-4" /> Venues
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{venue.nameEn}</h2>
            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${gradeColor(venue.grade)}`}>
              Grade {gradeLabel(venue.grade)}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${lifecycleColor(venue.lifecycleState)}`}>
              {venue.lifecycleState.replace("_", " ")}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{venue.id} · {venue.nameGu}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export</Button>
          <Button size="sm"><Edit className="h-4 w-4" /> Edit Venue</Button>
        </div>
      </div>

      {/* KYV Progress bar */}
      {venue.kyvProgress < 100 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-800">KYV Onboarding In Progress — {venue.kyvProgress}%</span>
            </div>
            <div className="flex gap-2 flex-wrap">
              {KYV_STEPS.map((step, i) => {
                const completed = (i / (KYV_STEPS.length - 1)) * 100 < venue.kyvProgress;
                return (
                  <div key={step} className={cn("flex items-center gap-1.5 text-xs px-2 py-1 rounded-full", completed ? "bg-green-100 text-green-800" : "bg-white text-slate-400 border border-slate-200")}>
                    {completed ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-current" />}
                    {step}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — main info */}
        <div className="lg:col-span-2 space-y-5">
          <Tabs defaultValue="profile">
            <TabsList className="w-full flex-wrap h-auto gap-1">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="sub-venues">Sub-Venues</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="audit">Audit</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Profile tab */}
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-5 space-y-5">
                  {/* Block 1 — Identity */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-800" /> Identity
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Venue ID", value: venue.id },
                        { label: "Type", value: venueTypeLabel(venue.venueType) },
                        { label: "Ownership", value: venue.ownershipType },
                        { label: "Owning Body", value: venue.owningBody },
                        { label: "Operator", value: venue.operatorName },
                        { label: "Primary Sport", value: venue.primarySport },
                        { label: "Indoor/Outdoor", value: venue.indoorOutdoor },
                        { label: "SPOC Revision", value: `v${venue.spocRevision}` },
                      ].map((field) => (
                        <div key={field.label}>
                          <p className="text-xs text-slate-500">{field.label}</p>
                          <p className="text-sm font-medium text-slate-900">{field.value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-slate-500 mb-1">Supported Sports</p>
                      <div className="flex flex-wrap gap-1.5">
                        {venue.supportedSports.map((s) => (
                          <Badge key={s} variant="ghost">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    {venue.aliasNames && venue.aliasNames.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-slate-500 mb-1">Alias Names</p>
                        <p className="text-sm text-slate-700">{venue.aliasNames.join(", ")}</p>
                      </div>
                    )}
                  </section>

                  <Separator />

                  {/* Block 2 — Location */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-800" /> Location & Access
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: "Full Address", value: venue.fullAddress },
                        { label: "Coordinates", value: `${venue.coordinates.lat}°N, ${venue.coordinates.lng}°E` },
                        { label: "LGD State", value: venue.lgdStateCode },
                        { label: "LGD District", value: venue.lgdDistrictCode },
                        { label: "LGD Taluka", value: venue.lgdTalukaCode ?? "—" },
                        { label: "Nearest Transit", value: venue.nearestTransit ?? "—" },
                        { label: "Entry Gates", value: venue.entryGatesCount },
                        { label: "Parking", value: `${venue.parkingCapacity} vehicles` },
                      ].map((field) => (
                        <div key={field.label}>
                          <p className="text-xs text-slate-500">{field.label}</p>
                          <p className="text-sm font-medium text-slate-900">{field.value}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <Separator />

                  {/* Block 3 — Capacity */}
                  <section>
                    <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-800" /> Capacity
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Seating", value: venue.capacitySeating.toLocaleString("en-IN") },
                        { label: "Standing", value: venue.capacityStanding.toLocaleString("en-IN") },
                        { label: "Wheelchair", value: venue.capacityWheelchair },
                        { label: "Women-Only Zones", value: venue.womenOnlyZones ?? "—" },
                        { label: "VIP Enclosure", value: venue.vipEnclosureSeats ?? "—" },
                        { label: "Media Boxes", value: venue.mediaBoxSeats ?? "—" },
                        { label: "Hospitality Boxes", value: venue.hospitalityBoxes ?? "—" },
                        { label: "Helipad", value: venue.helipad ? "Yes" : "No" },
                      ].map((field) => (
                        <div key={field.label} className="bg-slate-50 rounded-lg p-3 text-center">
                          <p className="text-lg font-bold text-slate-900">{field.value}</p>
                          <p className="text-xs text-slate-500">{field.label}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Short history */}
                  {venue.shortHistory && (
                    <>
                      <Separator />
                      <section>
                        <h3 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                          <History className="h-4 w-4 text-blue-800" /> History
                        </h3>
                        <p className="text-sm text-slate-700 leading-relaxed">{venue.shortHistory}</p>
                      </section>
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sub-venues tab */}
            <TabsContent value="sub-venues">
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {venue.subVenues.map((sv) => (
                      <div key={sv.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-sm">{sv.name}</h4>
                            <p className="text-xs text-slate-500">{sv.id}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Badge variant={sv.bookable ? "success" : "ghost"}>
                              {sv.bookable ? "Bookable" : "Not Bookable"}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: "Type", value: sv.type.replace("_", " ") },
                            { label: "Capacity", value: sv.capacity.toLocaleString() },
                            { label: "Base Rate", value: `₹${(sv.baseRatePaise / 100).toLocaleString()}` },
                          ].map((f) => (
                            <div key={f.label} className="bg-slate-50 rounded-lg p-2 text-center">
                              <p className="text-sm font-semibold text-slate-900">{f.value}</p>
                              <p className="text-xs text-slate-500">{f.label}</p>
                            </div>
                          ))}
                        </div>
                        {sv.dependencyLocks.length > 0 && (
                          <p className="mt-2 text-xs text-orange-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Locked when: {sv.dependencyLocks.join(", ")} is booked
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Compliance tab */}
            <TabsContent value="compliance">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Compliance Score</p>
                      <p className="text-xs text-slate-500">{venue.complianceCertificates.filter((c) => c.state === "VALID").length} of {venue.complianceCertificates.length} certificates valid</p>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: complianceScore >= 80 ? "#16a34a" : complianceScore >= 50 ? "#d97706" : "#dc2626" }}>
                      {complianceScore}%
                    </div>
                  </div>
                  <Progress value={complianceScore} indicatorColor={complianceScore >= 80 ? "bg-green-500" : complianceScore >= 50 ? "bg-yellow-500" : "bg-red-500"} className="mb-5" />
                  <div className="space-y-3">
                    {[
                      ...venue.complianceCertificates,
                      { type: "Pool Safety Certificate", issuingBody: "Gujarat Water Authority", state: "MISSING" as const, certificateNumber: "—", issueDate: "—", expiryDate: "—" },
                      { type: "Sports Medicine Certificate", issuingBody: "SAG Medical", state: "MISSING" as const, certificateNumber: "—", issueDate: "—", expiryDate: "—" },
                    ].map((cert, i) => (
                      <div key={i} className={cn("flex items-center justify-between p-3 rounded-xl border", {
                        "border-green-200 bg-green-50": cert.state === "VALID",
                        "border-yellow-200 bg-yellow-50": cert.state === "EXPIRING_SOON",
                        "border-red-200 bg-red-50": cert.state === "EXPIRED",
                        "border-slate-200 bg-slate-50": cert.state === "MISSING",
                      })}>
                        <div className="flex items-center gap-3">
                          {cert.state === "VALID" ? <CheckCircle2 className="h-4 w-4 text-green-600" /> :
                           cert.state === "EXPIRING_SOON" ? <AlertTriangle className="h-4 w-4 text-yellow-600" /> :
                           cert.state === "EXPIRED" ? <XCircle className="h-4 w-4 text-red-600" /> :
                           <div className="h-4 w-4 rounded-full border-2 border-slate-300" />}
                          <div>
                            <p className="text-sm font-medium text-slate-900">{cert.type}</p>
                            <p className="text-xs text-slate-500">{cert.issuingBody}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {cert.state !== "MISSING" ? (
                            <>
                              <p className="text-xs text-slate-600">{cert.certificateNumber}</p>
                              <p className={`text-xs font-medium ${complianceColor(cert.state)}`}>
                                {cert.state === "EXPIRED" ? "Expired" : `Expires ${formatDate(cert.expiryDate)}`}
                              </p>
                            </>
                          ) : (
                            <Badge variant="outline" className="text-xs">Not uploaded</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit tab */}
            <TabsContent value="audit">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Infrastructure Audit Score</p>
                      <p className="text-xs text-slate-500">Last audited {formatDate(venue.lastAuditDate)} · Next due {formatDate(venue.nextAuditDue)}</p>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${venue.auditScore >= 32 ? "text-green-700" : venue.auditScore >= 20 ? "text-yellow-700" : "text-red-700"}`}>
                        {venue.auditScore}
                      </div>
                      <div className="text-xs text-slate-500">/ 40</div>
                    </div>
                  </div>
                  <Progress
                    value={(venue.auditScore / 40) * 100}
                    indicatorColor={venue.auditScore >= 32 ? "bg-green-500" : venue.auditScore >= 20 ? "bg-yellow-500" : "bg-red-500"}
                    className="mb-5"
                  />
                  {/* Ratings */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-amber-400 fill-current" />
                        <span className="text-xl font-bold text-slate-900">{venue.communityRating}</span>
                      </div>
                      <p className="text-xs text-slate-500">Community Rating</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-xl font-bold text-slate-900">{venue.professionalRating}</span>
                      </div>
                      <p className="text-xs text-slate-500">Professional Rating</p>
                    </div>
                  </div>
                  {/* Sample audit parameters */}
                  <div className="space-y-2">
                    {[
                      { param: "Playing Surface Condition", score: 8, max: 10 },
                      { param: "Changing Rooms & Facilities", score: 7, max: 8 },
                      { param: "Safety & Emergency Equipment", score: 9, max: 10 },
                      { param: "Accessibility (Divyangjan)", score: 6, max: 8 },
                      { param: "Lighting & Electrical", score: 4, max: 4 },
                    ].map((p) => (
                      <div key={p.param}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-slate-600">{p.param}</span>
                          <span className="font-medium text-slate-900">{p.score}/{p.max}</span>
                        </div>
                        <Progress value={(p.score / p.max) * 100} className="h-1.5" indicatorColor={p.score / p.max >= 0.8 ? "bg-green-500" : p.score / p.max >= 0.6 ? "bg-yellow-500" : "bg-red-500"} />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Team tab */}
            <TabsContent value="team">
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {[
                      { label: "Venue Manager", person: venue.venueManager, icon: "👔" },
                      { label: "Medical Lead", person: venue.medicalLead, icon: "⚕️" },
                      { label: "Security Head", person: venue.securityHead, icon: "🛡️" },
                      ...(venue.deputyManager ? [{ label: "Deputy Manager", person: venue.deputyManager, icon: "👤" }] : []),
                      ...(venue.federationLiaison ? [{ label: "Federation Liaison", person: venue.federationLiaison, icon: "🤝" }] : []),
                    ].map((member) => (
                      <div key={member.label} className="flex items-start gap-4 p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-2xl flex-shrink-0">
                          {member.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <p className="font-semibold text-slate-900">{member.person.name}</p>
                            <Badge variant="ghost" className="text-xs">{member.label}</Badge>
                          </div>
                          <p className="text-xs text-slate-500 mb-2">{member.person.role}</p>
                          <div className="flex flex-wrap gap-3 text-xs text-slate-600">
                            <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{member.person.mobile}</span>
                            <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{member.person.email}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">24×7 Emergency</p>
                        <p className="text-sm font-medium text-slate-900 flex items-center gap-1.5 mt-0.5">
                          <Phone className="h-3.5 w-3.5 text-red-500" /> {venue.emergencyNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Local Police Station</p>
                        <p className="text-sm font-medium text-slate-900 mt-0.5">{venue.localPolicePS}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings tab */}
            <TabsContent value="bookings">
              <Card>
                <CardContent className="p-5">
                  {venueBookings.length === 0 ? (
                    <p className="text-center text-slate-500 py-8 text-sm">No bookings for this venue yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {venueBookings.map((booking) => (
                        <Link key={booking.id} href={`/admin/bookings/${booking.id}`}>
                          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors cursor-pointer">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">{booking.eventName}</p>
                              <p className="text-xs text-slate-500">{booking.id} · {booking.requesterName}</p>
                            </div>
                            <div className="flex flex-col items-end gap-1 shrink-0">
                              <Badge variant="outline" className="text-xs">{booking.track}</Badge>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${booking.state === "APPROVED" ? "bg-green-100 text-green-700" : booking.state === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                {booking.state}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* History tab */}
            <TabsContent value="history">
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {[
                      { action: "Venue profile updated — Block 3 capacity revised", by: "Snehal Mehta (SPOC)", at: "2026-04-01T10:00:00Z", icon: "✏️" },
                      { action: "Compliance certificate uploaded — Fire NOC renewed", by: "Rajesh Patel (Venue Manager)", at: "2025-03-01T09:00:00Z", icon: "📋" },
                      { action: "Grade upgraded from A to A+", by: "SPOC Review", at: "2025-01-15T14:00:00Z", icon: "⬆️" },
                      { action: "Pay & Play toggle changed → Disabled", by: "DSO Ahmedabad", at: "2024-12-01T11:00:00Z", icon: "🔄" },
                      { action: "Venue activated (SPOC e-signed)", by: "Snehal Mehta (SPOC)", at: "2024-04-01T10:00:00Z", icon: "✅" },
                      { action: "KYV Intake submitted", by: "Arjun Bhai Patel (Field Officer)", at: "2024-01-15T08:00:00Z", icon: "📝" },
                    ].map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="text-xl flex-shrink-0">{entry.icon}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{entry.action}</p>
                          <p className="text-xs text-slate-500">{entry.by} · {formatDateTime(entry.at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right — sidebar info */}
        <div className="space-y-4">
          {/* Quick stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Capacity (Seating)", value: venue.capacitySeating.toLocaleString("en-IN") },
                { label: "Sub-Venues", value: venue.subVenues.length },
                { label: "Audit Score", value: `${venue.auditScore}/40` },
                { label: "Community Rating", value: `⭐ ${venue.communityRating}/5` },
                { label: "SPOC Signed", value: formatDate(venue.spocSignedAt) },
                { label: "Last Updated", value: formatDate(venue.updatedAt) },
              ].map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-medium text-slate-900">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pay & Play toggle */}
          <Card className={cn("border-2", payplayEnabled ? "border-purple-200" : "border-slate-200")}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Zap className={cn("h-4 w-4", payplayEnabled ? "text-purple-600" : "text-slate-400")} />
                  <span className="text-sm font-semibold text-slate-900">Pay & Play</span>
                </div>
                <Switch
                  checked={payplayEnabled}
                  onCheckedChange={setPayplayEnabled}
                  aria-label="Toggle Pay and Play"
                />
              </div>
              <p className={cn("text-xs", payplayEnabled ? "text-purple-700" : "text-slate-500")}>
                {payplayEnabled
                  ? `Enabled by ${venue.payplayToggledBy ?? "DSO"} on ${venue.payplayToggledAt ? formatDate(venue.payplayToggledAt) : "—"}`
                  : "Disabled — DSO can toggle to open citizen booking"}
              </p>
              {!payplayEnabled && (
                <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" /> Requires e-Sign confirmation
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming Bookings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {venueBookings.filter((b) => b.state === "APPROVED").length === 0 ? (
                <p className="text-slate-400">No approved bookings</p>
              ) : (
                venueBookings.filter((b) => b.state === "APPROVED").map((b) => (
                  <div key={b.id} className="p-2 bg-green-50 rounded-lg">
                    <p className="font-medium text-slate-900 truncate">{b.eventName}</p>
                    <p className="text-slate-500">{formatDate(b.startAt)}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Action buttons */}
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
              <FileText className="h-4 w-4" /> Generate Compliance Report
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
              <Clipboard className="h-4 w-4" /> Schedule Audit
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2 text-sm">
              <Camera className="h-4 w-4" /> Upload Media
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
