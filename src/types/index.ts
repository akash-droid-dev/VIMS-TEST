// ============================================================
// VIMS TypeScript Types
// ============================================================

export type UserTier =
  | "SUPER_ADMIN"
  | "SPOC"
  | "COMMISSIONERATE"
  | "DSO"
  | "DSC"
  | "VENUE_MANAGER"
  | "FIELD_OFFICER"
  | "CITIZEN"
  | "AUDITOR";

export type VenueType =
  | "STADIUM"
  | "INDOOR_HALL"
  | "SWIMMING_POOL"
  | "SHOOTING_RANGE"
  | "ATHLETICS_TRACK"
  | "MULTIPURPOSE"
  | "MULTI_SPORT_COMPLEX"
  | "GROUND"
  | "ACADEMY"
  | "WELLNESS_CENTRE";

export type OwnershipType =
  | "GOVERNMENT"
  | "PRIVATE"
  | "PPP"
  | "PSU"
  | "EDUCATIONAL"
  | "FEDERATION"
  | "ASSOCIATION"
  | "ULB"
  | "PANCHAYAT";

export type VenueLifecycleState =
  | "PROPOSED"
  | "UNDER_REVIEW"
  | "ACTIVE"
  | "SUSPENDED"
  | "REVOKED"
  | "DEMOLISHED";

export type VenueGrade = "A_PLUS" | "A" | "B" | "C" | "D";

export type SubVenueType =
  | "MAIN_ARENA"
  | "PRACTICE_GROUND"
  | "TRAINING_HALL"
  | "COURT"
  | "PITCH"
  | "POOL"
  | "TRACK"
  | "GYM"
  | "RANGE"
  | "CONFERENCE_ROOM"
  | "MEETING_ROOM"
  | "CHANGING_ROOM";

export type BookingTrack =
  | "GOVERNMENT"
  | "FEDERATION"
  | "COMMERCIAL"
  | "PAY_AND_PLAY";

export type BookingState =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "PENDING_PAYMENT"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED"
  | "COMPLETED"
  | "DISPUTED";

export type PaymentState =
  | "PENDING"
  | "PARTIAL"
  | "PAID"
  | "REFUNDED"
  | "FAILED";

export type ComplianceState = "VALID" | "EXPIRING_SOON" | "EXPIRED" | "MISSING";

export type KYVStep =
  | "FIELD_COLLECTION"
  | "PHOTO_UPLOAD"
  | "GPS_VERIFICATION"
  | "DOCUMENT_UPLOAD"
  | "SPOC_REVIEW"
  | "ACTIVATION";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Person {
  id: string;
  name: string;
  photo?: string;
  aadhaarHash?: string;
  mobile: string;
  email: string;
  role: string;
  joiningDate: string;
  languagePreference: "EN" | "GU" | "HI";
}

export interface SubVenue {
  id: string;
  parentVenueId: string;
  name: string;
  type: SubVenueType;
  capacity: number;
  baseRatePaise: number;
  bookable: boolean;
  dependencyLocks: string[];
  dimensions?: string;
  surface?: string;
}

export interface ComplianceCertificate {
  type: string;
  issuingBody: string;
  certificateNumber: string;
  issueDate: string;
  expiryDate: string;
  state: ComplianceState;
  documentUrl?: string;
}

export interface AssetItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: "EXCELLENT" | "GOOD" | "FAIR" | "POOR";
  lastServiced?: string;
  iotTagId?: string;
}

export interface AuditParameter {
  parameter: string;
  category: string;
  score: number;
  maxScore: number;
  notes?: string;
}

