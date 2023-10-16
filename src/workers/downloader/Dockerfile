FROM node:18.18.0-slim
RUN apt update
RUN apt install -y ffmpeg
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src/workers/downloader .
CMD ["npx", "tsx", "index.ts"]
