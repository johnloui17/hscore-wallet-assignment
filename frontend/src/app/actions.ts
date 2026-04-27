'use server';

import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { createWallet, deleteWallet, credit, debit } from '@/lib/api';

export async function loginAction(userId: string) {
  const cookieStore = await cookies();
  cookieStore.set('pocketfeel_user_id', userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  });
  return { success: true };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('pocketfeel_user_id');
  return { success: true };
}

export async function createWalletAction(name: string, initialBalance: number, userId?: string) {
  try {
    const result = await createWallet(name, initialBalance, userId);
    revalidateTag('wallets', 'default');
    revalidateTag('all-activity', 'default');
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create wallet';
    return { success: false, error: message };
  }
}

export async function deleteWalletAction(id: string) {
  try {
    await deleteWallet(id);
    revalidateTag('wallets', 'default');
    revalidateTag('all-activity', 'default');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete wallet';
    return { success: false, error: message };
  }
}

export async function creditAction(id: string, amount: number, category?: string, description?: string) {
  try {
    const result = await credit(id, amount, category, description);
    revalidateTag('wallets', 'default');
    revalidateTag('all-activity', 'default');
    // Also revalidate specific wallet balance and history if we tag them later
    revalidateTag(`balance-${id}`, 'default');
    revalidateTag(`history-${id}`, 'default');
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to credit wallet';
    return { success: false, error: message };
  }
}

export async function debitAction(id: string, amount: number, category?: string, description?: string) {
  try {
    const result = await debit(id, amount, category, description);
    revalidateTag('wallets', 'default');
    revalidateTag('all-activity', 'default');
    revalidateTag(`balance-${id}`, 'default');
    revalidateTag(`history-${id}`, 'default');
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to debit wallet';
    return { success: false, error: message };
  }
}
