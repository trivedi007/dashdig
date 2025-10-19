FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code - make sure this runs every time
COPY . .

# Expose port
EXPOSE 8080

# Start directly with node
CMD ["node", "src/server.js"]
