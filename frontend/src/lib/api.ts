const BASE_URL = 'http://localhost:3001/api/v1/wallet';

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
  const res = await fetch(BASE_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch wallets');
  return res.json();
}

export async function deleteWallet(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete wallet');
}

export async function getBalance(id: string) {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch balance');
  return res.json();
}

export async function credit(id: string, amount: number, category?: string) {
  const res = await fetch(`${BASE_URL}/${id}/credit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category }),
  });
  if (!res.ok) throw new Error('Failed to credit');
  return res.json();
}

export async function debit(id: string, amount: number, category?: string) {
  const res = await fetch(`${BASE_URL}/${id}/debit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, category }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to debit');
  return data;
}

export async function getHistory(id: string, limit: number = 10, offset: number = 0) {
  const res = await fetch(`${BASE_URL}/${id}/history?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
}
