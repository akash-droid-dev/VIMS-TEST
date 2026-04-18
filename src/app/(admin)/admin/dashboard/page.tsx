"use client";
import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2, CalendarCheck, Zap, AlertTriangle, TrendingUp,
  Users, FileSearch, ShieldAlert, ArrowUpRight, Clock,
  XCircle, ChevronRight, Trophy, Activity,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TiltCard } from "@/components/ui/tilt-card";
import { useSound } from "@/hooks/useSound";
import {
  formatCurrency, formatDateTime, bookingStateColor,
  lifecycleColor, gradeColor, gradeLabel, timeAgo,
} from "@/lib/utils";
import {
  MOCK_DASHBOARD_STATS, MOCK_BOOKINGS, MOCK_VENUES,
  MOCK_REVENUE_DATA, MOCK_VENUE_TYPE_DATA, MOCK_DISTRICT_STATS,
} from "@/lib/mock-data";

/* ── Chart light theme ───────────────────────────────────────── */
const CHART_GRID = "#e2e8f0";
const CHART_TICK = { fill: "#64748b", fontSize: 11 };
const CHART_TIP  = {
  contentStyle: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    color: "#0f172a",
    boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
    padding: "10px 14px",
  },
  labelStyle: { color: "#64748b" },
};

/* ── KPI card definitions ────────────────────────────────────── */
const KPI_CARDS = [
  {
    label: "Total Venues",       value: "8,500+", sub: "+312 pending KYV", Icon: Building2,
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50 border border-blue-100",   iconClass: "text-blue-600",
    valueClass: "gradient-text-blue",
    trend: "+4.2%", trendClass: "chip-emerald px-2 py-0.5 text-xs",
  },
  {
    label: "Active Venues",      value: "6,800+", sub: "80.0% of total", Icon: Trophy,
    borderColor: "border-l-emerald-500",
    iconBg: "bg-emerald-50 border border-emerald-100", iconClass: "text-emerald-600",
    valueClass: "gradient-text-emerald",
    trend: "+2.1%", trendClass: "chip-emerald px-2 py-0.5 text-xs",
  },
  {
    label: "Pending Approvals",  value: "187",   sub: "Across 14 states", Icon: Clock,
    borderColor: "border-l-amber-500",
    iconBg: "bg-amber-50 border border-amber-100",  iconClass: "text-amber-600",
    valueClass: "gradient-text-gold",
    trend: "-3 today", trendClass: "chip-amber px-2 py-0.5 text-xs",
  },
  {
    label: "Pay & Play",         value: "1,800+", sub: "DSO-enabled slots", Icon: Zap,
    borderColor: "border-l-purple-500",
    iconBg: "bg-purple-50 border border-purple-100", iconClass: "text-purple-600",
    valueClass: "text-purple-700 text-2xl font-black",
    trend: "+8 this month", trendClass: "chip-purple px-2 py-0.5 text-xs",
  },
  {
    label: "Revenue (Apr)",      value: formatCurrency(MOCK_DASHBOARD_STATS.revenueThisMonth), sub: "All tracks combined", Icon: TrendingUp,
    borderColor: "border-l-blue-500",
    iconBg: "bg-blue-50 border border-blue-100",   iconClass: "text-blue-600",
    valueClass: "gradient-text-blue",
    trend: "+8.3%", trendClass: "chip-emerald px-2 py-0.5 text-xs",
  },
  {
    label: "Compliance Alerts",  value: "18",    sub: "Certificates expiring", Icon: ShieldAlert,
    borderColor: "border-l-red-500",
    iconBg: "bg-red-50 border border-red-100",    iconClass: "text-red-600",
    valueClass: "text-red-600 text-2xl font-black",
    trend: "Urgent", trendClass: "chip-red px-2 py-0.5 text-xs",
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { playHover, playClick, playNav } = useSound();

  const handleExportReport = useCallback(() => {
    playClick();
    const rows = [
      ["Venue ID", "Name", "District", "Sport", "Grade", "State", "Pay & Play", "Rating"],
      ...MOCK_VENUES.map((v) => [
        v.id, v.nameEn, v.lgdDistrictCode, v.primarySport,
        v.grade, v.lifecycleState, v.payplayEnabled ? "Yes" : "No",
        v.communityRating.toString(),
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `GVIMS_Venue_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [playClick]);

  return (
    <div className="space-y-6 relative">

      {/* Subtle mesh background orbs */}
      <div className="orb orb-blue   w-[450px] h-[450px] top-[-80px]  right-[-60px] opacity-40 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />
      <div className="orb orb-purple w-[350px] h-[350px] bottom-[60px] left-[-60px] opacity-30 pointer-events-none" style={{ position: "fixed", zIndex: 0 }} />

      {/* Page heading */}
      <div className="flex items-start justify-between flex-wrap gap-4 relative z-10">
        <div>
          <h2 className="text-2xl font-black gradient-text">Command Dashboard</h2>
          <p className="text-slate-500 text-sm mt-0.5">India National Sports Venue Platform — Phase 1 Overview</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <FileSearch className="h-4 w-4" /> Export Report
          </Button>
          <Button size="sm" onClick={() => { playNav(); router.push("/admin/venues/new"); }}>
            <Building2 className="h-4 w-4" /> Add Venue
          </Button>
        </div>
      </div>

      {/* KPI Grid with 3D Tilt + Sound */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 relative z-10">
        {KPI_CARDS.map((kpi, i) => (
          <TiltCard key={kpi.label} intensity={8} scale={1.03}>
            <div
              className={`bg-white border-l-4 ${kpi.borderColor} rounded-2xl overflow-hidden cursor-default shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-shadow duration-300`}
              style={{ animation: `fadeSlideUp 0.5s ease-out ${i * 0.06}s both` }}
              onMouseEnter={playHover}
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${kpi.iconBg}`}>
                    <kpi.Icon className={`h-4 w-4 ${kpi.iconClass}`} />
                  </div>
                  <span className={kpi.trendClass}>{kpi.trend}</span>
                </div>
                <div className={`text-2xl font-black mb-0.5 ${kpi.valueClass}`}>{kpi.value}</div>
                <div className="text-xs text-slate-600 font-medium">{kpi.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{kpi.sub}</div>
              </div>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* Revenue trend */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" /> Revenue Trend
            </CardTitle>
            <CardDescription>Monthly booking revenue across all tracks (₹ in Lakhs)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={MOCK_REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#2563eb" stopOpacity={0.20} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                <XAxis dataKey="month" tick={CHART_TICK} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} tick={CHART_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TIP} formatter={(v) => [formatCurrency(Number(v)), "Revenue"]} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2563eb"
                  fill="url(#revGrad)"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: "#2563eb", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Venue type donut */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-cyan-600" /> Venues by Type
            </CardTitle>
            <CardDescription>Distribution across 8,500+ venues</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={MOCK_VENUE_TYPE_DATA}
                  cx="50%" cy="50%"
                  innerRadius={42} outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {MOCK_VENUE_TYPE_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} opacity={0.9} />
                  ))}
                </Pie>
                <Tooltip {...CHART_TIP} formatter={(v, name) => [v, name]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {MOCK_VENUE_TYPE_DATA.slice(0, 4).map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ background: d.color }} />
                    <span className="text-slate-500">{d.name}</span>
                  </div>
                  <span className="font-semibold text-slate-700">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District chart + pending approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 relative z-10">
        {/* District stats */}
        <Card className="lg:col-span-2 card-hover">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-600" /> State-wise Activity
            </CardTitle>
            <CardDescription>Top 6 states by active venues and Pay &amp; Play</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={MOCK_DISTRICT_STATS} barSize={14}>
                <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID} />
                <XAxis dataKey="district" tick={CHART_TICK} axisLine={false} tickLine={false} />
                <YAxis tick={CHART_TICK} axisLine={false} tickLine={false} />
                <Tooltip {...CHART_TIP} />
                <Legend
                  iconType="circle"
                  iconSize={7}
                  formatter={(val) => <span style={{ color: "#64748b", fontSize: 11 }}>{val}</span>}
                />
                <Bar dataKey="active"  name="Active"      fill="#2563eb" radius={[3, 3, 0, 0]} opacity={0.85} />
                <Bar dataKey="payplay" name="Pay & Play"  fill="#f59e0b" radius={[3, 3, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pending approvals */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" /> Pending
              </CardTitle>
              <Badge variant="warning">
                {MOCK_BOOKINGS.filter((b) => ["SUBMITTED", "UNDER_REVIEW"].includes(b.state)).length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {MOCK_BOOKINGS.filter((b) => ["SUBMITTED", "UNDER_REVIEW"].includes(b.state)).map((booking) => (
              <div
                key={booking.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
              >
                <div className="mt-0.5 flex-shrink-0 h-7 w-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center">
                  <Clock className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{booking.eventName || booking.id}</p>
                  <p className="text-[11px] text-slate-500 truncate">{booking.venueName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Badge variant="warning" className="text-[9px] px-1.5 py-0">{booking.track}</Badge>
                  </div>
                </div>
                <Link href={`/admin/bookings/${booking.id}`}>
                  <ChevronRight className="h-4 w-4 text-slate-300 hover:text-blue-600 group-hover:text-blue-500 transition-colors" />
                </Link>
              </div>
            ))}
            <Separator className="bg-slate-100" />
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="w-full text-xs text-blue-600 hover:text-blue-700">
                View All Bookings <ArrowUpRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent venues + Compliance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10">
        {/* Recent venues */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-cyan-600" /> Recent Venues
              </CardTitle>
              <Link href="/admin/venues">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {MOCK_VENUES.slice(0, 4).map((venue) => (
                <Link key={venue.id} href={`/admin/venues/${venue.id}`}>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl flex-shrink-0">
                      {venue.venueType === "STADIUM" ? "🏟️"
                        : venue.venueType === "SWIMMING_POOL" ? "🏊"
                        : venue.venueType === "INDOOR_HALL" ? "🏸"
                        : "⚽"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{venue.nameEn}</p>
                      <p className="text-xs text-slate-500 truncate">{venue.lgdDistrictCode} · {venue.primarySport}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gradeColor(venue.grade)}`}>
                        {gradeLabel(venue.grade)}
                      </span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${lifecycleColor(venue.lifecycleState)}`}>
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
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" /> Compliance Alerts
              </CardTitle>
              <Link href="/admin/compliance">
                <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700">
                  View all <ArrowUpRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1.5">
              {[
                { venue: "Nehru Indoor Stadium, Chennai",  cert: "Fire NOC",              status: "EXPIRED",        days: -15, district: "TN" },
                { venue: "SAG Aquatics Centre, Ahmedabad",cert: "Fire NOC",              status: "EXPIRING_SOON",  days: 22,  district: "GJ" },
                { venue: "Balewadi Complex, Pune",        cert: "Electrical Inspection", status: "EXPIRING_SOON",  days: 18,  district: "MH" },
                { venue: "Kanteerava Stadium, Bengaluru", cert: "Lift Certificate",      status: "EXPIRED",        days: -8,  district: "KA" },
              ].map((alert, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                >
                  <div className={`mt-0.5 flex-shrink-0 h-7 w-7 rounded-lg flex items-center justify-center ${
                    alert.status === "EXPIRED"
                      ? "bg-red-50 border border-red-100"
                      : "bg-amber-50 border border-amber-100"
                  }`}>
                    {alert.status === "EXPIRED"
                      ? <XCircle       className="h-3.5 w-3.5 text-red-600" />
                      : <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{alert.venue}</p>
                    <p className="text-[11px] text-slate-500">{alert.cert} · {alert.district}</p>
                  </div>
                  <Badge variant={alert.status === "EXPIRED" ? "destructive" : "warning"} className="text-[9px] shrink-0">
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
