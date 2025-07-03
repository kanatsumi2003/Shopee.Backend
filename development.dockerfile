FROM node:24

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package*.json ./

RUN pnpm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["pnpm", "dev"]