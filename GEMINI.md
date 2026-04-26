# GEMINI.md - Pocket Feel Project Context

## Project Overview
Pocket Feel is a full-stack digital wallet application designed for high-integrity transaction management. It features a monorepo structure with a NestJS backend and a Next.js frontend.

### Architecture & Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
  - **Database:** [TypeORM](https://typeorm.io/) with dual support for **PostgreSQL** (Default) and **SQLite** (Dev Toggle).
  - **Validation:** `class-validator` and `class-transformer` for DTO validation.
  - **Features:** Transactional wallet operations (Credit/Debit), history tracking, and wallet management.
- **Frontend:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
  - **State Management:** [TanStack Query](https://tanstack.com/query) (React Query).
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
- **Entities:** Located in `src/wallet/entities/`.
- **DTOs:** Located in `src/wallet/dto/` for request/response validation.
- **Transactions:** Use TypeORM `QueryRunner` for atomic operations involving balance updates and transaction logging.
- **Environment Variables:**
  - `DB_TYPE`: `postgres` or `sqlite`
  - `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME` (For PostgreSQL)

### Frontend
- **App Router:** Uses the Next.js App Router pattern (`src/app/`).
- **Data Fetching:** API calls are abstracted in `src/lib/api.ts`.
- **Components:** Styled using `styled-components` with a `StyledComponentsRegistry` for SSR support.
- **Providers:** TanStack Query providers are wrapped in `src/lib/query-provider.tsx`.

### API Endpoints (Prefix: `http://localhost:3001/api/v1/wallet`)
- `POST /`: Create a new wallet.
- `GET /`: List all wallets.
- `GET /:id`: Get wallet balance.
- `DELETE /:id`: Delete a wallet.
- `POST /:id/credit`: Add funds to a wallet.
- `POST /:id/debit`: Withdraw funds from a wallet.
- `GET /:id/history`: Get transaction history (paginated).

## Key Files
- `backend/src/app.module.ts`: Database connection logic and environment configuration.
- `backend/src/wallet/wallet.service.ts`: Core business logic for wallet operations.
- `backend/src/wallet/entities/`: Database schema for Wallets and Transactions.
- `frontend/src/lib/api.ts`: Centralized frontend API client.
- `docker-compose.yml`: Local infrastructure definition.
