'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { getAllWallets, createWallet, deleteWallet } from '@/lib/api';
import { useRouter } from 'next/navigation';

const DashboardContainer = styled.main`
  width: 100%;
  max-width: 800px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Header = styled.h1`
  font-size: 2.2rem;
  margin: 0;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

const CreateBtn = styled.button`
  background: var(--primary);
  color: white;
  padding: 10px 24px;
  font-size: 1rem;
  border-radius: 12px;
  
  &:hover {
    background: var(--primary-hover);
    transform: translateY(-2px);
  }
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const WalletCard = styled.div`
  background: rgba(15, 23, 42, 0.4);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255,255,255,0.1);
  }
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WalletId = styled.span`
  color: #94a3b8;
  font-size: 0.85rem;
  font-family: monospace;
`;

const WalletBal = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
`;

const DeleteBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: var(--debit);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 10;

  &:hover {
    background: rgba(239, 68, 68, 0.2);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 32px;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
  margin: 0 0 8px 0;
  color: white;
  font-size: 1.5rem;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--card-border);
  border-radius: 10px;
  padding: 12px;
  color: white;
  font-size: 1rem;
  outline: none;
  &:focus { border-color: var(--primary); }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  background: transparent;
  color: #94a3b8;
  border: 1px solid rgba(255,255,255,0.1);
  &:hover { background: rgba(255,255,255,0.05); color: white; }
`;

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const { data: wallets = [] } = useQuery({
    queryKey: ['wallets'],
    queryFn: getAllWallets,
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, initialBalance }: { name: string, initialBalance: number }) => createWallet(name, initialBalance),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wallets'] }),
  });

  const handleCreateSubmit = () => {
    createMutation.mutate({ 
      name: newName.trim() || 'My Vault', 
      initialBalance: Number(newBalance.replace(/,/g, '')) || 0 
    });
    setIsModalOpen(false);
    setNewName('');
    setNewBalance('');
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue) {
      setNewBalance('');
      return;
    }
    
    if (rawValue.endsWith('.')) {
      setNewBalance(rawValue);
      return;
    }

    const parts = rawValue.split('.');
    let formatted = Number(parts[0]).toLocaleString('en-IN');
    if (parts.length > 1) {
      formatted += '.' + parts[1].substring(0, 2);
    }
    setNewBalance(formatted);
  };

  return (
    <>
    <DashboardContainer>
      <HeaderRow>
        <Header>Vault Dashboard</Header>
        <CreateBtn onClick={() => setIsModalOpen(true)}>+ Create Wallet</CreateBtn>
      </HeaderRow>

      <WalletList>
        {wallets.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center' }}>No wallets found. Create one above.</p>
        ) : (
          wallets.map((wallet: any) => (
            <WalletCard key={wallet.id} onClick={() => router.push(`/wallet/${wallet.id}`)}>
              <WalletInfo>
                <WalletId>{wallet.name || 'Unnamed Vault'}</WalletId>
                <WalletBal>
                  {Number(wallet.balance).toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                  })}
                </WalletBal>
              </WalletInfo>
              <DeleteBtn 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMutation.mutate(wallet.id);
                }}
              >
                Delete
              </DeleteBtn>
            </WalletCard>
          ))
        )}
      </WalletList>
    </DashboardContainer>

    {isModalOpen && (
      <ModalOverlay onClick={() => setIsModalOpen(false)}>
        <ModalContent onClick={e => e.stopPropagation()}>
          <ModalTitle>New Wallet Setup</ModalTitle>
          <Input 
            autoFocus
            placeholder="Wallet Name (e.g., Savings)" 
            value={newName} 
            onChange={e => setNewName(e.target.value)} 
          />
          <Input 
            type="text"
            placeholder="Initial Deposit Amount (₹)" 
            value={newBalance} 
            onChange={handleBalanceChange} 
          />
          <ModalActions>
            <CancelBtn onClick={() => setIsModalOpen(false)}>Cancel</CancelBtn>
            <CreateBtn onClick={handleCreateSubmit}>Confirm Setup</CreateBtn>
          </ModalActions>
        </ModalContent>
      </ModalOverlay>
    )}
    </>
  );
}