export interface Venue {
  id: string;
  // Block 1 — Identity
  nameEn: string;
  nameGu: string;
  nameHi?: string;
  aliasNames?: string[];
  venueType: VenueType;
  ownershipType: OwnershipType;
  owningBody: string;
  operatorName: string;
  lifecycleState: VenueLifecycleState;
  // Block 2 — Location
  fullAddress: string;
  coordinates: GeoCoordinates;
  lgdStateCode: string;
  lgdDistrictCode: string;
  lgdTalukaCode?: string;
  nearestTransit?: string;
  entryGatesCount: number;
  parkingCapacity: number;
  // Block 3 — Capacity
  capacitySeating: number;
  capacityStanding: number;
  capacityWheelchair: number;
  womenOnlyZones?: number;
  vipEnclosureSeats?: number;
  mediaBoxSeats?: number;
  hospitalityBoxes?: number;
  helipad?: boolean;
  // Block 4 — Sports
  primarySport: string;
  supportedSports: string[];
  subVenues: SubVenue[];
  fopDimensions?: string;
  surfaceType?: string;
  indoorOutdoor: "INDOOR" | "OUTDOOR" | "MIXED";
  // Block 5 — Team
  venueManager: Person;
  deputyManager?: Person;
  medicalLead: Person;
  securityHead: Person;
  federationLiaison?: Person;
  dsoBinding: string;
  emergencyNumber: string;
  localPolicePS: string;
  // Block 6 — Grade
  grade: VenueGrade;
  auditScore: number;
  lastAuditDate: string;
  nextAuditDue: string;
  communityRating: number;
  professionalRating: number;
  auditParameters?: AuditParameter[];
  // Block 7 — Compliance
  complianceCertificates: ComplianceCertificate[];
  // Block 8 — Assets
  assets?: AssetItem[];
  // Block 9 — Pay & Play
  payplayEnabled: boolean;
  payplayToggledBy?: string;
  payplayToggledAt?: string;
  // SPOC
  spocSignedBy: string;
  spocSignedAt: string;
  spocRevision: number;
  // Meta
  kyvStep: KYVStep;
  kyvProgress: number;
  mediaGallery?: string[];
  images?: string[];          // ordered: [hero, gallery1, gallery2, ...]
  layoutImageUrl?: string;    // venue floor plan / layout diagram
  shortHistory?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  venueId: string;
  venueName: string;
  subVenueIds: string[];
  track: BookingTrack;
  districtCode: string;
  requestedBy: string;
  requesterName: string;
  requesterOrg?: string;
  startAt: string;
  endAt: string;
  state: BookingState;
  pendingOn?: string;
  slaDeadline?: string;
  amountPaise: number;
  paymentState: PaymentState;
  approvalChain: ApprovalStep[];
  eventName?: string;
  eventDescription?: string;
  expectedAttendance?: number;
  documents?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalStep {
  step: number;
  role: string;
  assignee?: string;
  assigneeName?: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "QUERIED" | "DELEGATED";
  actionAt?: string;
  remarks?: string;
  eSignHash?: string;
}

export interface PayPlaySlot {
  id: string;
  venueId: string;
  subVenueId: string;
  date: string;
  startTime: string;
  endTime: string;
  available: boolean;
  pricePaise: number;
  bookingId?: string;
}

export interface AuditLedgerEntry {
  ledgerId: string;
  occurredAt: string;
  actorUserId: string;
  actorName: string;
  actorTier: UserTier;
  actorScope: string;
  actionType: string;
  resourceType: string;
  resourceId: string;
  spocOriginId?: string;
  payload?: Record<string, unknown>;
  eSignHash?: string;
  ipAddress?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  tier: UserTier;
  scopeState?: string;
  scopeDistrict?: string;
  aadhaarHash?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  permissions: string[];
}

export interface DashboardStats {
  totalVenues: number;
  activeVenues: number;
  pendingKyv: number;
  totalBookings: number;
  pendingApprovals: number;
  payplayEnabled: number;
  revenueThisMonth: number;
  complianceAlerts: number;
}

export interface CalendarLock {
  id: string;
  subVenueId: string;
  startAt: string;
  endAt: string;
  overlay: "BOOKING" | "MAINTENANCE" | "BLOCK" | "PAYPLAY" | "VVIP";
  sourceId: string;
  priority: number;
  color?: string;
  title?: string;
}

export interface PricingScheme {
  id: string;
  name: string;
  description: string;
  targetGrades: VenueGrade[];
  targetTracks: BookingTrack[];
  discountPercent?: number;
  flatRatePaise?: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  approvedBy?: string;
}
