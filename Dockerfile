# Use Node.js 16 on Debian (better Prisma compatibility than Alpine)
FROM node:16-bullseye-slim

# Install OpenSSL and other dependencies needed for Prisma
RUN apt-get update && apt-get install -y \
    openssl \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@7.33.7

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files from workspace packages
COPY app/db/package.json ./app/db/
COPY app/server/package.json ./app/server/
COPY app/web/package.json ./app/web/
COPY pkgs/boot/package.json ./pkgs/boot/
COPY pkgs/builder/package.json ./pkgs/builder/
COPY pkgs/dev/package.json ./pkgs/dev/
COPY pkgs/docs/package.json ./pkgs/docs/
COPY pkgs/figma/package.json ./pkgs/figma/
COPY pkgs/libs/package.json ./pkgs/libs/
COPY pkgs/main/package.json ./pkgs/main/
COPY pkgs/platform/package.json ./pkgs/platform/

# Copy the rest of the application code
COPY . .

# Install dependencies and generate Prisma in one step to avoid cross-compilation issues
ARG TARGETPLATFORM
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
RUN pnpm config set store-dir /tmp/pnpm-store && \
    pnpm install --frozen-lockfile && \
    cd /app/app/db && \
    if [ "$TARGETPLATFORM" = "linux/amd64" ]; then \
        PRISMA_CLI_BINARY_TARGETS="debian-openssl-1.1.x" PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma generate; \
    elif [ "$TARGETPLATFORM" = "linux/arm64" ]; then \
        PRISMA_CLI_BINARY_TARGETS="linux-arm64-openssl-1.1.x" PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma generate; \
    else \
        PRISMA_CLI_BINARY_TARGETS="debian-openssl-1.1.x" PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 pnpm prisma generate; \
    fi && \
    pnpm prisma db pull && \
    cd /app && \
    pnpm store prune && \
    rm -rf /tmp/pnpm-store && \
    npm cache clean --force && \
    apt-get remove -y python3 make g++ && \
    apt-get autoremove -y

# Set back to main directory
WORKDIR /app

# Expose the port that the app runs on
EXPOSE 5001

# Start the application
CMD ["node", "base", "prod", "--port", "5001"]