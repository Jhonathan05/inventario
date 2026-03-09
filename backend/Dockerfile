# Etapa 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

# Etapa 2: Producción
FROM node:20-alpine

RUN apk add --no-cache postgresql-client

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN mkdir -p /app/uploads
RUN chmod +x /app/start.sh

EXPOSE 3001

CMD ["/bin/sh", "/app/start.sh"]
