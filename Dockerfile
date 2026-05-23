FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install all dependencies (needed for build)
RUN npm install

# Copy TypeScript config and source files
COPY tsconfig.json ./
COPY server ./server
COPY src ./src
COPY vite.config.ts index.html ./

# Build frontend and server
RUN npm run build

# Check if server was built
RUN ls -la dist/server/ || echo "Warning: dist/server not found"

# Install only production dependencies
RUN npm ci --production

# Expose port
EXPOSE 3001

# Start server
CMD ["node", "--enable-source-maps", "dist/server/index.js"]
