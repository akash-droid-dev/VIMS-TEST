"use client";
import React, { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Check, Upload, User, Calendar, MapPin,
  Building2, FileText, CreditCard, Shield, Info, AlertCircle,
  CheckCircle2, Clock, Phone, Mail, Hash, Zap, Mic, Monitor,
  Ambulance, ParkingCircle, Utensils, Lightbulb, Users, ChevronRight
} from "lucide-react";
import { MOCK_VENUES } from "@/lib/mock-data";
import { submitLiveBooking } from "@/lib/store";
import { useSound } from "@/hooks/useSound";

// ── Types ──────────────────────────────────────────────────────────────────────

type ApplicantType = "GOVERNMENT" | "PSU" | "EDUCATIONAL" | "SPORTS_ASSOCIATION" | "NGO" | "CORPORATE" | "INDIVIDUAL";
type EventType = "COMPETITION" | "TRAINING_CAMP" | "EXHIBITION" | "CONFERENCE" | "CULTURAL" | "CORPORATE" | "COMMUNITY" | "OTHER";
type EventLevel = "INTERNATIONAL" | "NATIONAL" | "STATE" | "DISTRICT" | "TALUKA" | "LOCAL";
type BookingTrack = "GOVERNMENT" | "COMMERCIAL" | "FEDERATION" | "PAY_AND_PLAY";
type PaymentMode = "ONLINE" | "CHALLAN" | "DD" | "NEFT";

interface FormData {
  applicantType: ApplicantType | "";
  orgName: string; orgRegNo: string; gstNo: string; panNo: string;
  contactPerson: string; designation: string; mobile1: string; mobile2: string; email: string;
  aadhaarLast4: string; addressLine1: string; addressLine2: string; city: string; district: string; pincode: string;
  eventName: string; eventType: EventType | ""; affiliatedBody: string; eventLevel: EventLevel | "";
  ageCategory: string; participantCount: string; audienceCount: string;
  mediaPresence: boolean; internationalAthletes: boolean; eventDescription: string;
  subVenueId: string; startDate: string; endDate: string; setupDate: string; teardownDate: string;
  dailyStartTime: string; dailyEndTime: string;
  floodlights: boolean; paSystem: boolean; scoreboard: boolean; obVan: boolean;
  firstAid: boolean; ambulance: boolean; policebandobast: boolean; parkingMgmt: boolean;
  cateringPermission: boolean; generator: boolean; dressingRooms: boolean; pressConference: boolean;
  bookingTrack: BookingTrack | ""; paymentMode: PaymentMode | "";
  docs: Record<string, File | null>;
  declarationAccuracy: boolean; declarationCompliance: boolean; declarationTerms: boolean;
}

const INITIAL_FORM: FormData = {
  applicantType: "", orgName: "", orgRegNo: "", gstNo: "", panNo: "",
  contactPerson: "", designation: "", mobile1: "", mobile2: "", email: "",
  aadhaarLast4: "", addressLine1: "", addressLine2: "", city: "", district: "", pincode: "",
  eventName: "", eventType: "", affiliatedBody: "", eventLevel: "", ageCategory: "",
  participantCount: "", audienceCount: "", mediaPresence: false, internationalAthletes: false, eventDescription: "",
  subVenueId: "", startDate: "", endDate: "", setupDate: "", teardownDate: "",
  dailyStartTime: "", dailyEndTime: "",
  floodlights: false, paSystem: false, scoreboard: false, obVan: false,
  firstAid: false, ambulance: false, policebandobast: false, parkingMgmt: false,
  cateringPermission: false, generator: false, dressingRooms: false, pressConference: false,
  bookingTrack: "", paymentMode: "",
  docs: {},
  declarationAccuracy: false, declarationCompliance: false, declarationTerms: false,
};

const STEPS = [
  { id: 1, label: "Event",        icon: Calendar },
  { id: 2, label: "Venue & Dates", icon: MapPin },
  { id: 3, label: "Services",     icon: Zap },
  { id: 4, label: "Track & Fee",  icon: CreditCard },
  { id: 5, label: "Documents",    icon: FileText },
  { id: 6, label: "Declaration",  icon: Shield },
];


