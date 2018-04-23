FROM repo.neo.pro:9999/node/npm:8.11

COPY ./ ./
RUN npm run build

ENV PORT 8080

CMD ["node", "dist/index.js"]
