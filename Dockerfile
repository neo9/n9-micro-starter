FROM node:9.10.1-alpine

WORKDIR /home/app
COPY package.json ./
RUN npm install
COPY ./ ./
RUN npm build

USER nobody

ENV PORT 8080

CMD ["node", "dist/index.js"]
