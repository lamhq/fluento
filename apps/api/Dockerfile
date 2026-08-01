# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY package.json tsconfig.json esbuild.mjs ./
COPY prisma ./prisma
COPY src ./src

# Install dependencies
RUN pnpm install --config.dangerouslyAllowAllBuilds=true

# Generate Prisma client
RUN pnpm run prisma:generate

# Build the app (bundles into one JS file in dist/)
RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only the bundled output and package metadata
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/healthcheck.mjs ./dist
COPY package.json ./

# Expose runtime port
EXPOSE 5600

# Start the API app using npm script
CMD ["npm", "run", "start"]
