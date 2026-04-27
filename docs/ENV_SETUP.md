# ⚙️ Pocket Feel — Environment Variable Setup

This document provides detailed instructions for configuring the environment variables required to run the Pocket Feel application in both development and production environments.

---

## 🏗️ Backend Configuration (`/backend`)

The backend uses a `.env` file located in the root of the `backend/` directory.

### **Mandatory Variables**

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | The port the NestJS server will listen on. | `3001` |
| `DB_TYPE` | Type of database to use (`postgres` or `sqlite`). | `postgres` |

### **PostgreSQL Variables**
*Required if `DB_TYPE=postgres`*

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `DB_HOST` | Hostname of your database instance. | `localhost` |
| `DB_PORT` | Port of your database instance. | `5432` |
| `DB_USERNAME` | Username for database access. | `postgres` |
| `DB_PASSWORD` | Password for database access. | `postgres` |
| `DB_NAME` | Name of the database to connect to. | `hscore_wallet` |

### **Production Variables**

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Current environment mode. Set to `production` for live deployments. | `development` |

---

## 🎨 Frontend Configuration (`/frontend`)

The frontend uses a `.env.local` file for development and standard environment variables for production (e.g., in the Vercel dashboard).

### **Global Variables**

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | The full base URL of your running backend API. | `http://localhost:3001/api/v1/wallet` |

---

## 🛠️ Implementation Steps

### 1. Development (Local)
1.  Navigate to the `/backend` folder and create a file named `.env`. Copy the variables from above.
2.  Navigate to the `/frontend` folder and create a file named `.env.local`. Add the `NEXT_PUBLIC_API_URL`.
3.  **Pro Tip:** If using SQLite locally, you only need to set `DB_TYPE=sqlite` and `PORT=3001` in your backend `.env`.

### 2. Production (Cloud)
When deploying to platforms like **Render** (Backend) or **Vercel** (Frontend):
1.  Open the "Environment Variables" section of your service dashboard.
2.  Paste each key and value from your local configuration.
3.  **Critical:** Ensure `NEXT_PUBLIC_API_URL` on your frontend points to the **Live URL** of your deployed backend (e.g., `https://pocketfeel-api.onrender.com/api/v1/wallet`).

---

## ⚠️ Security Notes
- **Never** commit your `.env` or `.env.local` files to version control. They are already included in the `.gitignore`.
- In production, ensure `NODE_ENV=production` is set so that the backend automatically disables schema synchronization for data safety.
