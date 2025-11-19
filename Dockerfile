FROM node:18-alpine

# Set work directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install --only=production

# Copy app source
COPY . .

# Cloud Run expects the container to listen on $PORT, default 8080
ENV PORT=8080
EXPOSE 8080

CMD ["node", "index.js"]
