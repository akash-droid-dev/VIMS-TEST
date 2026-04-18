"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  Search, Plus, Shield, CheckCircle2, XCircle, Clock,
  Mail, Phone, Edit, ToggleLeft, X, Save, AlertTriangle,
  MapPin, Star, UserCheck
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MOCK_USERS } from "@/lib/mock-data";
import { tierColor, tierLabel, initials, formatDateTime, cn } from "@/lib/utils";
import { getRegisteredUsers, updateRegisteredUser, type RegisteredUser } from "@/lib/store";
import type { User } from "@/types";

type AnyUser = User | (RegisteredUser & { isCitizen: true });

function isCitizen(u: AnyUser): u is RegisteredUser & { isCitizen: true } {
  return (u as any).isCitizen === true;
}

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState("ALL");
  const [citizens, setCitizens] = useState<RegisteredUser[]>([]);
  const [editUser, setEditUser] = useState<AnyUser | null>(null);
  const [suspendUser, setSuspendUser] = useState<AnyUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", mobile: "" });
  const [saving, setSaving] = useState(false);

  const loadCitizens = useCallback(() => {
    setCitizens(getRegisteredUsers());
  }, []);

  useEffect(() => {
    loadCitizens();
    const handler = () => loadCitizens();
    window.addEventListener("vims:store_update", handler);
    return () => window.removeEventListener("vims:store_update", handler);
  }, [loadCitizens]);

  const allUsers: AnyUser[] = useMemo(() => {
    const govUsers: AnyUser[] = MOCK_USERS;
    const citUsers: AnyUser[] = citizens.map((c) => ({ ...c, isCitizen: true as const }));
    return [...govUsers, ...citUsers];
  }, [citizens]);

  const filtered = useMemo(() => {
    return allUsers.filter((u) => {
      const name = isCitizen(u) ? u.name : u.name;
      const email = isCitizen(u) ? u.email : u.email;
      const id = isCitizen(u) ? u.id : u.id;
      const tier = isCitizen(u) ? "CITIZEN" : u.tier;
      const matchSearch =
        !search ||
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        id.toLowerCase().includes(search.toLowerCase());
      const matchTier = filterTier === "ALL" || tier === filterTier;
      return matchSearch && matchTier;
    });
  }, [allUsers, search, filterTier]);

  const tierCounts: Record<string, number> = useMemo(() => {
    const counts: Record<string, number> = { ALL: allUsers.length, CITIZEN: citizens.length };
    MOCK_USERS.forEach((u) => {
      counts[u.tier] = (counts[u.tier] ?? 0) + 1;
    });
    return counts;
  }, [allUsers, citizens]);

  const openEdit = (u: AnyUser) => {
    setEditUser(u);
    if (isCitizen(u)) {
      setEditForm({ name: u.name, email: u.email, mobile: u.mobile });
    } else {
      setEditForm({ name: u.name, email: u.email, mobile: u.mobile ?? "" });
    }
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    if (isCitizen(editUser)) {
      updateRegisteredUser(editUser.id, {
        name: editForm.name,
        email: editForm.email,
        mobile: editForm.mobile,
      });
      loadCitizens();
    }
    setSaving(false);
    setEditUser(null);
  };

  const handleToggleActive = async () => {
    if (!suspendUser) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    if (isCitizen(suspendUser)) {
      updateRegisteredUser(suspendUser.id, { isActive: !suspendUser.isActive });
      loadCitizens();
    }
    setSaving(false);
    setSuspendUser(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Users & Access</h2>
          <p className="text-slate-500 text-sm mt-0.5">
            {allUsers.length} users — {MOCK_USERS.length} government staff · {citizens.length} registered citizens
          </p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4" /> Invite User</Button>
      </div>

      {/* Tier pills */}
      <div className="flex flex-wrap gap-2">
        {["ALL","CITIZEN","SUPER_ADMIN","SPOC","COMMISSIONERATE","DSO","DSC","VENUE_MANAGER","FIELD_OFFICER","AUDITOR"].map((tier) => {
          const count = tierCounts[tier] ?? 0;
          if (count === 0 && tier !== "ALL" && tier !== "CITIZEN") return null;
          return (
            <button key={tier} onClick={() => setFilterTier(tier)}
              className={cn("px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                filterTier === tier ? "border-blue-800 ring-1 ring-blue-800 bg-blue-50 text-blue-800" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              )}>
              {tier === "ALL" ? "All" : tier === "CITIZEN" ? "Citizens" : tierLabel(tier as any)} ({count})
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex flex-wrap items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, user ID…" className="pl-9 h-8 text-sm" />
        </div>
        <span className="text-xs text-slate-500">{filtered.length} users</span>
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user) => {
          const citizen = isCitizen(user);
          const tier = citizen ? "CITIZEN" : user.tier;
          const isActive = citizen ? user.isActive : user.isActive;
          const name = user.name;
          const email = user.email;
          const mobile = citizen ? user.mobile : (user as User).mobile ?? "—";
          const lastLogin = citizen ? user.registeredAt : (user as User).lastLogin;
          const lastLoginLabel = citizen ? "Registered" : "Last login";

          return (
            <Card key={user.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarFallback className={cn("text-sm font-bold",
                      citizen ? "bg-green-100 text-green-800" : tierColor(tier as any)
                    )}>
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-900 text-sm truncate">{name}</h3>
                      {isActive ? (
                        <span className="flex items-center gap-0.5 text-xs text-green-600">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-0.5 text-xs text-red-600">
                          <XCircle className="h-3 w-3" /> Suspended
                        </span>
                      )}
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                      citizen ? "bg-green-100 text-green-800" : tierColor(tier as any)
                    )}>
                      {citizen ? "Citizen" : tierLabel(tier as any)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{email || "—"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{mobile}</span>
                  </div>
                  {citizen && user.district && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{user.district}</span>
                    </div>
                  )}
                  {citizen && user.sportsInterests.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Star className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{user.sportsInterests.slice(0, 3).join(", ")}</span>
                    </div>
                  )}
                  {!citizen && (user as User).scopeDistrict && (
                    <div className="flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>District: {(user as User).scopeDistrict}</span>
                    </div>
                  )}
                  {lastLogin && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{lastLoginLabel}: {formatDateTime(lastLogin)}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                    onClick={() => openEdit(user)}
                  >
                    <Edit className="h-3 w-3" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn("flex-1 text-xs", isActive ? "text-red-600 hover:text-red-700 hover:bg-red-50" : "text-green-600 hover:text-green-700 hover:bg-green-50")}
                    onClick={() => setSuspendUser(user)}
                    disabled={!citizen}
                  >
                    <ToggleLeft className="h-3 w-3" /> {isActive ? "Suspend" : "Activate"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-slate-500">
          <UserCheck className="h-12 w-12 mx-auto mb-3 text-slate-300" />
          <p className="font-medium">No users match your search</p>
        </div>
      )}

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
              <button onClick={() => setEditUser(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Name</label>
                <Input
                  value={editForm.name}
                  onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Email Address</label>
                <Input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                  className="text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Mobile Number</label>
                <Input
                  value={editForm.mobile}
                  onChange={(e) => setEditForm((f) => ({ ...f, mobile: e.target.value }))}
                  className="text-sm"
                />
              </div>
              {!isCitizen(editUser) && (
                <p className="text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
                  Government staff profiles are managed by the HR system. Changes here are local only.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveEdit} disabled={saving}>
                {saving ? "Saving…" : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend/Activate Modal */}
      {suspendUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className={cn("h-11 w-11 rounded-full flex items-center justify-center",
                (isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive) ? "bg-red-100" : "bg-green-100"
              )}>
                <AlertTriangle className={cn("h-5 w-5", (isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive) ? "text-red-600" : "text-green-600")} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {(isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive) ? "Suspend User?" : "Activate User?"}
                </h3>
                <p className="text-sm text-slate-500">{suspendUser.name}</p>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              {(isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive)
                ? "This user will lose access to all G-VIMS features immediately."
                : "This user will regain access to G-VIMS features."}
            </p>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setSuspendUser(null)}>Cancel</Button>
              <Button
                className={cn("flex-1", (isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive) ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700")}
                onClick={handleToggleActive}
                disabled={saving}
              >
                {saving ? "Processing…" : (isCitizen(suspendUser) ? suspendUser.isActive : suspendUser.isActive) ? "Suspend" : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
