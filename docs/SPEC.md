# Tilda Dashboard Assignment — Technical Specification

> A medical-fee statistics dashboard with authentication, charts, and tables.
> Built as a TypeScript monorepo (frontend + backend + shared types).

---

## 1. Project Overview

This project implements the **Tilda online coding assignment**: a dashboard
application that visualizes medical institution treatment-fee statistics
(의료기관종별 진료과목별 진료비 통계) from the South Korean public data API,
along with a full authentication flow (signup, login, my-page) and a contact
form.

**Submission deadline:** 2026-05-29 15:00 KST (48 hours).

### 1.1 Evaluation Weights (from the assignment)

| Criterion | Weight |
|---|---|
| All required features work correctly | 30% |
| Reusable / maintainable structure | 20% |
| UI/UX and visual polish | 20% |
| Performance optimization | 15% |
| Technical persuasiveness of core implementation | 15% |

### 1.2 Goals

- Hit every **[필수 / Required]** item.
- Hit every **[선택 / Optional]** item (login, my-page, backend API, deployment).
- Implement all listed "extra features" (chart tooltip, pagination, table
  filter/sort, query key management).
- Use a clean monorepo layout so types stay in sync between FE and BE.

---

## 2. Tech Stack

### 2.1 Frontend (`apps/web`)

| Concern | Choice |
|---|---|
| Framework | **Next.js 15 (App Router)** |
| Language | **TypeScript** (strict) |
| Styling | **TailwindCSS** + **shadcn/ui** (Radix primitives) |
| Server state | **TanStack Query v5** |
| Client state | **Zustand** (auth/session, sidebar tab) |
| Charts | **Recharts** (dual-axis line chart) |
| Tables | **TanStack Table v8** (filtering, sorting, pagination) |
| Forms | **React Hook Form** + **Zod** resolver |
| HTTP | **Axios** instance with JWT interceptor |
| Icons | **lucide-react** |
| Notifications | **sonner** (toast) |

### 2.2 Backend (`apps/api`)

| Concern | Choice |
|---|---|
| Framework | **NestJS 10** |
| Language | **TypeScript** |
| ORM | **Prisma** |
| Database | **PostgreSQL 16** (via Docker) |
| Auth | **JWT (access)** with `@nestjs/jwt` + `passport-jwt` |
| Hashing | **bcrypt** |
| Validation | `class-validator` + `class-transformer` |
| Config | `@nestjs/config` |
| External API client | Axios via `@nestjs/axios` (proxy to data.go.kr) |
| Logging | Nest built-in `Logger` |

### 2.3 Shared (`packages/shared`)

- DTO/response types
- Zod schemas reused on both ends (where practical)
- Enum / constant definitions (medical institution types, sort keys)

### 2.4 Dev / Infra

- **pnpm** workspaces (monorepo)
- **Docker Compose** — `postgres`, `api`, `web` services, one `docker compose up -d` from root
- **Turborepo** (optional, only if it pays for itself within the 48h budget)
- **ESLint** + **Prettier**
- **Husky** + **lint-staged** (optional)

---

## 3. Monorepo Layout

