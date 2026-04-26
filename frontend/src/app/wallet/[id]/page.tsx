'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBalance, credit, debit, getHistory } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  TrendingDown, 
  ShoppingBag, 
  FileText, 
  Utensils, 
  Film, 
  Plane, 
  Briefcase, 
  Loader2, 
  Calendar, 
  Wallet, 
  History as HistoryIcon, 
  CheckCircle2, 
  X 
} from 'lucide-react';

import { toast } from 'sonner';

/* ── Styled Components ── */
const Page = styled.div`
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background-color: #0f172a;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 48px 20px 24px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
`;

const BackBtn = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 10px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const WalletTitle = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const BalanceCard = styled(motion.div)`
  text-align: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 32px 24px;
  border-radius: 28px;
  box-shadow: 0 15px 30px -10px rgba(37, 99, 235, 0.4);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 150px;
    height: 150px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
  }
`;

const BalanceLabel = styled.p`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 700;
`;

const BalanceAmount = styled.h2`
  font-size: 3.2rem;
  margin: 0;
  font-weight: 800;
  color: #fff;
  letter-spacing: -1px;

  @media (max-width: 400px) {
    font-size: 2.6rem;
  }
`;

/* ── Choice UI ── */
const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
`;

const ChoiceCard = styled(motion.button)<{ $variant?: 'ledger' | 'credit' | 'debit'; $fullWidth?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: ${({ $fullWidth }) => $fullWidth ? '20px 24px' : '24px 16px'};
  display: flex;
  flex-direction: ${({ $fullWidth }) => $fullWidth ? 'row' : 'column'};
  align-items: center;
  justify-content: center;
  gap: ${({ $fullWidth }) => $fullWidth ? '16px' : '12px'};
  cursor: pointer;
  color: #f1f5f9;
  transition: all 0.2s;
  grid-column: ${({ $fullWidth }) => $fullWidth ? 'span 2' : 'auto'};

  &:hover {
    background: rgba(30, 41, 59, 0.7);
    border-color: ${({ $variant }) => 
      $variant === 'credit' ? '#10b981' : 
      $variant === 'debit' ? '#ef4444' : '#3b82f6'};
  }

  svg {
    color: ${({ $variant }) => 
      $variant === 'credit' ? '#10b981' : 
      $variant === 'debit' ? '#ef4444' : '#3b82f6'};
    width: ${({ $fullWidth }) => $fullWidth ? '24px' : '32px'};
    height: ${({ $fullWidth }) => $fullWidth ? '24px' : '32px'};
  }
`;

const ChoiceTitle = styled.span`
  font-weight: 700;
  font-size: 0.95rem;
  text-align: center;
`;

/* ── Flow Containers ── */
const FlowContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

/* ── Amount Entry UI ── */
const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  font-size: 1.4rem;
  font-weight: 700;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 22px 20px 22px 48px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  outline: none;
  transition: all 0.2s ease;
  
  &:focus {
    border-color: #3b82f6;
    background: rgba(30, 41, 59, 0.8);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #475569;
  }
