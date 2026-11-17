FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

ENV NODE_ENV=production

RUN npm ci

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
