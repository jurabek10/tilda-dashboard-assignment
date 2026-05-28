# Tilda Dashboard Assignment

의료기관종별 진료과목별 진료비 통계 대시보드 (Tilda online coding assignment).

A TypeScript monorepo (pnpm workspaces) with:

| App | Stack | Port |
|---|---|---|
| `apps/web` | Next.js 16 (App Router) · React 19 · Tailwind v4 · TanStack Query v5 · TanStack Table v8 · Recharts · React Hook Form · Zod · Zustand | 3000 |
| `apps/api` | NestJS 11 · Prisma 6 · PostgreSQL 16 · JWT (httpOnly cookie) · class-validator | 4000 |
| `packages/shared` | Cross-package Zod schemas, types, constants | – |

## Quick start (Docker)

```bash
cp .env.example .env
docker compose up -d --build
```

Then open:

- Web: <http://localhost:3000>
- API: <http://localhost:4000/api/health>

The API auto-applies the Prisma schema on boot (`prisma db push`).

> If `DATA_GO_KR_API_KEY` is not set, the API serves a **deterministic mock dataset** (≈1,200 rows) so the dashboard works out-of-the-box.

## Local dev (without Docker)

Prerequisites: Node 20+, pnpm 9.15+, PostgreSQL 16 (e.g. `docker compose up -d postgres`).

```bash
pnpm install
cp .env.example apps/api/.env   # or set DATABASE_URL etc. in repo root .env

# 1) DB schema
pnpm --filter @tilda/api prisma:generate
pnpm --filter @tilda/api exec prisma db push

# 2) Run both apps in parallel
pnpm dev
# or individually:
pnpm dev:api   # http://localhost:4000/api
pnpm dev:web   # http://localhost:3000
```

## Environment variables

| Var | Required | Default | Notes |
|---|---|---|---|
| `DATABASE_URL` | yes | `postgresql://tilda:tilda@localhost:5432/tilda` | PostgreSQL connection string |
| `JWT_SECRET` | yes (prod) | dev fallback | Long random string |
| `JWT_EXPIRES_IN` | no | `7d` | JWT lifetime |
| `DATA_GO_KR_API_KEY` | optional | – | When empty, mock data is served |
| `DATA_GO_KR_BASE_URL` | no | `https://apis.data.go.kr/B551182/MadmExpnList` | data.go.kr upstream |
| `CORS_ORIGIN` | no | `http://localhost:3000` | Comma-separated origins |
| `COOKIE_SECURE` | no | `false` | `true` in production over HTTPS |
| `NEXT_PUBLIC_API_URL` | yes | `http://localhost:4000/api` | Frontend → backend |

## Repository layout

```
tilda-dashboard-assignment/
├── apps/
│   ├── api/                  # NestJS backend
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── auth/      # signup / login / me / password / logout
│   │   │   │   ├── statistics/# data.go.kr proxy + 60s in-memory cache
│   │   │   │   └── health/
│   │   │   ├── libs/          # filter, decorator, types
│   │   │   └── prisma/        # PrismaService
│   │   └── prisma/schema.prisma
│   └── web/                  # Next.js 16 frontend
│       ├── src/
│       │   ├── app/           # /, /(auth)/login, /(auth)/signup, /mypage
│       │   ├── middleware.ts  # route guard (httpOnly cookie)
│       │   └── libs/
│       │       ├── api/       # axios client + auth/statistics
│       │       ├── query/     # queryClient + centralized queryKeys
│       │       ├── stores/    # auth.store, sidebar.store (Zustand)
│       │       ├── hooks/
│       │       └── components/
│       │           ├── layout/      # Header, Sidebar, Footer
│       │           ├── dashboard/   # StatsChart, StatsTable, DashboardShell, …
│       │           ├── auth/        # SignupForm, LoginForm, MyPageForms
│       │           ├── contact/     # ContactForm + success
│       │           └── ui/          # shadcn-style primitives
│       └── public/
├── packages/
│   └── shared/               # types · zod schemas · constants · queryKey defs
├── docker-compose.yml
├── .env.example
├── package.json              # pnpm workspaces
├── pnpm-workspace.yaml
└── docs/SPEC.md              # original design spec
```

## Backend API

All endpoints are prefixed with `/api`.

