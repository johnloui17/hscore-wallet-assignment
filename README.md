# Digital Vault - High-Integrity Wallet Assignment

Digital Vault is a modern, high-integrity full-stack digital wallet application. It provides a secure and intuitive interface for managing multiple wallets, tracking balances, and categorizing transactions.

![Digital Vault Dashboard Placeholder](https://via.placeholder.com/800x400.png?text=Digital+Vault+Dashboard+Preview)

## 🚀 Key Functionalities

### 1. Multi-Wallet Management
- **Create Wallets:** Setup multiple distinct vaults (e.g., "Savings", "Daily Expenses", "Travel Fund").
- **Initial Deposits:** Start any vault with an initial balance.
- **Dynamic List:** Real-time view of all your vaults and their current totals.
- **Secure Deletion:** Remove vaults that are no longer needed.

### 2. Transaction Integrity
- **Credit (Deposit):** Add funds to any wallet instantly.
- **Debit (Withdrawal):** Securely withdraw funds with automatic balance validation to prevent overdrafts.
- **ACID Compliance:** The backend ensures that balance updates and transaction logging happen atomically.

### 3. Categorization & Tracking
- **Smart Categories:** Assign categories like *Groceries*, *Bills*, *Dining*, *Salary*, and more to your transactions.
- **Visual Icons:** Transaction history displays intuitive emojis for quick visual identification.
- **Detailed History:** View a complete ledger of every credit and debit ever made.
- **Pagination:** Clean, paginated history view (4 transactions per page) for efficient browsing.

---

## 📸 High-Level Demo

### Step 1: Initialize Your Vaults
Upon opening the application, you'll land on the **Vault Dashboard**. Click on **"+ Create Wallet"** to initialize your first vault.
> *Demo Tip: Give it a name like "Personal Vault" and start with an initial deposit.*

### Step 2: Manage Your Funds
Click on any wallet card to enter its **Control Center**. Here you can:
- **Input an amount** in the dedicated field.
- **Select an optional category** (e.g., 🍔 Dining or 💸 Salary).
- Click **Credit** or **Debit** to perform the operation.

### Step 3: Audit Your History
Toggle the **"View Transaction History"** button at the bottom. This expands a detailed ledger showing:
- Operation Type (Credit/Debit)
- Exact Timestamp
- Assigned Category
- Specific Amount (color-coded: Green for Credit, Red for Debit)

---

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, Styled Components, TanStack Query.
- **Backend:** NestJS, TypeORM, class-validator.
- **Database:** PostgreSQL (primary) / SQLite (optional).
- **Environment:** Containerized with Docker.

---

## 🚦 Getting Started

### 1. Setup Infrastructure
```bash
docker-compose up -d
```

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

Visit `http://localhost:3000` to start your Digital Vault experience.

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
