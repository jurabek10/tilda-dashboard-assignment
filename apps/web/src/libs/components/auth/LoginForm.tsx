"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@tilda/shared";
import { authApi } from "@/libs/api/auth.api";
import { extractApiError } from "@/libs/api/client";
import { useAuthStore } from "@/libs/stores/auth.store";
import { queryKeys } from "@/libs/query/queryKeys";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      qc.setQueryData(queryKeys.auth.me, res.user);
      document.cookie = "tilda_logged_in=1; path=/; max-age=604800; SameSite=Lax";
      toast.success(`${res.user.name}님, 환영합니다.`);
      router.push("/");
      router.refresh();
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      for (const [field, msg] of Object.entries(fieldErrors)) {
        form.setError(field as keyof LoginInput, { message: msg });
      }
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5"
      noValidate
    >
      <Field
        label="이메일"
        error={form.formState.errors.email?.message}
        leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
      >
        <Input
          type="email"
          placeholder="you@example.com"
          {...form.register("email")}
          autoComplete="email"
          aria-invalid={!!form.formState.errors.email}
          className="pl-9"
        />
      </Field>

      <Field
        label="비밀번호"
        error={form.formState.errors.password?.message}
        leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
      >
        <Input
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          {...form.register("password")}
          autoComplete="current-password"
          aria-invalid={!!form.formState.errors.password}
          className="pl-9 pr-10"
        />
        <button
          type="button"
          onClick={() => setShowPw((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
          aria-label="비밀번호 표시 토글"
        >
          {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </Field>

      <Button
        type="submit"
        size="lg"
        disabled={form.formState.isSubmitting}
        className="w-full"
      >
        {form.formState.isSubmitting && (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        로그인
      </Button>

      <p className="text-center text-sm text-slate-500">
        아직 계정이 없으신가요?{" "}
        <Link
          href="/signup"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          회원가입
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  children,
  leftIcon,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </span>
        )}
        {children}
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
