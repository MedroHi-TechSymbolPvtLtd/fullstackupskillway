# ---------------------------------------------------------
# 1) Build Stage (Vite Build on ARM64)
# ---------------------------------------------------------
FROM --platform=linux/arm64 public.ecr.aws/docker/library/node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy all project files (including .env.production)
COPY . .

# Ensure .env.production is definitely available inside container
# (Useful in case gitignore blocks it accidentally)
COPY .env.production /app/.env.production

# Build the Vite app
RUN npm run build


# ---------------------------------------------------------
# 2) Nginx Stage (Serve built static files)
# ---------------------------------------------------------
FROM --platform=linux/arm64 public.ecr.aws/docker/library/nginx:alpine

# Create SSL directory inside the container
RUN mkdir -p /etc/nginx/ssl

# Copy Cloudflare Origin SSL certificates
COPY certs/origin.crt /etc/nginx/ssl/origin.crt
COPY certs/origin.key /etc/nginx/ssl/origin.key

# Correct certificate permissions
RUN chmod 600 /etc/nginx/ssl/origin.key && \
    chmod 644 /etc/nginx/ssl/origin.crt

# Copy custom Nginx HTTPS config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built frontend assets
COPY --from=build /app/dist /usr/share/nginx/html

# Expose ports
EXPOSE 80 443

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
