# Page-by-Page UI/UX Implementation Plan

This document outlines the step-by-step execution phases to transform the `@frontend` repository into a high-performance, mobile-first Next.js application, organized strictly on a page-by-page basis.

## User Review Required
> [!IMPORTANT]
> The plan now includes strict **Design Review Gates**. After I complete a specific UI milestone, I will pause execution, present the design to you, and wait for your explicit approval before starting the next phase of work.

## Execution Phases

---

### Phase 1: The Portfolio Overview (Home Page)
**Goal:** Completely overhaul `src/app/page.tsx` and its associated data/actions.

1. **Data Layer (Home Page specific):**
   - Refactor `getAllWallets` and `createWallet` in `src/lib/api.ts` to utilize Next.js Server Actions and tag-based caching.
   - Remove `@tanstack/react-query` usage from the Home Page.

2. **UI Infrastructure (Home Page specific):**
   - Install `@use-gesture/react` and update global CSS for mobile constraints.
   - Build the base `<BottomSheet />` component.

3. **Page Construction:**
   - Convert `src/app/page.tsx` to a Server Component for instant data fetching.
   - Build the sticky "Total Portfolio Value" header.
   - Implement the `<WalletCarousel />` for swipeable wallet cards.
   - Implement the bottom-right FAB (Floating Action Button).
   - Build and attach the `<CreateWalletBottomSheet />` for smooth vault creation.

> [!CAUTION]
> **🛑 REVIEW GATE 1: Home Page Review**
> At this point, execution will pause. I will present the new Home Page and Create Vault flow to you. Once you approve the design and functionality, we will proceed to Phase 2.

---

### Phase 2: Wallet Details & The Ledger (Wallet Page)
**Goal:** Completely overhaul `src/app/wallet/[id]/page.tsx` and its associated data/actions.

1. **Data Layer (Wallet Page specific):**
   - Refactor `getBalance`, `getHistory`, `credit`, and `debit` to utilize Next.js Server Actions.
   - Remove `@tanstack/react-query` usage from the Wallet Details page.

2. **UI Infrastructure (Wallet Page specific):**
   - Build the `<CustomNumpad />` component.

3. **Page Construction:**
   - Convert `src/app/wallet/[id]/page.tsx` to a Server Component to fetch the initial balance and history instantly.
   - Redesign the layout: Top half displays the Balance Card, bottom half permanently displays the Ledger (no toggle buttons).
   - Implement the sticky action bar at the absolute bottom with `[ + Add Funds ]` and `[ - Withdraw ]` buttons.

4. **The Transaction Experience:**
   - Build the `<TransactionBottomSheet />` triggered by the sticky action bar, integrating the Numpad and category selector.
   - Implement React's `useOptimistic` hook to update the balance and ledger instantly *before* the server confirms the transaction.

> [!CAUTION]
> **🛑 REVIEW GATE 2: Wallet Details Review**
> Execution will pause again. I will present the Wallet Details layout, the transaction bottom sheet, and the optimistic ledger updates. Once approved, the project update is complete.

---

## Verification Plan

Upon completing all phases, we will verify:
- **Performance:** No client-side loading spinners visible on initial page loads for both the Home Page and Wallet Details Page.
- **Interactions:** Bottom sheets correctly dismiss on downward swipe; carousels snap securely.
- **UX:** `useOptimistic` accurately updates the ledger and rolls back safely if a simulated network error occurs.
