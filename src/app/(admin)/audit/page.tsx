"use client";
import React, { useState, useMemo } from "react";
import {
  Search, Download, Shield, Lock, Eye, AlertTriangle, Filter,
  FileSearch, ChevronDown, ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_AUDIT_ENTRIES } from "@/lib/mock-data";
import { formatDateTime, tierColor, tierLabel, cn } from "@/lib/utils";

const ACTION_ICONS: Record<string, string> = {
  "venue.activated": "✅",
  "venue.revoked": "🚫",
  "venue.intake_submitted": "📝",
  "booking.approved": "✅",
  "booking.rejected": "❌",
  "booking.cancelled": "🚫",
  "payplay.toggle_changed": "⚡",
  "scheme.activated": "🎟️",
  "scheme.revoked": "🚫",
  "user.created": "👤",
  "compliance.lapsed": "⚠️",
};

const ACTION_COLORS: Record<string, string> = {
  "venue.activated": "text-green-700 bg-green-50",
  "venue.revoked": "text-red-700 bg-red-50",
  "booking.approved": "text-green-700 bg-green-50",
  "booking.rejected": "text-red-700 bg-red-50",
  "payplay.toggle_changed": "text-purple-700 bg-purple-50",
  "scheme.activated": "text-blue-700 bg-blue-50",
  "venue.intake_submitted": "text-blue-700 bg-blue-50",
};

export default function AuditPage() {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("ALL");
  const [filterAction, setFilterAction] = useState("ALL");
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return MOCK_AUDIT_ENTRIES.filter((e) => {
      const matchSearch =
        !search ||
        e.actorName.toLowerCase().includes(search.toLowerCase()) ||
        e.actionType.toLowerCase().includes(search.toLowerCase()) ||
        e.resourceId.toLowerCase().includes(search.toLowerCase()) ||
        e.ledgerId.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === "ALL" || e.actorTier === filterTier;
      const matchAction = filterAction === "ALL" || e.actionType === filterAction;
      return matchSearch && matchTier && matchAction;
    });
  }, [search, filterTier, filterAction]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileSearch className="h-6 w-6 text-blue-800" /> Audit Ledger
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">Immutable WORM append-only log — CAG & RTI ready</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export CSV</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> RTI Report</Button>
        </div>
      </div>

      {/* Security notice */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-3 flex items-center gap-3">
          <Lock className="h-4 w-4 text-amber-600 shrink-0" />
          <p className="text-sm text-amber-800">
            This ledger is WORM (Write Once Read Many) — records cannot be modified or deleted. All entries include actor identity, IP address, and NIC e-Sign hash where applicable. Compliant with DPDP Act 2023 and CAG audit standards.
          </p>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Entries", value: MOCK_AUDIT_ENTRIES.length.toLocaleString() },
          { label: "e-Signed Actions", value: MOCK_AUDIT_ENTRIES.filter((e) => e.eSignHash).length },
          { label: "Today's Activity", value: "24" },
          { label: "Unique Actors", value: new Set(MOCK_AUDIT_ENTRIES.map((e) => e.actorUserId)).size },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by actor, action, resource ID…" className="pl-9 h-8 text-sm" />
        </div>
        <Select value={filterTier} onValueChange={setFilterTier}>
          <SelectTrigger className="w-36 h-8 text-sm"><SelectValue placeholder="All Tiers" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Tiers</SelectItem>
            {["SUPER_ADMIN","SPOC","COMMISSIONERATE","DSO","DSC","VENUE_MANAGER","FIELD_OFFICER"].map((t) => (
              <SelectItem key={t} value={t}>{tierLabel(t as any)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-44 h-8 text-sm"><SelectValue placeholder="All Actions" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Actions</SelectItem>
            {Object.keys(ACTION_ICONS).map((a) => (
              <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs text-slate-500">{filtered.length} entries</span>
      </div>

      {/* Ledger table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table" aria-label="Audit ledger">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Timestamp</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actor</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Resource</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">e-Sign</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">IP</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <React.Fragment key={entry.ledgerId}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                        {formatDateTime(entry.occurredAt)}
                        <div className="text-slate-400 font-mono">{entry.ledgerId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{entry.actorName}</p>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${tierColor(entry.actorTier)}`}>
                          {tierLabel(entry.actorTier)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className={cn("inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium", ACTION_COLORS[entry.actionType] ?? "bg-slate-100 text-slate-700")}>
                          <span>{ACTION_ICONS[entry.actionType] ?? "📋"}</span>
                          <span>{entry.actionType}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-xs">
                        <p className="font-medium text-slate-900">{entry.resourceType}</p>
                        <p className="text-slate-500 font-mono">{entry.resourceId}</p>
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell">
                        {entry.eSignHash ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <Shield className="h-3 w-3" />
                            <span className="font-mono">{entry.eSignHash.slice(0, 12)}…</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden xl:table-cell text-xs text-slate-500 font-mono">
                        {entry.ipAddress ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        {entry.payload && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => setExpanded(expanded === entry.ledgerId ? null : entry.ledgerId)}
                            aria-label="View payload"
                          >
                            <ChevronDown className={cn("h-4 w-4 transition-transform", expanded === entry.ledgerId && "rotate-180")} />
                          </Button>
                        )}
                      </td>
                    </tr>
                    {expanded === entry.ledgerId && entry.payload && (
                      <tr className="bg-slate-50 border-b border-slate-200">
                        <td colSpan={7} className="px-4 py-3">
                          <div className="bg-slate-900 text-green-400 rounded-lg p-3 font-mono text-xs overflow-x-auto">
                            <pre>{JSON.stringify(entry.payload, null, 2)}</pre>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-slate-500 text-sm">No audit entries match your filters.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
