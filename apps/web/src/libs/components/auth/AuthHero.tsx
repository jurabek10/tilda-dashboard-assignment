import { Activity, ShieldCheck, Sparkles } from "lucide-react";
import { BrandMark } from "@/libs/components/layout/BrandMark";

const FEATURES = [
  {
    icon: Activity,
    title: "실시간 진료비 통계",
    description: "건강보험심사평가원이 제공하는 최신 데이터를 시각화합니다.",
  },
  {
    icon: Sparkles,
    title: "인터랙티브 차트 & 테이블",
    description: "정렬 · 필터링 · 페이지네이션을 한 화면에서 처리하세요.",
  },
  {
    icon: ShieldCheck,
    title: "안전한 인증",
    description: "httpOnly 쿠키 기반 JWT 인증으로 안전하게 보호됩니다.",
  },
];

export function AuthHero() {
  return (
    <section className="tilda-aurora relative hidden flex-1 overflow-hidden text-white lg:flex lg:flex-col lg:justify-between lg:p-12">
      <div className="tilda-grid absolute inset-0 opacity-40" aria-hidden />

      <div className="relative flex items-center gap-3">
        <BrandMark size="md" />
        <div>
          <p className="text-sm font-semibold tracking-tight">Tilda Assignment</p>
          <p className="text-xs text-white/70">의료 데이터 대시보드</p>
        </div>
      </div>

      <div className="relative max-w-md">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-200">
          Medical Statistics Dashboard
        </p>
        <h2 className="text-3xl font-semibold leading-tight tracking-tight">
          진료과목별 진료비를
          <br />
          한눈에 비교하세요.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/75">
          데이터·차트·테이블을 한 화면에서 빠르게 탐색하고, 진료과목별 환자수와
          입내원일수의 흐름을 깊이 있게 분석할 수 있습니다.
        </p>

        <ul className="mt-10 flex flex-col gap-5">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-inset ring-white/15">
                <Icon className="h-4.5 w-4.5 text-indigo-200" />
              </span>
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-white/65">{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-white/50">
        Powered by data.go.kr · 건강보험심사평가원
      </p>
    </section>
  );
}
