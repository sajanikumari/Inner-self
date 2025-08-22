FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first for better Docker cache
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --only=production

# Copy the rest of the application
WORKDIR /app
COPY . .

# Ensure utils directory and all files are copied
RUN ls -la /app/server/utils/

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Set working directory to server
WORKDIR /app/server

# Expose the ports that might be used
EXPOSE 5000
EXPOSE 10000

# Start the server
CMD ["node", "index.js"]
