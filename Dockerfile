# Build stage
FROM node:22-alpine AS build
WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm install -g npm@latest undici@latest ip-address@latest tar@latest brace-expansion@latest
COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force
COPY . .

# Runtime stage
FROM node:22-alpine
WORKDIR /app
RUN apk update && apk upgrade --no-cache
RUN npm install -g npm@latest undici@latest ip-address@latest tar@latest brace-expansion@latest
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
COPY --from=build --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/src ./src
COPY --from=build --chown=nodejs:nodejs /app/package.json ./
USER nodejs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"
CMD ["node", "src/server.js"]
