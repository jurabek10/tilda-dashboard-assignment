"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2, Lock, Mail, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signupSchema, type SignupInput } from "@tilda/shared";
import { authApi } from "@/libs/api/auth.api";
import { extractApiError } from "@/libs/api/client";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";

export function SignupForm() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", name: "" },
    mode: "onTouched",
  });

  const onSubmit = async (data: SignupInput) => {
    try {
      await authApi.signup(data);
      toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
      router.push("/login");
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      for (const [field, msg] of Object.entries(fieldErrors)) {
        form.setError(field as keyof SignupInput, { message: msg });
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
        hint="영문, 숫자, 특수문자를 포함한 8자 이상"
        error={form.formState.errors.password?.message}
        leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
      >
        <Input
          type={showPw ? "text" : "password"}
          placeholder="••••••••"
          {...form.register("password")}
          autoComplete="new-password"
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

      <Field
        label="이름"
        hint="2~8자, 공백 없이"
        error={form.formState.errors.name?.message}
        leftIcon={<UserRound className="h-4 w-4 text-slate-400" />}
      >
        <Input
          placeholder="홍길동"
          {...form.register("name")}
          autoComplete="name"
          aria-invalid={!!form.formState.errors.name}
          className="pl-9"
        />
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
        회원가입
      </Button>

      <p className="text-center text-sm text-slate-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-semibold text-indigo-600 hover:text-indigo-500"
        >
          로그인
        </Link>
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
  leftIcon,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm font-medium text-slate-700">{label}</Label>
        {hint && !error && (
          <span className="text-[11px] text-slate-400">{hint}</span>
        )}
      </div>
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
