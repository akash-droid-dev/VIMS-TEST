// Shared localStorage store — connects Admin and Public interfaces in real-time

export const STORE_KEY = "vims_shared_store";

export interface RegisteredUser {
  id: string;
  name: string;
  mobile: string;
  email: string;
  district: string;
  sportsInterests: string[];
  registeredAt: string;
  isActive: boolean;
  tier: "CITIZEN";
}

export interface LiveBooking {
  id: string;
  refNo: string;
  // Venue
  venueId: string;
  venueName: string;
  subVenueId: string;
  subVenueName: string;
  // Applicant
  applicantType: string;
  orgName: string;
  contactPerson: string;
  designation: string;
  mobile: string;
  email: string;
  district: string;
  addressLine1: string;
  // Event
  eventName: string;
  eventType: string;
  eventLevel: string;
  affiliatedBody: string;
  ageCategory: string;
  participantCount: string;
  audienceCount: string;
  mediaPresence: boolean;
  internationalAthletes: boolean;
  eventDescription: string;
  // Dates
  startDate: string;
  endDate: string;
  setupDate: string;
  dailyStartTime: string;
  dailyEndTime: string;
  // Services
  servicesRequested: string[];
  // Track & Payment
  bookingTrack: string;
  paymentMode: string;
  // Workflow
  state: "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewRemarks?: string;
}

export interface VIMSStore {
  payplayStates: Record<string, boolean>;
  savedVenues: string[];
  recentlyViewed: string[];
  registeredUsers: RegisteredUser[];
  liveBookings: LiveBooking[];
}

function defaults(): VIMSStore {
  return {
    registeredUsers: [],
    liveBookings: [],
    payplayStates: {
      "G-VIMS-GJ-AHM-STD-00001": false,
      "G-VIMS-GJ-AHM-POOL-00002": true,
      "G-VIMS-GJ-SRT-IND-00003": true,
      "G-VIMS-GJ-VDO-GND-00004": false,
      "G-VIMS-GJ-RJK-ATH-00005": false,
    },
    savedVenues: [],
    recentlyViewed: [],
  };
}

export function getStore(): VIMSStore {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...JSON.parse(raw) };
  } catch {
    return defaults();
  }
}

function saveStore(store: VIMSStore) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
  window.dispatchEvent(new CustomEvent("vims:store_update"));
}

export function getPayPlayState(venueId: string): boolean {
  return getStore().payplayStates[venueId] ?? false;
}

export function setPayPlayState(venueId: string, enabled: boolean) {
  const s = getStore();
  s.payplayStates[venueId] = enabled;
  saveStore(s);
}

export function toggleSavedVenue(venueId: string) {
  const s = getStore();
  const idx = s.savedVenues.indexOf(venueId);
  if (idx >= 0) s.savedVenues.splice(idx, 1);
  else s.savedVenues.push(venueId);
  saveStore(s);
}

export function trackRecentlyViewed(venueId: string) {
  const s = getStore();
  s.recentlyViewed = [venueId, ...s.recentlyViewed.filter((id) => id !== venueId)].slice(0, 10);
  saveStore(s);
}

export function registerCitizen(user: Omit<RegisteredUser, "id" | "registeredAt" | "tier" | "isActive">) {
  const s = getStore();
  const newUser: RegisteredUser = {
    ...user,
    id: `CIT-${Date.now()}`,
    tier: "CITIZEN",
    isActive: true,
    registeredAt: new Date().toISOString(),
  };
  s.registeredUsers = [newUser, ...s.registeredUsers];
  saveStore(s);
  return newUser;
}

export function updateRegisteredUser(id: string, updates: Partial<RegisteredUser>) {
  const s = getStore();
  const idx = s.registeredUsers.findIndex((u) => u.id === id);
  if (idx >= 0) {
    s.registeredUsers[idx] = { ...s.registeredUsers[idx], ...updates };
    saveStore(s);
  }
}

export function getRegisteredUsers(): RegisteredUser[] {
  return getStore().registeredUsers;
}

// ── Live Booking Operations ────────────────────────────────────────────────────

export function submitLiveBooking(
  data: Omit<LiveBooking, "id" | "state" | "submittedAt">
): LiveBooking {
  const s = getStore();
  const booking: LiveBooking = {
    ...data,
    id: `LB-${Date.now()}`,
    state: "SUBMITTED",
    submittedAt: new Date().toISOString(),
  };
  s.liveBookings = [booking, ...(s.liveBookings ?? [])];
  saveStore(s);
  return booking;
}

export function updateLiveBookingState(
  id: string,
  state: LiveBooking["state"],
  reviewedBy: string,
  remarks?: string
) {
  const s = getStore();
  const idx = (s.liveBookings ?? []).findIndex((b) => b.id === id);
  if (idx >= 0) {
    s.liveBookings[idx] = {
      ...s.liveBookings[idx],
      state,
      reviewedBy,
      reviewedAt: new Date().toISOString(),
      reviewRemarks: remarks,
    };
    saveStore(s);
  }
}

export function getLiveBookings(): LiveBooking[] {
  return getStore().liveBookings ?? [];
}
