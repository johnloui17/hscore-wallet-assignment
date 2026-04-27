'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getAllActivity, getAllWallets } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader, VaultLogo } from '@/components/PageLoader';
import { 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Home,
  Activity as ActivityIcon,
  CreditCard,
  Settings,
  Plus,
  Loader2,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { BottomSheet } from '@/components/BottomSheet';
import { CreateWalletBottomSheet } from '@/components/CreateWalletBottomSheet';

interface WalletData {
  id: string;
  name: string;
}

interface TransactionData {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number | string;
  description?: string;
  created_at: string;
  wallet_id: string;
  wallet?: {
    name: string;
  };
}

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

  @media (min-width: 1024px) {
    max-width: 100%;
    flex-direction: row;
  }
`;

const Sidebar = styled.nav`
  display: none;
  
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 280px;
    background: #020617;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    padding: 48px 24px;
    gap: 32px;
    z-index: 100;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const BrandName = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 16px;
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#3b82f6' : '#94a3b8'};
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: white;
  }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
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

  @media (min-width: 1024px) {
    padding: 0 80px 100px 80px;
  }
`;

const FixedHeader = styled.div`
  padding: 48px 20px 24px 20px;
  background: linear-gradient(to bottom, #0f172a 85%, rgba(15, 23, 42, 0));
  z-index: 10;
  flex-shrink: 0;

  @media (min-width: 1024px) {
    padding: 60px 80px 32px 80px;
  }
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

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const DesktopStatus = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 24px;
  }
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const StatusLabel = styled.span`
  font-size: 0.6rem;
  color: #475569;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const StatusValue = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #f1f5f9;
  font-size: 0.85rem;
  font-weight: 700;

  svg {
    color: #10b981;
  }
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

  @media (min-width: 1024px) {
    padding: 12px 24px;
    font-size: 0.95rem;
    border-radius: 16px;
  }
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

/* ── Transaction UI ── */
const LedgerBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

const TransactionRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.4) 100%);
  border: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;

  @media (min-width: 1024px) {
    padding: 28px 32px;
    border-radius: 32px;
    
    &:hover {
      background: rgba(30, 41, 59, 0.6);
      border-color: rgba(255, 255, 255, 0.08);
      transform: scale(1.01);
    }
  }
`;

const TransLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;

  @media (min-width: 1024px) {
    gap: 24px;
  }
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

  @media (min-width: 1024px) {
    width: 56px;
    height: 56px;
    border-radius: 20px;
    svg { width: 24px; height: 24px; }
  }
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

  @media (min-width: 1024px) {
    font-size: 1.1rem;
  }
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

  @media (min-width: 1024px) {
    font-size: 1.4rem;
  }
`;

/* ── Navigation Components ── */
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

  @media (min-width: 1024px) {
    display: none;
  }
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

  @media (min-width: 1024px) {
    margin-top: 0;
    width: 100%;
    height: auto;
    padding: 16px;
    border-radius: 18px;
    font-size: 1rem;
    gap: 12px;
  }
`;

/* ── Filter Hub Styling ── */
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
`;

const DesktopOnly = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: block;
  }
`;

const MobileOnly = styled.div`
  display: block;
  @media (min-width: 1024px) {
    display: none;
  }
`;

