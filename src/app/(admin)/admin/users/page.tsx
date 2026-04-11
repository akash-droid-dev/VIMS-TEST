"use client";
import React, { useState, useMemo } from "react";
import {
  Search, Plus, Shield, CheckCircle2, XCircle, Clock,
  Mail, Phone, Edit, ToggleLeft
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { tierColor, tierLabel, initials, formatDateTime, cn } from "@/lib/utils";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("ALL");

  const filtered = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchSearch =
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.id.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === "ALL" || u.tier === filterTier;
      return matchSearch && matchTier;
    });
  }, [search, filterTier]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Users & Access</h2>
          <p className="text-slate-500 text-sm mt-0.5">{MOCK_USERS.length} registered users across all tiers</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Invite User</Button>
      </div>

      {/* Tier breakdown */}
      <div className="flex flex-wrap gap-2">
        {["ALL","SUPER_ADMIN","SPOC","COMMISSIONERATE","DSO","DSC","VENUE_MANAGER","FIELD_OFFICER","AUDITOR"].map((tier) => {
          const count = tier === "ALL" ? MOCK_USERS.length : MOCK_USERS.filter((u) => u.tier === tier).length;
          return (
            <button key={tier} onClick={() => setFilterTier(tier)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterTier === tier ? "border-blue-800 ring-1 ring-blue-800 bg-blue-50" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}>
              {tier === "ALL" ? "All" : tierLabel(tier as any)} ({count})
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, user ID…" className="pl-9 h-8 text-sm" />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} users</span>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => (
          <Card key={user.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 shrink-0">
                  <AvatarFallback className={cn("text-sm font-bold", tierColor(user.tier))}>
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm truncate">{user.name}</h3>
                    {user.isActive ? (
                      <span className="flex items-center gap-0.5 text-xs text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-xs text-red-600">
                        <XCircle className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </div>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", tierColor(user.tier))}>
                    {tierLabel(user.tier)}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span>{user.mobile}</span>
                </div>
                {(user.scopeDistrict || user.scopeState) && (
                  <div className="flex items-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Scope: {user.scopeDistrict ? `District ${user.scopeDistrict}` : `State ${user.scopeState}`}</span>
                  </div>
                )}
                {user.lastLogin && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Last login: {formatDateTime(user.lastLogin)}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs">
                  <Edit className="h-3 w-3" /> Edit
                </Button>
                <Button variant="ghost" size="sm" className="flex-1 text-xs text-slate-600">
                  <ToggleLeft className="h-3 w-3" /> {user.isActive ? "Suspend" : "Activate"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
