# Production Readiness Report 🚀

This document evaluates the codebase for production readiness, highlighting what is complete, what needs configuration, and how development and production environments are separated.

## ✅ What is currently Production-Ready
1. **Containerization:** The `docker-compose.yml` provides a production-like database environment for local testing.
2. **Dependency Management:** The backend build process (`NODE_ENV=development npm ci && npm run build && npm prune --production`) correctly strips out development tools (like `@nestjs/cli`) to minimize the production attack surface and image size.
3. **Validation & Integrity:** Global `ValidationPipe` is active, stripping unknown properties (`whitelist: true`, `forbidNonWhitelisted: true`).
4. **Database Agnosticism:** The backend connects to PostgreSQL via environment variables (`DB_HOST`, etc.), allowing connection to managed databases like Supabase or AWS RDS without code changes.

---

## 🚧 What Needs Fixing Before Going Live

### 1. Database Synchronization (CRITICAL)
- **Issue:** TypeORM is currently set to `synchronize: true` (or hardcoded on). This automatically alters your database schema when you change entities. In production, this can accidentally drop tables or delete user data!
- **Fix:** Update `app.module.ts` to disable `synchronize` automatically in production: `synchronize: process.env.NODE_ENV !== 'production'`.

### 2. CORS (Cross-Origin Resource Sharing) Security
- **Issue:** `app.enableCors()` is open to all domains. Any website can currently make requests to your API.
- **Fix:** Restrict CORS in `main.ts` to only allow your Vercel frontend URL in production.

### 3. Security Headers (Helmet)
- **Issue:** The backend leaks information about the framework (e.g., `X-Powered-By: Express`) and lacks modern security headers to prevent XSS and clickjacking.
- **Fix:** Install and configure `helmet` in `main.ts`.

### 4. Rate Limiting
- **Issue:** The API is vulnerable to brute force and basic DDoS attacks.
- **Fix:** Install `@nestjs/throttler` to limit how many requests a single IP can make per minute.

---

## 🌍 Environment Management Strategy

To cleanly separate Development and Production, we will establish specific environment variables. 

### Backend (NestJS)
You provide these in the Render dashboard for Production, and use a local `.env` file for Development.

**Local Development (`backend/.env`):**
```env
NODE_ENV=development
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=user
DB_PASSWORD=password
DB_NAME=wallet_db
FRONTEND_URL=http://localhost:3000
```

**Live Production (Render Dashboard):**
```env
NODE_ENV=production
DB_TYPE=postgres
DB_HOST=aws-1-ap-south-1.pooler.supabase.com
DB_PORT=6543
DB_USERNAME=postgres.wjjpvjduzjnvlzupbswd
DB_PASSWORD=your_secure_password
DB_NAME=postgres
FRONTEND_URL=https://hscore-wallet-assignment.vercel.app
```

### Frontend (Next.js)
Next.js handles `.env` files automatically. 

**Local Development (`frontend/.env.development`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1/wallet
```

**Live Production (Vercel Dashboard):**
```env
NEXT_PUBLIC_API_URL=https://hscore-wallet-assignment.onrender.com/api/v1/wallet
```