```
tilda-dashboard-assignment/
├── apps/
│   ├── api/                          # NestJS backend (structure based on jurabek10/nestar)
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/             # auth module (signup, login, me, password)
│   │   │   │   │   ├── auth.module.ts
│   │   │   │   │   ├── auth.controller.ts
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── dto/
│   │   │   │   │   ├── guards/
│   │   │   │   │   └── strategies/jwt.strategy.ts
│   │   │   │   ├── users/            # user module (profile management)
│   │   │   │   └── statistics/       # proxies data.go.kr API + caches it
│   │   │   ├── libs/
│   │   │   │   ├── decorators/       # @AuthUser, @Roles
│   │   │   │   ├── enums/
│   │   │   │   ├── dto/              # common DTOs
│   │   │   │   └── types/
│   │   │   ├── prisma/
│   │   │   │   └── prisma.service.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                          # Next.js 15 frontend (structure based on jurabek10/nestar-next)
│       ├── src/
│       │   ├── app/                  # App Router
│       │   │   ├── layout.tsx        # root layout (header + sidebar + footer)
│       │   │   ├── page.tsx          # dashboard home (state-based tab switching)
│       │   │   ├── (auth)/
│       │   │   │   ├── login/page.tsx
│       │   │   │   └── signup/page.tsx
│       │   │   ├── mypage/page.tsx   # protected (middleware-guarded)
│       │   │   ├── api/              # route handlers only if needed
│       │   │   └── globals.css
│       │   ├── libs/
│       │   │   ├── components/
│       │   │   │   ├── layout/
│       │   │   │   │   ├── Header.tsx
│       │   │   │   │   ├── Footer.tsx
│       │   │   │   │   └── Sidebar.tsx
│       │   │   │   ├── dashboard/
│       │   │   │   │   ├── DashboardHome.tsx
│       │   │   │   │   ├── StatsChart.tsx
│       │   │   │   │   ├── StatsTable.tsx
│       │   │   │   │   └── StatsTableColumns.tsx
│       │   │   │   ├── contact/
│       │   │   │   │   ├── ContactForm.tsx
│       │   │   │   │   └── ContactSuccess.tsx
│       │   │   │   ├── auth/
│       │   │   │   │   ├── SignupForm.tsx
│       │   │   │   │   ├── LoginForm.tsx
│       │   │   │   │   └── MyPageForms.tsx
│       │   │   │   └── ui/           # shadcn/ui generated components
│       │   │   ├── hooks/
│       │   │   │   ├── useStatistics.ts
│       │   │   │   ├── useAuth.ts
│       │   │   │   └── useMediaQuery.ts
│       │   │   ├── stores/
│       │   │   │   ├── auth.store.ts        # Zustand
│       │   │   │   └── sidebar.store.ts     # active tab (state-based, not router)
│       │   │   ├── api/
│       │   │   │   ├── client.ts            # axios instance + JWT interceptor
│       │   │   │   ├── auth.api.ts
│       │   │   │   └── statistics.api.ts
│       │   │   ├── query/
│       │   │   │   ├── queryClient.ts
│       │   │   │   └── queryKeys.ts         # centralized query key factory
│       │   │   ├── schemas/                 # Zod schemas (shared via packages/shared)
│       │   │   └── utils/
│       │   ├── middleware.ts                # route protection (SSR-level redirects)
│       │   └── types/
│       ├── public/
│       ├── Dockerfile
│       ├── next.config.ts
│       ├── tailwind.config.ts
│       ├── postcss.config.mjs
│       ├── components.json                  # shadcn config
│       ├── package.json
│       └── tsconfig.json
│
├── packages/
│   └── shared/                              # shared types & schemas
│       ├── src/
│       │   ├── types/
│       │   │   ├── auth.ts                  # User, AuthResponse, JwtPayload
│       │   │   ├── statistics.ts            # MedicalStatisticsRow, PaginatedResponse
│       │   │   └── index.ts
│       │   ├── schemas/
│       │   │   ├── auth.schema.ts           # Zod: signup/login/changePassword
│       │   │   └── contact.schema.ts
│       │   ├── constants/
│       │   │   └── medical.ts               # institution type labels
│       │   └── index.ts
│       ├── package.json
│       └── tsconfig.json
│
├── docker-compose.yml
├── package.json                             # root, pnpm workspaces
├── pnpm-workspace.yaml
├── turbo.json                               # if Turborepo used
├── .env.example
├── README.md
└── SPEC.md                                  # this file
```

---

## 4. Required Features (from the assignment)

### 4.1 Dashboard Requirements

#### 4.1.1 [Required] Fetch API Data
- Use the **의료기관종별 진료과목별 진료비** API at
  `https://www.data.go.kr/data/15139382/fileData.do`.
- Register, get an API key, store as `DATA_GO_KR_API_KEY` env var.
- The backend proxies this API in `statistics` module so the key is never
  exposed to the browser, with optional in-memory caching (60s) to reduce
  upstream load.

**Backend endpoint:** `GET /api/statistics?page=1&perPage=100`

#### 4.1.2 [Required] Line Chart
- Library: **Recharts** `<LineChart>` with `<YAxis yAxisId="left">` and
  `<YAxis yAxisId="right" orientation="right">`.
- X-axis: `진료과목 (표시과목)`
- Left Y-axis: `환자수` (patient count) — labels + ticks, ≥5 ticks
- Right Y-axis: `입내원일수` (visit days) — labels + ticks, ≥5 ticks
- Two lines (red = 환자수, blue = 입내원일수) with no value clipping
  (use `domain={['auto', 'auto']}` and `allowDecimals={false}`, custom
  `tickCount` ≥ 5).
