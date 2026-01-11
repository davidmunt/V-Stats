FROM node:20-alpine

WORKDIR /app

# Dependencias
COPY package*.json ./
RUN npm install

# Código
COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev"]
