'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, credit, debit, getHistory } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  History, 
  TrendingUp, 
  TrendingDown,
  ShoppingBag,
  FileText,
  Utensils,
  Film,
  Plane,
  Briefcase,
  Loader2,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

const MainContainer = styled(motion.main)`
  width: 100%;
  max-width: 700px;
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  margin: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40px;
`;

const BackBtn = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 10px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const Header = styled.h1`
  font-size: 2rem;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const BalanceCard = styled(motion.div)`
  text-align: center;
  margin-bottom: 48px;
  background: rgba(30, 41, 59, 0.3);
  padding: 32px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

const BalanceLabel = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
`;

const BalanceAmount = styled.h2`
  font-size: 4rem;
  margin: 0;
  font-weight: 800;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 8px;
  letter-spacing: -1px;
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 40px;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CurrencySymbol = styled.span`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid var(--card-border);
  border-radius: 16px;
  padding: 20px 20px 20px 40px;
  color: white;
  font-size: 1.25rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: var(--primary);
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 16px;
`;

const ActionButton = styled(motion.button)<{ $type: 'credit' | 'debit' }>`
  flex: 1;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: none;
  
  ${({ $type }) => $type === 'credit' ? `
    background: #10b981;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3);
  ` : `
    background: #ef4444;
    color: white;
    box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CategorySection = styled.div`
  margin-top: 8px;
`;

const CategoryLabel = styled.p`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-align: center;
`;

const IconRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
`;

const IconBtn = styled(motion.button)<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)')};
  border: 1px solid ${({ $active }) => ($active ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)')};
  color: ${({ $active }) => ($active ? 'var(--primary)' : '#94a3b8')};
  padding: 14px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: var(--primary);
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

const HistorySection = styled.div`
  margin-top: 32px;
`;

const HistoryToggle = styled(motion.button)`
  background: rgba(255, 255, 255, 0.03);
  color: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  width: 100%;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
  }
`;

const LedgerBox = styled(motion.div)`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
  background: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.02);
`;

const TransLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TransIcon = styled.div<{ $type: string }>`
  background: ${({ $type }) => ($type === 'CREDIT' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)')};
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
  padding: 10px;
  border-radius: 12px;
`;

const TransMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TransTitle = styled.span`
  font-weight: 600;
  color: white;
`;

const TransSub = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.8rem;
`;

const TransAmount = styled.span<{ $type: string }>`
  font-weight: 700;
  font-size: 1.15rem;
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 0 8px;
`;

const PageBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
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
    { icon: <ShoppingBag size={20} />, name: 'Groceries' },
    { icon: <FileText size={20} />, name: 'Bills' },
    { icon: <Utensils size={20} />, name: 'Dining' },
    { icon: <Film size={20} />, name: 'Entertainment' },
    { icon: <Plane size={20} />, name: 'Travel Cost' },
    { icon: <Briefcase size={20} />, name: 'Salary' },
  ];

  const [showHistory, setShowHistory] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 4;

  const { data: balanceData } = useQuery({
    queryKey: ['balance', walletId],
    queryFn: () => getBalance(walletId),
    refetchInterval: 5000,
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['history', walletId, page],
    queryFn: () => getHistory(walletId, limit, page * limit),
    enabled: showHistory,
  });

  const creditMutation = useMutation({
    mutationFn: (amount: number) => credit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      toast.success(`Successfully added ₹${amountInput}`);
      setAmountInput('');
      setSelectedCategory(null);
    },
    onError: () => toast.error("Failed to process credit")
  });

  const debitMutation = useMutation({
    mutationFn: (amount: number) => debit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      toast.success(`Successfully withdrawn ₹${amountInput}`);
      setAmountInput('');
      setSelectedCategory(null);
    },
    onError: (err: any) => toast.error(err.message || "Failed to process debit")
  });

  const currentBalance = balanceData?.balance || 0;
  const transactions = historyData?.transactions || [];
  const totalTransactions = historyData?.total || 0;
  const totalPages = Math.ceil(totalTransactions / limit);

  return (
    <MainContainer
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <HeaderRow>
        <BackBtn 
          whileHover={{ x: -4 }}
          onClick={() => router.push('/')}
        >
          <ChevronLeft size={18} />
          Dashboard
        </BackBtn>
        <Header>{balanceData?.name || 'Vault Details'}</Header>
      </HeaderRow>

      <BalanceCard layout>
        <BalanceLabel>Available Balance</BalanceLabel>
        <BalanceAmount>
          {Number(currentBalance).toLocaleString('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
          })}
        </BalanceAmount>
      </BalanceCard>

      {!showHistory && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <Controls>
            <InputWrapper>
              <CurrencySymbol>₹</CurrencySymbol>
              <Input
                type="number"
                placeholder="0.00"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
              />
            </InputWrapper>
            
            <ActionRow>
              <ActionButton 
                $type="credit" 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => creditMutation.mutate(Number(amountInput))}
                disabled={creditMutation.isPending || !amountInput}
              >
                {creditMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ArrowUpCircle size={22} />
                    Credit
                  </>
                )}
              </ActionButton>
              <ActionButton 
                $type="debit" 
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => debitMutation.mutate(Number(amountInput))}
                disabled={debitMutation.isPending || !amountInput}
              >
                {debitMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <ArrowDownCircle size={22} />
                    Debit
                  </>
                )}
              </ActionButton>
            </ActionRow>
          </Controls>

          <CategorySection>
            <CategoryLabel>Tag a Category (Optional)</CategoryLabel>
            <IconRow>
              {categories.map((cat) => (
                <IconBtn 
                  key={cat.name} 
                  $active={selectedCategory === cat.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
                  title={cat.name}
                >
                  {cat.icon}
                </IconBtn>
              ))}
            </IconRow>
          </CategorySection>
        </motion.div>
      )}

      <HistorySection>
        <HistoryToggle 
          whileTap={{ scale: 0.99 }}
          onClick={() => setShowHistory(!showHistory)}
        >
          <History size={18} />
          {showHistory ? 'Back to Actions' : 'View Full History'}
        </HistoryToggle>

        <AnimatePresence mode="wait">
          {showHistory && (
            <LedgerBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {isLoadingHistory ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <Loader2 className="animate-spin" color="#3b82f6" size={32} />
                </div>
              ) : transactions.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', margin: '40px 0' }}>No transactions recorded yet.</p>
              ) : (
                <>
                  {transactions.map((tx: any, idx: number) => (
                    <TransactionRow 
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <TransLeft>
                        <TransIcon $type={tx.type}>
                          {tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                        </TransIcon>
                        <TransMeta>
                          <TransTitle>{tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Withdrawn'}</TransTitle>
                          <TransSub>
                            <Calendar size={12} />
                            {new Date(tx.created_at).toLocaleDateString()} • {tx.category || 'General'}
                          </TransSub>
                        </TransMeta>
                      </TransLeft>
                      <TransAmount $type={tx.type}>
                        {tx.type === 'CREDIT' ? '+' : '-'}{Number(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}
                      </TransAmount>
                    </TransactionRow>
                  ))}

                  <Pagination>
                    <PageBtn
                      disabled={page === 0}
                      onClick={() => setPage(p => p - 1)}
                    >
                      Previous
                    </PageBtn>
                    <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>
                      {page + 1} / {totalPages}
                    </span>
                    <PageBtn
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next
                    </PageBtn>
                  </Pagination>
                </>
              )}
            </LedgerBox>
          )}
        </AnimatePresence>
      </HistorySection>
    </MainContainer>
  );
}
