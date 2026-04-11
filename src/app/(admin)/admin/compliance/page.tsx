"use client";
import React, { useState } from "react";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Upload,
  Calendar, Download, Bell, Filter, Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MOCK_VENUES } from "@/lib/mock-data";
import { formatDate, daysUntil, cn } from "@/lib/utils";
import type { ComplianceState } from "@/types";

interface FlatCert {
  venueName: string;
  venueId: string;
  district: string;
  type: string;
  issuingBody: string;
  certificateNumber: string;
  expiryDate: string;
  state: ComplianceState;
}

const flatCerts: FlatCert[] = MOCK_VENUES.flatMap((v) =>
  v.complianceCertificates.map((c) => ({
    venueName: v.nameEn,
    venueId: v.id,
    district: v.lgdDistrictCode,
    type: c.type,
    issuingBody: c.issuingBody,
    certificateNumber: c.certificateNumber,
    expiryDate: c.expiryDate,
    state: c.state,
  }))
);

const stateIcon = (state: ComplianceState) => {
  if (state === "VALID") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
  if (state === "EXPIRING_SOON") return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
  if (state === "EXPIRED") return <XCircle className="h-4 w-4 text-red-600" />;
  return <div className="h-4 w-4 rounded-full border-2 border-slate-300" />;
};

const stateVariant = (state: ComplianceState) => {
  if (state === "VALID") return "success" as const;
  if (state === "EXPIRING_SOON") return "warning" as const;
  if (state === "EXPIRED") return "destructive" as const;
  return "ghost" as const;
};

export default function CompliancePage() {
  const [search, setSearch] = useState("");
  const [filterState, setFilterState] = useState("ALL");

  const filtered = flatCerts.filter((c) => {
    const matchSearch = !search || c.venueName.toLowerCase().includes(search.toLowerCase()) || c.type.toLowerCase().includes(search.toLowerCase());
    const matchState = filterState === "ALL" || c.state === filterState;
    return matchSearch && matchState;
  });

  const expired = flatCerts.filter((c) => c.state === "EXPIRED").length;
  const expiring = flatCerts.filter((c) => c.state === "EXPIRING_SOON").length;
  const valid = flatCerts.filter((c) => c.state === "VALID").length;
  const overall = Math.round((valid / flatCerts.length) * 100);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-800" /> Compliance Vault
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">9 statutory certificates tracked across all venues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Bell className="h-4 w-4" /> Alert Settings</Button>
          <Button variant="outline" size="sm"><Download className="h-4 w-4" /> Export Report</Button>
        </div>
      </div>

      {/* Overall score */}
      <Card className="bg-gradient-to-br from-blue-900 to-slate-800 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">Overall Compliance Health</p>
              <div className="text-5xl font-bold mb-2">{overall}%</div>
              <p className="text-blue-200 text-sm">{valid} valid · {expiring} expiring soon · {expired} expired</p>
            </div>
            <div className="space-y-2 min-w-48">
              {[
                { label: "Valid", value: valid, total: flatCerts.length, color: "bg-green-400" },
                { label: "Expiring Soon", value: expiring, total: flatCerts.length, color: "bg-yellow-400" },
                { label: "Expired", value: expired, total: flatCerts.length, color: "bg-red-400" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-200">{s.label}</span>
                    <span className="text-white font-medium">{s.value}/{s.total}</span>
                  </div>
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full", s.color)} style={{ width: `${(s.value / s.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert banners */}
      {expired > 0 && (
        <Card className="border-red-300 bg-red-50">
          <CardContent className="p-4 flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-900">{expired} certificates have expired</p>
              <p className="text-sm text-red-700">
                Expired venues: {flatCerts.filter((c) => c.state === "EXPIRED").map((c) => c.venueName).filter((v, i, a) => a.indexOf(v) === i).join(", ")}.
                These venues may need to be suspended until certificates are renewed.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by venue, certificate type…" className="pl-9 h-8 text-sm" />
        </div>
        <div className="flex gap-1.5">
          {["ALL","VALID","EXPIRING_SOON","EXPIRED","MISSING"].map((s) => (
            <button key={s} onClick={() => setFilterState(s)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterState === s ? "border-blue-800 ring-1 ring-blue-800 bg-blue-50" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}>
              {s === "ALL" ? "All" : s.replace("_"," ")}
            </button>
          ))}
        </div>
        <span className="text-xs text-slate-500">{filtered.length} certs</span>
      </div>

      {/* Certificates table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Venue</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Certificate</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">Issuing Body</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">Cert. No.</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Expiry</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cert, i) => {
                  const days = daysUntil(cert.expiryDate);
                  return (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-900 text-sm">{cert.venueName}</p>
                        <p className="text-xs text-slate-500">{cert.district} · {cert.venueId}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {stateIcon(cert.state)}
                          <span className="text-sm text-slate-900">{cert.type}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 hidden lg:table-cell">{cert.issuingBody}</td>
                      <td className="px-4 py-3 text-xs text-slate-500 font-mono hidden xl:table-cell">{cert.certificateNumber}</td>
                      <td className="px-4 py-3 text-xs">
                        <p className="font-medium text-slate-900">{formatDate(cert.expiryDate)}</p>
                        {cert.state !== "MISSING" && (
                          <p className={cn("text-xs", days < 0 ? "text-red-600" : days < 30 ? "text-yellow-600" : "text-slate-500")}>
                            {days < 0 ? `${Math.abs(days)} days overdue` : `${days} days left`}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={stateVariant(cert.state)} className="text-xs">
                          {cert.state.replace("_"," ")}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          <Upload className="h-3 w-3" /> Renew
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