const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: "COMPETITION", label: "Sports Competition / Tournament" },
  { value: "TRAINING_CAMP", label: "Training / Coaching Camp" },
  { value: "EXHIBITION", label: "Exhibition / Demo Event" },
  { value: "CONFERENCE", label: "Sports Conference / Seminar" },
  { value: "CULTURAL", label: "Cultural / Recreational Event" },
  { value: "CORPORATE", label: "Corporate Sports Event" },
  { value: "COMMUNITY", label: "Community / Welfare Event" },
  { value: "OTHER", label: "Other" },
];

const EVENT_LEVELS: { value: EventLevel; label: string; color: string }[] = [
  { value: "INTERNATIONAL", label: "International", color: "bg-violet-50 border-violet-300 text-violet-700" },
  { value: "NATIONAL", label: "National", color: "bg-blue-50 border-blue-300 text-blue-700" },
  { value: "STATE", label: "State", color: "bg-sky-50 border-sky-300 text-sky-700" },
  { value: "DISTRICT", label: "District", color: "bg-emerald-50 border-emerald-300 text-emerald-700" },
  { value: "TALUKA", label: "Taluka", color: "bg-teal-50 border-teal-300 text-teal-700" },
  { value: "LOCAL", label: "Local / Club", color: "bg-slate-50 border-slate-300 text-slate-600" },
];

const BOOKING_TRACKS: { value: BookingTrack; label: string; desc: string; icon: string; color: string; feeNote: string }[] = [
  { value: "GOVERNMENT", label: "Government Track", desc: "Central/State/ULB/PSU bodies", icon: "🏛️", color: "border-blue-300 bg-blue-50", feeNote: "As per G.R. — often subsidised or nil" },
  { value: "COMMERCIAL", label: "Commercial Track", desc: "Private companies, corporates", icon: "🏢", color: "border-orange-300 bg-orange-50", feeNote: "Full commercial rate applies" },
  { value: "FEDERATION", label: "Federation Track", desc: "Registered sports bodies", icon: "🏆", color: "border-emerald-300 bg-emerald-50", feeNote: "50% concession on base rate" },
  { value: "PAY_AND_PLAY", label: "Pay & Play", desc: "Instant hourly/session booking", icon: "⚡", color: "border-violet-300 bg-violet-50", feeNote: "Per-slot rate, instant confirmation" },
];

const PAYMENT_MODES: { value: PaymentMode; label: string; desc: string }[] = [
  { value: "ONLINE", label: "Online Payment", desc: "UPI / Net Banking / Cards" },
  { value: "CHALLAN", label: "Treasury Challan", desc: "Govt. bodies via challan" },
  { value: "DD", label: "Demand Draft", desc: "DD in favour of SAG" },
  { value: "NEFT", label: "NEFT / RTGS", desc: "Direct bank transfer" },
];

const REQUIRED_DOCS = [
  { key: "identityProof", label: "Identity / Authorisation Proof", required: true, note: "Aadhaar / PAN / Govt. ID / Auth letter" },
  { key: "orgReg", label: "Organisation Registration Certificate", required: true, note: "Trust deed / ROC / Society reg." },
  { key: "eventPlan", label: "Detailed Event Plan", required: true, note: "Programme schedule, discipline-wise" },
  { key: "participantList", label: "Tentative Participant List", required: false, note: "Name, district, category" },
  { key: "affiliationCert", label: "Affiliation / NOC from State Body", required: true, note: "For competition events" },
  { key: "insurance", label: "Event Insurance Certificate", required: true, note: "Min ₹25 lakh liability coverage" },
  { key: "safetyPlan", label: "Safety & Security Plan", required: false, note: "Required for 1000+ participants" },
  { key: "mediaAccred", label: "Media Accreditation List", required: false, note: "If OB van or press conference requested" },
];


function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
  );
}

function InputField({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <FieldLabel label={label} required={required} />
      <input
        {...props}
        required={required}
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
      />
    </div>
  );
}

function ToggleChip({ label, icon: Icon, active, onClick }: { label: string; icon: React.ElementType; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
        active
          ? "border-blue-400 bg-blue-50 text-blue-700 shadow-sm shadow-blue-100"
          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{label}</span>
      {active && <Check className="w-3.5 h-3.5 ml-auto text-blue-600" />}
    </button>
  );
}