- ≥10 data rows (perPage ≥ 10).
- Horizontal scroll wrapper when X labels overflow.
- **Tooltip** with both series + tab label (optional req — implemented).
- **Pagination control** above the chart (optional req — implemented).

#### 4.1.3 [Required] Table
- Library: **TanStack Table v8** (headless) + shadcn/ui table primitives.
- Columns: `진료년도`, `의료기관종별`, `진료과목(표시과목)`, `명세서청구건수`,
  `보험자부담금(선별포함)`, `요양급여비용총액(선별포함)`, `환자수`, `입내원일수`.
- ≥100 rows (perPage ≥ 100).
- Sticky header, horizontal scroll for narrow viewports, vertical scroll
  inside a fixed-height container — no clipping.
- Number formatting via `Intl.NumberFormat('ko-KR')`.
- **Sorting** per column (optional req — implemented).
- **Per-column filter** + global search (optional req — implemented).
- **Pagination** (optional req — implemented; default page size 25).

#### 4.1.4 [Required] "Extra Features" — all optional items implemented
- ✅ Chart tooltip
- ✅ Chart pagination
- ✅ Table filter + sort
- ✅ Table pagination
- ✅ Centralized **query key management** (`libs/query/queryKeys.ts`)
- ✅ Loading skeletons, empty/error states

### 4.2 Auth & My-Page

#### 4.2.1 [Required] Signup Page
- Fields: `email`, `password`, `name`.
- Client-side Zod validation:
  - Email format
  - Password: ≥8 chars, must contain letters + digits + special chars
  - Name: not empty, length 2–8 chars
- Visual feedback under each field (red text via shadcn `<FormMessage>`).
- On success → redirect to `/login`.

#### 4.2.2 [Optional] Login Page (implemented)
- Fields: `email`, `password`.
- Same email + password format validation.
- Password visibility toggle (eye icon).
- On success → backend issues JWT → stored in **httpOnly cookie**
  (set by backend) so SSR middleware can read it.
- Redirect to `/` (dashboard home).

#### 4.2.3 [Optional] My-Page (implemented)
- Protected route. Middleware redirects unauthenticated users to `/login`.
- Two forms:
  - **Change name**: name validation (2–8 chars, no blanks). Email is read-only.
  - **Change password**: requires current password; new password meets
    the same complexity rules; new ≠ current; new == new-confirm.
- Each form is a separate `<form>` with its own RHF instance.

#### 4.2.4 [Optional] Backend API (implemented)
See **§5 Backend API Specification** below.

#### 4.2.5 Route protection
- **Public:** `/`, `/login`, `/signup`, contact tab.
- **Protected:** `/mypage` (server-side redirect to `/login` via Next.js
  `middleware.ts` reading the JWT cookie).
- **Auth-redirect:** logged-in users hitting `/login` or `/signup`
  are redirected to `/`.

### 4.3 Layout & Misc

#### 4.3.1 [Required] Header + Footer
- **Header**: `sticky top-0 z-50`, left-aligned "Tilda Assignment" title,
  right-aligned user menu (login/logout/mypage).
- **Footer**: `fixed bottom-0` (or sticky in flex column), right-aligned
  "Tilda Assignment" text.

#### 4.3.2 [Required] Sidebar (state-based, NOT router)
- Fixed left sidebar; only the content area scrolls.
- Menu items: **대시보드 홈 / 설정 / 문의**.
- Active tab stored in Zustand store (`sidebar.store.ts`).
- Clicking a menu item changes the rendered component but **does NOT
  change the URL** (no `next/link`, no `router.push`).
- Content per tab:
  - `대시보드 홈` → chart + table
  - `설정` → "설정페이지 입니다." text only
  - `문의` → contact form (§4.3.3)

#### 4.3.3 [Required] Contact Page
- Form fields:
  - `*성함` (required, 2–20 chars)
  - `*이메일` (required, email format)
  - `회사` (optional, 2–20 chars when present)
  - `*내용` textarea (required)
  - Submit button (`type="submit"`)
