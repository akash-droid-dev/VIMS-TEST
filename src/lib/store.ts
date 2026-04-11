// Shared localStorage store — connects Admin and Public interfaces in real-time

export const STORE_KEY = "vims_shared_store";

export interface VIMSStore {
  payplayStates: Record<string, boolean>;
  savedVenues: string[];
  recentlyViewed: string[];
}

function defaults(): VIMSStore {
  return {
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
