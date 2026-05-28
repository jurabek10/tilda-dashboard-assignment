"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserRound, UserPlus } from "lucide-react";
import { Button } from "@/libs/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/libs/components/ui/dropdown-menu";
import { useAuthStore } from "@/libs/stores/auth.store";
import { useLogout } from "@/libs/hooks/useAuth";
import { BrandMark } from "./BrandMark";

export function Header() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const router = useRouter();
  const logout = useLogout();

  const handleLogout = async () => {
    await logout.mutateAsync();
    router.push("/");
    router.refresh();
  };

  const initial = user?.name?.[0] ?? user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="relative flex h-16 items-center justify-between bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-4 shadow-[0_4px_24px_-12px_rgba(67,56,202,0.6)] sm:px-6">
        {/* subtle highlight at the top */}
        <span
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          aria-hidden
        />

        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <BrandMark size="md" variant="light" />
          <div className="flex flex-col leading-tight">
            <span className="text-base font-semibold tracking-tight text-white">
              Tilda Assignment
            </span>
            <span className="hidden text-[11px] text-indigo-100/90 sm:inline">
              의료기관종별 진료과목별 진료비
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {!hydrated ? (
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/15" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="group flex items-center gap-2 rounded-full border border-white/15 bg-white/10 py-1 pl-1 pr-3 text-sm text-white backdrop-blur transition-colors hover:bg-white/20"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-semibold text-indigo-600 shadow">
                    {initial}
                  </span>
                  <span className="hidden sm:inline">{user.name}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 p-1.5">
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </span>
                    <span className="truncate text-xs font-normal text-slate-500">
                      {user.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/mypage")}>
                  <UserRound className="h-4 w-4 text-slate-500" />
                  마이페이지
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 text-slate-500" />
                  로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/login")}
                className="text-white hover:bg-white/15 hover:text-white"
              >
                <LogIn className="h-4 w-4" />
                로그인
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/signup")}
                className="bg-white text-indigo-700 hover:bg-indigo-50"
              >
                <UserPlus className="h-4 w-4" />
                회원가입
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
