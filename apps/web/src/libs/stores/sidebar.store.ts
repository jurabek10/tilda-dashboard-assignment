"use client";

import { create } from "zustand";

export const SIDEBAR_TABS = ["home", "settings", "contact"] as const;
export type SidebarTab = (typeof SIDEBAR_TABS)[number];

export const SIDEBAR_LABELS: Record<SidebarTab, string> = {
  home: "대시보드 홈",
  settings: "설정",
  contact: "문의",
};

type SidebarState = {
  active: SidebarTab;
  setActive: (t: SidebarTab) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  active: "home",
  setActive: (t) => set({ active: t }),
}));