- On submit:
  - Save serialized payload to `localStorage["tilda.contact"]`.
  - Switch view to success screen with two buttons:
    - **대시보드로 돌아가기** → switches sidebar tab to `대시보드 홈`
    - **다른 문의 접수하기** → re-renders the empty contact form;
      a fresh submit overwrites the localStorage value.
- Re-entering the contact tab later shows the empty form again
  (the form is not pre-filled from localStorage — only the last
  submission is persisted).

#### 4.3.4 [Optional] Deployment (implemented)
- **Frontend** → Vercel (Next.js 15)
- **Backend + Postgres** → Render (or Railway) with the Dockerfile
- Production env vars set in respective dashboards.
- README contains live URL.

---

## 5. Backend API Specification

All endpoints prefixed with `/api`. JSON in/out.

### 5.1 Auth

#### `POST /api/auth/signup`
**Request body**
```json
{ "email": "user@example.com", "password": "Abcd1234!", "name": "주라벡" }
```
**Response 201**
```json
{ "id": "uuid", "email": "user@example.com", "name": "주라벡" }
```
**Errors**
- `400` validation failure (per field)
- `409` email already in use

#### `POST /api/auth/login`
**Request body** `{ "email": "...", "password": "..." }`
**Response 200**
```json
{ "user": { "id": "...", "email": "...", "name": "..." }, "accessToken": "jwt..." }
```
Also sets an **httpOnly, Secure, SameSite=Lax** cookie `access_token`.
**Errors** `401` invalid credentials.

#### `GET /api/auth/me`
JWT required. Returns the current user.
**Response 200** `{ "id": "...", "email": "...", "name": "..." }`
**Errors** `401`.

#### `PATCH /api/auth/me`
JWT required. Update name only.
**Request body** `{ "name": "새이름" }`
**Response 200** updated user.

#### `PATCH /api/auth/me/password`
JWT required.
**Request body**
```json
{ "currentPassword": "...", "newPassword": "...", "newPasswordConfirm": "..." }
```
**Response 200** `{ "ok": true }`
**Errors**
- `400` validation (mismatch, complexity)
- `401` current password wrong

#### `POST /api/auth/logout`
Clears the cookie. `204`.

### 5.2 Statistics

#### `GET /api/statistics`
Query params: `page` (default 1), `perPage` (default 100, max 1000).
Proxies the data.go.kr API and shapes the rows.

**Response 200**
```json
{
  "page": 1,
  "perPage": 100,
  "totalCount": 1234,
  "data": [
    {
      "treatmentYear": 2023,
      "institutionType": "상급종합병원",
      "departmentName": "일반의",
      "claimCount": 300,
      "insurerBurden": 3000000,
      "totalBenefitCost": 20000000,
      "patientCount": 900,
      "visitDays": 300
    }
  ]
}
```

### 5.3 Error envelope (all errors)
```json
{ "statusCode": 400, "message": "...", "errors": [{ "field": "email", "message": "..." }] }
```

