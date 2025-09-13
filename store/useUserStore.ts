// store/useUserStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TLoginWithOtpResponse } from "@/service/types-schemas";

type UserState = {
  user: TLoginWithOtpResponse["data"] | null;
  setUser: (user: TLoginWithOtpResponse["data"] | null) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: TLoginWithOtpResponse["data"]) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
