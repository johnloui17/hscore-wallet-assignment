'use client';

import { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Activity, Plus, CreditCard, Settings, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { CreateWalletBottomSheet } from './CreateWalletBottomSheet';
import { useRouter } from 'next/navigation';

/* ── SVG Logo Component ── */
function VaultLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M32 4L8 16V32C8 47.464 18.536 58.536 32 60C45.464 58.536 56 47.464 56 32V16L32 4Z"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
      />
      <circle
        cx="32"
        cy="34"
        r="14"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <line x1="32" y1="24" x2="32" y2="44" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="34" x2="42" y2="34" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="32" cy="34" r="3" stroke="white" strokeWidth="1.5" fill="none" />
      <path
        d="M28 16V13C28 10.791 29.791 9 32 9C34.209 9 36 10.791 36 13V16"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="16" cy="22" r="1.5" fill="white" />
      <circle cx="48" cy="22" r="1.5" fill="white" />
      <circle cx="16" cy="46" r="1.5" fill="white" />
      <circle cx="48" cy="46" r="1.5" fill="white" />
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

/* ── Header (Centered) ── */
const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 24px;
`;

const LogoTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 24px;
`;

const BrandName = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

/* ── Summary Card ── */
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
  margin-bottom: 20px;
  padding: 0 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  color: #ffffff;
  font-weight: 700;
  margin: 0;
`;

/* ── Wallet Card ── */
const WalletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-bottom: 40px;
`;

const WalletInfoCard = styled(motion.div)<{ $accentColor: string }>`
  background: linear-gradient(145deg,
    rgba(30, 41, 59, 0.85) 0%,
    rgba(15, 23, 42, 0.95) 100%
  );
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 24px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 24px;
    right: 24px;
    height: 3px;
    border-radius: 0 0 3px 3px;
    background: ${props => props.$accentColor};
    opacity: 0.7;
  }
`;

const CardContentRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const LeftCol = styled.div`
  flex: 1;
  min-width: 0;
`;

const RightCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  text-align: right;
  gap: 12px;
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
  margin: 0 0 16px 0;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubscriptionBadge = styled.div<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  background: ${props => props.$color}18;
  color: ${props => props.$color};
  border: 1px solid ${props => props.$color}30;
`;

const BalanceSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const CardBalanceLabel = styled.div`
  font-size: 0.65rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  font-weight: 700;
`;

const CardBalance = styled.div`
  font-size: 1.8rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
  margin-top: 2px;
`;

const ExpiryContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const ExpiryLabel = styled.span`
  font-size: 0.6rem;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-weight: 700;
`;

const ExpiryValue = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  font-weight: 600;
`;

/* ── Empty State ── */
const EmptyState = styled.div`
  text-align: center;
  padding: 48px 20px;
  background: rgba(30, 41, 59, 0.3);
  border-radius: 24px;
  border: 1px dashed rgba(255, 255, 255, 0.08);
`;

/* ── Footer ── */
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

/* ── Helpers ── */
const ACCENT_COLORS = ['#3b82f6', '#94a3b8', '#f59e0b', '#10b981', '#6366f1'];
const PLAN_NAMES = ['Starter', 'Silver', 'Gold', 'Platinum', 'Black Edition'];

function getAccentColor(index: number) {
  return ACCENT_COLORS[index % ACCENT_COLORS.length];
}

function getPlanName(index: number) {
  return PLAN_NAMES[index % PLAN_NAMES.length];
}

function getExpiryDate(createdAt?: string) {
  const base = createdAt ? new Date(createdAt) : new Date();
  const expiry = new Date(base);
  expiry.setFullYear(expiry.getFullYear() + 1);
  return expiry.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* ── Main Component ── */
interface PortfolioClientProps {
  wallets: any[];
}

export function PortfolioClient({ wallets }: PortfolioClientProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const router = useRouter();

  const totalValue = wallets.reduce((sum, w) => sum + Number(w.balance || 0), 0);

  return (
    <Page>
      <ScrollArea>
        {/* ── Header ── */}
        <HeaderSection>
          <LogoTitleRow>
            <VaultLogo size={36} />
            <BrandName>Pocket Feel</BrandName>
          </LogoTitleRow>
        </HeaderSection>

        {/* ── Section 1: Summary Card ── */}
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
            John Doe
          </UserName>
        </SummaryCardContainer>

        {/* ── Section 2: Wallets List ── */}
        <SectionHeader>
          <SectionTitle>Wallets</SectionTitle>
        </SectionHeader>

        {wallets.length === 0 ? (
          <EmptyState>
            <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.1rem' }}>No wallets yet</h3>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
              Tap the + button below to create your first wallet.
            </p>
          </EmptyState>
        ) : (
          <WalletList>
            {wallets.map((wallet, index) => (
              <WalletInfoCard
                key={wallet.id}
                $accentColor={getAccentColor(index)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(`/wallet/${wallet.id}`)}
                whileTap={{ scale: 0.98 }}
              >
                <CardContentRow>
                  <LeftCol>
                    <CardLabel>Account Name</CardLabel>
                    <CardName>{wallet.name || 'Unnamed Wallet'}</CardName>

                    <BalanceSection>
                      <CardBalanceLabel>Balance</CardBalanceLabel>
                      <CardBalance>
                        {Number(wallet.balance).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0,
                        })}
                      </CardBalance>
                    </BalanceSection>
                  </LeftCol>

                  <RightCol>
                    <SubscriptionBadge $color={getAccentColor(index)}>
                      ● {getPlanName(index)} Plan
                    </SubscriptionBadge>

                    <ExpiryContainer>
                      <ExpiryLabel>Plan Expires</ExpiryLabel>
                      <ExpiryValue>{getExpiryDate(wallet.createdAt)}</ExpiryValue>
                    </ExpiryContainer>
                  </RightCol>
                </CardContentRow>
              </WalletInfoCard>
            ))}
          </WalletList>
        )}
      </ScrollArea>

      {/* ── Footer Navigation ── */}
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

      <CreateWalletBottomSheet
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </Page>
  );
}
