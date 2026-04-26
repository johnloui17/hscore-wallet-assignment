'use server';

import { revalidateTag } from 'next/cache';
import { createWallet, deleteWallet, credit, debit } from '@/lib/api';

export async function createWalletAction(name: string, initialBalance: number) {
  try {
    const result = await createWallet(name, initialBalance);
    revalidateTag('wallets', 'default');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create wallet' };
  }
}

export async function deleteWalletAction(id: string) {
  try {
    await deleteWallet(id);
    revalidateTag('wallets', 'default');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete wallet' };
  }
}

export async function creditAction(id: string, amount: number, category?: string) {
  try {
    const result = await credit(id, amount, category);
    revalidateTag('wallets', 'default');
    // Also revalidate specific wallet balance and history if we tag them later
    revalidateTag(`balance-${id}`, 'default');
    revalidateTag(`history-${id}`, 'default');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to credit wallet' };
  }
}

export async function debitAction(id: string, amount: number, category?: string) {
  try {
    const result = await debit(id, amount, category);
    revalidateTag('wallets', 'default');
    revalidateTag(`balance-${id}`, 'default');
    revalidateTag(`history-${id}`, 'default');
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to debit wallet' };
  }
}
