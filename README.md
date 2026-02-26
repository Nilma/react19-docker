# React 19 + Docker (Step-by-step)

This tutorial shows **two** Docker setups for a React 19 app:

1. **Development container** (fast iteration + hot reload)
2. **Production image** (small, optimized static build served by Nginx)

It builds on the Docker fundamentals (images, containers, Dockerfile, docker-compose, `.env`) you covered in your slides. fileciteturn0file0

---

## Prerequisites

- Docker Desktop installed and running
- Node.js (recommended **v20+**) for local scaffolding
- A terminal

Verify Docker:

```bash
docker --version
docker compose version
```

---

## 1) Create a React 19 app (Vite)

In an empty folder:

```bash
npm create vite@latest react19-docker -- --template react
cd react19-docker
npm install
npm run dev
```

Confirm the app works at the URL printed by Vite (usually `http://localhost:5173`).

---

## 2) Add `.dockerignore`

Create a file named `.dockerignore`:

```dockerignore
node_modules
dist
.git
.gitignore
Dockerfile
docker-compose.yml
npm-debug.log
yarn-error.log
.DS_Store
```

---

## 3) Development with Docker (hot reload)

### 3.1 Create `Dockerfile.dev`

Create `Dockerfile.dev` in the project root:

```dockerfile
# Dev image for React (Vite) with hot reload
FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm ci

# Copy project
COPY . .

# Vite dev server port
EXPOSE 5173

# Important: Vite needs --host so it is reachable from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
```

### 3.2 Create `docker-compose.yml` (dev)

Create `docker-compose.yml`:

```yaml
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      # Mount your source for live edits
      - .:/app
      # Keep container's node_modules (avoid overwriting by the host)
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
```

### 3.3 Run the dev container

```bash
docker compose up --build
```

Open:

- `http://localhost:5173`

Edit a component (e.g., `src/App.jsx`) and you should see hot reload.

Stop containers:

```bash
docker compose down
```

---

## 4) Production with Docker (multi-stage build + Nginx)

For production we’ll build the static site and serve it efficiently.

### 4.1 Create `Dockerfile` (production)

Create `Dockerfile`:

```dockerfile
# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Run stage ----
FROM nginx:alpine

# Copy build output to Nginx web root
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: custom Nginx config to support SPA routing
# (uncomment if you add the config file in step 4.2)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 4.2 (Optional) Add SPA routing support

If you use React Router (client-side routes like `/about`), create `nginx.conf`:

```nginx
server {
  listen 80;
  server_name _;
  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

Then uncomment the `COPY nginx.conf ...` line in the Dockerfile.

### 4.3 Build and run production image

Build:

```bash
docker build -t react19-prod .
```

Run:

```bash
docker run --rm -p 8080:80 react19-prod
```

Open:

- `http://localhost:8080`

---

## 5) (Optional) Use `.env` for configuration

For Vite, environment variables exposed to the browser must start with `VITE_`.

Create `.env`:

```env
VITE_API_BASE_URL=https://example.com/api
```

Use it in code:

```js
const baseUrl = import.meta.env.VITE_API_BASE_URL;
```

**Important:** don’t commit `.env` to Git. Add it to `.gitignore`.

---

## 6) Common pitfalls & fixes

### Hot reload doesn’t work in Docker
- Ensure your dev command includes `--host 0.0.0.0`
- Try polling (already included in compose): `CHOKIDAR_USEPOLLING=true`

### Port already in use
- Change host mapping, e.g. `5174:5173`
- Or stop the process using the port

### “Cannot find module” / dependency weirdness
- Make sure you kept `/app/node_modules` as an **anonymous volume** in compose:
  `- /app/node_modules`

### Production routes 404 (React Router)
- Add the `nginx.conf` with `try_files ... /index.html` (step 4.2)

---

## 7) Quick command summary

**Dev**
```bash
docker compose up --build
docker compose down
```

**Prod**
```bash
docker build -t react19-prod .
docker run --rm -p 8080:80 react19-prod
```

---