`;

const SubmitButton = styled(motion.button)<{ $type: 'credit' | 'debit' }>`
  width: 100%;
  padding: 20px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  border: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${({ $type }) => $type === 'credit' ? `
    background: #10b981;
    color: white;
    box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.4);
  ` : `
    background: #ef4444;
    color: white;
    box-shadow: 0 8px 20px -4px rgba(239, 68, 68, 0.4);
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const CategorySection = styled.div`
  margin-top: 12px;
`;

const CategoryLabel = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 16px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const IconRow = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
`;

const IconBtn = styled(motion.button)<{ $active: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)')};
  border: 1px solid ${({ $active }) => ($active ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)')};
  color: ${({ $active }) => ($active ? '#3b82f6' : '#64748b')};
  aspect-ratio: 1;
  border-radius: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    border-color: rgba(59, 130, 246, 0.3);
  }
`;

/* ── History UI ── */
const HistoryHeader = styled.div`
  margin-bottom: 16px;
  padding: 0 4px;
`;

const HistoryTitle = styled.h3`
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
`;

const LedgerBox = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 32px;
`;

const TransactionRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 24px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

const TransLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TransIcon = styled.div<{ $type: string }>`
  background: ${({ $type }) => ($type === 'CREDIT' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
  padding: 12px;
  border-radius: 14px;
`;

const TransMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TransTitle = styled.span`
  font-weight: 700;
  color: #f1f5f9;
  font-size: 1rem;
`;

const TransSub = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 600;
`;

const TransAmount = styled.span<{ $type: string }>`
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
`;

const PageBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
  border: none;
  padding: 12px 24px;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.25;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
  }
`;

/* ── Success Modal UI ── */
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(12px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 32px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: #94a3b8;
  padding: 8px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const SuccessIconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #10b981;
  margin-bottom: 24px;
`;

const SuccessMessage = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
`;

const SuccessSubMessage = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.5;
`;

export default function WalletDetails() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const walletId = params.id as string;
  
  const [viewMode, setViewMode] = useState<'choice' | 'amount' | 'history'>('choice');
  const [txType, setTxType] = useState<'credit' | 'debit' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const limit = 4;

  const [successModal, setSuccessModal] = useState<{ visible: boolean; message: string }>({ 
    visible: false, 
    message: '' 
  });

  const categories = [
    { icon: <ShoppingBag size={20} />, name: 'Groceries' },
    { icon: <FileText size={20} />, name: 'Bills' },
    { icon: <Utensils size={20} />, name: 'Dining' },
    { icon: <Film size={20} />, name: 'Entertainment' },
    { icon: <Plane size={20} />, name: 'Travel Cost' },
    { icon: <Briefcase size={20} />, name: 'Salary' },
  ];

  const { data: balanceData } = useQuery({
    queryKey: ['balance', walletId],
    queryFn: () => getBalance(walletId),
    refetchInterval: 5000,
  });

  const { data: historyData, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['history', walletId, page],
    queryFn: () => getHistory(walletId, limit, page * limit),
  });

  // Auto-close success modal after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (successModal.visible) {
      timer = setTimeout(() => {
        setSuccessModal({ visible: false, message: '' });
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [successModal.visible]);

  const creditMutation = useMutation({
    mutationFn: (amount: number) => credit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      setSuccessModal({ visible: true, message: `Successfully added ₹${Number(amountInput).toLocaleString('en-IN')}` });
      resetForm();
    },
    onError: () => toast.error("Failed to process credit")
  });

  const debitMutation = useMutation({
    mutationFn: (amount: number) => debit(walletId, amount, selectedCategory || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      setSuccessModal({ visible: true, message: `Successfully withdrawn ₹${Number(amountInput).toLocaleString('en-IN')}` });
      resetForm();
    },
    onError: (err: any) => toast.error(err.message || "Failed to process debit")
  });

  const resetForm = () => {
    setAmountInput('');
    setSelectedCategory(null);
    setTxType(null);
    setViewMode('choice');
  };

  const handleAction = () => {
    if (!amountInput || !txType) return;
    if (txType === 'credit') creditMutation.mutate(Number(amountInput));
    else debitMutation.mutate(Number(amountInput));
  };

  const handleBack = () => {
    if (viewMode === 'choice') {
      router.push('/');
    } else {
      setViewMode('choice');
    }
  };

  const getBackLabel = () => {
    if (viewMode === 'choice') return 'Dashboard';
    return 'Options';
  };

  const currentBalance = balanceData?.balance || 0;
  const transactions = historyData?.transactions || [];
  const totalTransactions = historyData?.total || 0;
  const totalPages = Math.ceil(totalTransactions / limit);

  const isPending = creditMutation.isPending || debitMutation.isPending;

  return (
    <Page>
      <ScrollArea>
        <HeaderRow>
          <BackBtn 
            whileHover={{ x: -4 }}
            onClick={handleBack}
          >
            <ChevronLeft size={18} />
            {getBackLabel()}
          </BackBtn>
          <WalletTitle>{balanceData?.name || 'Vault Details'}</WalletTitle>
        </HeaderRow>

        <BalanceCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BalanceLabel>Available Balance</BalanceLabel>
          <BalanceAmount>
            {Number(currentBalance).toLocaleString('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0
            })}
          </BalanceAmount>
        </BalanceCard>

        {isLoadingHistory ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" color="#3b82f6" size={32} />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {viewMode === 'choice' && (
              <motion.div
                key="choice"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <ChoiceGrid>
                  <ChoiceCard 
                    $fullWidth
                    $variant="ledger"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode('history')}
                  >
                    <HistoryIcon size={24} />
                    <ChoiceTitle>View Ledger</ChoiceTitle>
                  </ChoiceCard>
                  
                  <ChoiceCard 
                    $variant="credit"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTxType('credit');
                      setViewMode('amount');
                    }}
                  >
                    <ArrowUpCircle size={32} />
                    <ChoiceTitle>Credit Funds</ChoiceTitle>
                  </ChoiceCard>
                  
                  <ChoiceCard 
                    $variant="debit"
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setTxType('debit');
                      setViewMode('amount');
                    }}
                  >
                    <ArrowDownCircle size={32} />
                    <ChoiceTitle>Debit Funds</ChoiceTitle>
                  </ChoiceCard>
                </ChoiceGrid>
              </motion.div>
            )}

            {viewMode === 'amount' && txType && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <FlowContainer>
                  <Controls>
                    <InputWrapper>
                      <CurrencySymbol>₹</CurrencySymbol>
                      <Input
                        type="number"
                        placeholder="0.00"
                        autoFocus
                        value={amountInput}
                        onChange={(e) => setAmountInput(e.target.value)}
                      />
                    </InputWrapper>
                    
                    <SubmitButton 
                      $type={txType}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAction}
                      disabled={isPending || !amountInput}
                    >
                      {isPending ? <Loader2 className="animate-spin" size={20} /> : (
                        <>
                          <CheckCircle2 size={22} />
                          Confirm {txType}
                        </>
                      )}
                    </SubmitButton>
                  </Controls>

                  <CategorySection>
                    <CategoryLabel>Tag a Category</CategoryLabel>
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
                </FlowContainer>
              </motion.div>
            )}

            {viewMode === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <HistoryHeader>
                  <HistoryTitle>Ledger</HistoryTitle>
                </HistoryHeader>

                <LedgerBox>
                  {transactions.length === 0 ? (
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
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </ScrollArea>

      {/* ── Success Modal Overlay ── */}
      <AnimatePresence>
        {successModal.visible && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <CloseButton onClick={() => setSuccessModal({ visible: false, message: '' })}>
                <X size={20} />
              </CloseButton>

              <SuccessIconWrapper
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15, stiffness: 200 }}
              >
                <CheckCircle2 size={48} strokeWidth={2.5} />
              </SuccessIconWrapper>

              <SuccessMessage>Transaction Successful</SuccessMessage>
              <SuccessSubMessage>{successModal.message}</SuccessSubMessage>
              
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
                style={{
                  height: '4px',
                  background: '#10b981',
                  borderRadius: '2px',
                  marginTop: '24px',
                  opacity: 0.6
                }}
              />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </Page>
  );
}
