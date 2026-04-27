# GEMINI.md - Pocket Feel Project Context

## Project Overview
Pocket Feel is a full-stack digital wallet application designed for high-integrity transaction management. It features a monorepo structure with a NestJS backend and a Next.js frontend.

### Architecture & Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
  - **Database:** [TypeORM](https://typeorm.io/) with dual support for **PostgreSQL** (Default) and **SQLite** (Dev Toggle).
  - **Validation:** `class-validator` and `class-transformer` for DTO validation.
  - **Features:** User-scoped wallet management (User ID session), transactional operations (Credit/Debit), and paginated history tracking.
- **Frontend:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
  - **State Management:** [TanStack Query](https://tanstack.com/query) (React Query) for robust data fetching and caching.
  - **Authentication:** Secure `HttpOnly` cookie-based sessions with Next.js Middleware (`proxy.ts`).
  - **Styling:** [Styled Components](https://styled-components.com/) and Vanilla CSS.
  - **Infrastructure:** [Docker Compose](https://docs.docker.com/compose/) for containerized PostgreSQL orchestration.

## Getting Started

### Prerequisites
- Node.js (v18+)
- Docker Desktop (Recommended for PostgreSQL)
- npm or yarn

### Running the Project

#### 1. Database (PostgreSQL)
The project defaults to PostgreSQL. Start the database using Docker:
```bash
docker compose up -d
```
*Alternatively, if using local PostgreSQL via Homebrew:* `brew services start postgresql@15`

#### 2. Backend
```bash
cd backend
npm install
npm run start:dev
```
**SQLite Toggle:** To run without PostgreSQL, use: `DB_TYPE=sqlite npm run start:dev`

#### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Development Conventions

### Backend
- **Modules:** Organized by feature (e.g., `wallet` module).
- **Security:** Most `GET` endpoints require a `userId` query parameter to enforce data privacy.
- **Entities:** Located in `src/wallet/entities/`.
- **DTOs:** Located in `src/wallet/dto/` for request/response validation.
- **Transactions:** Use TypeORM `QueryRunner` for atomic operations involving balance updates and transaction logging.
- **Environment Variables:**
  - `DB_TYPE`: `postgres` or `sqlite`
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` (For PostgreSQL)

### Frontend
- **App Router:** Uses the Next.js App Router pattern (`src/app/`).
- **Auth Proxy:** `src/proxy.ts` handles route protection and session verification via cookies.
- **Data Fetching:** API calls are abstracted in `src/lib/api.ts` and managed via TanStack Query.
- **Components:** Styled using `styled-components` with a `StyledComponentsRegistry` for SSR support.
- **Providers:** TanStack Query providers are wrapped in `src/lib/query-provider.tsx`.

### API Endpoints (Prefix: `http://localhost:3001/api/v1/wallet`)
- `POST /`: Create a new wallet (accepts optional `userId`).
- `GET /?userId={id}`: List all wallets for a specific user (**Required: userId**).
- `GET /:id`: Get specific wallet balance.
- `DELETE /:id`: Delete a wallet.
- `POST /:id/credit`: Add funds to a wallet.
- `POST /:id/debit`: Withdraw funds from a wallet.
- `GET /:id/history?limit={n}&offset={m}`: Get transaction history (paginated).
- `GET /transactions/all?userId={id}`: Global transaction feed (**Required: userId**).

## Key Files
- `backend/src/wallet/wallet.service.ts`: Core business logic and user-scoped data filtering.
- `backend/src/wallet/wallet.controller.ts`: API route definitions and request validation.
- `frontend/src/proxy.ts`: Authentication layer (formerly middleware).
- `frontend/src/app/actions.ts`: Server Actions for secure cookie management (login/logout).
- `frontend/src/lib/api.ts`: Centralized frontend API client.
- `docker-compose.yml`: Local infrastructure definition.
