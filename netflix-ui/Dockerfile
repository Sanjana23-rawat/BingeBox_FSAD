FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

RUN useradd -m appuser

COPY . .

RUN chown -R appuser:appuser /app

USER appuser

EXPOSE 3000

CMD ["npm","start"]

