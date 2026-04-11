"use client";
import React from "react";
import Link from "next/link";
import {
  Building2, CalendarCheck, Zap, AlertTriangle, TrendingUp,
  Users, FileSearch, ShieldAlert, ArrowUpRight, Clock, CheckCircle2,
  XCircle, ChevronRight, Trophy, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  formatCurrency, formatDateTime, bookingStateColor,
  lifecycleColor, gradeColor, gradeLabel, timeAgo
} from "@/lib/utils";
import {
  MOCK_DASHBOARD_STATS, MOCK_BOOKINGS, MOCK_VENUES,
  MOCK_REVENUE_DATA, MOCK_VENUE_TYPE_DATA, MOCK_DISTRICT_STATS
} from "@/lib/mock-data";

const KPI_CARDS = [
  {
    label: "Total Venues", value: "1,184", sub: "+47 pending KYV", icon: Building2,
    color: "text-blue-800", bg: "bg-blue-50", trend: "+4.2%",
  },
  {
    label: "Active Venues", value: "892", sub: "75.3% of total", icon: Trophy,
    color: "text-green-700", bg: "bg-green-50", trend: "+2.1%",
  },
  {
    label: "Pending Approvals", value: "23", sub: "Across 3 districts", icon: Clock,
    color: "text-orange-700", bg: "bg-orange-50", trend: "-3 today",
  },
  {
    label: "Pay & Play Venues", value: "234", sub: "DSO-enabled", icon: Zap,
    color: "text-purple-700", bg: "bg-purple-50", trend: "+8 this month",
  },
  {
    label: "Revenue (Apr)", value: formatCurrency(MOCK_DASHBOARD_STATS.revenueThisMonth), sub: "All tracks combined", icon: TrendingUp,
    color: "text-emerald-700", bg: "bg-emerald-50", trend: "+8.3%",
  },
  {
    label: "Compliance Alerts", value: "18", sub: "Certificates expiring", icon: ShieldAlert,
    color: "text-red-700", bg: "bg-red-50", trend: "Urgent",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5">Gujarat State Sports Venue Platform — Phase 1A Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileSearch className="h-4 w-4" /> Export Report
          </Button>
          <Button size="sm">
            <Building2 className="h-4 w-4" /> Add Venue
          </Button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {KPI_CARDS.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-lg ${kpi.bg} mb-3`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div className="text-xl font-bold text-slate-900 mb-0.5">{kpi.value}</div>
              <div className="text-xs text-slate-500 mb-1">{kpi.label}</div>
              <div className="text-xs font-medium text-green-600">{kpi.trend}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly booking revenue across all tracks (₹ in Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [formatCurrency(Number(v)), "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="#1e40af" fill="url(#revGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Venue type pie */}
        <Card>
          <CardHeader>
            <CardTitle>Venues by Type</CardTitle>
            <CardDescription>Distribution across 1,184 venues</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={MOCK_VENUE_TYPE_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                  {MOCK_VENUE_TYPE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, name) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1 mt-2">
              {MOCK_VENUE_TYPE_DATA.slice(0, 4).map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-600">{d.name}</span>
                  </div>
                  <span className="font-medium text-slate-900">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District bar chart + pending approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District stats */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>District-wise Venue Activity</CardTitle>
            <CardDescription>Top 6 districts by active venues and Pay & Play</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_DISTRICT_STATS} barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="district" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
                <Bar dataKey="active" name="Active" fill="#1e40af" radius={[2, 2, 0, 0]} />
                <Bar dataKey="payplay" name="Pay & Play" fill="#f97316" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending approvals */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Approvals</CardTitle>
              <Badge variant="destructive">{MOCK_BOOKINGS.filter((b) => ["SUBMITTED", "UNDER_REVIEW"].includes(b.state)).length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_BOOKINGS.filter((b) => ["SUBMITTED", "UNDER_REVIEW"].includes(b.state)).map((booking) => (
              <div key={booking.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="mt-0.5 flex-shrink-0">
                  <Clock className="h-4 w-4 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-900 truncate">{booking.eventName || booking.id}</p>
                  <p className="text-xs text-slate-500 truncate">{booking.venueName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant="warning" className="text-[10px] px-1.5 py-0">{booking.track}</Badge>
                    <span className="text-[10px] text-slate-400">{booking.id}</span>
                  </div>
                </div>
                <Link href={`/bookings/${booking.id}`}>
                  <ChevronRight className="h-4 w-4 text-slate-400 hover:text-blue-800 transition-colors" />
                </Link>
              </div>
            ))}
            <Separator />
            <Link href="/bookings">
              <Button variant="ghost" size="sm" className="w-full text-xs text-blue-800">
                View All Bookings <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent venues + Compliance alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent venues */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Recent Venues</CardTitle>
              <Link href="/venues">
                <Button variant="ghost" size="sm" className="text-xs text-blue-800">View all <ArrowUpRight className="h-3 w-3" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MOCK_VENUES.slice(0, 4).map((venue) => (
                <Link key={venue.id} href={`/venues/${venue.id}`}>
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-lg flex-shrink-0">
                      {venue.venueType === "STADIUM" ? "🏟️" : venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "INDOOR_HALL" ? "🏸" : "⚽"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{venue.nameEn}</p>
                      <p className="text-xs text-slate-500 truncate">{venue.lgdDistrictCode} · {venue.primarySport}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full border ${gradeColor(venue.grade)}`}>
                        {gradeLabel(venue.grade)}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${lifecycleColor(venue.lifecycleState)}`}>
                        {venue.lifecycleState}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Compliance alerts */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Compliance Alerts</CardTitle>
              <Link href="/compliance">
                <Button variant="ghost" size="sm" className="text-xs text-blue-800">View all <ArrowUpRight className="h-3 w-3" /></Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { venue: "Surat Indoor Stadium", cert: "Fire NOC", status: "EXPIRED", days: -15, district: "SRT" },
                { venue: "SAG Aquatics Centre", cert: "Fire NOC", status: "EXPIRING_SOON", days: 22, district: "AHM" },
                { venue: "Gandhinagar Sports Complex", cert: "Electrical Inspection", status: "EXPIRING_SOON", days: 18, district: "GAN" },
                { venue: "Bhavnagar Multi-Purpose Hall", cert: "Lift Certificate", status: "EXPIRED", days: -8, district: "BHV" },
              ].map((alert, i) => (
                <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`mt-0.5 flex-shrink-0 ${alert.status === "EXPIRED" ? "text-red-500" : "text-yellow-500"}`}>
                    {alert.status === "EXPIRED" ? <XCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-slate-900 truncate">{alert.venue}</p>
                    <p className="text-xs text-slate-500">{alert.cert} · {alert.district}</p>
                  </div>
                  <Badge variant={alert.status === "EXPIRED" ? "destructive" : "warning"} className="text-[10px] shrink-0">
                    {alert.days < 0 ? `${Math.abs(alert.days)}d overdue` : `${alert.days}d left`}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
