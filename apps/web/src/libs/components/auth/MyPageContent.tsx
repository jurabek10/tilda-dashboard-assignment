"use client";

import { AlertTriangle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/libs/components/ui/alert";
import { Skeleton } from "@/libs/components/ui/skeleton";
import { useAuthStore } from "@/libs/stores/auth.store";
import { MyPageForms } from "./MyPageForms";
import { MyPageHeader } from "./MyPageHeader";

export function MyPageContent() {
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);

  if (!hydrated) {
    return (
      <>
        <Skeleton className="h-[140px] rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[320px] rounded-2xl" />
          <Skeleton className="h-[420px] rounded-2xl" />
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>로그인 정보를 확인할 수 없습니다.</AlertTitle>
        <AlertDescription>
          다시 로그인한 뒤 마이페이지를 이용해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <>
      <MyPageHeader />
      <MyPageForms />
    </>
  );
}