### Auth

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup` | – | Create account. Body: `{ email, password, name }` |
| `POST` | `/auth/login` | – | Returns `{ user, accessToken }` and sets `access_token` httpOnly cookie |
| `POST` | `/auth/logout` | – | Clears the cookie |
| `GET`  | `/auth/me` | JWT | Returns the current user |
| `PATCH`| `/auth/me` | JWT | Update `name` only |
| `PATCH`| `/auth/me/password` | JWT | `{ currentPassword, newPassword, newPasswordConfirm }` |

Validation rules (enforced both on the client via `@tilda/shared` Zod schemas and on the server via `class-validator`):

- email: standard email format
- password: 8+ chars, letters + digits + special char
- name: 2–8 chars, no blanks

### Statistics

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/statistics?page=1&perPage=100` | – | Proxies data.go.kr; falls back to mock |

Response shape:

```json
{
  "page": 1,
  "perPage": 100,
  "totalCount": 1234,
  "data": [
    {
      "treatmentYear": 2023,
      "institutionType": "상급종합병원",
      "departmentName": "내과",
      "claimCount": 300,
      "insurerBurden": 3000000,
      "totalBenefitCost": 20000000,
      "patientCount": 900,
      "visitDays": 300
    }
  ]
}
```

Cached in-process for 60 s per `(page, perPage)`.

### Error envelope

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "올바른 이메일 형식이 아닙니다." }],
  "path": "/api/auth/signup"
}
```

## Frontend feature checklist

### Dashboard (Required)

- ✅ Backend-proxied data fetch (key never reaches browser)
- ✅ Dual-axis Recharts `LineChart` (left = 환자수 red, right = 입내원일수 blue)
- ✅ `domain={['auto', 'auto']}` + `tickCount={6}` → no value clipping, ≥5 ticks per axis
- ✅ ≥10 rows on chart, ≥100 rows on table (per spec)
- ✅ TanStack Table with sticky header, horizontal scroll, fixed-height vertical scroll
- ✅ Numbers formatted with `Intl.NumberFormat('ko-KR')`
- ✅ Chart tooltip showing both series + meta
- ✅ Chart pagination control (above the chart)
- ✅ Table column filters + global search + per-column sort + page size selector
- ✅ Centralized query keys (`src/libs/query/queryKeys.ts`)
- ✅ Skeleton loading + `<Alert>` error states + empty states

### Auth

- ✅ `/signup` with email / password / name + per-field Zod validation
- ✅ `/login` with password visibility toggle, httpOnly cookie issued by API
- ✅ `/mypage` with two independent forms (name change · password change)
- ✅ `middleware.ts` route guard: `/mypage` requires auth, `/login` & `/signup` redirect to `/` when logged in

### Layout

- ✅ Sticky header (left: title · right: user menu / login)
- ✅ Sticky footer
- ✅ Fixed left sidebar with 3 state-based tabs — **no URL changes**, only the rendered component swaps
- ✅ Mobile horizontal-scroll tab bar fallback
- ✅ Contact form with localStorage persistence and success/reset flow

## Architecture notes

- **State separation** — server state in TanStack Query (5 min staleTime), client UI state in Zustand, form state in React Hook Form. Auth user mirrors into Zustand for synchronous reads in the Header, but the source of truth is the cookie + `/auth/me`.
- **Query keys** are derived from one central factory so cache invalidation can target groups (`['statistics']`, `['statistics', 'list', { page, perPage }]`).
- **Shared schemas** — `@tilda/shared` exports the same Zod schemas that both `zodResolver` (FE) and the response shape (BE) use, eliminating drift.
- **Backend cache** — `StatisticsService` caches each `(page, perPage)` for 60 s to soften rate limits on the data.go.kr upstream.
- **Mock fallback** — when no `DATA_GO_KR_API_KEY` is configured, the API generates a deterministic ≈1,200-row dataset (`statistics.mock.ts`) so the dashboard demonstrates correctly out-of-the-box.
- **Auth cookie** — login issues a JWT in an httpOnly, SameSite=Lax cookie. The Next.js `middleware.ts` reads it to redirect at the edge, so protected pages never flash for unauthenticated users.
- **Code splitting** — the contact form (`ContactView`) is loaded with `next/dynamic` since it's below the fold.

## Deployment

- **Frontend** → Vercel (build command `pnpm --filter @tilda/web build`, root `apps/web`). Set `NEXT_PUBLIC_API_URL` to the API origin.
- **Backend + Postgres** → Render / Railway. Use `apps/api/Dockerfile`. Set `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `COOKIE_SECURE=true`, `DATA_GO_KR_API_KEY`.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Run API and Web in parallel |
| `pnpm dev:api` / `pnpm dev:web` | Run a single app |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TS noEmit across the workspace |
| `pnpm prisma:generate` | Generate the Prisma client |
| `pnpm prisma:migrate` | Run a dev migration |

## License

Private — coursework / interview submission.
