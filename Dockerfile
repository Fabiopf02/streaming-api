FROM node:23-slim AS base

FROM base AS builder
WORKDIR /build

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

RUN pnpm prune --prod

FROM base AS prod
WORKDIR /app

# RUN useradd --create-home --shell /bin/bash appuser
# USER appuser

COPY --from=builder /build/dist ./dist
COPY --from=builder /build/node_modules ./node_modules
COPY --from=builder /build/package.json ./

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["node", "dist/src/main.js"]
