"use client";
import { useState, useEffect } from "react";
import { getStore, type VIMSStore } from "@/lib/store";

export function useVIMSStore(): VIMSStore {
  const [store, setStore] = useState<VIMSStore>(getStore);

  useEffect(() => {
    const sync = () => setStore(getStore());
    window.addEventListener("vims:store_update", sync);
    return () => window.removeEventListener("vims:store_update", sync);
  }, []);

  return store;
}
