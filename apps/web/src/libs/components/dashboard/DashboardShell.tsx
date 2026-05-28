"use client";

import dynamic from "next/dynamic";
import { useSidebarStore } from "@/libs/stores/sidebar.store";
import { DashboardHome } from "./DashboardHome";
import { SettingsView } from "./SettingsView";
import { Skeleton } from "@/libs/components/ui/skeleton";

const ContactView = dynamic(
  () =>
    import("@/libs/components/contact/ContactForm").then((m) => m.ContactView),
  {
    loading: () => <Skeleton className="h-[400px] max-w-2xl" />,
  }
);

export function DashboardShell() {
  const active = useSidebarStore((s) => s.active);
  return (
    <div className="flex w-full flex-col gap-4">
      {active === "home" && <DashboardHome />}
      {active === "settings" && <SettingsView />}
      {active === "contact" && <ContactView />}
    </div>
  );
}
