'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, credit, debit, getHistory } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';

const MainContainer = styled.main`
  width: 100%;
  max-width: 600px;
  background: var(--card-bg);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--card-border);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  margin: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const BackBtn = styled.button`
  background: rgba(255,255,255,0.05);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  &:hover { background: rgba(255,255,255,0.1); color: white; }
`;

const Header = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(to right, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
`;

const BalanceCard = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const BalanceLabel = styled.p`
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
`;

const BalanceAmount = styled.h2`
  font-size: 3.5rem;
  margin: 0;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 0 20px rgba(255,255,255,0.1);
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 4px;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 30px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 140px;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--card-border);
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
  }
  
  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
`;

const ActionButton = styled.button<{ $type: 'credit' | 'debit' }>`
  background: ${({ $type }) => ($type === 'credit' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')};
  color: ${({ $type }) => ($type === 'credit' ? 'var(--credit)' : 'var(--debit)')};
  border: 1px solid ${({ $type }) => ($type === 'credit' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)')};
  border-radius: 12px;
  padding: 0 24px;
  font-size: 1.1rem;
  flex: 1;
  
  &:hover {
    background: ${({ $type }) => ($type === 'credit' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)')};
    transform: translateY(-2px);
  }
`;

const CategorySection = styled.div`
  margin-bottom: 30px;
  text-align: center;
`;

const CategoryText = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  margin-bottom: 12px;
`;

const IconRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const IconBtn = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.4)' : 'rgba(255, 255, 255, 0.05)')};
  border: 1px solid ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.8)' : 'rgba(255, 255, 255, 0.1)')};
  padding: 12px;
  border-radius: 50%;
  font-size: 1.5rem;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 0.2);
  }
  
  &:hover::after {
    content: attr(title);
    position: absolute;
    bottom: -35px;
    background: #0f172a;
    color: white;
    font-size: 0.8rem;
    padding: 6px 10px;
    border-radius: 6px;
    white-space: nowrap;
    border: 1px solid rgba(255,255,255,0.1);
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0,0,0,0.3);
  }
`;

const HistoryToggle = styled.button`
  background: rgba(255,255,255,0.05);
  color: #fff;
  border-radius: 12px;
  padding: 14px;
  width: 100%;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(255,255,255,0.1);

  &:hover {
    background: rgba(255,255,255,0.1);
  }
`;

const LedgerBox = styled.div`
  margin-top: 16px;
  border-top: 1px solid var(--card-border);
  padding-top: 16px;
`;

const TransactionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  margin-bottom: 8px;
`;

const TransInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TransDate = styled.span`
  color: #94a3b8;
  font-size: 0.85rem;
`;

const TransLabel = styled.span`
  font-weight: 500;
`;

const TransAmount = styled.span<{ $type: string }>`
  font-weight: 600;
  font-size: 1.1rem;
  color: ${({ $type }) => ($type === 'CREDIT' ? 'var(--credit)' : 'var(--debit)')};
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  margin-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const PageInfo = styled.span`
  color: #94a3b8;
  font-size: 0.9rem;
`;

const PageButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  padding: 8px 16px;
  font-size: 0.9rem;
  border-radius: 8px;
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
  }
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

export default function WalletDetails() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const walletId = params.id as string;
  const [amountInput, setAmountInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { icon: '🛒', name: 'Groceries' },
    { icon: '🧾', name: 'Bills' },
    { icon: '🍔', name: 'Dining' },
    { icon: '🎬', name: 'Entertainment' },
    { icon: '✈️', name: 'Travel Cost' },
    { icon: '💸', name: 'Salary' },
  ];

  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 4; // Requested specifically by user to paginate at 4 per page

  const { data: balanceData } = useQuery({
    queryKey: ['balance', walletId],
    queryFn: () => getBalance(walletId),
    refetchInterval: 5000,
  });

  const { data: historyData } = useQuery({
    queryKey: ['history', walletId, page],
    queryFn: () => getHistory(walletId, limit, page * limit),
    enabled: showHistory,
  });

  const creditMutation = useMutation({
    mutationFn: (amount: number) => credit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      setAmountInput('');
      setSelectedCategory(null);
    },
    onError: (err: any) => console.error("Credit Error: ", err.message)
  });

  const debitMutation = useMutation({
    mutationFn: (amount: number) => debit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      setAmountInput('');
      setSelectedCategory(null);
    },
    onError: (err: any) => console.error("Debit Error: ", err.message)
  });

  const currentBalance = balanceData?.balance || 0;
  const transactions = historyData?.transactions || [];
  const totalTransactions = historyData?.total || 0;
  const totalPages = Math.ceil(totalTransactions / limit);

  return (
    <MainContainer>
      <HeaderRow>
        <BackBtn onClick={() => router.push('/')}>Back to Dashboard</BackBtn>
        <Header>{balanceData?.name || 'Wallet Control'}</Header>
      </HeaderRow>

      <BalanceCard>
        <BalanceLabel>Current Balance</BalanceLabel>
        <BalanceAmount>
          {Number(currentBalance).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
          })}
        </BalanceAmount>
      </BalanceCard>

      {!showHistory && (
        <>
          <Controls>
            <Input
              type="number"
              placeholder="Amount"
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
            />
            <ActionButton $type="credit" onClick={() => creditMutation.mutate(Number(amountInput))}>
              Credit
            </ActionButton>
            <ActionButton $type="debit" onClick={() => debitMutation.mutate(Number(amountInput))}>
              Debit
            </ActionButton>
          </Controls>

          <CategorySection>
            <CategoryText>Optional: Select a Category for this Transaction</CategoryText>
            <IconRow>
              {categories.map((cat) => (
                <IconBtn 
                  key={cat.name} 
                  title={cat.name} 
                  $active={selectedCategory === cat.name}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                >
                  {cat.icon}
                </IconBtn>
              ))}
            </IconRow>
          </CategorySection>
        </>
      )}
      <HistoryToggle onClick={() => setShowHistory(!showHistory)}>
        {showHistory ? 'Hide Transaction History' : 'View Transaction History'}
      </HistoryToggle>

      {showHistory && (
        <LedgerBox>
          {transactions.length === 0 ? (
            <p style={{ color: '#94a3b8', textAlign: 'center', margin: '20px 0' }}>No transactions exist yet.</p>
          ) : (
            <>
              {transactions.map((tx: any) => (
                <TransactionRow key={tx.id}>
                  <TransInfo>
                    <TransLabel>{tx.type === 'CREDIT' ? 'Credit Operation' : 'Debit Operation'}</TransLabel>
                    <TransDate>{new Date(tx.created_at).toLocaleString()}</TransDate>
                    {tx.category && <span style={{ color: '#60a5fa', fontSize: '0.8rem', marginTop: '2px', fontWeight: 600 }}>{tx.category}</span>}
                  </TransInfo>
                  <TransAmount $type={tx.type}>
                    {tx.type === 'CREDIT' ? '+' : '-'}{Number(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                  </TransAmount>
                </TransactionRow>
              ))}

              <PaginationContainer>
                <PageButton
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}>
                  Previous
                </PageButton>
                <PageInfo>Page {page + 1} of {totalPages || 1}</PageInfo>
                <PageButton
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}>
                  Next
                </PageButton>
              </PaginationContainer>
            </>
          )}
        </LedgerBox>
      )}
    </MainContainer>
  );
}
