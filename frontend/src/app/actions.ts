'use server';

import { revalidateTag } from 'next/cache';
import { createWallet, deleteWallet, credit, debit } from '@/lib/api';

export async function createWalletAction(name: string, initialBalance: number) {
  try {
    const result = await createWallet(name, initialBalance);
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
