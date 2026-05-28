import { MobileSidebar, Sidebar } from "@/libs/components/layout/Sidebar";
import { DashboardShell } from "@/libs/components/dashboard/DashboardShell";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Sidebar />
      <main className="flex min-w-0 flex-1 flex-col">
        <MobileSidebar />
        <div className="tilda-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
          <DashboardShell />
        </div>
      </main>
    </>
  );
}
