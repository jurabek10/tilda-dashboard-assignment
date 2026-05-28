"use client";

import { create } from "zustand";
import type { User } from "@tilda/shared";

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
  hydrated: boolean;
  setHydrated: (b: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  hydrated: false,
  setUser: (u) => set({ user: u }),
  setHydrated: (b) => set({ hydrated: b }),
}));
