# Tilda Dashboard Assignment

의료기관종별 진료과목별 진료비 통계 API를 활용한 대시보드, 회원가입/로그인/마이페이지, 문의 폼 구현 과제입니다.

- 배포된 프론트엔드: https://tilda-dashboard-assignment-web.vercel.app
- 배포된 백엔드 상태 확인: https://tilda-dashboard-api.onrender.com/api/health
- 데이터 출처: 건강보험심사평가원, 의료기관종별 진료과목별 진료비 통계

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프론트엔드 | Next.js 16, React 19, TypeScript, Tailwind CSS, Recharts, TanStack Query, TanStack Table, React Hook Form, Zod, Zustand |
| 백엔드 | NestJS, TypeScript, Prisma, PostgreSQL, JWT, httpOnly Cookie |
| 공통 패키지 | pnpm workspace, 공유 Zod 스키마, 공유 타입 |
| 배포 | Vercel(frontend), Render(backend + PostgreSQL) |
| 로컬 실행 | Docker Compose |

## 빠른 실행 방법

루트 디렉토리에서 아래 명령어를 실행합니다.

```bash
cp .env.example .env
docker compose up -d --build
```

실행 후 접속 주소:

- 프론트엔드: http://localhost:3000
- 백엔드 헬스체크: http://localhost:4000/api/health

Docker Compose 실행 시 PostgreSQL, NestJS API, Next.js Web이 함께 실행됩니다. API 컨테이너는 시작 시 Prisma 스키마를 데이터베이스에 반영합니다.

## 로컬 개발 실행

Node.js 20 이상과 pnpm 9.15 이상이 필요합니다.

```bash
pnpm install
cp .env.example .env

pnpm --filter @tilda/api prisma:generate
pnpm --filter @tilda/api exec prisma db push

pnpm dev
```

개별 실행:

```bash
pnpm dev:api
pnpm dev:web
```

## 환경 변수

| 변수 | 설명 |
|---|---|
| `DATABASE_URL` | PostgreSQL 연결 문자열 |
| `JWT_SECRET` | JWT 서명용 비밀키 |
| `JWT_EXPIRES_IN` | JWT 만료 시간, 기본값 `7d` |
| `DATA_GO_KR_API_KEY` | data.go.kr API 키. 없으면 데모용 mock 데이터 사용 |
| `DATA_GO_KR_BASE_URL` | data.go.kr ODCloud API base URL |
| `DATA_GO_KR_DATASET_PATH` | 의료기관종별 진료과목별 진료비 통계 데이터셋 경로 |
| `CORS_ORIGIN` | 프론트엔드 origin, 쉼표로 여러 개 설정 가능 |
| `COOKIE_SECURE` | HTTPS 환경에서는 `true` |
| `COOKIE_SAME_SITE` | 프론트/백엔드 도메인이 다르면 `none` |
| `NEXT_PUBLIC_API_URL` | 프론트엔드에서 호출할 백엔드 API URL |

## 프로젝트 구조

