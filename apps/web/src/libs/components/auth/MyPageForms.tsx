"use client";

import { useEffect, useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  changeNameSchema,
  changePasswordSchema,
  type ChangeNameInput,
  type ChangePasswordInput,
} from "@tilda/shared";
import { authApi } from "@/libs/api/auth.api";
import { extractApiError } from "@/libs/api/client";
import { useAuthStore } from "@/libs/stores/auth.store";
import { queryKeys } from "@/libs/query/queryKeys";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";

export function MyPageForms() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChangeNameForm />
      <ChangePasswordForm />
    </div>
  );
}

function FormCard({
  icon: Icon,
  title,
  description,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  tone: "indigo" | "amber";
  children: React.ReactNode;
}) {
  const tones = {
    indigo: "bg-indigo-500/10 text-indigo-600",
    amber: "bg-amber-500/10 text-amber-600",
  };
  return (
    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <header className="flex items-start gap-3 border-b border-slate-100 p-5">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </header>
      <div className="p-5">{children}</div>
    </section>
  );
}

function ChangeNameForm() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const qc = useQueryClient();

  const form = useForm<ChangeNameInput>({
    resolver: zodResolver(changeNameSchema),
    defaultValues: { name: user?.name ?? "" },
    mode: "onTouched",
  });

  useEffect(() => {
    if (user?.name && !form.formState.isDirty) {
      form.reset({ name: user.name });
    }
  }, [user?.name, form]);

  const onSubmit = async (data: ChangeNameInput) => {
    try {
      const updated = await authApi.updateName(data);
      setUser(updated);
      qc.setQueryData(queryKeys.auth.me, updated);
      toast.success("이름이 변경되었습니다.");
      form.reset({ name: updated.name });
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      for (const [field, msg] of Object.entries(fieldErrors)) {
        form.setError(field as keyof ChangeNameInput, { message: msg });
      }
      toast.error(message);
    }
  };

  return (
    <FormCard
      icon={UserRound}
      tone="indigo"
      title="프로필 정보"
      description="이름은 2~8자, 공백 없이 입력해주세요."
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <Field label="이메일" hint="변경할 수 없습니다.">
          <Input
            value={user?.email ?? ""}
            readOnly
            disabled
            className="bg-slate-50"
          />
        </Field>
        <Field
          label="이름"
          hint="2~8자, 공백 없이"
          error={form.formState.errors.name?.message}
          leftIcon={<UserRound className="h-4 w-4 text-slate-400" />}
        >
          <Input
            placeholder="이름"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
            autoComplete="name"
            className="pl-9"
          />
        </Field>
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            저장
          </Button>
        </div>
      </form>
    </FormCard>
  );
}

function ChangePasswordForm() {
  const [show, setShow] = useState({ cur: false, nw: false, cf: false });

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordConfirm: "",
    },
    mode: "onTouched",
  });

  const onSubmit = async (data: ChangePasswordInput) => {
    try {
      await authApi.changePassword(data);
      toast.success("비밀번호가 변경되었습니다.");
      form.reset();
    } catch (err) {
      const { message, fieldErrors } = extractApiError(err);
      for (const [field, msg] of Object.entries(fieldErrors)) {
        form.setError(field as keyof ChangePasswordInput, { message: msg });
      }
      toast.error(message);
    }
  };

  const PwField = ({
    label,
    hint,
    error,
    visible,
    onToggle,
    register,
    autoComplete,
  }: {
    label: string;
    hint?: string;
    error?: string;
    visible: boolean;
    onToggle: () => void;
    register: ReturnType<
      ReturnType<typeof useForm<ChangePasswordInput>>["register"]
    >;
    autoComplete: string;
  }) => (
    <Field
      label={label}
      hint={hint}
      error={error}
      leftIcon={<Lock className="h-4 w-4 text-slate-400" />}
    >
      <Input
        type={visible ? "text" : "password"}
        placeholder="••••••••"
        {...register}
        aria-invalid={!!error}
        autoComplete={autoComplete}
        className="pl-9 pr-10"
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        aria-label="비밀번호 표시 토글"
      >
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </Field>
  );

  return (
    <FormCard
      icon={KeyRound}
      tone="amber"
      title="비밀번호 변경"
      description="8자 이상, 영문/숫자/특수문자를 포함해주세요."
    >
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
        noValidate
      >
        <PwField
          label="현재 비밀번호"
          error={form.formState.errors.currentPassword?.message}
          visible={show.cur}
          onToggle={() => setShow((s) => ({ ...s, cur: !s.cur }))}
          register={form.register("currentPassword")}
          autoComplete="current-password"
        />
        <PwField
          label="새 비밀번호"
          hint="8자 이상 · 영문/숫자/특수문자"
          error={form.formState.errors.newPassword?.message}
          visible={show.nw}
          onToggle={() => setShow((s) => ({ ...s, nw: !s.nw }))}
          register={form.register("newPassword")}
          autoComplete="new-password"
        />
        <PwField
          label="새 비밀번호 확인"
          error={form.formState.errors.newPasswordConfirm?.message}
          visible={show.cf}
          onToggle={() => setShow((s) => ({ ...s, cf: !s.cf }))}
          register={form.register("newPasswordConfirm")}
          autoComplete="new-password"
        />
        <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            안전한 변경을 위해 현재 비밀번호를 입력해주세요.
          </span>
        </div>
        <div className="flex justify-end">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            비밀번호 변경
          </Button>
        </div>
      </form>
    </FormCard>
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
