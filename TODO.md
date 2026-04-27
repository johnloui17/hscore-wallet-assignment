# Final Submission Checklist (hScore Assignment)

This checklist tracks the requirements specified in the hScore Advisors LLC assignment email.

## ✅ Completed Requirements

### Backend Requirements (Node.js/NestJS)
- [x] **Create Wallet:** Endpoint `POST /api/v1/wallet` implemented.
- [x] **Credit Amount:** Endpoint `POST /api/v1/wallet/:id/credit` implemented.
- [x] **Debit Amount:** Endpoint `POST /api/v1/wallet/:id/debit` implemented.
- [x] **Fetch Wallet Details:** Endpoint `GET /api/v1/wallet/:id` implemented.
- [x] **Paginated History:** Endpoint `GET /api/v1/wallet/:id/history` with `limit`/`offset` implemented.
- [x] **Database:** PostgreSQL (with SQLite development fallback).
- [x] **Authentication:** No auth required on API layer; querying uses `walletId` (and `userId` for scoping).

### Frontend Requirements (Next.js)
- [x] **Create Wallet:** User can create multiple vaults with initial deposits.
- [x] **View Details:** Real-time balance and transaction summaries.
- [x] **Credit/Debit:** Dedicated flows for managing funds.
- [x] **Paginated History:** Clean ledger view with pagination support.
- [x] **Persistence:** User session is preserved via User ID (cookies/localStorage) until logout.

### Documentation Requirements
- [x] **README:** Proper instructions for local setup.
- [x] **API Documentation:** Detailed `API.md` created.
- [x] **Frontend Flow:** Explained in `README.md`.
- [x] **Environment Variables:** Documented for both services.
- [x] **Database Setup:** Instructions for Docker/PostgreSQL and SQLite fallback.

---

## 🚧 Pending Tasks (TODO)

### 1. Repository & Access
- [ ] Invite **`hscore-webmaster`** as a contributor to this private GitHub repository.

### 2. Deployment
- [ ] Deploy the Backend API (Render, Railway, or Fly.io).
- [ ] Deploy the Frontend (Vercel, Netlify).
- [ ] Gather the live links for submission.

### 3. Final Submission
- [ ] Share the GitHub link, live frontend link, and live backend link with the recruiter before **27th, 10:00 PM**.
