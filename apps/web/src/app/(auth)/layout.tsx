import { AuthHero } from "@/libs/components/auth/AuthHero";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-1 bg-white">
      <AuthHero />
      <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
