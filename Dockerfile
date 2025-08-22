FROM node:18-alpine

WORKDIR /app

# Copy the entire project
COPY . .

# Install server dependencies
WORKDIR /app/server
RUN npm install --production

# Expose port
EXPOSE 5000

# Start the server
CMD ["node", "index.js"]
