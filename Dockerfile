FROM node:23-slim as base

FROM base as builder
WORKDIR /build

RUN corepack enable pnpm
COPY package.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install

COPY ./src ./src
COPY tsconfig*.json ./
COPY nest-cli.json ./
RUN pnpm run build
RUN pnpm prune --prod

FROM base as prod
WORKDIR /app
USER node

COPY --from=builder --chown=node:node /build/dist .

ARG PORT=3000
ENV PORT=$PORT

EXPOSE $PORT

CMD ["pnpm", "run", "start:prod"]
