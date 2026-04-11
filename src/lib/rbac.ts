import type { UserTier } from "@/types";

// ============================================================
// VIMS RBAC Matrix — 7-tier scope enforcement
// ============================================================

export interface RBACPermission {
  module: string;
  verbs: string[];
}

export const RBAC_MATRIX: Record<UserTier, Record<string, string[]>> = {
  SUPER_ADMIN: {
    venues: ["create", "read", "update", "delete", "activate", "revoke", "override"],
    bookings: ["create", "read", "update", "approve", "reject", "cancel", "override"],
    payplay: ["read", "toggle", "override"],
    users: ["create", "read", "update", "delete", "suspend"],
    audit: ["read", "export"],
    pricing: ["create", "read", "update", "activate", "revoke"],
    reports: ["read", "export", "generate"],
    calendar: ["read", "write", "override"],
    compliance: ["read", "write", "flag"],
    settings: ["read", "write"],
  },
  SPOC: {
    venues: ["create", "read", "update", "activate", "revoke"],
    bookings: ["read", "approve", "reject", "query"],
    payplay: ["read"],
    users: ["read"],
    audit: ["read"],
    pricing: ["read"],
    reports: ["read", "export"],
    calendar: ["read", "write"],
    compliance: ["read", "write"],
    settings: ["read"],
  },
  COMMISSIONERATE: {
    venues: ["read"],
    bookings: ["read", "approve", "reject"],
    payplay: ["read"],
    users: ["read"],
    audit: ["read", "export"],
    pricing: ["read", "update"],
    reports: ["read", "export", "generate"],
    calendar: ["read"],
    compliance: ["read"],
    settings: ["read"],
  },
  DSO: {
    venues: ["read", "update"],
    bookings: ["read", "approve", "reject", "query"],
    payplay: ["read", "toggle"],
    users: ["read"],
    audit: ["read"],
    pricing: ["read"],
    reports: ["read"],
    calendar: ["read", "write"],
    compliance: ["read"],
    settings: [],
  },
  DSC: {
    venues: ["read", "update"],
    bookings: ["read", "approve", "reject"],
    payplay: ["read", "toggle"],
    users: ["read"],
    audit: ["read"],
    pricing: ["read"],
    reports: ["read"],
    calendar: ["read"],
    compliance: ["read"],
    settings: [],
  },
  VENUE_MANAGER: {
    venues: ["read", "update"],
    bookings: ["read", "create"],
    payplay: ["read"],
    users: [],
    audit: ["read"],
    pricing: ["read"],
    reports: ["read"],
    calendar: ["read", "write"],
    compliance: ["read", "update"],
    settings: [],
  },
  FIELD_OFFICER: {
    venues: ["create", "read", "update"],
    bookings: [],
    payplay: [],
    users: [],
    audit: [],
    pricing: [],
    reports: [],
    calendar: ["read"],
    compliance: ["read"],
    settings: [],
  },
  CITIZEN: {
    venues: ["read"],
    bookings: ["create", "read", "cancel"],
    payplay: ["read", "create", "cancel"],
    users: [],
    audit: [],
    pricing: ["read"],
    reports: [],
    calendar: ["read"],
    compliance: [],
    settings: [],
  },
  AUDITOR: {
    venues: ["read"],
    bookings: ["read"],
    payplay: ["read"],
    users: ["read"],
    audit: ["read", "export"],
    pricing: ["read"],
    reports: ["read", "export"],
    calendar: ["read"],
    compliance: ["read"],
    settings: [],
  },
};

export function hasPermission(tier: UserTier, module: string, verb: string): boolean {
  return RBAC_MATRIX[tier]?.[module]?.includes(verb) ?? false;
}

export function canTogglePayPlay(tier: UserTier): boolean {
  return hasPermission(tier, "payplay", "toggle");
}

export function canApproveBooking(tier: UserTier): boolean {
  return hasPermission(tier, "bookings", "approve");
}

export function canActivateVenue(tier: UserTier): boolean {
  return hasPermission(tier, "venues", "activate");
}

export function getSidebarNav(tier: UserTier): NavItem[] {
  const all: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard", tiers: ["SUPER_ADMIN", "SPOC", "COMMISSIONERATE", "DSO", "DSC", "VENUE_MANAGER", "FIELD_OFFICER", "AUDITOR"] },
    { label: "Venues", href: "/venues", icon: "Building2", tiers: ["SUPER_ADMIN", "SPOC", "COMMISSIONERATE", "DSO", "DSC", "VENUE_MANAGER", "FIELD_OFFICER"] },
    { label: "Bookings", href: "/bookings", icon: "CalendarCheck", tiers: ["SUPER_ADMIN", "SPOC", "COMMISSIONERATE", "DSO", "DSC", "VENUE_MANAGER"] },
    { label: "Pay & Play", href: "/payplay", icon: "Zap", tiers: ["SUPER_ADMIN", "SPOC", "DSO", "DSC"] },
    { label: "Calendar", href: "/calendar", icon: "Calendar", tiers: ["SUPER_ADMIN", "SPOC", "DSO", "DSC", "VENUE_MANAGER"] },
    { label: "Compliance", href: "/compliance", icon: "ShieldCheck", tiers: ["SUPER_ADMIN", "SPOC", "VENUE_MANAGER"] },
    { label: "Audit Ledger", href: "/audit", icon: "FileSearch", tiers: ["SUPER_ADMIN", "SPOC", "COMMISSIONERATE", "AUDITOR"] },
    { label: "Users", href: "/users", icon: "Users", tiers: ["SUPER_ADMIN", "SPOC"] },
    { label: "Settings", href: "/settings", icon: "Settings", tiers: ["SUPER_ADMIN"] },
  ];
  return all.filter((item) => (item.tiers as string[]).includes(tier));
}

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  tiers: UserTier[];
}
