const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1/wallet';

export async function createWallet(name: string, initialBalance: number = 0) {
  const res = await fetch(BASE_URL, { 
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, initialBalance })
  });
  if (!res.ok) throw new Error('Failed to create wallet');
  return res.json();
}

export async function getAllWallets() {
  const res = await fetch(BASE_URL, { next: { tags: ['wallets'] } });
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return res.json();
}

export async function deleteWallet(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete wallet');
}

export async function getBalance(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { next: { tags: [`balance-${id}`] } });
  if (!res.ok) throw new Error('Failed to fetch balance');
  return res.json();
}

export async function credit(id: string, amount: number, category?: string, description?: string) {
  const res = await fetch(`${BASE_URL}/${id}/credit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category, description }),
  });
  if (!res.ok) throw new Error('Failed to credit');
  return res.json();
}

export async function debit(id: string, amount: number, category?: string, description?: string) {
  const res = await fetch(`${BASE_URL}/${id}/debit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category, description }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to debit');
  return data;
}

export async function getHistory(id: string, limit: number = 10, offset: number = 0) {
  const res = await fetch(`${BASE_URL}/${id}/history?limit=${limit}&offset=${offset}`, { next: { tags: [`history-${id}`] } });
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}

export async function getAllActivity(params: Record<string, string | number | string[] | undefined>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (key === 'walletIds' && Array.isArray(value)) {
        if (value.length > 0) {
          query.append('walletId', value.join(','));
        }
      } else {
        query.append(key, value.toString());
      }
    }
  });
  
  const res = await fetch(`${BASE_URL}/transactions/all?${query.toString()}`, { next: { tags: ['all-activity'] } });
  if (!res.ok) throw new Error('Failed to fetch global activity');
  return res.json();
}
