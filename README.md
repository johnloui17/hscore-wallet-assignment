# Pocket Feel - Your Personal Digital Wallet
Pocket Feel is a modern, high-integrity full-stack digital wallet application. It provides a secure and intuitive interface for managing multiple wallets, tracking balances, and categorizing transactions.
![Pocket Feel Dashboard](./assets/homePage.png)


## 🚀 Key Functionalities

### 1. Multi-Wallet Management
- **Create Wallets:** Setup multiple distinct vaults (e.g., "Savings", "Daily Expenses", "Travel Fund").
- **Initial Deposits:** Start any vault with an initial balance.
- **Dynamic List:** Real-time view of all your vaults and their current totals.
- **Secure Deletion:** Remove vaults that are no longer needed.

### 2. Transaction Integrity
- **Credit (Deposit):** Add funds to any wallet instantly.
- **Debit (Withdrawal):** Securely withdraw funds with automatic balance validation to prevent overdrafts.
- **ACID Compliance:** The backend ensures that balance updates and transaction logging happen atomically using TypeORM transactions.

### 3. Categorization & Tracking
- **Smart Categories:** Assign categories like *Groceries*, *Bills*, *Dining*, *Salary*, and more to your transactions.
- **Visual Icons:** Transaction history displays intuitive emojis for quick visual identification.
- **Detailed History:** View a complete ledger of every credit and debit ever made.
- **Pagination:** Clean, paginated history view (4 transactions per page) for efficient browsing.

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, Styled Components, TanStack Query.
- **Backend:** NestJS, TypeORM, class-validator.
- **Database:** PostgreSQL (Primary) / SQLite (Development Toggle).
- **Infrastructure:** Docker Compose for containerized PostgreSQL orchestration.

---

## 🚦 Getting Started

### 1. Database Setup (PostgreSQL)
The project defaults to PostgreSQL. The recommended way to run it is via **Docker**:
```bash
docker compose up -d
```
*Alternatively, you can use local PostgreSQL via Homebrew (`brew services start postgresql@15`).*

### 2. Run Backend
```bash
cd backend
npm install
npm run start:dev
```

### 3. Run Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🔄 Database Toggle (Local Dev)
If you prefer not to use PostgreSQL/Docker, you can switch to **SQLite** instantly:
```bash
cd backend && DB_TYPE=sqlite npm run start:dev
```
This will create a local `database.sqlite` file in the backend directory.

---

## 🌐 Production & Live Hosting
When deploying this project to the internet (e.g., Vercel, Render, Railway), configure the following environment variables in your hosting provider:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `DB_TYPE` | Database Type | `postgres` |
| `DB_HOST` | Database Hostname | `your-db-instance.amazonaws.com` |
| `DB_PORT` | Database Port | `5432` |
| `DB_USERNAME` | Database User | `admin` |
| `DB_PASSWORD` | Database Password | `your-secure-password` |
| `DB_NAME` | Database Name | `wallet_prod` |
| `NODE_ENV` | Environment Mode | `production` |

*Note: In production mode, `synchronize` is automatically disabled to protect your data schema.*

---

## 📘 API Reference (v1)

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/v1/wallet` | `GET` | Fetch all wallets |
| `/api/v1/wallet` | `POST` | Create a new wallet |
| `/api/v1/wallet/:id` | `GET` | Get current balance |
| `/api/v1/wallet/:id/credit` | `POST` | Deposit funds |
| `/api/v1/wallet/:id/debit` | `POST` | Withdraw funds |
| `/api/v1/wallet/:id/history` | `GET` | Fetch transaction ledger |

---

*Developed by John Loui for HScore Wallet Assignment.*
