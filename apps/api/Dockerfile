FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @myfond/api build
EXPOSE 4000
CMD ["pnpm", "--filter", "@myfond/api", "start"]
