'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import { getAllActivity, getAllWallets } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Home,
  Activity as ActivityIcon,
  CreditCard,
  Settings,
  Plus,
  Loader2,
  RefreshCcw,
  SlidersHorizontal,
  ArrowRight,
  Wallet,
  Check,
  X
} from 'lucide-react';
import { BottomSheet } from '@/components/BottomSheet';

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

const FixedHeader = styled.div`
  padding: 48px 20px 24px 20px;
  background: linear-gradient(to bottom, #0f172a 85%, rgba(15, 23, 42, 0));
  z-index: 10;
  flex-shrink: 0;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #94a3b8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterBtn = styled(motion.button)<{ $hasFilters: boolean }>`
  background: ${({ $hasFilters }) => $hasFilters ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $hasFilters }) => $hasFilters ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $hasFilters }) => $hasFilters ? '#3b82f6' : '#94a3b8'};
  padding: 10px 16px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
`;

const Badge = styled.span`
  background: #3b82f6;
  color: white;
  font-size: 0.65rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: -8px;
  right: -8px;
  border: 2px solid #0f172a;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 0 20px 120px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/* ── Bottom Sheet Content Styling ── */
const SheetHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const SheetTitle = styled.h2`
  color: white;
  font-size: 1.2rem;
  font-weight: 800;
  margin: 0;
`;

const ResetText = styled.button`
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const SectionLabel = styled.label`
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
`;

const PillGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Pill = styled.button<{ $active: boolean }>`
  background: ${({ $active }) => $active ? 'rgba(59, 130, 246, 0.15)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${({ $active }) => $active ? '#3b82f6' : 'rgba(255, 255, 255, 0.08)'};
  color: ${({ $active }) => $active ? '#3b82f6' : '#94a3b8'};
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.1);
  }
`;

const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.03);
  padding: 4px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const CustomDateInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  padding: 10px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;

  &::-webkit-calendar-picker-indicator {
    filter: invert(1);
    opacity: 0.5;
  }
`;

const ApplyBtn = styled(motion.button)`
  background: #3b82f6;
  color: white;
  border: none;
  width: 100%;
  padding: 16px;
  border-radius: 18px;
  font-weight: 800;
  font-size: 1rem;
  margin-top: 12px;
  cursor: pointer;
  box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.4);
`;

/* ── Transaction UI ── */
const LedgerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TransactionRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.03);
`;

const TransLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
`;

const TransIcon = styled.div<{ $type: string }>`
  background: ${({ $type }) => ($type === 'CREDIT' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

const TransMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const TransTitle = styled.span`
  font-weight: 700;
  color: #f1f5f9;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TransDesc = styled.p`
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 500;
  margin: 1px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TransSub = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.7rem;
  font-weight: 600;
`;

const WalletBadge = styled.span`
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 700;
`;

const TransAmount = styled.span<{ $type: string }>`
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
  flex-shrink: 0;
  margin-left: 12px;
`;

/* ── Footer ── */
const Footer = styled.nav`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 8px 12px 12px 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  z-index: 20;
`;

const FooterItem = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 12px;
  color: ${props => props.$active ? '#3b82f6' : '#475569'};
  transition: color 0.2s;

  &:hover {
    color: ${props => props.$active ? '#3b82f6' : '#94a3b8'};
  }
`;

const FooterLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.3px;
`;

const AddButton = styled(motion.button)`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #3b82f6;
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.45);
  cursor: pointer;
  margin-top: -20px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-bottom: 24px;