```text
tilda-dashboard-assignment/
├── apps/
│   ├── api/                 # NestJS 백엔드
│   │   ├── prisma/           # Prisma schema
│   │   └── src/
│   │       ├── components/
│   │       │   ├── auth/     # 회원가입, 로그인, 본인인증, 정보 수정
│   │       │   ├── health/   # 헬스체크
│   │       │   └── statistics/ # data.go.kr 프록시 및 캐시
│   │       └── libs/
│   └── web/                 # Next.js 프론트엔드
│       └── src/
│           ├── app/          # /, /login, /signup, /mypage
│           ├── middleware.ts # 마이페이지 보호 및 인증 페이지 리다이렉션
│           └── libs/
│               ├── api/
│               ├── components/
│               ├── hooks/
│               ├── query/
│               └── stores/
├── packages/shared/         # 공통 타입, Zod 스키마
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

## 과제 요구사항 구현 체크리스트

### 1. 대시보드 요구사항

#### 1-1. API 데이터 가져오기 - 필수

- 의료기관종별 진료과목별 진료비 통계 API를 백엔드에서 호출합니다.
- 프론트엔드는 data.go.kr API 키를 직접 알지 않고, NestJS API의 `/api/statistics`를 호출합니다.
- Render 배포 환경에는 `DATA_GO_KR_API_KEY`가 설정되어 실제 API 데이터를 사용합니다.
- API 키가 없는 로컬 환경에서는 대시보드 확인이 가능하도록 deterministic mock 데이터를 반환합니다.

구현 위치:

- `apps/api/src/components/statistics/statistics.service.ts`
- `apps/api/src/components/statistics/statistics.controller.ts`
- `apps/web/src/libs/api/statistics.api.ts`

#### 1-2. 차트 그리기 - 필수

- Recharts 기반의 dual-axis line chart를 구현했습니다.
- 가로축: `진료과목(표시과목)`
- 왼쪽 세로축: `환자수`
- 오른쪽 세로축: `입내원일수`
- 각 세로축은 `tickCount={6}`으로 5개 이상의 눈금을 표시합니다.
- `domain={["auto", "auto"]}`를 사용해 라인의 실제 수치가 잘리지 않도록 했습니다.
- 의료기관종별을 구분하지 않고, 전체 API 데이터를 `진료과목(표시과목)` 기준으로 합산합니다.
- 차트는 전체 데이터를 한 번 가져온 뒤, 합산된 진료과목 단위로 페이지네이션합니다.
- 현재 실제 API 기준 전체 333개 row를 가져오고, 52개 진료과목으로 집계됩니다.

구현 위치:

- `apps/web/src/libs/components/dashboard/DashboardHome.tsx`
- `apps/web/src/libs/components/dashboard/StatsChart.tsx`

#### 1-3. 테이블 그리기 - 필수

테이블은 API 데이터의 모든 요구 컬럼을 표시합니다.

- `진료년도`
- `의료기관종별`
- `진료과목(표시과목)`
- `명세서청구건수`
- `보험자부담금(선별포함)`
- `요양급여비용총액(선별포함)`
- `환자수`
- `입내원일수`

추가 구현:

- 100개 이상의 행 호출 조건을 만족하도록 `perPage=200`을 사용합니다.
- 테이블 영역은 가로/세로 스크롤을 지원합니다.
- 헤더와 값이 같은 컬럼에 정렬되도록 TanStack Table 컬럼 정의를 사용했습니다.
- 숫자는 `ko-KR` 포맷으로 표시합니다.

구현 위치:

- `apps/web/src/libs/components/dashboard/StatsTable.tsx`

#### 1-4. 그 외 부가기능 - 선택

구현한 선택 기능:

- 차트 tooltip
- 차트 페이지네이션
- 테이블 정렬
- 테이블 컬럼 필터
- 테이블 전체 검색
- 테이블 페이지네이션
- 쿼리 키 중앙 관리
- 로딩 skeleton, error alert, empty state

구현 위치:

- `apps/web/src/libs/query/queryKeys.ts`
- `apps/web/src/libs/components/dashboard/StatsChart.tsx`
- `apps/web/src/libs/components/dashboard/StatsTable.tsx`

### 2. 로그인 및 마이페이지 요구사항

#### 2-1. 회원가입 페이지 - 필수

회원가입 페이지에서 이메일, 비밀번호, 이름을 입력받습니다.

클라이언트 유효성 검사:

- 이메일 형식 확인
- 비밀번호 최소 8자
- 비밀번호 영문, 숫자, 특수문자 조합 확인
- 이름 공백 여부 확인
- 이름 2자 이상 8자 이하 확인

유효성 검사 실패 시 각 필드 아래에 시각적 에러 메시지를 표시합니다. 회원가입 성공 시 로그인 페이지로 이동합니다.

구현 위치:

- `apps/web/src/libs/components/auth/SignupForm.tsx`
- `packages/shared/src/schemas/auth.schema.ts`

#### 2-2. 로그인 페이지 - 선택

구현 내용:

- 이메일, 비밀번호 입력
- 클라이언트 유효성 검사
- 비밀번호 표시/숨김 토글
- 로그인 성공 시 서버에서 JWT 발급
- JWT는 httpOnly cookie로 저장
- 로그인한 사용자만 `/mypage` 접근 가능
- 비로그인 사용자는 `/mypage` 접근 시 `/login`으로 리다이렉션
- 로그인 사용자는 `/login`, `/signup` 접근 시 `/`로 리다이렉션

구현 위치:

- `apps/web/src/libs/components/auth/LoginForm.tsx`
- `apps/web/src/middleware.ts`
- `apps/api/src/components/auth/auth.controller.ts`
- `apps/api/src/components/auth/auth.service.ts`

#### 2-3. 마이페이지 - 선택

마이페이지에 이름 변경 폼과 비밀번호 변경 폼을 구현했습니다.

이름 변경 폼:

- 이름 공백 여부 확인
- 이름 2자 이상 8자 이하 확인
- 이메일은 변경 불가

비밀번호 변경 폼:

- 비밀번호 최소 길이 확인
- 영문, 숫자, 특수문자 조합 확인
- 현재 비밀번호와 신규 비밀번호 불일치 확인
- 신규 비밀번호와 신규 비밀번호 확인 일치 확인
- 실패 시 시각적 피드백 제공

구현 위치:

- `apps/web/src/app/mypage/page.tsx`
- `apps/web/src/libs/components/auth/MyPageForms.tsx`

#### 2-4. 수행에 필요한 API 구현 - 선택

구현 API:

| Method | Path | 설명 |
|---|---|---|
| `POST` | `/api/auth/signup` | 회원가입 |
| `POST` | `/api/auth/login` | 로그인 및 JWT cookie 발급 |
| `POST` | `/api/auth/logout` | 로그아웃 및 cookie 제거 |
| `GET` | `/api/auth/me` | 본인인증 |
| `PATCH` | `/api/auth/me` | 본인 이름 수정 |
| `PATCH` | `/api/auth/me/password` | 비밀번호 수정 |
| `GET` | `/api/statistics` | 의료기관종별 진료과목별 진료비 통계 조회 |
| `GET` | `/api/health` | 서버 상태 확인 |

Docker 기반 컨테이너 환경:

- `docker compose up -d --build`로 루트 디렉토리에서 실행 가능
- PostgreSQL, API, Web 컨테이너 구성

구현 위치:

- `docker-compose.yml`
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`

