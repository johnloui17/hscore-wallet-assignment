'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getAllWallets } from '@/lib/api';
import { PageLoader, VaultLogo } from './PageLoader';
import {
  Home,
  Activity,
  Plus,
  CreditCard,
  Settings,
  User,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  LayoutGrid,
  Loader2
} from 'lucide-react';
import { CreateWalletBottomSheet } from './CreateWalletBottomSheet';
import { useRouter } from 'next/navigation';

interface TransactionShort {
  id: string;
  amount: number | string;
  type: 'CREDIT' | 'DEBIT';
  created_at: string;
}

interface WalletData {
  id: string;
  name: string;
  balance: number | string;
  created_at: string;
  transactions?: TransactionShort[];
}

interface PortfolioClientProps {
  // wallets prop removed as it's now handled by useQuery
}

/* ── Desktop Sparkline (Dynamic) ── */
function Sparkline({ transactions, currentBalance, color }: { transactions: TransactionShort[], currentBalance: number, color: string }) {
  const dataPoints: number[] = [currentBalance];
  let runningBalance = currentBalance;

  const sortedTx = [...(transactions || [])].sort((a, b) =>
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  for (const tx of sortedTx) {
    if (tx.type === 'CREDIT') {
      runningBalance -= Number(tx.amount);
    } else {
      runningBalance += Number(tx.amount);
    }
    dataPoints.unshift(runningBalance);
  }

  if (dataPoints.length < 2) {
    dataPoints.unshift(currentBalance);
  }

  const min = Math.min(...dataPoints);
  const max = Math.max(...dataPoints);
  const range = max - min || 1;

  const points = dataPoints.map((val, i) => ({
    x: (i / (dataPoints.length - 1)) * 100,
    y: 35 - ((val - min) / range) * 30
  }));

  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    const cp2x = curr.x + (next.x - curr.x) / 2;
    d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
  }

  return (
    <svg width="100%" height="40" viewBox="0 0 100 40" preserveAspectRatio="none" style={{ filter: 'drop-shadow(0 0 4px ' + color + '40)' }}>
      <motion.path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
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
  padding: 48px 20px 24px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 1024px) {
    padding: 60px 80px;
    gap: 32px;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    margin-bottom: 12px;
  }
`;

const LogoTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;

  @media (min-width: 1024px) {
    display: none;
  }
`;

const BrandName = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const DesktopStatus = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: flex;
    align-items: center;
    gap: 24px;
    padding-top: 8px;
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

const DesktopHero = styled.div`
  display: none;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 32px;
    width: 100%;
    margin-bottom: 16px;
  }
`;

const ChartContainer = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  overflow: hidden;
  cursor: help;
  justify-content: center;
  align-items: center;

  &::after {
    content: 'Insufficient historical data. Continuous usage for 7 days required for portfolio insights.';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 280px;
    transform: translate(-50%, -50%) scale(0.95);
    background: rgba(15, 23, 42, 0.98);
    backdrop-filter: blur(12px);
    color: white;
    padding: 20px 24px;
    border-radius: 24px;
    font-size: 0.85rem;
    line-height: 1.4;
    text-align: center;
    font-weight: 600;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 40px 80px rgba(0, 0, 0, 0.7);
    z-index: 50;
  }

  &:hover::after {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: absolute;
  top: 32px;
  left: 0;
  padding: 0 32px;
`;

const ChartTitle = styled.h3`
  font-size: 0.9rem;
  color: #94a3b8;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const EmptyChartIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  opacity: 0.15;
  margin-top: 20px;
`;

const SummaryCardContainer = styled.div`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 24px;
  padding: 28px 24px;
  margin-bottom: 32px;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;

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

  @media (min-width: 1024px) {
    margin-bottom: 0;
    border-radius: 32px;
    height: 100%;
  }
`;

const SummaryLabel = styled.div`
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 8px;
`;

const SummaryValue = styled.div`
  font-size: 2.2rem;
  color: #ffffff;
  font-weight: 800;
  margin-bottom: 20px;
  letter-spacing: -1px;
`;

const UserName = styled.div`
  font-size: 1rem;
  color: #ffffff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0.9;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;

  @media (min-width: 1024px) {
    font-size: 1.4rem;
  }
`;

const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;

  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
    gap: 32px;
  }
`;

const WalletInfoCard = styled(motion.div) <{ $accentColor: string }>`
  background: linear-gradient(145deg,
    rgba(30, 41, 59, 0.85) 0%,
    rgba(15, 23, 42, 0.95) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 160px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 20px;
    right: 20px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: ${props => props.$accentColor};
    opacity: 0.7;
  }

  @media (min-width: 1024px) {
    padding: 32px;
    border-radius: 32px;
    min-height: 200px;
    background: rgba(30, 41, 59, 0.3);
    
    &:hover {
      border-color: ${props => props.$accentColor}40;
      background: rgba(30, 41, 59, 0.5);
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    }
  }
`;

const CardLabel = styled.div`
  font-size: 0.65rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
  margin-bottom: 4px;
`;

const CardName = styled.h2`
  font-size: 1.25rem;
  color: #f1f5f9;
  margin: 0;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (min-width: 1024px) {
    font-size: 1.4rem;
  }
`;

const CardBalance = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  margin-top: 8px;

  @media (min-width: 1024px) {
    font-size: 2.2rem;
    margin-top: 12px;
  }
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.03);
`;

const PlanIndicator = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  color: ${props => props.$color};
  text-transform: uppercase;
  letter-spacing: 0.8px;

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => props.$color};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.08);

  @media (min-width: 1024px) {
    grid-column: span 2;
  }
`;

const Footer = styled.nav`
  width: 100%;
  padding: 8px 12px 12px 12px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;

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

  @media (min-width: 1024px) {
    margin-top: 0;
    width: 100%;
    height: auto;
    padding: 16px;
    border-radius: 18px;
    justify-content: center;
    gap: 12px;
    font-size: 1rem;
  }
`;

const ACCENT_COLORS = ['#3b82f6', '#94a3b8', '#f59e0b', '#10b981', '#6366f1'];

function getAccentColor(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

function getPlanName() {
  return 'Platinum Member';
}

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

export function PortfolioClient() {
  const { data: wallets = [], isLoading, isError } = useQuery({
    queryKey: ['wallets'],
    queryFn: getAllWallets,
  });

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const router = useRouter();
  const newestCardRef = useRef<HTMLDivElement>(null);
  const prevWalletsCount = useRef(wallets.length);

  const totalValue = wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize(); // Call it once to initialize correctly on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (wallets.length > prevWalletsCount.current) {
      if (isDesktop && newestCardRef.current) {
        setTimeout(() => {
          newestCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 500);
      }
    }
    prevWalletsCount.current = wallets.length;
  }, [wallets, isDesktop]);

  if (isLoading) {
    return (
      <PageLoader />
    );
  }

  if (isError) {
    return (
      <PageLoader />
    );
  }

  return (
    <Page>
      <Sidebar>
        <SidebarBrand>
          <VaultLogo size={32} />
          <BrandName>Pocket Feel</BrandName>
        </SidebarBrand>
        <SidebarNav>
          <SidebarItem onClick={() => router.push('/')} $active>
            <Home size={20} />
            Home
          </SidebarItem>
          <SidebarItem onClick={() => router.push('/activity')}>
            <Activity size={20} />
            Activity
          </SidebarItem>
          <SidebarItem onClick={() => router.push('/cards')}>
            <CreditCard size={20} />
            Cards
          </SidebarItem>
          <SidebarItem onClick={() => router.push('/settings')}>
            <Settings size={20} />
            Settings
          </SidebarItem>
        </SidebarNav>
        <div style={{ marginTop: 'auto' }}>
          <AddButton
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus size={20} strokeWidth={2.5} />
            <span>Create Wallet</span>
          </AddButton>
        </div>
      </Sidebar>

      <MainContent>
        <ScrollArea>
          <HeaderSection>
            <LogoTitleRow>
              <VaultLogo size={36} />
              <BrandName>Pocket Feel</BrandName>
            </LogoTitleRow>

            <DesktopOnly>
              <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginBottom: '8px' }}>Portfolio Overview</h1>
              <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>Global perspective on your assets.</p>
            </DesktopOnly>

            <DesktopStatus>
              <StatusItem>
                <StatusLabel>Account Status</StatusLabel>
                <StatusValue>
                  <ShieldCheck size={14} />
                  Platinum Member
                </StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Last Sync</StatusLabel>
                <StatusValue>
                  <RefreshCw size={14} />
                  System Live
                </StatusValue>
              </StatusItem>
              <StatusItem>
                <StatusLabel>Total Vaults</StatusLabel>
                <StatusValue>
                  <LayoutGrid size={14} />
                  {wallets.length} Active
                </StatusValue>
              </StatusItem>
            </DesktopStatus>
          </HeaderSection>

          <DesktopHero>
            <SummaryCardContainer>
              <SummaryLabel>Total Net Worth</SummaryLabel>
              <SummaryValue>
                {totalValue.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                })}
              </SummaryValue>
              <UserName>
                <User size={20} />
                Ronaldo KK
              </UserName>
            </SummaryCardContainer>

            <ChartContainer>
              <ChartHeader>
                <ChartTitle>Performance Insights</ChartTitle>
              </ChartHeader>
              <EmptyChartIcon>
                <TrendingUp size={64} />
                <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Analytics Pending
                </div>
              </EmptyChartIcon>
            </ChartContainer>
          </DesktopHero>

          <MobileOnly style={{ marginBottom: '32px' }}>
            <SummaryCardContainer>
              <SummaryLabel>Total Balance</SummaryLabel>
              <SummaryValue>
                {totalValue.toLocaleString('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  maximumFractionDigits: 0,
                })}
              </SummaryValue>
              <UserName>
                <User size={20} />
                Ronaldo KK
              </UserName>
            </SummaryCardContainer>
          </MobileOnly>

          <div>
            <SectionHeader>
              <SectionTitle>My Wallets</SectionTitle>
            </SectionHeader>

            {wallets.length === 0 ? (
              <EmptyState>
                <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.1rem' }}>No wallets yet</h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
                  Tap the + button to create your first wallet.
                </p>
              </EmptyState>
            ) : (
              <WalletList>
                {wallets.map((wallet, index) => (
                  <WalletInfoCard
                    key={wallet.id}
                    ref={index === 0 ? newestCardRef : null}
                    $accentColor={getAccentColor(index)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => router.push(`/wallet/${wallet.id}`)}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div>
                      <CardLabel>Account</CardLabel>
                      <CardName>{wallet.name || 'Unnamed'}</CardName>
                      <DesktopOnly style={{ marginTop: '16px' }}>
                        <Sparkline
                          transactions={wallet.transactions || []}
                          currentBalance={Number(wallet.balance)}
                          color={getAccentColor(index)}
                        />
                      </DesktopOnly>
                    </div>

                    <div>
                      <CardBalance>
                        {Number(wallet.balance).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        })}
                      </CardBalance>
                      <CardBottom>
                        <PlanIndicator $color={getAccentColor(index)}>
                          {getPlanName()}
                        </PlanIndicator>
                      </CardBottom>
                    </div>
                  </WalletInfoCard>
                ))}
              </WalletList>
            )}
          </div>
        </ScrollArea>

        <MobileOnly>
          <Footer>
            <FooterItem onClick={() => router.push('/')} $active>
              <Home size={20} />
              <FooterLabel>Home</FooterLabel>
            </FooterItem>
            <FooterItem onClick={() => router.push('/activity')}>
              <Activity size={20} />
              <FooterLabel>Activity</FooterLabel>
            </FooterItem>
            <AddButton
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsCreateOpen(true)}
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
        </MobileOnly>
      </MainContent>

      <CreateWalletBottomSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Page>
  );
}
