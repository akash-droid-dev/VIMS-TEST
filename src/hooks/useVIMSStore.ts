"use client";
import { useState, useEffect } from "react";
import { getStore, type VIMSStore, STORE_KEY } from "@/lib/store";

export function useVIMSStore(): VIMSStore {
  const [store, setStore] = useState<VIMSStore>(getStore);

  useEffect(() => {
    const sync = () => setStore(getStore());

    // Same-tab updates (admin and public on same tab, or any direct store mutation)
    window.addEventListener("vims:store_update", sync);

    // Cross-tab updates: admin panel open in one tab, public in another
    const storageSync = (e: StorageEvent) => {
      if (e.key === STORE_KEY) sync();
    };
    window.addEventListener("storage", storageSync);

    return () => {
      window.removeEventListener("vims:store_update", sync);
      window.removeEventListener("storage", storageSync);
    };
  }, []);

  return store;
}