### 5.4 Prisma schema (sketch)
```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

---

## 6. Shared Package

`packages/shared/src/index.ts` exports:

- **Types:** `User`, `AuthResponse`, `JwtPayload`, `MedicalStatisticsRow`,
  `PaginatedStatistics`, `ContactFormPayload`.
- **Zod schemas:** `signupSchema`, `loginSchema`, `changeNameSchema`,
  `changePasswordSchema`, `contactSchema`.
- **Constants:** `MEDICAL_INSTITUTION_TYPES`, `STATISTICS_QUERY_KEYS`.

The frontend imports schemas via `import { signupSchema } from '@tilda/shared'`
and uses them with `zodResolver`. The backend imports the same types for DTOs
(but uses class-validator at the controller boundary so Nest dependency
injection stays clean).

---

## 7. State Management Strategy

| Data | Store | Why |
|---|---|---|
| Auth user / token | Zustand (`auth.store`) + httpOnly cookie | persistence, SSR awareness via cookie |
| Active sidebar tab | Zustand (`sidebar.store`) | requirement is "state-based, not router" |
| Statistics fetch state | TanStack Query | server-state cache, pagination, refetch |
| Form fields | React Hook Form | per-form local state |
| Contact submission | `localStorage` | requirement |

### 7.1 Query Keys (centralized)
```ts
// libs/query/queryKeys.ts
export const queryKeys = {
  auth: { me: ['auth', 'me'] as const },
  statistics: {
    all: ['statistics'] as const,
    list: (page: number, perPage: number) =>
      ['statistics', 'list', { page, perPage }] as const,
  },
} as const;
```

---

## 8. UI/UX Plan

- **Design language:** shadcn/ui defaults (neutral palette), accent
  `blue-500` for header/footer to match the assignment mockups.
- **Layout grid:**
  - Header: `h-14`, sticky.
  - Sidebar: `w-56`, fixed.
  - Footer: `h-10`, sticky bottom.
  - Content: `flex-1 overflow-y-auto p-6`.
- **Responsiveness:** sidebar collapses to icon-only at `md` breakpoint;
  table scrolls horizontally; chart wraps in `<ScrollArea>` when X labels
  exceed container width.
- **Empty / loading / error** states everywhere using shadcn `<Skeleton>`
  and `<Alert>`.
- **Accessibility:** focus rings, labelled form fields, `aria-live` on
  toast messages.

---

## 9. Performance

- **TanStack Query** with `staleTime: 5 * 60_000` for statistics so tab
  switching doesn't re-fetch.
- **Backend in-memory cache** (60s) of upstream data.go.kr responses by
  `(page, perPage)` to dodge rate limits.
- Table uses **virtualization** (`@tanstack/react-virtual`) when row count
  >= 200, keeping DOM nodes low.
- Chart memoized with `useMemo` over the active page slice.
- Next.js **Route segment config**: dashboard page is dynamic (cookie
  reads), auth pages are static.
- `next/font` for fonts, no remote CSS.
- Code-split contact form via `dynamic()` (it's not above-the-fold).

---

## 10. Docker Setup

### `docker-compose.yml` (root)
```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: tilda
      POSTGRES_PASSWORD: tilda
      POSTGRES_DB: tilda
    ports: ["5432:5432"]
    volumes: [pgdata:/var/lib/postgresql/data]

  api:
    build: { context: ./apps/api }
    environment:
      DATABASE_URL: postgresql://tilda:tilda@postgres:5432/tilda
      JWT_SECRET: ${JWT_SECRET}
      DATA_GO_KR_API_KEY: ${DATA_GO_KR_API_KEY}
    depends_on: [postgres]
    ports: ["4000:4000"]

  web:
    build: { context: ./apps/web }
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:4000/api
    depends_on: [api]
    ports: ["3000:3000"]

volumes: { pgdata: {} }
```

Requirement: `docker compose up -d` from repo root must boot everything.

---

## 11. Implementation Phases (48-hour budget)

| Phase | Hours | Deliverable |
|---|---|---|
| 0. Repo scaffolding (pnpm workspaces, shared package, docker-compose) | 2 | empty monorepo boots |
| 1. Backend auth (User model, signup/login/me/password, JWT) | 5 | Postman happy path |
| 2. Backend statistics proxy + caching | 2 | `/api/statistics` returns shaped data |
| 3. Frontend shell (layout, header, sidebar, footer, theming) | 3 | navigable empty pages |
| 4. Dashboard chart + table (with pagination/sort/filter) | 6 | meets §4.1 |
| 5. Signup + Login + middleware route guard | 4 | meets §4.2.1–2.2 |
| 6. My-page (name + password forms) | 3 | meets §4.2.3 |
| 7. Contact form + localStorage flow | 2 | meets §4.3.3 |
| 8. Polish, loading/error states, responsive | 4 | UI ready |
| 9. Dockerfiles + compose verification | 2 | `docker compose up -d` works |
| 10. Deployment (Vercel + Render) | 2 | live URL |
| 11. README + buffer | 3 | submission ready |

**Total:** ~38h work + 10h buffer.

---

## 12. Submission Checklist

- [ ] Private GitHub repo created
- [ ] Collaborators invited: `mj.kim@tilda.co.kr`, `hs.choi@tilda.co.kr`
- [ ] `README.md` with: stack, folder structure, env vars, run instructions
      (`docker compose up -d` + manual dev mode), deployed URL,
      architecture notes
- [ ] `docker compose up -d` works from a fresh clone
- [ ] All [필수] items pass manual QA
- [ ] All [선택] items implemented
- [ ] Live deployment reachable
- [ ] PR-quality commit history (no `wip` / `fix typo` noise — squash where
      appropriate)
