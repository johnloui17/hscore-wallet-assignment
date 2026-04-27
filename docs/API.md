# Pocket Feel API Documentation (v1)

This document provides detailed information about the Pocket Feel Wallet API endpoints, request/response formats, and error handling.

## Base URL
`http://localhost:3001/api/v1/wallet`

---

## 🔐 Data Isolation (User ID)
While the API does not require full authentication (JWT/OAuth), it enforces data isolation via a `userId` query parameter on sensitive read endpoints. This ensures that users only interact with their own data.

---

## 📁 Wallet Endpoints

### 1. Create Wallet
Creates a new digital wallet for a user.

- **URL:** `/`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "name": "Savings Wallet",
    "initialBalance": 1000,
    "userId": "john_doe"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:**
    ```json
    {
      "id": "uuid-string",
      "name": "Savings Wallet",
      "balance": 1000,
      "user_id": "john_doe",
      "created_at": "2026-04-27T12:00:00Z"
    }
    ```

### 2. List All Wallets
Retrieves all wallets associated with a specific user.

- **URL:** `/?userId={userId}`
- **Method:** `GET`
- **Query Params:**
  - `userId` (Required): The unique ID of the user.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    [
      {
        "id": "uuid-string",
        "name": "Savings Wallet",
        "balance": 1000,
        "user_id": "john_doe",
        "created_at": "2026-04-27T12:00:00Z",
        "transactions": [
          {
            "id": "tx-uuid",
            "wallet_id": "uuid-string",
            "amount": 1000,
            "type": "CREDIT",
            "category": "Initial Deposit",
            "created_at": "2026-04-27T12:00:00Z"
          }
        ]
      }
    ]
    ```
  - *Note: The `transactions` array is limited to the last 10 records for dashboard performance.*

### 3. Get Wallet Balance
Fetch the current balance of a specific wallet.

- **URL:** `/:walletId`
- **Method:** `GET`
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:** `Wallet Object` (same structure as above, but without the transactions array).

### 4. Delete Wallet
Permanently removes a wallet and its history.

- **URL:** `/:walletId`
- **Method:** `DELETE`
- **Success Response:**
  - **Code:** `200 OK`

---

## 💸 Transaction Endpoints

### 1. Credit (Deposit)
Add funds to a specific wallet.

- **URL:** `/:walletId/credit`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "amount": 500,
    "category": "Salary",
    "description": "April Bonus"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:** `Updated Wallet Object`

### 2. Debit (Withdrawal)
Withdraw funds from a specific wallet.

- **URL:** `/:walletId/debit`
- **Method:** `POST`
- **Body:**
  ```json
  {
    "amount": 200,
    "category": "Groceries",
    "description": "Weekly shopping"
  }
  ```
- **Success Response:**
  - **Code:** `201 Created`
  - **Content:** `Updated Wallet Object`
- **Error Response:**
  - **Code:** `400 Bad Request` (e.g., if balance is insufficient).

---

## 📜 History & Activity Endpoints

### 1. Paginated Wallet History
Fetch transactions for a specific wallet with pagination support.

- **URL:** `/:walletId/history`
- **Method:** `GET`
- **Query Params:**
  - `limit` (Optional, Default: 10): Number of records per page.
  - `offset` (Optional, Default: 0): Number of records to skip.
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "transactions": [
        {
          "id": "tx-uuid",
          "wallet_id": "uuid-string",
          "amount": 200,
          "type": "DEBIT",
          "category": "Groceries",
          "description": "Weekly shopping",
          "created_at": "2026-04-27T14:30:00Z"
        }
      ],
      "total": 45
    }
    ```

### 2. Global Activity Feed
Fetch all transactions across all wallets for a specific user.

- **URL:** `/transactions/all`
- **Method:** `GET`
- **Query Params:**
  - `userId` (Required): Unique ID of the user.
  - `limit`/`offset`: Pagination controls (Default: 10/0).
  - `type`: Filter by `CREDIT` or `DEBIT`.
  - `category`: Filter by category name.
  - `walletId`: Filter by a specific wallet ID or multiple IDs (comma-separated).
  - `startDate`/`endDate`: Filter by ISO date strings.
  - `sortBy`: `date` or `amount` (Default: `date`).
  - `sortOrder`: `ASC` or `DESC` (Default: `DESC`).
- **Success Response:**
  - **Code:** `200 OK`
  - **Content:**
    ```json
    {
      "transactions": [
        {
          "id": "tx-uuid",
          "wallet_id": "uuid-string",
          "amount": 500,
          "type": "CREDIT",
          "category": "Salary",
          "created_at": "2026-04-27T12:00:00Z",
          "wallet": {
            "id": "uuid-string",
            "name": "Savings Wallet"
          }
        }
      ],
      "total": 120
    }
    ```

---

## ⚠️ Error Handling
All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "message": "Detailed error message here",
  "error": "Bad Request"
}
```

**Common Status Codes:**
- `400 Bad Request`: Validation failed or insufficient funds.
- `404 Not Found`: Wallet ID does not exist.
- `500 Internal Server Error`: Database or server failure.
