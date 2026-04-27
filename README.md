# 💳 Pocket Feel — High-Integrity Digital Wallet

Pocket Feel is a modern, full-stack digital wallet application designed for secure, user-scoped transaction management. It features a high-fidelity frontend built with **Next.js 15** and a robust **NestJS** backend, ensuring ACID-compliant operations and a premium user experience.

![Pocket Feel Dashboard](./assets/homePage.png)

---

## ✨ Key Features

### 🔐 User-ID Scoped Sessions
- **Zero-Password Entry:** Users access their wallets using a simple User ID (e.g., `ronaldo`).
- **Secure Persistence:** Sessions are maintained via `HttpOnly` cookies and `localStorage`, ensuring data isolation without complex OAuth setups.
- **Cross-Device Ready:** All data is associated with the User ID in the database, allowing access from any browser.

### 🛡️ Transaction Integrity
- **ACID Compliance:** Uses TypeORM transactions to ensure balance updates and ledger entries happen atomically—no partial state even on failures.
- **Safe Deletion:** A custom **"Safe Swipe Slider"** prevents accidental wallet deletion, requiring a deliberate drag interaction to confirm.
- **Overdraft Protection:** Backend validation prevents debit operations that exceed the available balance.

### 📊 Real-Time Financial Tracking
- **Paginated Ledger:** Efficiently browse through transaction history with server-side pagination.
- **Smart Categorization:** Tag transactions with categories like *Groceries*, *Dining*, or *Salary* for better tracking.
- **Live Updates:** Integrated with **TanStack Query** for instant UI synchronization after every transaction.

---

## 🏗️ Technical Architecture

### **Frontend**
- **Framework:** Next.js 15 (App Router)
- **State & Fetching:** TanStack Query (React Query)
- **Styling:** Styled Components + Framer Motion (Animations)
- **Middleware:** Custom Edge Proxy for route protection and session verification.

### **Backend**
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL (Production) / SQLite (Local Dev fallback)
- **ORM:** TypeORM
- **Validation:** `class-validator` for DTO-level request integrity.

---

## 🚦 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Docker (Optional, for PostgreSQL)

### 2. Clone & Setup Environments

#### **Backend (`/backend`)**
Create a `.env` file:
```env
PORT=3001
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=hscore_wallet
```
*Note: To use SQLite instead, simply run with `DB_TYPE=sqlite`.*

#### **Frontend (`/frontend`)**
Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1/wallet
```

### 3. Execution
**Start Database:**
```bash
docker compose up -d
```

**Launch Services:**
```bash
# In /backend
npm install && npm run start:dev

# In /frontend
npm install && npm run dev
```

---

## 🌐 Deployment Instructions

### **Backend (e.g., Render / Railway)**
1.  Connect your repository.
2.  Set the Root Directory to `backend/`.
3.  Add all environment variables listed above.
4.  Build Command: `npm install && npm run build`.
5.  Start Command: `npm run start:prod`.

### **Frontend (e.g., Vercel)**
1.  Connect your repository.
2.  Set the Root Directory to `frontend/`.
3.  Set `NEXT_PUBLIC_API_URL` to your **Live Backend URL**.
4.  Deploy.

---

## 📘 API & Documentation

Pocket Feel includes extensive internal documentation to assist reviewers:

- **[Detailed API Documentation (API.md)](./API.md)** — Full endpoint signatures and examples.
- **[Submission TODO Checklist (TODO.md)](./TODO.md)** — Tracking of assignment requirements.
- **[Architectural Context (GEMINI.md)](./GEMINI.md)** — Deep dive into system-wide dependencies.

---

*Developed with ❤️ by John Loui for the hScore Advisors Wallet Assignment.*
