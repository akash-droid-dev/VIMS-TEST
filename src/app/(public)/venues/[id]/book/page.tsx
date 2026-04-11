"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  MapPin, CalendarDays, Clock, ChevronLeft, ChevronRight,
  Shield, CreditCard, CheckCircle2, Loader2, AlertCircle,
  Zap, User, Phone, Mail, ArrowRight, Trophy
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_VENUES } from "@/lib/mock-data";

type Step = "slot" | "details" | "payment" | "otp" | "confirmed";

const TIME_SLOTS = [
  { id: "s1", time: "06:00 – 07:00", available: true },
  { id: "s2", time: "07:00 – 08:00", available: true },
  { id: "s3", time: "08:00 – 09:00", available: false },
  { id: "s4", time: "09:00 – 10:00", available: true },
  { id: "s5", time: "16:00 – 17:00", available: true },
  { id: "s6", time: "17:00 – 18:00", available: false },
  { id: "s7", time: "18:00 – 19:00", available: true },
  { id: "s8", time: "19:00 – 20:00", available: true },
];

const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "💳", desc: "Google Pay, PhonePe, BHIM" },
  { id: "card", label: "Debit / Credit Card", icon: "🏦", desc: "Visa, Mastercard, RuPay" },
  { id: "netbanking", label: "Net Banking", icon: "🔒", desc: "All major banks" },
];

