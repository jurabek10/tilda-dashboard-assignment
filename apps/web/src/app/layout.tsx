import type { Metadata } from "next";
import { Toaster } from "sonner";
import { QueryProvider } from "@/libs/components/providers/QueryProvider";
import { AuthBootstrap } from "@/libs/components/providers/AuthBootstrap";
import { Header } from "@/libs/components/layout/Header";
import { Footer } from "@/libs/components/layout/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tilda Assignment",
  description: "의료기관종별 진료과목별 진료비 통계 대시보드",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" translate="no" className="notranslate">
      <body className="notranslate flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground">
        <QueryProvider>
          <AuthBootstrap />
          <Header />
          <div className="flex w-full min-w-0 flex-1 min-h-0">{children}</div>
          <Footer />
          <Toaster position="top-center" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
