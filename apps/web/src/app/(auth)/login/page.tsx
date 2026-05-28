import { LoginForm } from "@/libs/components/auth/LoginForm";
import { BrandMark } from "@/libs/components/layout/BrandMark";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3 lg:hidden">
        <BrandMark size="md" />
        <div>
          <p className="text-sm font-semibold text-slate-900">Tilda Assignment</p>
          <p className="text-xs text-slate-500">의료 데이터 대시보드</p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          다시 만나서 반가워요
        </h1>
        <p className="text-sm text-slate-500">
          계정에 로그인하고 대시보드를 확인하세요.
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
