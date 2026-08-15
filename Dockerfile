# ---- Marea Tours (Next.js + Prisma) ----
FROM node:20-bookworm-slim

# OpenSSL is required by Prisma's query engine
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies (postinstall runs `prisma generate`)
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund

# Copy the rest and build
COPY . .
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Runs migrations + seed, then starts Next.js (see package.json "start")
CMD ["npm", "run", "start"]
