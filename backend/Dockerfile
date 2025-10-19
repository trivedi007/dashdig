FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Bust cache - changes every time to force fresh copy
ARG CACHEBUST=1
RUN echo "Cache bust: $CACHEBUST"

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start directly with node
CMD ["node", "src/server.js"]
