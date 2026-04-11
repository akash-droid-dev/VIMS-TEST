import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, differenceInDays } from "date-fns";
import type { VenueGrade, VenueLifecycleState, BookingState, ComplianceState, UserTier } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 10000000) return `₹${(rupees / 10000000).toFixed(2)}Cr`;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(2)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return `₹${rupees.toLocaleString("en-IN")}`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function daysUntil(date: string | Date): number {
  return differenceInDays(new Date(date), new Date());
}

export function gradeColor(grade: VenueGrade): string {
  const map: Record<VenueGrade, string> = {
    A_PLUS: "bg-emerald-100 text-emerald-800 border-emerald-200",
    A: "bg-green-100 text-green-800 border-green-200",
    B: "bg-blue-100 text-blue-800 border-blue-200",
    C: "bg-yellow-100 text-yellow-800 border-yellow-200",
    D: "bg-red-100 text-red-800 border-red-200",
  };
  return map[grade] ?? "bg-gray-100 text-gray-800";
}

export function gradeLabel(grade: VenueGrade): string {
  const map: Record<VenueGrade, string> = {
    A_PLUS: "A+", A: "A", B: "B", C: "C", D: "D",
  };
  return map[grade] ?? grade;
}

export function lifecycleColor(state: VenueLifecycleState): string {
  const map: Record<VenueLifecycleState, string> = {
    PROPOSED: "bg-blue-100 text-blue-800",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    SUSPENDED: "bg-orange-100 text-orange-800",
    REVOKED: "bg-red-100 text-red-800",
    DEMOLISHED: "bg-gray-100 text-gray-800",
  };
  return map[state] ?? "bg-gray-100 text-gray-800";
}

export function bookingStateColor(state: BookingState): string {
  const map: Record<BookingState, string> = {
    DRAFT: "bg-slate-100 text-slate-700",
    SUBMITTED: "bg-blue-100 text-blue-700",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-700",
    PENDING_PAYMENT: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-gray-100 text-gray-700",
    COMPLETED: "bg-emerald-100 text-emerald-700",
    DISPUTED: "bg-rose-100 text-rose-700",
  };
  return map[state] ?? "bg-gray-100 text-gray-700";
}

export function complianceColor(state: ComplianceState): string {
  const map: Record<ComplianceState, string> = {
    VALID: "text-green-600",
    EXPIRING_SOON: "text-yellow-600",
    EXPIRED: "text-red-600",
    MISSING: "text-slate-400",
  };
  return map[state] ?? "text-gray-600";
}

export function tierLabel(tier: UserTier): string {
  const map: Record<UserTier, string> = {
    SUPER_ADMIN: "Super Admin",
    SPOC: "SPOC",
    COMMISSIONERATE: "Commissionerate",
    DSO: "DSO",
    DSC: "DSC",
    VENUE_MANAGER: "Venue Manager",
    FIELD_OFFICER: "Field Officer",
    CITIZEN: "Citizen",
    AUDITOR: "Auditor",
  };
  return map[tier] ?? tier;
}

export function tierColor(tier: UserTier): string {
  const map: Record<UserTier, string> = {
    SUPER_ADMIN: "bg-purple-100 text-purple-800",
    SPOC: "bg-blue-100 text-blue-800",
    COMMISSIONERATE: "bg-indigo-100 text-indigo-800",
    DSO: "bg-cyan-100 text-cyan-800",
    DSC: "bg-sky-100 text-sky-800",
    VENUE_MANAGER: "bg-teal-100 text-teal-800",
    FIELD_OFFICER: "bg-green-100 text-green-800",
    CITIZEN: "bg-gray-100 text-gray-800",
    AUDITOR: "bg-orange-100 text-orange-800",
  };
  return map[tier] ?? "bg-gray-100 text-gray-800";
}

export function truncate(str: string, maxLen: number): string {
  return str.length > maxLen ? `${str.slice(0, maxLen)}…` : str;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");
}

export function slaHealth(deadline: string): "OK" | "WARNING" | "BREACHED" {
  const days = daysUntil(deadline);
  if (days < 0) return "BREACHED";
  if (days <= 2) return "WARNING";
  return "OK";
}

export function slaColor(health: "OK" | "WARNING" | "BREACHED"): string {
  return {
    OK: "text-green-600",
    WARNING: "text-yellow-600",
    BREACHED: "text-red-600",
  }[health];
}

export function getSportEmoji(sport: string): string {
  const map: Record<string, string> = {
    cricket: "🏏", football: "⚽", basketball: "🏀", volleyball: "🏐",
    badminton: "🏸", tennis: "🎾", swimming: "🏊", athletics: "🏃",
    hockey: "🏑", kabaddi: "🤼", wrestling: "🤼", boxing: "🥊",
    shooting: "🎯", archery: "🏹", weightlifting: "🏋️", gymnastics: "🤸",
    chess: "♟️", multipurpose: "🏟️",
  };
  return map[sport.toLowerCase()] ?? "🏅";
}

export function venueTypeLabel(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}
