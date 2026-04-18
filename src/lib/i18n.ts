export type Lang = "en" | "gu" | "hi";

export const LANG_LABELS: Record<Lang, string> = {
  en: "EN · English",
  gu: "ગુ · Gujarati",
  hi: "हि · Hindi",
};

const T = {
  // ── Navigation ──────────────────────────────────────────
  nav_discover:       { en: "Discover Venues",   gu: "વેન્યુ શોધો",         hi: "स्थल खोजें" },
  nav_payplay:        { en: "Pay & Play",         gu: "ચૂકવો & રમો",         hi: "पे एंड प्ले" },
  nav_events:         { en: "Events",             gu: "ઇવેન્ટ્સ",            hi: "कार्यक्रम" },
  nav_about:          { en: "About",              gu: "વિશે",                hi: "परिचय" },
  nav_my_bookings:    { en: "My Bookings",        gu: "મારી બુકિંગ",        hi: "मेरी बुकिंग" },
  nav_register:       { en: "Register",           gu: "નોંધણી",             hi: "पंजीकरण" },
  nav_sign_in:        { en: "Sign In",            gu: "સાઇન ઇન",            hi: "साइन इन" },

  // ── Hero ────────────────────────────────────────────────
  hero_title:         { en: "Book Sports Venues Anywhere in India", gu: "ભારતમાં ગમે ત્યાં સ્પોર્ટ્સ વેન્યુ બુક કરો", hi: "भारत में कहीं भी स्पोर्ट्स स्थल बुक करें" },
  hero_subtitle:      { en: "8,500+ government-managed venues · 788 districts · instant Pay & Play booking", gu: "8,500+ સરકારી સ્થળો · 788 જિલ્લાઓ · તત્કાલ Pay & Play બુકિંગ", hi: "8,500+ सरकारी स्थल · 788 जिले · तत्काल Pay & Play बुकिंग" },
  hero_search:        { en: "Search venues, sports, or states…", gu: "વેન્યુ, રમત અથવા રાજ્ય શોધો…", hi: "स्थल, खेल या राज्य खोजें…" },
  hero_badge:         { en: "India's Official Sports Venue Platform", gu: "ભારતનું સત્તાવાર સ્પોર્ટ્સ વેન્યુ પ્લેટફોર્મ", hi: "भारत का आधिकारिक खेल स्थल मंच" },

  // ── Stats strip ─────────────────────────────────────────
  stat_total_venues:  { en: "Total Venues",       gu: "કુલ વેન્યુ",          hi: "कुल स्थल" },
  stat_districts:     { en: "States / UTs",       gu: "રાજ્ય / UT",         hi: "राज्य / UT" },
  stat_payplay:       { en: "Pay & Play Enabled", gu: "Pay & Play સક્ષમ",   hi: "Pay & Play सक्षम" },
  stat_sports:        { en: "Sports",             gu: "રમતો",               hi: "खेल" },

  // ── Venue card / detail ─────────────────────────────────
  book_now:           { en: "Book Now",           gu: "હવે બુક કરો",        hi: "अभी बुक करें" },
  view_details:       { en: "View details",       gu: "વિગત જુઓ",           hi: "विवरण देखें" },
  instant_booking:    { en: "Instant Booking",    gu: "તત્કાલ બુકિંગ",      hi: "तत्काल बुकिंग" },
  per_hour:           { en: "/hr",                gu: "/કલાક",              hi: "/घंटा" },
  seats:              { en: "seats",              gu: "બેઠકો",              hi: "सीटें" },
  rating:             { en: "Rating",             gu: "રેટિંગ",             hi: "रेटिंग" },
  reviews:            { en: "reviews",            gu: "સમીક્ષાઓ",           hi: "समीक्षाएं" },
  all_venues:         { en: "All Venues",         gu: "બધા વેન્યુ",         hi: "सभी स्थल" },

  // ── Filters ─────────────────────────────────────────────
  filters:            { en: "Filters",            gu: "ફિલ્ટર",             hi: "फ़िल्टर" },
  payplay_only:       { en: "Pay & Play only",    gu: "માત્ર Pay & Play",    hi: "केवल Pay & Play" },
  indoor:             { en: "Indoor",             gu: "ઇન્ડોર",             hi: "इनडोर" },
  outdoor:            { en: "Outdoor",            gu: "આઉટડોર",             hi: "आउटडोर" },
  all_type:           { en: "All",                gu: "બધા",                hi: "सभी" },
  reset_filters:      { en: "Reset all filters",  gu: "બધા ફિલ્ટર રીસેટ",   hi: "सभी फ़िल्टर रीसेट" },
  venues_found:       { en: "venues found",       gu: "વેન્યુ મળ્યા",       hi: "स्थल मिले" },

  // ── Tabs ────────────────────────────────────────────────
  tab_overview:       { en: "Overview",           gu: "ઓવરવ્યૂ",            hi: "अवलोकन" },
  tab_slots:          { en: "Slots",              gu: "સ્લોટ",              hi: "स्लॉट" },
  tab_sub_venues:     { en: "Sub-Venues",         gu: "સબ-વેન્યુ",          hi: "उप-स्थल" },
  tab_reviews:        { en: "Reviews",            gu: "સમીક્ષા",            hi: "समीक्षा" },

  // ── Actions ─────────────────────────────────────────────
  save:               { en: "Save",               gu: "સાચવો",              hi: "सहेजें" },
  share:              { en: "Share",              gu: "શેર",                hi: "साझा करें" },
  cancel:             { en: "Cancel",             gu: "રદ",                 hi: "रद्द करें" },
  confirm:            { en: "Confirm",            gu: "પુષ્ટિ",             hi: "पुष्टि करें" },
  back:               { en: "Back",               gu: "પાછળ",               hi: "वापस" },
  contact_venue:      { en: "Contact Venue",      gu: "વેન્યુ સંપર્ક",      hi: "स्थल से संपर्क" },

  // ── Booking ─────────────────────────────────────────────
  select_date:        { en: "Select Date",        gu: "તારીખ પસંદ કરો",     hi: "तारीख चुनें" },
  available_slots:    { en: "Available Slots",    gu: "ઉપલબ્ધ સ્લોટ",      hi: "उपलब्ध स्लॉट" },
  peak_hour:          { en: "Peak hour",          gu: "પીક સમય",            hi: "पीक आवर" },
  convenience_fee:    { en: "Convenience fee",    gu: "સુવિધા ફી",          hi: "सुविधा शुल्क" },
  total:              { en: "Total",              gu: "કુલ",                hi: "कुल" },

  // ── About ────────────────────────────────────────────────
  about_venue:        { en: "About This Venue",   gu: "આ વેન્યુ વિશે",      hi: "इस स्थल के बारे में" },
  facilities:         { en: "Facilities & Amenities", gu: "સુવિધાઓ", hi: "सुविधाएं और आमेनिटीज" },
  sports_activities:  { en: "Sports & Activities", gu: "રમત અને પ્રવૃત્તિ", hi: "खेल और गतिविधियां" },
  location:           { en: "Location & Access",  gu: "સ્થાન",              hi: "स्थान" },
  safety:             { en: "Safety & Compliance", gu: "સુરક્ષા",           hi: "सुरक्षा और अनुपालन" },

  // ── Registration ─────────────────────────────────────────
  create_account:     { en: "Create Citizen Account", gu: "નાગરિક ખાતું બનાવો", hi: "नागरिक खाता बनाएं" },
  full_name:          { en: "Full Name",          gu: "પૂરું નામ",           hi: "पूरा नाम" },
  mobile:             { en: "Mobile Number",      gu: "મોબાઇલ નંબર",        hi: "मोबाइल नंबर" },
  email_addr:         { en: "Email Address",      gu: "ઇ-મેઇલ",            hi: "ईमेल पता" },
  aadhaar_last4:      { en: "Aadhaar Last 4",     gu: "આધાર છેલ્લા 4",     hi: "आधार के अंतिम 4 अंक" },
  send_otp:           { en: "Send OTP to Mobile", gu: "મોબાઇલ પર OTP મોકલો", hi: "मोबाइल पर OTP भेजें" },
  already_account:    { en: "Already have an account?", gu: "પહેલેથી ખાતું છે?", hi: "पहले से खाता है?" },
  sign_in_link:       { en: "Sign in",            gu: "સાઇન ઇન",           hi: "साइन इन" },

  // ── Admin ────────────────────────────────────────────────
  admin_dashboard:    { en: "Dashboard",          gu: "ડૅશબોર્ડ",           hi: "डैशबोर्ड" },
  export_report:      { en: "Export Report",      gu: "રિપોર્ટ નિકાસ",     hi: "रिपोर्ट निर्यात" },
  add_venue:          { en: "Add Venue",          gu: "વેન્યુ ઉમેરો",       hi: "स्थल जोड़ें" },
  new_booking:        { en: "New Booking",        gu: "નવી બુકિંગ",         hi: "नई बुकिंग" },
  edit_user:          { en: "Edit",               gu: "સંપાદિત",            hi: "संपादित करें" },
  suspend_user:       { en: "Suspend",            gu: "સસ્પેન્ડ",           hi: "निलंबित करें" },
  activate_user:      { en: "Activate",           gu: "સક્રિય",             hi: "सक्रिय करें" },
} as const;

export type TranslationKey = keyof typeof T;

export function translate(key: TranslationKey, lang: Lang): string {
  return T[key]?.[lang] ?? T[key]?.["en"] ?? key;
}

export function getLangFromStorage(): Lang {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem("vims_lang") as Lang) ?? "en";
}

export function setLangInStorage(lang: Lang) {
  localStorage.setItem("vims_lang", lang);
}