export default function VenueBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { playClick, playNav, playSuccess } = useSound();

  const venue = MOCK_VENUES.find((v) => v.id === id);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [refNo] = useState(() => `IVIMS/BK/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900000) + 100000)}`);

  const set = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toggle = useCallback((key: keyof FormData) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const goNext = () => {
    playNav();
    setStep((s) => Math.min(s + 1, 6));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goPrev = () => {
    playClick();
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = () => {
    if (!venue) return;
    const sv = venue.subVenues.find((s) => s.id === form.subVenueId) ?? venue.subVenues[0];
    const services: string[] = [];
    if (form.floodlights) services.push("Floodlights");
    if (form.paSystem) services.push("PA System");
    if (form.scoreboard) services.push("Scoreboard");
    if (form.obVan) services.push("OB Van");
    if (form.firstAid) services.push("First Aid");
    if (form.ambulance) services.push("Ambulance");
    if (form.policebandobast) services.push("Police Bandobast");
    if (form.parkingMgmt) services.push("Parking Management");
    if (form.cateringPermission) services.push("Catering Permission");
    if (form.generator) services.push("Generator");
    if (form.dressingRooms) services.push("Dressing Rooms");
    if (form.pressConference) services.push("Press Conference Room");

    submitLiveBooking({
      refNo,
      venueId: venue.id,
      venueName: venue.nameEn,
      subVenueId: sv?.id ?? "",
      subVenueName: sv?.name ?? "",
      applicantType: form.applicantType,
      orgName: form.orgName,
      contactPerson: form.contactPerson,
      designation: form.designation,
      mobile: form.mobile1,
      email: form.email,
      district: form.district,
      addressLine1: form.addressLine1,
      eventName: form.eventName,
      eventType: form.eventType,
      eventLevel: form.eventLevel,
      affiliatedBody: form.affiliatedBody,
      ageCategory: form.ageCategory,
      participantCount: form.participantCount,
      audienceCount: form.audienceCount,
      mediaPresence: form.mediaPresence,
      internationalAthletes: form.internationalAthletes,
      eventDescription: form.eventDescription,
      startDate: form.startDate,
      endDate: form.endDate,
      setupDate: form.setupDate,
      dailyStartTime: form.dailyStartTime,
      dailyEndTime: form.dailyEndTime,
      servicesRequested: services,
      bookingTrack: form.bookingTrack,
      paymentMode: form.paymentMode,
    });
    playSuccess();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!venue) {
    return (
      <div className="min-h-screen bg-[#f8faff] flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">Venue not found</p>
          <Link href="/venues" className="text-blue-600 hover:underline">Back to venues</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f8faff] py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h1>
          <p className="text-slate-500 mb-6">Your booking application has been received and is under review.</p>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-left shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">Reference Number</span>
              <span className="font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg text-sm">{refNo}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-500">Venue</span>
              <span className="text-sm font-medium text-slate-900">{venue.nameEn}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Status</span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> Under Review
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 text-left shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" /> What happens next?
            </h3>
            <ol className="space-y-3">
              {[
                { label: "DSO Review", desc: "District Sports Officer reviews your application (1-3 working days)", icon: "👤" },
                { label: "SPOC Verification", desc: "Venue SPOC verifies availability and compatibility (2-5 days)", icon: "🔍" },
                { label: "Commissionerate Approval", desc: "For large/national events, commissionerate clearance (up to 7 days)", icon: "🏛️" },
                { label: "Fee Assessment & Payment", desc: "Fee notice sent via SMS/email with payment link", icon: "💳" },
                { label: "Confirmation", desc: "Digital booking letter issued with venue access details", icon: "✅" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-lg leading-5 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                Total SLA: <strong className="text-slate-700">14 working days</strong> from submission.
                Contact <a href="mailto:helpdesk@ivims.sai.gov.in" className="text-blue-600 hover:underline">helpdesk@ivims.sai.gov.in</a> for queries.
              </p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href={`/venues/${id}`} className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              Back to Venue
            </Link>
            <Link href="/my-bookings" className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all">
              Track My Bookings
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff]">
      {/* Top bar with progress */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 py-3">
            <Link href={`/venues/${id}`} onClick={() => playClick()} className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-500 hover:text-slate-900">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 font-medium truncate">Booking Application — {venue.nameEn}</p>
              <div className="flex items-center gap-1 mt-1.5">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      s.id < step ? "bg-emerald-400" : s.id === step ? "bg-blue-500" : "bg-slate-200"
                    }`}
                    style={{ flex: s.id === step ? 2 : 1 }}
                  />
                ))}
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-500 tabular-nums shrink-0">{step} / 6</span>
          </div>
        </div>
      </div>

      {/* Step tabs */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const done = s.id < step;
              const active = s.id === step;
              return (
                <React.Fragment key={s.id}>
                  <button
                    type="button"
                    onClick={() => { if (done) { playClick(); setStep(s.id); } }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      active ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      done ? "text-emerald-700 hover:bg-emerald-50 cursor-pointer" :
                      "text-slate-400 cursor-default"
                    }`}
                  >
                    {done ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Icon className="w-3.5 h-3.5" />}
                    {s.label}
                  </button>
                  {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-slate-300 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* STEP 1 — Event */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Event Details</h2>
              <p className="text-sm text-slate-500 mt-1">Tell us about the event you&apos;re planning.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <InputField label="Name of Event / Activity" required placeholder="e.g. Gujarat State Under-17 Football Championship 2026" value={form.eventName} onChange={(e) => set("eventName", e.target.value)} />
              </div>
              <div>
                <FieldLabel label="Type of Event" required />
                <select value={form.eventType} onChange={(e) => set("eventType", e.target.value as EventType)}
                  className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all">
                  <option value="">Select event type</option>
                  {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <InputField label="Organising / Affiliated Body" placeholder="e.g. Gujarat Football Association" value={form.affiliatedBody} onChange={(e) => set("affiliatedBody", e.target.value)} />
            </div>

            <div>
              <FieldLabel label="Level of Event" required />
              <div className="flex flex-wrap gap-2 mt-1">
                {EVENT_LEVELS.map((l) => (
                  <button key={l.value} type="button"
                    onClick={() => { playClick(); set("eventLevel", l.value); }}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200 ${form.eventLevel === l.value ? l.color + " shadow-sm" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <InputField label="Age Category" placeholder="e.g. U-17, Open, Senior" value={form.ageCategory} onChange={(e) => set("ageCategory", e.target.value)} />
              <InputField label="Expected Participants" required type="number" min="1" placeholder="e.g. 256" value={form.participantCount} onChange={(e) => set("participantCount", e.target.value)} />
              <InputField label="Expected Spectators" type="number" min="0" placeholder="e.g. 2000" value={form.audienceCount} onChange={(e) => set("audienceCount", e.target.value)} />
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { key: "mediaPresence" as keyof FormData, label: "Media / TV Coverage Expected", icon: Monitor, color: "blue" },
                { key: "internationalAthletes" as keyof FormData, label: "International Athletes Participating", icon: Users, color: "violet" },
              ].map(({ key, label, icon: Icon, color }) => (
                <button key={key} type="button" onClick={() => toggle(key)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                    form[key] ? `border-${color}-400 bg-${color}-50 text-${color}-700` : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}>
                  <Icon className="w-4 h-4" />
                  {label}
                  {form[key] && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <div>
              <FieldLabel label="Brief Event Description" />
              <textarea value={form.eventDescription} onChange={(e) => set("eventDescription", e.target.value)} rows={4}
                placeholder="Describe the event format, disciplines, governing rules, and any special requirements..."
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none" />
            </div>
          </div>
        )}

        {/* STEP 2 — Venue & Dates */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Venue &amp; Dates</h2>
              <p className="text-sm text-slate-500 mt-1">Choose the sub-venue and specify your booking window.</p>
            </div>

            <div>
              <FieldLabel label="Sub-Venue / Facility" required />
              <div className="space-y-2 mt-1">
                {venue.subVenues.map((sv) => (
                  <button key={sv.id} type="button"
                    onClick={() => { if (sv.bookable) { playClick(); set("subVenueId", sv.id); } }}
                    disabled={!sv.bookable}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-200 ${
                      !sv.bookable ? "opacity-50 cursor-not-allowed border-slate-100 bg-slate-50" :
                      form.subVenueId === sv.id ? "border-blue-400 bg-blue-50 shadow-sm" :
                      "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                    }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${form.subVenueId === sv.id ? "border-blue-500 bg-blue-500" : "border-slate-300"}`}>
                        {form.subVenueId === sv.id && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{sv.name}</p>
                        <p className="text-xs text-slate-500">Capacity: {sv.capacity.toLocaleString()} · {sv.type.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">₹{(sv.baseRatePaise / 100).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">base / day</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InputField label="Event Start Date" required type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} />
              <InputField label="Event End Date" required type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} />
              <InputField label="Setup / Rehearsal From" type="date" value={form.setupDate} onChange={(e) => set("setupDate", e.target.value)} />
              <InputField label="Teardown / Departure By" type="date" value={form.teardownDate} onChange={(e) => set("teardownDate", e.target.value)} />
              <InputField label="Daily Start Time" required type="time" value={form.dailyStartTime} onChange={(e) => set("dailyStartTime", e.target.value)} />
              <InputField label="Daily End Time" required type="time" value={form.dailyEndTime} onChange={(e) => set("dailyEndTime", e.target.value)} />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-semibold mb-1">Booking Policy</p>
                <ul className="list-disc list-inside space-y-1 text-xs text-amber-700">
                  <li>Minimum booking: 4 hours. Maximum: 30 consecutive days.</li>
                  <li>Setup day charged at 50% of daily rate.</li>
                  <li>Extensions require a fresh amendment application.</li>
                  <li>Cancellation within 48 hours: no refund on deposit.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 — Services */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Additional Services</h2>
              <p className="text-sm text-slate-500 mt-1">Select facilities and support services required. Additional charges apply.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <ToggleChip label="Floodlights / High-Mast" icon={Lightbulb} active={form.floodlights} onClick={() => toggle("floodlights")} />
              <ToggleChip label="PA / Sound System" icon={Mic} active={form.paSystem} onClick={() => toggle("paSystem")} />
              <ToggleChip label="Electronic Scoreboard" icon={Monitor} active={form.scoreboard} onClick={() => toggle("scoreboard")} />
              <ToggleChip label="OB Van / Broadcast Setup" icon={Monitor} active={form.obVan} onClick={() => toggle("obVan")} />
              <ToggleChip label="First Aid Station" icon={Shield} active={form.firstAid} onClick={() => toggle("firstAid")} />
              <ToggleChip label="Ambulance on Standby" icon={Ambulance} active={form.ambulance} onClick={() => toggle("ambulance")} />
              <ToggleChip label="Police Bandobast" icon={Shield} active={form.policebandobast} onClick={() => toggle("policebandobast")} />
              <ToggleChip label="Parking Management" icon={ParkingCircle} active={form.parkingMgmt} onClick={() => toggle("parkingMgmt")} />
              <ToggleChip label="Catering Permission" icon={Utensils} active={form.cateringPermission} onClick={() => toggle("cateringPermission")} />
              <ToggleChip label="Generator / DG Backup" icon={Zap} active={form.generator} onClick={() => toggle("generator")} />
              <ToggleChip label="Dressing Rooms" icon={User} active={form.dressingRooms} onClick={() => toggle("dressingRooms")} />
              <ToggleChip label="Press Conference Room" icon={Mic} active={form.pressConference} onClick={() => toggle("pressConference")} />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">For events with 500+ expected attendance, police arrangement is mandatory and the application will be forwarded to the local Police Superintendent automatically.</p>
            </div>
          </div>
        )}

        {/* STEP 4 — Track & Fee */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Booking Track &amp; Fee</h2>
              <p className="text-sm text-slate-500 mt-1">Select the appropriate booking category and payment mode.</p>
            </div>

            <div>
              <FieldLabel label="Booking Track" required />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                {BOOKING_TRACKS.map((t) => (
                  <button key={t.value} type="button"
                    onClick={() => { playClick(); set("bookingTrack", t.value); }}
                    className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${form.bookingTrack === t.value ? t.color + " shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <span className="text-2xl">{t.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900">{t.label}</p>
                      <p className="text-xs text-slate-500 mb-1">{t.desc}</p>
                      <p className="text-xs font-medium text-slate-700 bg-white/70 rounded px-2 py-0.5 inline-block border border-slate-200">{t.feeNote}</p>
                    </div>
                    {form.bookingTrack === t.value && <Check className="w-5 h-5 text-blue-600 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {form.bookingTrack && form.subVenueId && form.startDate && form.endDate && (() => {
              const sv = venue.subVenues.find((s) => s.id === form.subVenueId);
              if (!sv) return null;
              const start = new Date(form.startDate);
              const end = new Date(form.endDate);
              const days = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000) + 1);
              const baseRate = sv.baseRatePaise / 100;
              const discountPct = form.bookingTrack === "GOVERNMENT" ? 100 : form.bookingTrack === "FEDERATION" ? 50 : 0;
              const subtotal = baseRate * days;
              const discountAmt = (subtotal * discountPct) / 100;
              const serviceFee = subtotal * 0.05;
              const total = subtotal - discountAmt + serviceFee;
              return (
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-5 text-white">
                  <p className="text-xs font-medium text-slate-400 mb-3 uppercase tracking-wider">Estimated Fee Breakup</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Base rate × {days} day(s)</span><span>₹{subtotal.toLocaleString()}</span></div>
                    {discountPct > 0 && <div className="flex justify-between text-sm"><span className="text-emerald-400">{discountPct}% {form.bookingTrack} discount</span><span className="text-emerald-400">−₹{discountAmt.toLocaleString()}</span></div>}
                    <div className="flex justify-between text-sm"><span className="text-slate-400">Service fee (5%)</span><span>₹{serviceFee.toLocaleString()}</span></div>
                    <div className="border-t border-slate-700 my-2" />
                    <div className="flex justify-between font-bold"><span>Estimated Total</span><span className="text-blue-300">₹{total.toLocaleString()}</span></div>
                    <p className="text-xs text-slate-500 mt-2">*Final fee assessed after approval. Security deposit 25% at payment stage.</p>
                  </div>
                </div>
              );
            })()}

            <div>
              <FieldLabel label="Preferred Payment Mode" required />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-1">
                {PAYMENT_MODES.map((p) => (
                  <button key={p.value} type="button"
                    onClick={() => { playClick(); set("paymentMode", p.value); }}
                    className={`p-3 rounded-xl border text-center transition-all duration-200 ${form.paymentMode === p.value ? "border-blue-400 bg-blue-50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}>
                    <p className="text-sm font-semibold text-slate-900">{p.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{p.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 5 — Documents */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Supporting Documents</h2>
              <p className="text-sm text-slate-500 mt-1">Upload required documents. Max 5MB per file. Accepted: PDF, JPG, PNG.</p>
            </div>

            <div className="space-y-3">
              {REQUIRED_DOCS.map((doc) => {
                const file = form.docs[doc.key];
                return (
                  <div key={doc.key} className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-slate-900">{doc.label}</p>
                        {doc.required && <span className="text-xs font-medium text-red-500 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">Required</span>}
                      </div>
                      <p className="text-xs text-slate-500">{doc.note}</p>
                      {file && <p className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1"><Check className="w-3 h-3" /> {file.name}</p>}
                    </div>
                    <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-all shrink-0 ${file ? "border-emerald-300 bg-emerald-50 text-emerald-700" : "border-blue-300 bg-blue-50 text-blue-700 hover:bg-blue-100"}`}>
                      <Upload className="w-3.5 h-3.5" />
                      {file ? "Replace" : "Upload"}
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0] ?? null;
                          set("docs", { ...form.docs, [doc.key]: f });
                        }} />
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-700 mb-2">Document Guidelines</p>
              <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                <li>All documents must be valid and not expired at time of event.</li>
                <li>Government-issued documents must be self-attested.</li>
                <li>Foreign participant documents must be notarised with English translation.</li>
                <li>Insurance certificate must cover entire event period including setup/teardown.</li>
                <li>Submission of false documents is a criminal offence under IPC Section 471.</li>
              </ul>
            </div>
          </div>
        )}

        {/* STEP 6 — Declaration */}
        {step === 6 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Declaration &amp; Submit</h2>
              <p className="text-sm text-slate-500 mt-1">Please read and accept the terms before submitting.</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                <p className="text-sm font-semibold text-slate-900">Terms &amp; Conditions for Venue Booking</p>
                <p className="text-xs text-slate-500">India Venue &amp; Infrastructure Management System (I-VIMS) · Sports Authority of India</p>
              </div>
              <div className="p-4 h-52 overflow-y-auto text-xs text-slate-600 space-y-3 leading-relaxed">
                <p><strong>1. Authority:</strong> Governed by the Ministry of Youth Affairs &amp; Sports, Government of India, and Sports Authority of India under SAI G.O. No. SAI/10/2024/TF dated 01-04-2024.</p>
                <p><strong>2. Eligibility:</strong> Applicant confirms legal authority to represent the named organisation and accuracy of all information provided.</p>
                <p><strong>3. Approval Discretion:</strong> Approval subject to availability and discretion of concerned authority. Submission does not guarantee booking.</p>
                <p><strong>4. Fees:</strong> All fees, security deposits, and taxes as assessed shall be payable before confirmation. Rates subject to revision per government orders.</p>
                <p><strong>5. Use of Venue:</strong> Venue shall be used only for stated purpose. Sub-letting or use for undeclared purposes is strictly prohibited.</p>
                <p><strong>6. Damages:</strong> Applicant liable for any damage during booking period. Cost of repairs recovered from security deposit or through legal means.</p>
                <p><strong>7. Compliance:</strong> Applicant shall comply with fire safety, crowd management, police requirements, and other directions from competent authorities.</p>
                <p><strong>8. Cancellation Policy:</strong> Full refund if cancelled 15+ days prior; 50% if 7-14 days; No refund within 7 days of event. Written intimation mandatory.</p>
                <p><strong>9. Data Protection:</strong> Personal data processed under Digital Personal Data Protection Act 2023 for venue booking purposes only.</p>
                <p><strong>10. Jurisdiction:</strong> Disputes subject to jurisdiction of courts at New Delhi, India.</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { key: "declarationAccuracy" as keyof FormData, label: "I/We declare that all information provided is true, complete and accurate. Misrepresentation may result in cancellation and legal action." },
                { key: "declarationCompliance" as keyof FormData, label: "I/We agree to comply with all rules, regulations, and guidelines of SAG and the venue authority during the booking period." },
                { key: "declarationTerms" as keyof FormData, label: "I/We have read, understood, and accept the Terms & Conditions and agree to be bound by them." },
              ].map(({ key, label }) => (
                <button key={key} type="button" onClick={() => { playClick(); toggle(key); }}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl border text-left transition-all duration-200 ${form[key] ? "border-emerald-300 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
                  <div className={`w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${form[key] ? "border-emerald-500 bg-emerald-500" : "border-slate-300"}`}>
                    {form[key] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{label}</p>
                </button>
              ))}
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <p className="text-sm font-semibold text-slate-900 mb-3">Application Summary</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div><span className="text-slate-500">Venue</span><p className="font-medium text-slate-900 mt-0.5">{venue.nameEn}</p></div>
                <div><span className="text-slate-500">Applicant</span><p className="font-medium text-slate-900 mt-0.5">{form.orgName || "—"}</p></div>
                <div><span className="text-slate-500">Event</span><p className="font-medium text-slate-900 mt-0.5">{form.eventName || "—"}</p></div>
                <div><span className="text-slate-500">Track</span><p className="font-medium text-slate-900 mt-0.5">{form.bookingTrack || "—"}</p></div>
                <div><span className="text-slate-500">Dates</span><p className="font-medium text-slate-900 mt-0.5">{form.startDate || "—"} → {form.endDate || "—"}</p></div>
                <div><span className="text-slate-500">SLA</span><p className="font-medium text-emerald-700 mt-0.5">14 working days</p></div>
              </div>
            </div>
          </div>
        )}

        {/* Nav buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
          <button type="button" onClick={goPrev} disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>

          {step < 6 ? (
            <button type="button" onClick={goNext}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-sm shadow-blue-200">
              Save &amp; Continue <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button type="button" onClick={handleSubmit}
              disabled={!form.declarationAccuracy || !form.declarationCompliance || !form.declarationTerms}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Submit Application
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
