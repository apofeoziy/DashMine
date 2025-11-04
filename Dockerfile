# Stage 1: Build Next.js application
FROM node:21-alpine AS builder

WORKDIR /app/neweb

# Install neweb dependencies
COPY neweb/package*.json ./
RUN npm ci --only=production

# Copy neweb source and build
COPY neweb/ ./
RUN npm run build

# Stage 2: Production image
FROM node:21-alpine

WORKDIR /usr/kubek

# Install backend dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend sources
COPY modules/ ./modules/
COPY routers/ ./routers/
COPY languages/ ./languages/
COPY app.js ./
COPY pkgconfig.json ./

# Copy built Next.js app from builder
COPY --from=builder /app/neweb/.next ./neweb/.next
COPY --from=builder /app/neweb/public ./neweb/public
COPY --from=builder /app/neweb/package*.json ./neweb/
COPY --from=builder /app/neweb/next.config.mjs ./neweb/

# Install neweb production dependencies
WORKDIR /usr/kubek/neweb
RUN npm ci --only=production

WORKDIR /usr/kubek

# Create necessary directories
RUN mkdir -p servers logs backups

# Expose ports for backend and frontend
EXPOSE 3000 3001

# Start both services
CMD sh -c "cd /usr/kubek/neweb && npm start & cd /usr/kubek && npm start"