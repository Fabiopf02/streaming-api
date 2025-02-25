FROM node:23-slim AS base

FROM base AS builder
WORKDIR /app

RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["node", "dist/src/main.js"]
