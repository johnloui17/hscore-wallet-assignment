# 🚀 Pocket Feel — Performance Optimization Guide
> **Stack:** NestJS (Render Free) + PostgreSQL + Next.js (Vercel)  
> **Problem:** Wallet page feels slow on first load / navigation.

---

## 🔴 Root Cause #1 — Render Free Tier Cold Starts (Biggest Issue)

Render free-tier web services **spin down after 15 minutes of inactivity**. The first request after that wakes the server — this alone adds **10–30 seconds** of latency. This is the #1 reason your wallet page feels slow.

### Fix A — Keep-Alive Ping (Zero Code, Free)
Use an external cron service to ping your Render backend every 10 minutes so it never sleeps.

**Services (all free):**
- [cron-job.org](https://cron-job.org) — free cron pings
- [UptimeRobot](https://uptimerobot.com) — free 5-min interval monitoring
- [Freshping](https://www.freshping.io) — free monitoring

**Target URL to ping:** `https://your-render-app.onrender.com/` (the root health check endpoint)

Your backend already has a root `GET /` route via `AppController` — just ping that.

### Fix B — Add an Explicit Health Check Endpoint

```typescript
// backend/src/app.controller.ts
@Get('health')
health() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

---

## 🟠 Root Cause #2 — No Database Connection Pooling

**File:** `backend/src/app.module.ts`

Your `TypeOrmModule.forRoot()` config has **no connection pool settings**. On Render free-tier, every request may wait to acquire a DB connection.

### Fix — Add Pool Config

```typescript
// backend/src/app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  // ... existing config ...
  extra: {
    max: 5,          // max connections in pool (free DB usually caps at 5–25)
    min: 1,          // keep at least 1 alive
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 3000,
  },
  connectTimeoutMS: 3000,
})
```

> ⚠️ If you're using Render's free PostgreSQL or Neon/Supabase free tier, check their max connection limit first.

---

## 🟠 Root Cause #3 — `getAllWallets()` Loads ALL Transactions Then Slices in JS

**File:** `backend/src/wallet/wallet.service.ts` — Line 45–58

```typescript
// ❌ CURRENT — fetches ALL transactions from DB, then slices in JavaScript
return this.walletRepository.find({
  relations: ['transactions'],  // loads EVERY transaction for EVERY wallet
  ...
}).then(wallets => {
  return wallets.map(w => ({
    ...w,
    transactions: w.transactions.slice(0, 10)  // ← waste: already fetched everything
  }));
});
```

This is an **N+1 and over-fetch problem** — as transactions grow, this query gets dramatically slower.

### Fix — Remove the relation join from `getAllWallets()`

The home page only needs wallet name and balance — it doesn't need any transactions at all.

```typescript
// ✅ FIXED — only fetch what you actually need
async getAllWallets(): Promise<Wallet[]> {
  return this.walletRepository.find({
    select: ['id', 'name', 'balance', 'created_at'],
    order: { created_at: 'DESC' },
    // NO relations: ['transactions']
  });
}
```

This turns a potentially large join query into a simple, fast `SELECT id, name, balance, created_at FROM wallets ORDER BY created_at DESC`.

---

## 🟡 Root Cause #4 — `getAllTransactions` Has No Indexes on Filtered Columns

**File:** `backend/src/wallet/entities/transaction.entity.ts`

You already have a composite index on `[wallet_id, created_at]` ✅ — good.  
But the `getAllTransactions` endpoint also filters on `type` and `category`, which have no indexes.

### Fix — Add Targeted Indexes

```typescript
// backend/src/wallet/entities/transaction.entity.ts

@Entity('transactions')
@Index(['wallet_id', 'created_at'])   // ✅ already exists
@Index(['type'])                       // ← ADD THIS
@Index(['category'])                   // ← ADD THIS
export class Transaction {
  // ...
}
```

> Note: TypeORM will auto-create these indexes on next deploy since `synchronize: true` is on in dev. For production, write a migration.

---

## 🟡 Root Cause #5 — Balance Polling Every 5 Seconds (Frontend)

**File:** `frontend/src/app/wallet/[id]/page.tsx` — Line 607

```typescript
// ❌ Polling every 5 seconds — hammers the Render free server
const { data: balanceData } = useQuery({
  queryKey: ['balance', walletId],
  queryFn: () => getBalance(walletId),
  refetchInterval: 5000,  // ← this
});
```

This creates a continuous request loop. On a free-tier server that may be under load, these extra requests add up and slow everything down.

### Fix — Increase to 30s or Remove Auto-Poll

```typescript
// ✅ Option 1 — reduce polling frequency
refetchInterval: 30000,  // 30 seconds is plenty

// ✅ Option 2 — no polling, refetch only on mutation success (already done via invalidateQueries)
// Just remove the refetchInterval entirely
```

Since you already call `queryClient.invalidateQueries` after every credit/debit mutation, you don't need polling at all.

---

## 🟡 Root Cause #6 — No Caching on `getBalance` and `getAllWallets` API Calls

**File:** `frontend/src/lib/api.ts`

Your `getAllWallets` and `getHistory` have `next: { tags: [...] }` but **no `revalidate` duration** — so Next.js won't cache the responses at the edge.

### Fix — Add Revalidation

```typescript
// frontend/src/lib/api.ts

export async function getBalance(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    next: {
      tags: [`balance-${id}`],
      revalidate: 30,  // ← ADD: Vercel edge caches this for 30 seconds
    }
  });
  if (!res.ok) throw new Error('Failed to fetch balance');
  return res.json();
}

export async function getAllWallets() {
  const res = await fetch(BASE_URL, {
    next: {
      tags: ['wallets'],
      revalidate: 30,  // ← ADD: Vercel edge caches this for 30 seconds
    }
  });
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return res.json();
}
```

---

## ✅ Summary — Priority Order

| Priority | Fix | Effort | Impact |
|---|---|---|---|
| 🔴 **#1** | Set up UptimeRobot / cron-job.org to ping Render every 10 min | 5 min | Eliminates cold starts |
| 🟠 **#2** | Add DB connection pool config in `app.module.ts` | 5 min | Faster DB connections |
| 🟠 **#3** | Remove `relations: ['transactions']` from `getAllWallets()` | 5 min | Faster home page load |
| 🟡 **#4** | Remove `refetchInterval: 5000` from balance query | 2 min | Reduces server hammering |
| 🟡 **#5** | Add `revalidate: 30` to `getBalance` and `getAllWallets` fetch calls | 5 min | Vercel edge caching |
| 🟡 **#6** | Add `@Index(['type'])` and `@Index(['category'])` to `Transaction` entity | 5 min | Faster filtered queries |

---

## 💡 Free Tier Constraints — What You Can't Control

| Constraint | Impact |
|---|---|
| Render Free spins down after 15 min inactivity | Cold start 10–30s — only mitigated with keep-alive ping |
| Render Free has limited CPU/RAM | Shared compute — can't fix, just write efficient queries |
| Render Free PostgreSQL has max 25 connections | Keep pool `max` at 5 or less |
| Vercel Serverless has ~150ms overhead per cold function | Use `revalidate` caching to avoid hitting origin every time |

---

*Generated: 2026-04-27 | Project: Pocket Feel / hscore-wallet-assignment*
