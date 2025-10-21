import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SyncState = {
  syncing: boolean;
  lastSynced: string;

  setSyncing: (value: boolean) => void;
  setLastSynced: (value: string) => void;
};

export const useSyncStore = create<SyncState>()(
  persist(
    (set) => ({
      syncing: false,
      lastSynced: "",

      setSyncing: (value) => set({ syncing: value }),
      setLastSynced: (value) => set({ lastSynced: value }),
    }),
    {
      name: "sync",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        lastSynced: state.lastSynced, // persist only lastSynced
      }),
    }
  )
);
