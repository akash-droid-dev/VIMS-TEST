"use client";
import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Upload, MapPin, Building2, Users, Shield, FileText, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "Identity", desc: "Basic info & ownership", icon: Building2 },
  { id: 2, label: "Location", desc: "GPS & address", icon: MapPin },
  { id: 3, label: "Capacity", desc: "Seating & zones", icon: Users },
  { id: 4, label: "Sports & Sub-Venues", desc: "Sports & layout", icon: Shield },
  { id: 5, label: "Documents", desc: "Compliance upload", icon: FileText },
  { id: 6, label: "Review & Submit", desc: "Final submission", icon: Check },
];

const VENUE_TYPES = ["STADIUM", "INDOOR_HALL", "SWIMMING_POOL", "SHOOTING_RANGE", "ATHLETICS_TRACK", "MULTIPURPOSE", "GROUND", "ACADEMY", "WELLNESS_CENTRE"];
const OWNERSHIP_TYPES = ["GOVERNMENT", "PRIVATE", "PPP", "PSU", "EDUCATIONAL", "FEDERATION", "ULB", "PANCHAYAT"];
const SPORTS = ["Cricket", "Football", "Basketball", "Volleyball", "Badminton", "Tennis", "Swimming", "Athletics", "Hockey", "Kabaddi", "Wrestling", "Boxing", "Shooting", "Archery", "Gymnastics", "Chess", "Multipurpose"];
const DISTRICTS = ["AHM", "SRT", "VDO", "RJK", "GAN", "BHV", "JAM", "JNR", "KCH", "MDH", "MHE", "NVS", "PAN", "POR", "SAB", "SKH", "SNG", "STR", "TAP", "VLS"];

