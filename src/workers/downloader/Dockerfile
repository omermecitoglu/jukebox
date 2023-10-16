FROM node:18.18.0-slim
RUN apt update
RUN apt install -y ffmpeg
RUN npm install -g npm@latest
RUN npm install -g tsx
WORKDIR /app
COPY .npmrc ./
COPY package*.json ./
RUN npm install
COPY src/workers/downloader .
CMD ["tsx", "index.ts"]
