"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building2,
  CheckCircle2,
  Mail,
  MessageSquare,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import {
  contactSchema,
  type ContactFormPayload,
  type ContactInput,
} from "@tilda/shared";
import { Button } from "@/libs/components/ui/button";
import { Input } from "@/libs/components/ui/input";
import { Label } from "@/libs/components/ui/label";
import { Textarea } from "@/libs/components/ui/textarea";
import { useSidebarStore } from "@/libs/stores/sidebar.store";

const STORAGE_KEY = "tilda.contact";

export function ContactView() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600">
          <span className="inline-block h-1 w-6 rounded-full bg-indigo-500" />
          Contact
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          문의하기
        </h1>
        <p className="text-sm text-slate-500">
          궁금하신 점을 남겨주시면 빠르게 답변 드리겠습니다.
        </p>
      </header>

      {submitted ? (
        <ContactSuccess onReset={() => setSubmitted(false)} />
      ) : (
        <ContactForm onSubmitted={() => setSubmitted(true)} />
      )}
    </div>
  );
}

function ContactForm({ onSubmitted }: { onSubmitted: () => void }) {
  const form = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
    mode: "onTouched",
  });

  const onSubmit = (data: ContactInput) => {
    const payload: ContactFormPayload = {
      name: data.name,
      email: data.email,
      company: data.company ? data.company : undefined,
      message: data.message,
      submittedAt: new Date().toISOString(),
    };
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    }
    toast.success("문의가 접수되었습니다.");
    onSubmitted();
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-base font-semibold text-slate-900">새 문의 작성</h2>
        <p className="text-xs text-slate-500">
          제출 후, 입력하신 내용은 브라우저의 localStorage에 저장됩니다.
        </p>
      </div>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-5"
        noValidate
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="성함"
            required
            error={form.formState.errors.name?.message}
            leftIcon={<UserRound className="h-4 w-4 text-slate-400" />}
          >
            <Input
              placeholder="홍길동"
              {...form.register("name")}
              aria-invalid={!!form.formState.errors.name}
              autoComplete="name"
              className="pl-9"
            />
          </Field>
          <Field
            label="이메일"
            required
            error={form.formState.errors.email?.message}
            leftIcon={<Mail className="h-4 w-4 text-slate-400" />}
          >
            <Input
              type="email"
              placeholder="you@example.com"
              {...form.register("email")}
              aria-invalid={!!form.formState.errors.email}
              autoComplete="email"
              className="pl-9"
            />
          </Field>
        </div>

        <Field
          label="회사"
          hint="선택 · 2~20자"
          error={form.formState.errors.company?.message}
          leftIcon={<Building2 className="h-4 w-4 text-slate-400" />}
        >
          <Input
            placeholder="회사명"
            {...form.register("company")}
            aria-invalid={!!form.formState.errors.company}
            autoComplete="organization"
            className="pl-9"
          />
        </Field>

        <Field
          label="내용"
          required
          error={form.formState.errors.message?.message}
          leftIcon={
            <MessageSquare className="h-4 w-4 text-slate-400" />
          }
          iconAlign="top"
        >
          <Textarea
            placeholder="문의하실 내용을 자세히 입력해주세요."
            {...form.register("message")}
            aria-invalid={!!form.formState.errors.message}
            rows={6}
            className="pl-9"
          />
        </Field>

        <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
          <Button
            type="submit"
            size="lg"
            disabled={form.formState.isSubmitting}
          >
            제출하기
          </Button>
        </div>
      </form>
    </section>
  );
}

function ContactSuccess({ onReset }: { onReset: () => void }) {
  const setActive = useSidebarStore((s) => s.setActive);
  return (
    <section className="flex flex-col items-center gap-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-4 ring-emerald-500/10">
        <CheckCircle2 className="h-7 w-7" />
      </span>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          문의가 접수되었습니다.
        </h2>
        <p className="mt-1 max-w-md text-sm text-slate-500">
          소중한 의견 감사합니다. 빠른 시일 내에 회신드리겠습니다.
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button onClick={() => setActive("home")} size="lg">
          대시보드로 돌아가기
        </Button>
        <Button variant="outline" size="lg" onClick={onReset}>
          다른 문의 접수하기
        </Button>
      </div>
    </section>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
  leftIcon,
  iconAlign = "center",
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  leftIcon?: React.ReactNode;
  iconAlign?: "center" | "top";
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <Label className="text-sm font-medium text-slate-700">
          {required && <span className="text-rose-500">*</span>}
          {label}
        </Label>
        {hint && !error && (
          <span className="text-[11px] text-slate-400">{hint}</span>
        )}
      </div>
      <div className="relative">
        {leftIcon && (
          <span
            className={
              "pointer-events-none absolute left-3 " +
              (iconAlign === "top" ? "top-3" : "top-1/2 -translate-y-1/2")
            }
          >
            {leftIcon}
          </span>
        )}
        {children}
      </div>
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
