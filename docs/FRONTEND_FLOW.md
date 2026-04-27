# 🎨 Pocket Feel — Frontend Flow Explanation

This document provides a detailed walkthrough of the user journey and frontend architecture of the Pocket Feel application.

---

## 1. Authentication & Session Security
Pocket Feel uses a streamlined **Zero-Password User ID** session model. This ensures a fast onboarding experience while maintaining strict data isolation.

- **The Login Flow**:
  - When a user first visits the application, the `proxy.ts` (Next.js Middleware) checks for a `pocketfeel_user_id` cookie.
  - If missing, the user is redirected to `/login`.
  - Upon entering a User ID (e.g., "Ronaldo"), a **Server Action** (`loginAction`) sets a secure, `HttpOnly` cookie. This cookie is used by the middleware for subsequent request validation.
  - The ID is also stored in `localStorage` to enhance client-side UX and persistent UI states.

---

## 2. Dashboard (Home Page)
The Home Page serves as the command center for the user's financial portfolio.

- **Initial Hydration**: The `userId` is read on the server from the cookie and passed as a prop to the `PortfolioClient`. This eliminates "loading flashes" and provides an instant data-ready experience.
- **Portfolio Overview**: Uses **TanStack Query** to fetch all wallets associated with the User ID.
- **Wallet Carousel (Mobile)**: On smaller screens, wallets are presented as a high-fidelity, touch-responsive horizontal carousel.
- **Global Stats**: A sticky header displays the total net worth across all wallets, live-calculated as data synchronizes.
- **Wallet Creation**: A Floating Action Button (FAB) triggers a **Bottom Sheet** (on mobile) or a centered modal (on desktop), allowing users to create new wallets with initial deposits.

---

## 3. Wallet Details & Operations
Tapping on any wallet card navigates the user to a dedicated workspace for that specific vault.

- **Real-Time Balance**: The balance is fetched and cached via `useQuery`, updating instantly after any transaction.
- **Credit/Debit Flow**:
  - Users can initiate funds management through dedicated action cards.
  - The flow includes amount entry (with an Indian Rupee formatter), optional descriptions, and category tagging (e.g., Groceries, Dining, Salary).
  - **Success Handling**: A premium modal appears after every successful transaction, featuring a 5-second auto-close timer and a completion animation.
- **Safe Swipe Slider**: To prevent accidental data loss, deleting a wallet requires a deliberate **swipe-to-confirm** interaction on a draggable slider handle.

---

## 4. The Global Ledger (Activity)
The Activity page provides a comprehensive audit trail of the user's entire financial history.

- **Unified Feed**: Displays transactions from all wallets in a single, chronological list.
- **Advanced Filtering**: Users can filter the feed by transaction type (Credit/Debit), category, or specific wallet IDs.
- **Pagination**: Implements server-side pagination with "Next" and "Previous" controls to ensure high performance even with thousands of records.
- **Error Recovery**: If a network error occurs, users can trigger a `refetch()` without refreshing the entire page.

---

## 5. Settings & Sign Out
The Settings page manages user preferences and session termination.

- **Profile Mock**: Displays the current User ID and status.
- **Sign Out Flow**:
  - Triggers the `logoutAction` (Server Action) to clear the secure `HttpOnly` cookie.
  - Clears `localStorage` to reset the client state.
  - Redirects the user back to the `/login` screen.

---

## 🛠 Tech Stack Synergy
- **Next.js 15 (App Router)**: Orchestrates the overall page structure and routing.
- **TanStack Query**: Manages all server-state, caching, and background synchronization.
- **Styled Components**: Provides a unified, high-fidelity design system with responsive layouts.
- **Framer Motion**: Handles all complex interactions, including the swipe-to-delete slider and page transitions.
