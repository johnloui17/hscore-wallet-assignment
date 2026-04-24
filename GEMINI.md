# GEMINI.md - Digital Vault Project Context

## Project Overview
Digital Vault is a full-stack digital wallet application designed for high-integrity transaction management. It features a monorepo structure with a NestJS backend and a Next.js frontend.

### Architecture & Tech Stack
- **Backend:** [NestJS](https://nestjs.com/) (TypeScript)
  - **Database:** [TypeORM](https://typeorm.io/) with SQLite.
  - **Validation:** `class-validator` and `class-transformer` for DTO validation.
  - **Features:** Transactional wallet operations (Credit/Debit), history tracking, and wallet management.
- **Frontend:** [Next.js](https://nextjs.org/) (App Router, TypeScript)
  - **State Management:** [TanStack Query](https://tanstack.com/query) (React Query).
  - **Styling:** [Styled Components](https://styled-components.com/) and Vanilla CSS.
  - **Components:** Modular structure with a focus on responsiveness and interactive feedback.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Running the Project

#### 1. Backend
```bash
cd backend
npm install
npm run start:dev
```
The backend API will be available at `http://localhost:3001`. The SQLite database will be created automatically as `backend/database.sqlite`.

#### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

## Development Conventions

### Backend
- **Modules:** Organized by feature (e.g., `wallet` module).
- **Entities:** Located in `src/feature/entities/`.
- **DTOs:** Located in `src/feature/dto/` for request/response validation.
- **Transactions:** Use TypeORM `QueryRunner` for atomic operations involving balance updates and transaction logging.
- **CORS:** Enabled globally in `main.ts` to allow frontend communication.

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
- `backend/src/wallet/wallet.service.ts`: Core business logic for wallet operations.
- `backend/src/wallet/entities/`: Database schema for Wallets and Transactions.
- `frontend/src/lib/api.ts`: Centralized frontend API client.
