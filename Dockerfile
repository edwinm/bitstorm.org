FROM node:26-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM georgjung/nginx-brotli:mainline-alpine

COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/web /usr/share/nginx/html

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
    CMD wget -q --spider http://127.0.0.1/ || exit 1