### 3. 레이아웃 및 기타 요구사항

#### 3-1. Header, Footer - 필수

Header:

- 좌측에 `Tilda Assignment` 제목 표시
- `position: sticky`로 상단 고정
- 우측에는 로그인/회원가입 또는 사용자 메뉴 표시

Footer:

- 하단 고정
- 우측 하단에 `Tilda Assignment` 문구 표시

구현 위치:

- `apps/web/src/libs/components/layout/Header.tsx`
- `apps/web/src/libs/components/layout/Footer.tsx`

#### 3-2. 사이드바 - 필수

구현 내용:

- 좌측 고정 사이드바
- 메뉴: 대시보드 홈, 설정, 문의
- 라우터가 아닌 Zustand 상태 기반 탭 전환
- 메뉴 클릭 시 URL이 변경되지 않음
- 대시보드 홈에는 차트와 테이블 표시
- 설정 메뉴에는 `설정페이지 입니다.` 문구 표시
- 문의 메뉴에는 문의 폼 표시
- 모바일 화면에서는 상단 가로 탭 메뉴로 표시

구현 위치:

- `apps/web/src/libs/components/layout/Sidebar.tsx`
- `apps/web/src/libs/components/dashboard/DashboardShell.tsx`
- `apps/web/src/libs/stores/sidebar.store.ts`

#### 3-3. 문의 페이지 구현 - 필수

문의 폼 구성:

- `성함`: 필수, 2~20자
- `이메일`: 필수, 이메일 형식
- `회사`: 선택, 입력 시 2~20자
- `내용`: 필수
- 제출 버튼: `type="submit"`

submit 동작:

- localStorage에 최신 문의 내용을 저장
- 제출 후 접수 완료 화면 표시
- `대시보드로 돌아가기` 버튼으로 대시보드 홈 메뉴 이동
- `다른 문의 접수하기` 버튼으로 문의 폼 다시 표시
- 다시 제출하면 localStorage 기존 내용을 최신 내용으로 덮어씀
- 문의 메뉴 재접근 시 기본 폼이 다시 표시됨

구현 위치:

- `apps/web/src/libs/components/contact/ContactForm.tsx`
- `packages/shared/src/schemas/contact.schema.ts`

#### 3-4. 배포 - 선택

- 프론트엔드: Vercel
- 백엔드: Render
- 데이터베이스: Render PostgreSQL
- 배포 환경에서도 대시보드 데이터 조회, 회원가입, 로그인, 마이페이지, 문의 폼이 동작합니다.

## API 응답 및 에러 형식

### 통계 API

```http
GET /api/statistics?page=1&perPage=100
```

응답 예시:

```json
{
  "page": 1,
  "perPage": 100,
  "totalCount": 333,
  "data": [
    {
      "treatmentYear": 2024,
      "institutionType": "상급종합병원",
      "departmentName": "내과",
      "claimCount": 18694873,
      "insurerBurden": 6565043997040,
      "totalBenefitCost": 7954774031660,
      "patientCount": 3595574,
      "visitDays": 22662384
    }
  ]
}
```

### 에러 응답

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "올바른 이메일 형식이 아닙니다."
    }
  ],
  "path": "/api/auth/signup"
}
```

## 검증 명령어

```bash
pnpm typecheck
pnpm build
docker compose config --quiet
```

## 주요 구현 포인트

- data.go.kr API 키는 브라우저에 노출하지 않고 백엔드에서만 사용합니다.
- 통계 API 결과는 `(page, perPage)` 기준으로 60초간 서버 메모리에 캐시합니다.
- 차트는 전체 API row를 먼저 가져온 뒤, 진료과목별로 환자수와 입내원일수를 합산합니다.
- 테이블은 TanStack Table을 사용해 정렬, 필터링, 검색, 페이지네이션을 제공합니다.
- 인증은 JWT와 httpOnly cookie를 사용합니다.
- 프론트엔드와 백엔드 검증 규칙은 `packages/shared`의 Zod schema를 중심으로 관리합니다.
- Chrome 번역 기능이 React DOM을 변경해 화면 오류가 발생하지 않도록 `notranslate` 설정을 적용했습니다.