function getDaysInMonth(year: number, month: number) {
  const days = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

export default function BookSlotPage() {
  const params = useParams();
  const router = useRouter();
  const venue = MOCK_VENUES.find((v) => v.id === params.id) ?? MOCK_VENUES[1];

  const [step, setStep] = useState<Step>("slot");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [payMethod, setPayMethod] = useState("upi");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [bookingRef, setBookingRef] = useState("");

  const [booker, setBooker] = useState({
    name: "",
    mobile: "",
    email: "",
    purpose: "",
    participants: "1",
  });

  const slotPrice = 8000; // 80.00 INR in paise
  const convenience = Math.round(slotPrice * 0.02);
  const gst = Math.round((slotPrice + convenience) * 0.18);
  const total = slotPrice + convenience + gst;

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const days = getDaysInMonth(viewYear, viewMonth);
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const isDateDisabled = (d: Date) => {
    const diff = Math.floor((d.getTime() - today.getTime()) / 86400000);
    return diff < 0 || diff > 30;
  };

  const handleNextStep = async () => {
    setError("");
    if (step === "slot") {
      if (!selectedDate || !selectedSlot) { setError("Select a date and time slot."); return; }
      setStep("details");
    } else if (step === "details") {
      if (!booker.name || !booker.mobile) { setError("Name and mobile are required."); return; }
      setStep("payment");
    } else if (step === "payment") {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      setLoading(false);
      setStep("otp");
    } else if (step === "otp") {
      const code = otpDigits.join("");
      if (code.length < 6) { setError("Enter the 6-digit OTP."); return; }
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1200));
      setLoading(false);
      setBookingRef(`BK-2026-0${Math.floor(9000 + Math.random() * 999)}`);
      setStep("confirmed");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otpDigits];
    next[index] = value.slice(-1);
    setOtpDigits(next);
    if (value && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpKey = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const STEPS = ["slot", "details", "payment", "otp"];
  const stepIdx = STEPS.indexOf(step);

  if (step === "confirmed") {
    return (
      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Booking Confirmed!</h1>
          <p className="text-slate-500 text-sm mb-6">
            Your slot at <span className="font-semibold text-slate-800">{venue.nameEn}</span> has been booked.
          </p>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 text-left mb-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-slate-500">Booking Reference</span>
              <span className="text-sm font-bold text-blue-800">{bookingRef}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Venue</span>
                <span className="font-medium text-slate-900 text-right max-w-[60%]">{venue.nameEn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-medium text-slate-900">
                  {selectedDate?.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-medium text-slate-900">
                  {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid</span>
                <span className="font-bold text-green-700">₹{(total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 text-left text-xs text-blue-700">
            <p className="font-medium mb-1">What's next?</p>
            <ul className="space-y-1">
              <li>• Payment receipt sent to your registered mobile</li>
              <li>• Show this booking ID at the venue gate</li>
              <li>• Arrive 10 minutes early — slot is non-transferable</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/my-bookings" className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 text-center">
              My Bookings
            </Link>
            <Link href="/venues" className="flex-1 py-2.5 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 text-center">
              Book Another
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        href={`/venues/${venue.id}`}
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-6 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {venue.nameEn}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step header */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold text-slate-900">Book a Slot</h1>
              <div className="flex items-center gap-1.5">
                {STEPS.map((s, i) => (
                  <div
                    key={s}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      i < stepIdx ? "w-5 bg-green-500" :
                      i === stepIdx ? "w-8 bg-blue-800" : "w-2 bg-slate-200"
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Step labels */}
            <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-slate-400 mb-0">
              {["Select Slot", "Your Details", "Payment", "Confirm"].map((label, i) => (
                <span key={label} className={cn(i === stepIdx ? "text-blue-800 font-semibold" : "")}>
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Step 1: Slot selection */}
          {step === "slot" && (
            <div className="space-y-4">
              {/* Calendar */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-slate-800">Select Date</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const d = new Date(viewYear, viewMonth - 1);
                        setViewYear(d.getFullYear());
                        setViewMonth(d.getMonth());
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium text-slate-700 min-w-[110px] text-center">
                      {new Date(viewYear, viewMonth).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </span>
                    <button
                      onClick={() => {
                        const d = new Date(viewYear, viewMonth + 1);
                        setViewYear(d.getFullYear());
                        setViewMonth(d.getMonth());
                      }}
                      className="p-1 rounded-lg hover:bg-slate-100"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-slate-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {days.map((d) => {
                    const disabled = isDateDisabled(d);
                    const isSelected = selectedDate?.toDateString() === d.toDateString();
                    const isToday = d.toDateString() === today.toDateString();
                    return (
                      <button
                        key={d.getDate()}
                        disabled={disabled}
                        onClick={() => setSelectedDate(d)}
                        className={cn(
                          "h-9 w-full rounded-lg text-sm transition-all",
                          isSelected ? "bg-blue-800 text-white font-semibold" :
                          isToday ? "border-2 border-blue-800 text-blue-800 font-semibold" :
                          disabled ? "text-slate-300 cursor-not-allowed" :
                          "hover:bg-blue-50 text-slate-700"
                        )}
                      >
                        {d.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time slots */}
              {selectedDate && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-sm font-semibold text-slate-800 mb-3">
                    Available Slots · {selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot.id}
                        disabled={!slot.available}
                        onClick={() => setSelectedSlot(slot.id)}
                        className={cn(
                          "py-2.5 rounded-xl border text-xs font-medium text-center transition-all",
                          !slot.available ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed" :
                          selectedSlot === slot.id ? "border-blue-800 bg-blue-800 text-white" :
                          "border-slate-200 hover:border-blue-300 hover:bg-blue-50 text-slate-700"
                        )}
                      >
                        {slot.time}
                        {!slot.available && <div className="text-[10px] mt-0.5">Booked</div>}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Booker details */}
          {step === "details" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-800">Your Details</h2>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700">Full Name <span className="text-red-500">*</span></label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    value={booker.name}
                    onChange={(e) => setBooker((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Your full name"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Mobile <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      value={booker.mobile}
                      onChange={(e) => setBooker((p) => ({ ...p, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) }))}
                      placeholder="10-digit number"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={booker.email}
                      onChange={(e) => setBooker((p) => ({ ...p, email: e.target.value }))}
                      placeholder="Optional"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">Purpose</label>
                  <select
                    value={booker.purpose}
                    onChange={(e) => setBooker((p) => ({ ...p, purpose: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800 bg-white"
                  >
                    <option value="">Select</option>
                    <option value="training">Personal Training</option>
                    <option value="practice">Practice Session</option>
                    <option value="fitness">Fitness / Recreation</option>
                    <option value="competition">Local Competition</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-700">No. of Participants</label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={booker.participants}
                    onChange={(e) => setBooker((p) => ({ ...p, participants: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-800">
                <span className="font-medium">Policy reminder:</span> Cancellation allowed up to 24 hours before the slot. No-shows forfeit the full payment.
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === "payment" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-slate-800">Select Payment Method</h2>
              <div className="space-y-2">
                {PAYMENT_METHODS.map((pm) => (
                  <label
                    key={pm.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      payMethod === pm.id ? "border-blue-800 bg-blue-50" : "border-slate-200 hover:border-blue-200"
                    )}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={pm.id}
                      checked={payMethod === pm.id}
                      onChange={() => setPayMethod(pm.id)}
                      className="accent-blue-800"
                    />
                    <span className="text-lg">{pm.icon}</span>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{pm.label}</div>
                      <div className="text-xs text-slate-500">{pm.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2 text-xs text-green-800">
                <Shield className="h-4 w-4 shrink-0" />
                Payments processed via Razorpay · PCI-DSS L1 certified · 256-bit SSL
              </div>
            </div>
          )}

          {/* Step 4: OTP confirmation */}
          {step === "otp" && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5">
              <div className="text-center py-2">
                <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <h2 className="text-base font-bold text-slate-900">Confirm with OTP</h2>
                <p className="text-sm text-slate-500 mt-1">
                  OTP sent to <span className="font-semibold text-slate-800">+91 {booker.mobile}</span>
                </p>
                <p className="text-xs text-slate-400 mt-0.5">Valid for 10 minutes</p>
              </div>
              <div className="flex justify-center gap-2">
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKey(i, e)}
                    className="h-12 w-10 text-center rounded-xl border-2 border-slate-200 text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-800 transition-colors"
                  />
                ))}
              </div>
              <p className="text-center text-xs text-slate-400">
                Didn't receive?{" "}
                <button type="button" className="text-blue-700 hover:underline">Resend OTP</button>
              </p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-2.5 rounded-xl">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step !== "slot" && (
              <button
                onClick={() => {
                  setError("");
                  const prev = STEPS[stepIdx - 1] as Step;
                  setStep(prev);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
            )}
            <button
              onClick={handleNextStep}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-800 text-white text-sm font-semibold hover:bg-blue-900 disabled:opacity-60 transition-colors"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {step === "slot" && <><Zap className="h-4 w-4" /> Continue to Details</>}
              {step === "details" && <><ArrowRight className="h-4 w-4" /> Proceed to Payment</>}
              {step === "payment" && <><CreditCard className="h-4 w-4" /> {loading ? "Processing…" : `Pay ₹${(total / 100).toFixed(2)}`}</>}
              {step === "otp" && <><CheckCircle2 className="h-4 w-4" /> {loading ? "Confirming…" : "Confirm Booking"}</>}
            </button>
          </div>
        </div>

        {/* Right: booking summary */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm sticky top-20">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                {venue.venueType === "SWIMMING_POOL" ? "🏊" : venue.venueType === "STADIUM" ? "🏟️" : "🏸"}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 leading-tight">{venue.nameEn}</h3>
                <div className="flex items-center gap-1 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  {venue.lgdDistrictCode}
                </div>
              </div>
            </div>

            {selectedDate && (
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <CalendarDays className="h-4 w-4 text-slate-400" />
                  {selectedDate.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
                </div>
                {selectedSlot && (
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {TIME_SLOTS.find((s) => s.id === selectedSlot)?.time}
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Slot fee (1 hr)</span>
                <span>₹{(slotPrice / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Platform convenience fee</span>
                <span>₹{(convenience / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>GST (18%)</span>
                <span>₹{(gst / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-slate-100 pt-2">
                <span>Total</span>
                <span>₹{(total / 100).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
              <Trophy className="h-3 w-3" />
              Pay & Play slot · Instant confirmation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
