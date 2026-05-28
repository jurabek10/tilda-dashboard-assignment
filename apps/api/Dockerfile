###############################################
# Stage 1 — install + build
###############################################
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /repo

# Workspace manifests first for cache
COPY pnpm-workspace.yaml package.json ./
COPY apps/api/package.json apps/api/
COPY packages/shared/package.json packages/shared/

RUN pnpm install --frozen-lockfile=false

# Copy sources
COPY packages/shared packages/shared
COPY apps/api apps/api

RUN pnpm --filter @tilda/shared build
RUN pnpm --filter @tilda/api prisma:generate
RUN pnpm --filter @tilda/api build

###############################################
# Stage 2 — runtime
###############################################
FROM node:22-alpine AS runtime

RUN apk add --no-cache openssl
RUN corepack enable && corepack prepare pnpm@9.15.9 --activate
WORKDIR /repo

ENV NODE_ENV=production
ENV PORT=4000

COPY --from=builder /repo/pnpm-workspace.yaml /repo/package.json ./
COPY --from=builder /repo/apps/api/package.json apps/api/
COPY --from=builder /repo/packages/shared/package.json packages/shared/

COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/api/node_modules apps/api/node_modules
COPY --from=builder /repo/apps/api/dist apps/api/dist
COPY --from=builder /repo/apps/api/prisma apps/api/prisma
COPY --from=builder /repo/packages/shared/node_modules packages/shared/node_modules
COPY --from=builder /repo/packages/shared/dist packages/shared/dist
COPY --from=builder /repo/packages/shared/src packages/shared/src

WORKDIR /repo/apps/api

EXPOSE 4000

CMD ["sh", "-c", "npx prisma db push --skip-generate --accept-data-loss && node dist/main.js"]
