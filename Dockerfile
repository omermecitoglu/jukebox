FROM node:18.18.0-slim
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "start"]
