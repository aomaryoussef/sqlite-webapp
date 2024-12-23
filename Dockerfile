# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy application files
COPY package*.json ./
COPY server.js ./

# Install dependencies
RUN npm install

# Copy SQLite database
COPY services.db ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "server.js"]
