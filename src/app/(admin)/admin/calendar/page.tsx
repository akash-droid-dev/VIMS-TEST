"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar, Building2, Zap, Wrench, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_VENUES, MOCK_BOOKINGS } from "@/lib/mock-data";
import { cn, formatDate } from "@/lib/utils";
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, addMonths, subMonths } from "date-fns";

const OVERLAY_COLORS = {
  BOOKING: { bg: "bg-blue-500", text: "text-blue-800", light: "bg-blue-100" },
  PAYPLAY: { bg: "bg-purple-500", text: "text-purple-800", light: "bg-purple-100" },
  MAINTENANCE: { bg: "bg-orange-500", text: "text-orange-800", light: "bg-orange-100" },
  BLOCK: { bg: "bg-red-500", text: "text-red-800", light: "bg-red-100" },
  VVIP: { bg: "bg-yellow-500", text: "text-yellow-800", light: "bg-yellow-100" },
};

// Generate mock calendar events
const CALENDAR_EVENTS = [
  { id: "ev1", title: "Gujarat State Athletics Championship", start: "2026-05-01", end: "2026-05-07", overlay: "BOOKING" as const, venue: "Sardar Patel Stadium", track: "GOVERNMENT" },
  { id: "ev2", title: "Gujarat Badminton Ranking", start: "2026-04-20", end: "2026-04-22", overlay: "BOOKING" as const, venue: "Surat Indoor Stadium", track: "FEDERATION" },
  { id: "ev3", title: "Pay & Play Open Slots", start: "2026-04-11", end: "2026-04-30", overlay: "PAYPLAY" as const, venue: "SAG Aquatics Centre" },
  { id: "ev4", title: "Pitch Maintenance", start: "2026-04-15", end: "2026-04-16", overlay: "MAINTENANCE" as const, venue: "Vadodara Football Ground" },
  { id: "ev5", title: "National Games Preparation Block", start: "2026-04-25", end: "2026-05-05", overlay: "BLOCK" as const, venue: "Sardar Patel Stadium" },
  { id: "ev6", title: "Ahmedabad Triathlon 2026", start: "2026-04-25", end: "2026-04-25", overlay: "BOOKING" as const, venue: "SAG Aquatics Centre", track: "COMMERCIAL" },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 11)); // Apr 2026
  const [selectedVenue, setSelectedVenue] = useState("ALL");
  const [view, setView] = useState<"month" | "week">("month");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  const getEventsForDay = (day: Date) => {
    return CALENDAR_EVENTS.filter((ev) => {
      const evStart = new Date(ev.start);
      const evEnd = new Date(ev.end);
      return day >= evStart && day <= evEnd;
    }).filter((ev) => selectedVenue === "ALL" || ev.venue === selectedVenue);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-800" /> Calendar Spine
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">5-overlay shared calendar — bookings, maintenance, Pay & Play, blocks, VVIP</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm"><Plus className="h-4 w-4" /> Add Event</Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(OVERLAY_COLORS).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-1.5 text-xs">
            <div className={cn("h-3 w-3 rounded-sm", colors.bg)} />
            <span className="text-slate-600">{type.replace("_"," ")}</span>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => subMonths(d, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-bold text-slate-900 min-w-36 text-center">
            {format(currentDate, "MMMM yyyy")}
          </h3>
          <Button variant="outline" size="icon" onClick={() => setCurrentDate((d) => addMonths(d, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date(2026, 3, 11))}>Today</Button>
        <Select value={selectedVenue} onValueChange={setSelectedVenue}>
          <SelectTrigger className="w-52 h-8 text-sm">
            <SelectValue placeholder="All Venues" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Venues</SelectItem>
            {MOCK_VENUES.map((v) => <SelectItem key={v.id} value={v.nameEn}>{v.nameEn}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Calendar grid */}
      <Card>
        <CardContent className="p-0">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-200">
            {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
              <div key={d} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide border-r last:border-r-0 border-slate-200">
                {d}
              </div>
            ))}
          </div>
          {/* Day cells */}
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const events = getEventsForDay(day);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isToday_ = isToday(day);
              return (
                <div
                  key={i}
                  className={cn(
                    "min-h-[100px] p-2 border-b border-r border-slate-100 last:border-r-0",
                    !isCurrentMonth && "bg-slate-50",
                    isToday_ && "bg-blue-50",
                    (i + 1) % 7 === 0 && "border-r-0"
                  )}
                >
                  <div className={cn(
                    "text-sm font-medium mb-1 h-6 w-6 flex items-center justify-center rounded-full",
                    isToday_ ? "bg-blue-800 text-white" : isCurrentMonth ? "text-slate-900" : "text-slate-300"
                  )}>
                    {format(day, "d")}
                  </div>
                  <div className="space-y-0.5">
                    {events.slice(0, 2).map((ev) => {
                      const colors = OVERLAY_COLORS[ev.overlay];
                      return (
                        <div key={ev.id} className={cn("text-[10px] px-1.5 py-0.5 rounded-sm font-medium truncate", colors.light, colors.text)}>
                          {ev.title}
                        </div>
                      );
                    })}
                    {events.length > 2 && (
                      <div className="text-[10px] text-slate-500 px-1">+{events.length - 2} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming events list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {CALENDAR_EVENTS.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()).map((ev) => {
              const colors = OVERLAY_COLORS[ev.overlay];
              return (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                  <div className={cn("h-10 w-1 rounded-full", colors.bg)} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{ev.title}</p>
                    <p className="text-xs text-slate-500">{ev.venue}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-medium text-slate-900">{formatDate(ev.start)}</p>
                    {ev.end !== ev.start && <p className="text-xs text-slate-500">to {formatDate(ev.end)}</p>}
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", colors.light, colors.text)}>
                      {ev.overlay}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
