// store/useUserStore.ts
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { UserStage } from "@/service/types-schemas";

type User = {
  fullName: string;
  email: string;
  role: string;
  id: string;
  phoneNumber: string;
  country: string;
  isDeleted?: boolean;
  requestDeleteOn: string;
  createdAt: string;
  updatedAt: string;
  stage: UserStage;
};

type UserState = {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;

  token: string | null;
  setToken: (token: string) => Promise<void>;
  clearToken: () => Promise<void>;

  activeShopId: string | null;
  setActiveShopId: (shopId: string) => void;
  clearActiveShopId: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      activeShopId: null,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      setToken: async (token: string) => {
        await SecureStore.setItemAsync("token", token);
        set({ token });
      },
      clearToken: async () => {
        await SecureStore.deleteItemAsync("token");
        set({ token: null });
      },

      setActiveShopId: (shopId) => set({ activeShopId: shopId }),
      clearActiveShopId: () => set({ activeShopId: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        activeShopId: state.activeShopId,
      }),
    },
  ),
);
