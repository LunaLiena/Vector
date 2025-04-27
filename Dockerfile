FROM node:20-buster AS builder

WORKDIR /app

# 1. Сначала копируем только файлы зависимостей
COPY package.json package-lock.json ./

# 2. Чистая установка зависимостей
RUN npm ci --legacy-peer-deps \ 
    && npm install -g electron-builder \    
    && npm cache clean --force
# 3. Копируем остальные файлы
COPY . .

CMD [ "npm","run","dev" ]
