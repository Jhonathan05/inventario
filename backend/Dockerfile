# Etapa 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --omit=dev

# Etapa 2: Producción
FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN mkdir -p /app/uploads

EXPOSE 3001

CMD ["node", "src/server.js"]
