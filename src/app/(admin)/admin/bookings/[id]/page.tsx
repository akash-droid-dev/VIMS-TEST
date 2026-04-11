"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, XCircle, MessageSquare, Clock,
  Shield, FileText, Calendar, Users, Building2, AlertTriangle,
  ChevronRight, Download, RotateCcw, Eye, Pen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { MOCK_BOOKINGS, MOCK_VENUES } from "@/lib/mock-data";
import {
  bookingStateColor, formatDate, formatDateTime, formatCurrency,
  slaHealth, slaColor, cn
} from "@/lib/utils";

const TRACK_COLORS: Record<string, string> = {
  GOVERNMENT: "bg-blue-100 text-blue-800",
  FEDERATION: "bg-purple-100 text-purple-800",
  COMMERCIAL: "bg-orange-100 text-orange-800",
  PAY_AND_PLAY: "bg-green-100 text-green-800",
};

const STEP_ROLES: Record<string, string> = {
  GOVERNMENT: "DSO → SPOC → Commissionerate → Super Admin",
  FEDERATION: "DSO → SPOC → Commissionerate",
  COMMERCIAL: "DSO → SPOC",
  PAY_AND_PLAY: "Auto",
};

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const booking = MOCK_BOOKINGS.find((b) => b.id === id) ?? MOCK_BOOKINGS[0];
  const venue = MOCK_VENUES.find((v) => v.id === booking.venueId);
  const [remarks, setRemarks] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const slah = booking.slaDeadline ? slaHealth(booking.slaDeadline) : "OK";
  const approvalProgress = Math.round((booking.approvalChain.filter((s) => s.status === "APPROVED").length / booking.approvalChain.length) * 100);

  const handleAction = async (action: string) => {
    setActionLoading(action);
    await new Promise((r) => setTimeout(r, 800));
    setActionLoading(null);
    alert(`${action} action recorded. e-Sign flow would trigger here.`);
  };

  const canAct = ["SUBMITTED", "UNDER_REVIEW"].includes(booking.state);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4 flex-wrap">
        <Link href="/admin/bookings">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Bookings</Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-slate-900">{booking.eventName ?? booking.id}</h2>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${TRACK_COLORS[booking.track]}`}>
              {booking.track.replace("_"," ")}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${bookingStateColor(booking.state)}`}>
              {booking.state.replace("_"," ")}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{booking.id} · {booking.venueName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Download File</Button>
          {booking.state === "APPROVED" && (
            <a href={`/bookings/status/${booking.id}`} target="_blank">
              <Button variant="outline" size="sm"><Eye className="h-4 w-4" /> Public Status</Button>
            </a>
          )}
        </div>
      </div>

      {/* SLA alert */}
      {booking.slaDeadline && slah !== "OK" && (
        <Card className={cn("border-2", slah === "BREACHED" ? "border-red-400 bg-red-50" : "border-yellow-400 bg-yellow-50")}>
          <CardContent className="p-3 flex items-center gap-3">
            <AlertTriangle className={cn("h-5 w-5 shrink-0", slah === "BREACHED" ? "text-red-600" : "text-yellow-600")} />
            <div>
              <p className={cn("text-sm font-semibold", slah === "BREACHED" ? "text-red-800" : "text-yellow-800")}>
                {slah === "BREACHED" ? "SLA Breached" : "SLA Warning"} — Deadline: {formatDate(booking.slaDeadline)}
              </p>
              <p className={cn("text-xs", slah === "BREACHED" ? "text-red-600" : "text-yellow-600")}>
                {slah === "BREACHED" ? "This file has exceeded the approval window. Escalation triggered." : "Less than 48 hours remaining. Please act promptly."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — details */}
        <div className="lg:col-span-2 space-y-5">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="approval">Approval Chain</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardContent className="p-5 space-y-5">
                  {/* Event details */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Booking ID", value: booking.id },
                      { label: "Track", value: booking.track.replace("_"," ") },
                      { label: "Venue", value: booking.venueName },
                      { label: "District", value: booking.districtCode },
                      { label: "Start Date", value: formatDateTime(booking.startAt) },
                      { label: "End Date", value: formatDateTime(booking.endAt) },
                      { label: "Expected Attendance", value: booking.expectedAttendance?.toLocaleString() ?? "—" },
                      { label: "Sub-Venues", value: booking.subVenueIds.join(", ") || "—" },
                    ].map((f) => (
                      <div key={f.label}>
                        <p className="text-xs text-slate-500">{f.label}</p>
                        <p className="text-sm font-medium text-slate-900">{f.value}</p>
                      </div>
                    ))}
                  </div>

                  {booking.eventDescription && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Event Description</p>
                        <p className="text-sm text-slate-700 leading-relaxed">{booking.eventDescription}</p>
                      </div>
                    </>
                  )}

                  <Separator />

                  {/* Requester */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Requester</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Name", value: booking.requesterName },
                        { label: "Organisation", value: booking.requesterOrg ?? "—" },
                        { label: "User ID", value: booking.requestedBy },
                      ].map((f) => (
                        <div key={f.label}>
                          <p className="text-xs text-slate-500">{f.label}</p>
                          <p className="text-sm font-medium text-slate-900">{f.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment */}
                  <div>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Payment</p>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div>
                        <p className="text-2xl font-bold text-slate-900">{formatCurrency(booking.amountPaise)}</p>
                        <p className="text-xs text-slate-500">Total amount</p>
                      </div>
                      <Badge variant={
                        booking.paymentState === "PAID" ? "success" :
                        booking.paymentState === "PENDING" ? "warning" :
                        booking.paymentState === "REFUNDED" ? "info" : "destructive"
                      }>
                        {booking.paymentState}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="approval">
              <Card>
                <CardContent className="p-5">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-slate-700">Approval Progress</span>
                      <span className="font-bold text-slate-900">{approvalProgress}%</span>
                    </div>
                    <Progress value={approvalProgress} indicatorColor={approvalProgress === 100 ? "bg-green-500" : "bg-blue-800"} />
                    <p className="text-xs text-slate-500 mt-1">Chain: {STEP_ROLES[booking.track]}</p>
                  </div>

                  <div className="space-y-3">
                    {booking.approvalChain.map((step, i) => (
                      <div key={i} className={cn("flex gap-4 p-4 rounded-xl border", {
                        "border-green-200 bg-green-50": step.status === "APPROVED",
                        "border-red-200 bg-red-50": step.status === "REJECTED",
                        "border-yellow-200 bg-yellow-50": step.status === "QUERIED",
                        "border-blue-200 bg-blue-50": step.status === "PENDING",
                        "border-slate-200 bg-slate-50": step.status === "DELEGATED",
                      })}>
                        <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", {
                          "bg-green-500 text-white": step.status === "APPROVED",
                          "bg-red-500 text-white": step.status === "REJECTED",
                          "bg-yellow-500 text-white": step.status === "QUERIED",
                          "bg-blue-800 text-white": step.status === "PENDING",
                          "bg-slate-400 text-white": step.status === "DELEGATED",
                        })}>
                          {step.status === "APPROVED" ? "✓" : step.status === "REJECTED" ? "✕" : step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-slate-900 text-sm">{step.role}</p>
                            <Badge variant={
                              step.status === "APPROVED" ? "success" :
                              step.status === "REJECTED" ? "destructive" :
                              step.status === "QUERIED" ? "warning" :
                              step.status === "PENDING" ? "default" : "ghost"
                            } className="text-xs">
                              {step.status}
                            </Badge>
                          </div>
                          {step.assigneeName && (
                            <p className="text-xs text-slate-600">{step.assigneeName} ({step.assignee})</p>
                          )}
                          {step.actionAt && (
                            <p className="text-xs text-slate-500">Actioned: {formatDateTime(step.actionAt)}</p>
                          )}
                          {step.remarks && (
                            <p className="text-xs text-slate-700 mt-1 italic">"{step.remarks}"</p>
                          )}
                          {step.eSignHash && (
                            <p className="text-xs text-green-600 font-mono mt-1">e-Sign: {step.eSignHash}</p>
                          )}
                          {step.status === "PENDING" && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                              <Clock className="h-3 w-3" /> Awaiting action
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    {[
                      { name: "Event Proposal Brief", type: "PDF", size: "2.3 MB", uploaded: true },
                      { name: "Organisation Registration Certificate", type: "PDF", size: "1.1 MB", uploaded: true },
                      { name: "Insurance Certificate", type: "PDF", size: "0.8 MB", uploaded: false },
                      { name: "Security Plan", type: "PDF", size: "—", uploaded: false },
                    ].map((doc, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                        <FileText className={cn("h-5 w-5 shrink-0", doc.uploaded ? "text-blue-600" : "text-slate-300")} />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-900">{doc.name}</p>
                          <p className="text-xs text-slate-500">{doc.type} {doc.uploaded ? `· ${doc.size}` : "· Not uploaded"}</p>
                        </div>
                        {doc.uploaded ? (
                          <Button variant="outline" size="sm" className="text-xs h-7"><Download className="h-3 w-3" /></Button>
                        ) : (
                          <Badge variant="warning" className="text-xs">Required</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {[
                      { event: "Booking submitted by requester", by: booking.requesterName, at: booking.createdAt, icon: "📝" },
                      ...booking.approvalChain.filter((s) => s.actionAt).map((s) => ({
                        event: `${s.role} ${s.status.toLowerCase()} booking`,
                        by: s.assigneeName ?? s.role,
                        at: s.actionAt ?? "",
                        icon: s.status === "APPROVED" ? "✅" : s.status === "REJECTED" ? "❌" : "💬",
                      })),
                      ...(booking.state === "PENDING_PAYMENT" ? [{ event: "Payment link sent to requester", by: "System", at: booking.updatedAt, icon: "💳" }] : []),
                    ].map((entry, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="text-xl flex-shrink-0">{entry.icon}</div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{entry.event}</p>
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

        {/* Right — actions */}
        <div className="space-y-4">
          {/* Action panel */}
          {canAct && (
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-blue-900">Approval Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Remarks / Query</label>
                  <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional remarks for your action..."
                    rows={3}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  loading={actionLoading === "approve"}
                  onClick={() => handleAction("approve")}
                >
                  <CheckCircle2 className="h-4 w-4" /> Approve & e-Sign
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-50"
                  loading={actionLoading === "query"}
                  onClick={() => handleAction("query")}
                >
                  <MessageSquare className="h-4 w-4" /> Raise Query
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  loading={actionLoading === "reject"}
                  onClick={() => handleAction("reject")}
                >
                  <XCircle className="h-4 w-4" /> Reject
                </Button>
                <p className="text-xs text-blue-700 text-center">All actions require NIC e-Sign</p>
              </CardContent>
            </Card>
          )}

          {/* Quick info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quick Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[
                { label: "Track", value: booking.track.replace("_"," ") },
                { label: "District", value: booking.districtCode },
                { label: "Pending On", value: booking.pendingOn ?? "—" },
                { label: "SLA Deadline", value: booking.slaDeadline ? formatDate(booking.slaDeadline) : "—" },
                { label: "Amount", value: formatCurrency(booking.amountPaise) },
                { label: "Payment", value: booking.paymentState },
                { label: "Created", value: formatDate(booking.createdAt) },
              ].map((s) => (
                <div key={s.label} className="flex justify-between">
                  <span className="text-slate-500">{s.label}</span>
                  <span className="font-medium text-slate-900">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Venue info */}
          {venue && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Venue Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium text-slate-900">{venue.nameEn}</p>
                <p className="text-xs text-slate-500">{venue.fullAddress}</p>
                <div className="flex gap-2">
                  <Badge variant="ghost">{venue.venueType.replace("_"," ")}</Badge>
                  <Badge variant={venue.lifecycleState === "ACTIVE" ? "success" : "warning"}>{venue.lifecycleState}</Badge>
                </div>
                <Link href={`/admin/venues/${venue.id}`}>
                  <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                    <Building2 className="h-3 w-3" /> View Venue Profile
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