`;

const PageBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: #f1f5f9;
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.8rem;
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

export default function ActivityPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(0);
  const limit = 8;

  // Filters State
  const [type, setType] = useState('');
  const [category, setCategory] = useState('');
  const [walletId, setWalletId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('DESC');

  const handleReset = () => {
    setType('');
    setCategory('');
    setWalletId('');
    setStartDate('');
    setEndDate('');
    setSortBy('date');
    setSortOrder('DESC');
    setPage(0);
  };

  const { data: walletsData } = useQuery({
    queryKey: ['wallets'],
    queryFn: getAllWallets,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['all-activity', page, type, category, walletId, startDate, endDate, sortBy, sortOrder],
    queryFn: () => getAllActivity({
      limit,
      offset: page * limit,
      type,
      category,
      walletId,
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      sortBy,
      sortOrder
    }),
  });

  const transactions = data?.transactions || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const categories = ['Groceries', 'Bills', 'Dining', 'Entertainment', 'Travel Cost', 'Salary'];

  const activeFilterCount = [
    type, 
    category, 
    walletId, 
    startDate, 
    endDate,
    sortBy !== 'date' ? sortBy : '',
    sortOrder !== 'DESC' ? sortOrder : ''
  ].filter(Boolean).length;

  return (
    <Page>
      <FixedHeader>
        <HeaderRow>
          <PageTitle>Activity</PageTitle>
          <ActionRow>
            <FilterBtn 
              $hasFilters={activeFilterCount > 0}
              onClick={() => setIsFilterOpen(true)}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal size={18} />
              Filters
              {activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
            </FilterBtn>
          </ActionRow>
        </HeaderRow>
      </FixedHeader>

      <ScrollArea>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
            <Loader2 className="animate-spin" color="#3b82f6" size={32} />
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}>
            <p style={{ fontWeight: 600 }}>No activities found.</p>
            <p style={{ fontSize: '0.8rem', marginTop: '4px' }}>Try adjusting your filters.</p>
          </div>
        ) : (
          <LedgerBox>
            {transactions.map((tx: any, idx: number) => (
              <TransactionRow 
                key={tx.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => router.push(`/wallet/${tx.wallet_id}`)}
                whileTap={{ scale: 0.98 }}
                style={{ cursor: 'pointer' }}
              >
                <TransLeft>
                  <TransIcon $type={tx.type}>
                    {tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                  </TransIcon>
                  <TransMeta>
                    <TransTitle>
                      {tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Withdrawn'}
                    </TransTitle>
                    {tx.description && <TransDesc>{tx.description}</TransDesc>}
                    <TransSub>
                      <Calendar size={12} />
                      {new Date(tx.created_at).toLocaleDateString()}
                      <WalletBadge>{tx.wallet?.name || 'Wallet'}</WalletBadge>
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
              <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>
                {page + 1} of {totalPages || 1}
              </span>
              <PageBtn
                disabled={page >= totalPages - 1}
                onClick={() => setPage(p => p + 1)}
              >
                Next
              </PageBtn>
            </Pagination>
          </LedgerBox>
        )}
      </ScrollArea>

      <Footer>
        <FooterItem onClick={() => router.push('/')}>
          <Home size={20} />
          <FooterLabel>Home</FooterLabel>
        </FooterItem>

        <FooterItem $active>
          <ActivityIcon size={20} />
          <FooterLabel>Activity</FooterLabel>
        </FooterItem>

        <AddButton
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => router.push('/')}
        >
          <Plus size={28} strokeWidth={2.5} />
        </AddButton>

        <FooterItem onClick={() => router.push('/cards')}>
          <CreditCard size={20} />
          <FooterLabel>Cards</FooterLabel>
        </FooterItem>

        <FooterItem onClick={() => router.push('/settings')}>
          <Settings size={20} />
          <FooterLabel>Settings</FooterLabel>
        </FooterItem>
      </Footer>

      {/* ── Filter Bottom Sheet ── */}
      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <ResetText onClick={handleReset}>Clear All</ResetText>
        </SheetHeader>

        <FilterSection>
          <SectionLabel>Transaction Type</SectionLabel>
          <PillGroup>
            <Pill $active={type === ''} onClick={() => setType('')}>All</Pill>
            <Pill $active={type === 'CREDIT'} onClick={() => setType('CREDIT')}>Credit</Pill>
            <Pill $active={type === 'DEBIT'} onClick={() => setType('DEBIT')}>Debit</Pill>
          </PillGroup>
        </FilterSection>

        <FilterSection>
          <SectionLabel>Wallet</SectionLabel>
          <PillGroup>
            <Pill $active={walletId === ''} onClick={() => setWalletId('')}>All Wallets</Pill>
            {walletsData?.map((w: any) => (
              <Pill 
                key={w.id} 
                $active={walletId === w.id} 
                onClick={() => setWalletId(w.id)}
              >
                {w.name}
              </Pill>
            ))}
          </PillGroup>
        </FilterSection>

        <FilterSection>
          <SectionLabel>Category</SectionLabel>
          <PillGroup>
            <Pill $active={category === ''} onClick={() => setCategory('')}>All</Pill>
            {categories.map(cat => (
              <Pill 
                key={cat} 
                $active={category === cat} 
                onClick={() => setCategory(cat)}
              >
                {cat}
              </Pill>
            ))}
          </PillGroup>
        </FilterSection>

        <FilterSection>
          <SectionLabel>Sort By</SectionLabel>
          <PillGroup>
            <Pill $active={sortBy === 'date'} onClick={() => setSortBy('date')}>Date</Pill>
            <Pill $active={sortBy === 'amount'} onClick={() => setSortBy('amount')}>Amount</Pill>
          </PillGroup>
          <div style={{ height: '8px' }} />
          <PillGroup>
            <Pill $active={sortOrder === 'DESC'} onClick={() => setSortOrder('DESC')}>Newest / Highest First</Pill>
            <Pill $active={sortOrder === 'ASC'} onClick={() => setSortOrder('ASC')}>Oldest / Lowest First</Pill>
          </PillGroup>
        </FilterSection>

        <FilterSection>
          <SectionLabel>Date Range</SectionLabel>
          <DateRangeContainer>
            <CustomDateInput 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
            />
            <div style={{ color: '#475569' }}><ArrowRight size={14} /></div>
            <CustomDateInput 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
            />
          </DateRangeContainer>
        </FilterSection>

        <ApplyBtn 
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsFilterOpen(false)}
        >
          Apply Filters
        </ApplyBtn>
      </BottomSheet>
    </Page>
  );
}
