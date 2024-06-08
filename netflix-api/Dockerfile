FROM node:18 

WORKDIR /app

COPY package.json .

RUN npm install --legacy-peer-deps

RUN useradd -m appuser
USER appuser

COPY --chown=appuser:appuser . .

EXPOSE 5000

CMD ["npm", "start"]
