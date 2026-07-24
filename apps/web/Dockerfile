# Stage 1: Build
FROM node:22-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY index.html package.json tsconfig*.json vite.config.ts ./
COPY src ./src
COPY docker ./docker
COPY public ./public

# Install dependencies
RUN pnpm install --config.dangerouslyAllowAllBuilds=true

# Build the app (bundles into one JS file in dist/)
RUN npm run build

# Stage 2: Runtime
FROM nginx:1.31.3-alpine AS runner

WORKDIR /app

# Copy built static files
COPY --from=builder /app/dist ./
COPY --from=builder /app/docker ./docker

# Copy custom nginx config
COPY docker/nginx.conf.template /etc/nginx/conf.d/
COPY docker/entrypoint.sh /entrypoint.sh

# Environment variable for API service (passed from docker-compose.yml)
# ENV API_URL=http://api-service:5600

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]