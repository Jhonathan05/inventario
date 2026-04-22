# Etapa 1: Build de React
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos solo el package.json para una instalación limpia
COPY package.json ./
RUN npm install --no-audit --no-fund --prefer-offline

COPY . .
# Comentado para desarrollo - el contenedor usa Vite dev server
# RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
