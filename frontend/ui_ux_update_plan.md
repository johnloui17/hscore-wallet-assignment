# Mobile-First Pocket Feel UI/UX Update Plan

This document outlines the proposed UI and UX improvements for the Pocket Feel project, pivoting to a **mobile-first design strategy** and ensuring **instantaneous data loading**. The goal is to create an experience that feels like a native iOS/Android application, utilizing bottom sheets, swipe gestures, thumb-friendly tap targets, full-screen flows, and aggressive data caching.

---

## 1. Performance & Data Caching (Next.js Native)

Since the application is built on the Next.js App Router, we will pivot from pure client-side fetching (React Query) to leveraging Next.js native server-side capabilities for maximum performance and zero layout shift:

- **React Server Components (RSC) for Initial Load**: Move the initial data fetching (e.g., getting the list of wallets or wallet details) to Server Components. This completely eliminates client-side loading spinners and delivers fully rendered HTML to the user instantly, heavily improving perceived performance.
- **Next.js Data Cache & Revalidation**: Utilize Next.js's extended `fetch` API. Data will be cached on the server using route or tag-based caching (`next: { tags: ['wallets'] }`). When a transaction occurs, we will use `revalidateTag('wallets')` or `revalidatePath` to instantly refresh the server cache.
- **Server Actions + `useOptimistic`**: Migrate our API mutation calls to Next.js Server Actions. To keep the snappy, native-app feel, we will pair Server Actions with React's `useOptimistic` hook. When a user credits or debits, the UI updates instantly; if the Server Action fails, the UI rolls back transparently.
- **Native Prefetching**: We will rely on Next.js `<Link>` components, which automatically prefetch the route data in the background when they enter the viewport. This ensures that navigating from the Dashboard to a Wallet Detail page feels instantaneous.

---

## 2. Dashboard (Home Page)

### Current Flow & State
- **Flow**: User lands on the dashboard -> Views a responsive desktop-style grid of wallet cards -> Clicks "Create Wallet" to open a standard modal.
- **UI**: Glassmorphism cards, grid layout that breaks to a single column on mobile, top-aligned action buttons.

### Proposed Mobile-First Flow & State
- **Flow**: User lands on dashboard -> Views a global "Total Assets" summary prominently at the top -> Swipes horizontally through a carousel of wallet cards -> Uses a fixed bottom-right Floating Action Button (FAB) or a sticky bottom action bar to create a new wallet.
- **UI Updates**:
  - **Global Summary**: Introduce a prominent, sticky "Total Net Worth" header at the top that sums up balances across all wallets.
  - **Wallet Carousel**: Instead of a vertical list or grid, present wallets as a horizontal snapping carousel of high-fidelity cards. This maximizes vertical screen real estate.
  - **Action Placement**: Move the "Create Wallet" action to a large FAB (Floating Action Button) anchored to the bottom right of the screen, or a persistent bottom action bar. This makes it easily reachable with the thumb.
  - **Empty State**: Interactive, full-width SVG illustration taking up the center of the screen, with an animated CTA button pushing the user to create their first wallet.

---

## 3. "Create Wallet" Flow

### Current Flow & State
- **Flow**: Click "Create Wallet" -> Standard centered modal overlay appears -> User enters Name and Initial Deposit -> Submits.
- **UI**: Standard dark modal, which often feels cramped on small screens and pushes the keyboard awkwardly.

### Proposed Mobile-First Flow & State
- **Flow**: Tap FAB -> A bottom sheet slides up (or a full-screen wizard opens) -> User completes a step-by-step setup (Name -> Icon -> Deposit) -> Submits.
- **UI Updates**:
  - **Full-Screen / Bottom Sheet**: Replace the centered modal with a sliding bottom sheet that takes up the lower 70% of the screen, or a full-screen wizard view. This prevents layout issues when the mobile keyboard opens.
  - **Step-by-Step Wizard**: Break the creation process into bite-sized steps (e.g., Step 1: Name, Step 2: Customization, Step 3: Deposit). This reduces cognitive load on small screens.
  - **Thumb-Friendly Inputs**: Use large input fields and a custom numeric keypad (instead of the native OS keyboard) for the deposit amount to ensure a consistent, premium feel.

---

## 4. Wallet Details Page

### Current Flow & State
- **Flow**: User clicks a wallet -> Sees Balance -> Sees an omnipresent Input field -> Clicks Credit/Debit -> Toggles "View Full History" to see past transactions.
- **UI**: Stacked desktop-style inputs, toggle buttons for history.

### Proposed Mobile-First Flow & State
- **Flow**: User taps a wallet -> Sees a massive balance header -> Bottom half of the screen is a scrollable transaction history -> Taps persistent bottom action buttons to transact.
- **UI Updates**:
  - **Sticky Bottom Actions**: Pin large `[ + Add Funds ]` and `[ - Withdraw ]` buttons to the bottom edge of the screen. They remain visible regardless of how far down the user scrolls through the history.
  - **Transaction Bottom Sheet**: Tapping Credit/Debit pulls up a quick-action bottom sheet. It features a large, custom numeric keypad and a horizontal scrollable row of categories.
  - **Seamless Ledger**: The history is not hidden. The lower section of the page is a dedicated, infinite-scrolling list of transactions.
  - **Swipe Actions**: Introduce swipe-to-delete or swipe-to-edit gestures on transaction rows (if applicable) or on the wallet card itself from the dashboard.

---

## Overall Design System & Aesthetic Goals

- **Thumb Zone Design**: All primary interactive elements (CTAs, navigation, inputs) must be placed in the lower third of the screen.
- **Typography**: Shift to a highly legible, modern geometric sans-serif (e.g., Inter or Outfit). Use large, bold font sizes for critical data (balances, amounts).
- **Haptic Feedback**: (If implemented as a PWA) Suggest subtle haptic feedback for critical actions like completing a transaction or swiping.
- **Animations**: Fluid, spring-based animations for bottom sheets sliding up, page transitions sliding left/right, and number tickers animating balance changes.
- **Colors**: Rich, deep background tones (e.g., `#0f172a`) contrasted with vibrant, glowing primary accents (e.g., electric blue, neon purple) for buttons and active states.
