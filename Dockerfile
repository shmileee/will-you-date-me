# syntax=docker/dockerfile:1.7

# ──────────────────────────────────────────────────────────
# Dev stage: Vite dev server with HMR
# ──────────────────────────────────────────────────────────
FROM node:22-alpine AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm", "run", "dev"]

# ──────────────────────────────────────────────────────────
# Build stage: produce static dist/
# ──────────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# ──────────────────────────────────────────────────────────
# Prod stage: nginx serving dist/ with SPA fallback
# ──────────────────────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
RUN cat > /etc/nginx/conf.d/default.conf <<'EOF'
server {
  listen 80 default_server;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;
  location / {
    try_files $uri $uri/ /index.html;
  }
  # Cache static assets aggressively
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
EOF
EXPOSE 80