export default function NewVenuePage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    // Identity
    nameEn: "", nameGu: "", nameHi: "", venueType: "", ownershipType: "", owningBody: "", operatorName: "",
    // Location
    address: "", lat: "", lng: "", district: "", taluka: "", nearestTransit: "", entryGates: "", parking: "",
    // Capacity
    seating: "", standing: "", wheelchair: "", womenZones: "", vip: "",
    // Sports
    primarySport: "", supportedSports: [] as string[], indoorOutdoor: "",
    // Sub-venues will be added dynamically
    subVenues: [] as { name: string; type: string; capacity: string; rate: string }[],
    // Docs
    fireNoc: null as File | null, structural: null as File | null,
  });

  const progress = (step / STEPS.length) * 100;

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const toggleSport = (sport: string) => {
    setForm((f) => ({
      ...f,
      supportedSports: f.supportedSports.includes(sport)
        ? f.supportedSports.filter((s) => s !== sport)
        : [...f.supportedSports, sport],
    }));
  };

  const addSubVenue = () => {
    setForm((f) => ({
      ...f,
      subVenues: [...f.subVenues, { name: "", type: "COURT", capacity: "", rate: "" }],
    }));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/venues">
          <Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /> Back</Button>
        </Link>
        <div>
          <h2 className="text-xl font-bold text-slate-900">New Venue Intake (KYV)</h2>
          <p className="text-slate-500 text-sm">Know Your Venue — 6-step onboarding</p>
        </div>
      </div>

      {/* Stepper */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-700">Step {step} of {STEPS.length}: {STEPS[step - 1].label}</span>
            <span className="text-xs text-slate-500">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="mb-4" />
          <div className="flex gap-2 overflow-x-auto pb-1">
            {STEPS.map((s) => (
              <button
                key={s.id}
                onClick={() => s.id < step && setStep(s.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0",
                  s.id === step ? "bg-blue-800 text-white" :
                  s.id < step ? "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200" :
                  "bg-slate-100 text-slate-400 cursor-not-allowed"
                )}
                disabled={s.id > step}
              >
                {s.id < step ? <Check className="h-3 w-3" /> : <s.icon className="h-3 w-3" />}
                {s.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(STEPS[step - 1].icon, { className: "h-5 w-5 text-blue-800" })}
            {STEPS[step - 1].label}
            <span className="text-xs font-normal text-slate-500 ml-1">— {STEPS[step - 1].desc}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {step === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nameEn">Venue Name (English) *</Label>
                  <Input id="nameEn" value={form.nameEn} onChange={(e) => update("nameEn", e.target.value)} placeholder="e.g., Sardar Patel Stadium" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nameGu">Venue Name (Gujarati) *</Label>
                  <Input id="nameGu" value={form.nameGu} onChange={(e) => update("nameGu", e.target.value)} placeholder="ગુજરાતીમાં નામ" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nameHi">Venue Name (Hindi)</Label>
                  <Input id="nameHi" value={form.nameHi} onChange={(e) => update("nameHi", e.target.value)} placeholder="हिंदी में नाम" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="venueType">Venue Type *</Label>
                  <Select value={form.venueType} onValueChange={(v) => update("venueType", v)}>
                    <SelectTrigger id="venueType"><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>{VENUE_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace("_", " ")}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ownershipType">Ownership Type *</Label>
                  <Select value={form.ownershipType} onValueChange={(v) => update("ownershipType", v)}>
                    <SelectTrigger id="ownershipType"><SelectValue placeholder="Select ownership" /></SelectTrigger>
                    <SelectContent>{OWNERSHIP_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="owningBody">Owning Body *</Label>
                  <Input id="owningBody" value={form.owningBody} onChange={(e) => update("owningBody", e.target.value)} placeholder="e.g., Gujarat Cricket Association" required />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label htmlFor="operatorName">Operator Name *</Label>
                  <Input id="operatorName" value={form.operatorName} onChange={(e) => update("operatorName", e.target.value)} placeholder="e.g., GCA Operations Pvt Ltd" required />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="address">Full Address *</Label>
                  <textarea id="address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="Complete address including area, city, pin code" rows={3} className="flex w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-800 resize-none" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="lat">GPS Latitude *</Label>
                  <Input id="lat" type="number" step="any" value={form.lat} onChange={(e) => update("lat", e.target.value)} placeholder="e.g., 23.0907" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lng">GPS Longitude *</Label>
                  <Input id="lng" type="number" step="any" value={form.lng} onChange={(e) => update("lng", e.target.value)} placeholder="e.g., 72.5955" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="district">LGD District *</Label>
                  <Select value={form.district} onValueChange={(v) => update("district", v)}>
                    <SelectTrigger id="district"><SelectValue placeholder="Select district" /></SelectTrigger>
                    <SelectContent>{DISTRICTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="taluka">LGD Taluka</Label>
                  <Input id="taluka" value={form.taluka} onChange={(e) => update("taluka", e.target.value)} placeholder="Taluka code" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="entryGates">Entry Gates Count *</Label>
                  <Input id="entryGates" type="number" value={form.entryGates} onChange={(e) => update("entryGates", e.target.value)} placeholder="e.g., 4" required min="1" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="parking">Parking Capacity *</Label>
                  <Input id="parking" type="number" value={form.parking} onChange={(e) => update("parking", e.target.value)} placeholder="Number of vehicles" required min="0" />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <Label htmlFor="nearestTransit">Nearest Transit</Label>
                  <Input id="nearestTransit" value={form.nearestTransit} onChange={(e) => update("nearestTransit", e.target.value)} placeholder="e.g., Motera BRTS, Sabarmati Railway 3km" />
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-700 flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                Field officers should use the mobile app for GPS capture with ±3m accuracy. Coordinates will be verified against LGD boundaries.
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { id: "seating", label: "Seating Capacity *", key: "seating" },
                  { id: "standing", label: "Standing Capacity *", key: "standing" },
                  { id: "wheelchair", label: "Wheelchair Seats *", key: "wheelchair" },
                  { id: "womenZones", label: "Women-Only Zones", key: "womenZones" },
                  { id: "vip", label: "VIP Enclosure Seats", key: "vip" },
                ].map((field) => (
                  <div key={field.id} className="space-y-1.5">
                    <Label htmlFor={field.id}>{field.label}</Label>
                    <Input id={field.id} type="number" value={(form as Record<string, unknown>)[field.key] as string} onChange={(e) => update(field.key, e.target.value)} placeholder="0" min="0" required={field.label.endsWith("*")} />
                  </div>
                ))}
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                <Shield className="h-4 w-4 shrink-0 mt-0.5" />
                Per RPwD Act 2016: wheelchair capacity must be ≥0.5% of total seating or minimum 10, whichever is higher. Women-only zones must be accessible.
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Primary Sport *</Label>
                  <Select value={form.primarySport} onValueChange={(v) => update("primarySport", v)}>
                    <SelectTrigger><SelectValue placeholder="Select sport" /></SelectTrigger>
                    <SelectContent>{SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Indoor / Outdoor *</Label>
                  <Select value={form.indoorOutdoor} onValueChange={(v) => update("indoorOutdoor", v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDOOR">Indoor</SelectItem>
                      <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                      <SelectItem value="MIXED">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Supported Sports</Label>
                <div className="flex flex-wrap gap-2">
                  {SPORTS.map((sport) => (
                    <button key={sport} type="button" onClick={() => toggleSport(sport)}
                      className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all", form.supportedSports.includes(sport) ? "bg-blue-800 text-white border-blue-800" : "bg-white text-slate-600 border-slate-300 hover:border-blue-400")}>
                      {sport}
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Sub-Venues</Label>
                  <Button type="button" variant="outline" size="sm" onClick={addSubVenue}>+ Add Sub-Venue</Button>
                </div>
                {form.subVenues.length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
                    No sub-venues added yet. Click "+ Add Sub-Venue" to define bookable spaces.
                  </p>
                )}
                {form.subVenues.map((sv, i) => (
                  <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 border border-slate-200 rounded-xl">
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input className="h-8 text-xs" placeholder="e.g., Court A" /></div>
                    <div className="space-y-1"><Label className="text-xs">Type</Label>
                      <Select><SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Type" /></SelectTrigger>
                        <SelectContent>
                          {["MAIN_ARENA","COURT","PITCH","POOL","TRACK","TRAINING_HALL","PRACTICE_GROUND"].map((t) => <SelectItem key={t} value={t} className="text-xs">{t.replace("_"," ")}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1"><Label className="text-xs">Capacity</Label><Input className="h-8 text-xs" type="number" placeholder="0" /></div>
                    <div className="space-y-1"><Label className="text-xs">Base Rate (₹/hour)</Label><Input className="h-8 text-xs" type="number" placeholder="0" /></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <p className="text-sm text-slate-600 mb-4">Upload statutory compliance certificates. All documents are stored in the encrypted compliance vault.</p>
              <div className="space-y-3">
                {[
                  { label: "Fire NOC (Gujarat Fire Services) *", required: true },
                  { label: "Structural Stability Certificate (PWD) *", required: true },
                  { label: "Electrical Inspection (Gujarat Electrical Inspectorate)", required: false },
                  { label: "Lift Certificate (Lift Inspector)", required: false },
                  { label: "Water Quality Certificate (GPCB)", required: false },
                  { label: "Sports Medicine Certificate (SAG)", required: false },
                ].map((doc) => (
                  <div key={doc.label} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:border-blue-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{doc.label}</p>
                        <p className="text-xs text-slate-500">PDF, JPG, PNG · Max 10MB</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      <Upload className="h-3 w-3" /> Upload
                    </Button>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                Documents will be stored in DigiLocker-linked vault. Expiry dates are tracked automatically and alerts sent 60 days before expiry.
              </div>
            </>
          )}

          {step === 6 && (
            <>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Check className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-800">Ready for Submission</span>
                  </div>
                  <p className="text-sm text-green-700">Your venue intake is complete. Submitting will trigger SPOC review and generate a provisional Venue ID.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Identity Fields", status: form.nameEn ? "Complete" : "Incomplete", ok: !!form.nameEn },
                    { label: "Location & GPS", status: form.address ? "Complete" : "Incomplete", ok: !!form.address },
                    { label: "Capacity Data", status: form.seating ? "Complete" : "Incomplete", ok: !!form.seating },
                    { label: "Sports & Sub-Venues", status: form.primarySport ? "Complete" : "Incomplete", ok: !!form.primarySport },
                    { label: "Compliance Docs", status: "Partially uploaded", ok: false },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <Badge variant={item.ok ? "success" : "warning"}>{item.status}</Badge>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700">
                  <strong>NIC e-Sign required:</strong> Submitting this intake will require your Aadhaar-linked e-signature via NIC eSign API. Have your Aadhaar OTP ready.
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ArrowLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-xs text-slate-400">Step {step} / {STEPS.length}</span>
        {step < STEPS.length ? (
          <Button onClick={() => setStep((s) => Math.min(STEPS.length, s + 1))}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button className="bg-green-600 hover:bg-green-700">
            <Check className="h-4 w-4" /> Submit & e-Sign
          </Button>
        )}
      </div>
    </div>
  );
}