export default function ActivityPage() {
  const router = useRouter();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
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
    setType(''); setCategory(''); setWalletId(''); setStartDate(''); setEndDate('');
    setSortBy('date'); setSortOrder('DESC'); setPage(0);
  };

  const { data: walletsData, isLoading: isWalletsLoading } = useQuery({ queryKey: ['wallets'], queryFn: getAllWallets });

  const { data, isLoading } = useQuery({
    queryKey: ['all-activity', page, type, category, walletId, startDate, endDate, sortBy, sortOrder],
    queryFn: () => getAllActivity({
      limit, offset: page * limit, type, category, walletId,
      startDate: startDate ? new Date(startDate).toISOString() : '',
      endDate: endDate ? new Date(endDate).toISOString() : '',
      sortBy, sortOrder
    }),
    placeholderData: keepPreviousData
  });

  const transactions = (data?.transactions as TransactionData[]) || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const categories = ['Groceries', 'Bills', 'Dining', 'Entertainment', 'Travel Cost', 'Salary'];
  const activeFilterCount = [type, category, walletId, startDate, endDate, sortBy !== 'date' ? sortBy : '', sortOrder !== 'DESC' ? sortOrder : ''].filter(Boolean).length;

  if (isWalletsLoading || (isLoading && transactions.length === 0)) {
    return <PageLoader />;
  }

  return (
    <Page>
      <Sidebar>
        <SidebarBrand>
          <VaultLogo size={32} />
          <BrandName>Pocket Feel</BrandName>
        </SidebarBrand>
        <SidebarNav>
          <SidebarItem onClick={() => router.push('/')}><Home size={20} />Home</SidebarItem>
          <SidebarItem $active><ActivityIcon size={20} />Activity</SidebarItem>
          <SidebarItem onClick={() => router.push('/cards')}><CreditCard size={20} />Cards</SidebarItem>
          <SidebarItem onClick={() => router.push('/settings')}><Settings size={20} />Settings</SidebarItem>
        </SidebarNav>
        <div style={{ marginTop: 'auto' }}>
          <AddButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsCreateOpen(true)}>
            <Plus size={20} strokeWidth={2.5} /><span>Create Wallet</span>
          </AddButton>
        </div>
      </Sidebar>

      <MainContent>
        <FixedHeader>
          <HeaderRow>
            <div>
              <PageTitle>Global Activity</PageTitle>
              <DesktopOnly><p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px' }}>Real-time audit log of all your vaults.</p></DesktopOnly>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
              <DesktopStatus>
                <StatusItem><StatusLabel>Security</StatusLabel><StatusValue><ShieldCheck size={14} />Encrypted</StatusValue></StatusItem>
                <StatusItem><StatusLabel>Network</StatusLabel><StatusValue><RefreshCw size={14} />Live Feed</StatusValue></StatusItem>
              </DesktopStatus>
              <FilterBtn $hasFilters={activeFilterCount > 0} onClick={() => setIsFilterOpen(true)} whileTap={{ scale: 0.95 }}>
                <SlidersHorizontal size={18} />Filters{activeFilterCount > 0 && <Badge>{activeFilterCount}</Badge>}
              </FilterBtn>
            </div>
          </HeaderRow>
        </FixedHeader>

        <ScrollArea>
          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 20px', color: '#64748b' }}><p style={{ fontWeight: 600 }}>No activities found.</p></div>
          ) : (
            <LedgerBox>
              {transactions.map((tx, idx) => (
                <TransactionRow key={tx.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => router.push(`/wallet/${tx.wallet_id}`)} whileTap={{ scale: 0.98 }}>
                  <TransLeft>
                    <TransIcon $type={tx.type}>{tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</TransIcon>
                    <TransMeta>
                      <TransTitle>{tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Withdrawn'}</TransTitle>
                      {tx.description && <TransDesc>{tx.description}</TransDesc>}
                      <TransSub><Calendar size={12} />{new Date(tx.created_at).toLocaleDateString()}<WalletBadge>{tx.wallet?.name || 'Wallet'}</WalletBadge></TransSub>
                    </TransMeta>
                  </TransLeft>
                  <TransAmount $type={tx.type}>{tx.type === 'CREDIT' ? '+' : '-'}{Number(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</TransAmount>
                </TransactionRow>
              ))}
              <Pagination>
                <PageBtn disabled={page === 0} onClick={() => setPage(p => p - 1)}>Previous</PageBtn>
                <span style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>{page + 1} of {totalPages || 1}</span>
                <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Next</PageBtn>
              </Pagination>
            </LedgerBox>
          )}
        </ScrollArea>

        <MobileOnly>
          <Footer>
            <FooterItem onClick={() => router.push('/')}><Home size={20} /><FooterLabel>Home</FooterLabel></FooterItem>
            <FooterItem $active><ActivityIcon size={20} /><FooterLabel>Activity</FooterLabel></FooterItem>
            <AddButton whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => router.push('/')}><Plus size={28} strokeWidth={2.5} /></AddButton>
            <FooterItem onClick={() => router.push('/cards')}><CreditCard size={20} /><FooterLabel>Cards</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/settings')}><Settings size={20} /><FooterLabel>Settings</FooterLabel></FooterItem>
          </Footer>
        </MobileOnly>
      </MainContent>

      <BottomSheet isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <SheetHeader><SheetTitle>Filters</SheetTitle><ResetText onClick={handleReset}>Clear All</ResetText></SheetHeader>
        <FilterSection><SectionLabel>Transaction Type</SectionLabel><PillGroup><Pill $active={type === ''} onClick={() => setType('')}>All</Pill><Pill $active={type === 'CREDIT'} onClick={() => setType('CREDIT')}>Credit</Pill><Pill $active={type === 'DEBIT'} onClick={() => setType('DEBIT')}>Debit</Pill></PillGroup></FilterSection>
        <FilterSection><SectionLabel>Wallet</SectionLabel><PillGroup><Pill $active={walletId === ''} onClick={() => setWalletId('')}>All Wallets</Pill>{walletsData?.map((w: WalletData) => (<Pill key={w.id} $active={walletId === w.id} onClick={() => setWalletId(w.id)}>{w.name}</Pill>))}</PillGroup></FilterSection>
        <FilterSection><SectionLabel>Category</SectionLabel><PillGroup><Pill $active={category === ''} onClick={() => setCategory('')}>All</Pill>{categories.map(cat => (<Pill key={cat} $active={category === cat} onClick={() => setCategory(cat)}>{cat}</Pill>))}</PillGroup></FilterSection>
        <FilterSection><SectionLabel>Sort By</SectionLabel><PillGroup><Pill $active={sortBy === 'date'} onClick={() => setSortBy('date')}>Date</Pill><Pill $active={sortBy === 'amount'} onClick={() => setSortBy('amount')}>Amount</Pill></PillGroup><div style={{ height: '8px' }} /><PillGroup><Pill $active={sortOrder === 'DESC'} onClick={() => setSortOrder('DESC')}>Newest / Highest First</Pill><Pill $active={sortOrder === 'ASC'} onClick={() => setSortOrder('ASC')}>Oldest / Lowest First</Pill></PillGroup></FilterSection>
        <FilterSection><SectionLabel>Date Range</SectionLabel><DateRangeContainer><CustomDateInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /><div style={{ color: '#475569' }}><ArrowRight size={14} /></div><CustomDateInput type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} /></DateRangeContainer></FilterSection>
        <ApplyBtn whileTap={{ scale: 0.98 }} onClick={() => setIsFilterOpen(false)}>Apply Filters</ApplyBtn>
      </BottomSheet>
      <CreateWalletBottomSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Page>
  );
}
