'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home,
  Activity as ActivityIcon,
  CreditCard as CreditCardIcon,
  Settings,
  Plus,
  ShieldCheck,
  Zap,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { CreateWalletBottomSheet } from '@/components/CreateWalletBottomSheet';

/* ── SVG Logo Component (Shared) ── */
function WalletLogo({ size = 40 }: { size?: number }) {
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
      <circle cx="32" cy="34" r="14" stroke="white" strokeWidth="2" fill="none" />
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
      <circle cx="16" cy="22" r="1.5" fill="white" /><circle cx="48" cy="22" r="1.5" fill="white" />
      <circle cx="16" cy="46" r="1.5" fill="white" /><circle cx="48" cy="46" r="1.5" fill="white" />
    </svg>
  );
}

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

const HeaderRow = styled.div`
  padding: 48px 0 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    padding: 60px 0 48px 0;
  }
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

/* ── Card Designs ── */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 48px;
    max-width: 1200px;
  }
`;

const CardContainer = styled(motion.div) <{ $bg: string; $color: string }>`
  width: 100%;
  aspect-ratio: 1.586 / 1;
  background: ${props => props.$bg};
  border-radius: 24px;
  padding: 28px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: ${props => props.$color};
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);

  @media (min-width: 1024px) {
    padding: 40px;
    border-radius: 40px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index: 1;
`;

const CardBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BrandTitle = styled.div`
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  @media (min-width: 1024px) { font-size: 1.4rem; }
`;

const BrandSub = styled.div`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-transform: uppercase;
  opacity: 0.7;
`;

const Chip = styled.div`
  width: 50px;
  height: 38px;
  background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 1px 1px rgba(255,255,255,0.4);
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 8px;
  }
`;

const CardNumber = styled.div`
  font-size: 1.5rem;
  letter-spacing: 3px;
  font-family: 'Courier New', Courier, monospace;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
  font-weight: 600;
  @media (min-width: 1024px) { font-size: 2rem; }
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: 1;
`;

const HolderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Label = styled.span`
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 800;
  opacity: 0.6;
`;

const HolderName = styled.div`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const PremiumBadge = styled.div`
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  border: 1px solid currentColor;
  padding: 4px 10px;
  border-radius: 4px;
`;

const GeometricPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  opacity: 0.1;
  background-image: radial-gradient(circle at 2px 2px, #fff 1px, transparent 0);
  background-size: 32px 32px;
  pointer-events: none;
`;

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
`;

const FooterLabel = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
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

export default function CardsPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('pocketfeel_user_id'));
  }, []);

  return (
    <Page>
      <Sidebar>
        <SidebarBrand>
          <WalletLogo size={32} />
          <BrandName>Pocket Feel</BrandName>
        </SidebarBrand>
        <SidebarNav>
          <SidebarItem onClick={() => router.push('/')}><Home size={20} />Home</SidebarItem>
          <SidebarItem onClick={() => router.push('/activity')}><ActivityIcon size={20} />Activity</SidebarItem>
          <SidebarItem $active><CreditCardIcon size={20} />Cards</SidebarItem>
          <SidebarItem onClick={() => router.push('/settings')}><Settings size={20} />Settings</SidebarItem>
        </SidebarNav>
        <div style={{ marginTop: 'auto' }}>
          <AddButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsCreateOpen(true)}>
            <Plus size={20} strokeWidth={2.5} /><span>Create Wallet</span>
          </AddButton>
        </div>
      </Sidebar>

      <MainContent>
        <ScrollArea>
          <HeaderRow>
            <div>
              <PageTitle>Digital Assets</PageTitle>
              <DesktopOnly><p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px' }}>Manage your premium physical and virtual cards.</p></DesktopOnly>
            </div>
            <DesktopStatus>
              <StatusItem><StatusLabel>Security</StatusLabel><StatusValue><ShieldCheck size={14} />NFC Encrypted</StatusValue></StatusItem>
              <StatusItem><StatusLabel>Network</StatusLabel><StatusValue><RefreshCw size={14} />Cloud Sync</StatusValue></StatusItem>
            </DesktopStatus>
          </HeaderRow>

          <CardsGrid>
            {/* Elysian Black Card */}
            <CardContainer
              $bg="linear-gradient(145deg, #0f172a 0%, #020617 100%)"
              $color="#f8fafc"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <GeometricPattern style={{ opacity: 0.05 }} />
              <CardTop>
                <CardBrand>
                  <BrandTitle>ELYSIAN</BrandTitle>
                  <BrandSub>BLACK</BrandSub>
                </CardBrand>
                <Cpu size={32} strokeWidth={1.5} style={{ opacity: 0.6 }} />
              </CardTop>

              <div>
                <Chip />
                <div style={{ marginTop: '24px' }}>
                  <CardNumber>**** **** 4410</CardNumber>
                </div>
              </div>

              <CardBottom>
                <HolderInfo>
                  <Label>Valued Member</Label>
                  <HolderName>{userId || 'User'}</HolderName>
                </HolderInfo>
                <PremiumBadge>PRIME</PremiumBadge>
              </CardBottom>
            </CardContainer>

            {/* Obsidian Onyx Card */}
            <CardContainer
              $bg="linear-gradient(145deg, #1e293b 0%, #000000 100%)"
              $color="#94a3b8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <GeometricPattern style={{ opacity: 0.08, backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)' }} />
              <CardTop>
                <CardBrand>
                  <BrandTitle style={{ color: '#ffffff' }}>OBSIDIAN</BrandTitle>
                  <BrandSub style={{ color: '#3b82f6' }}>ONYX</BrandSub>
                </CardBrand>
                <Zap size={32} strokeWidth={1.5} style={{ color: '#3b82f6', opacity: 0.8 }} />
              </CardTop>

              <div>
                <Chip style={{ background: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)' }} />
                <div style={{ marginTop: '24px' }}>
                  <CardNumber style={{ color: '#ffffff' }}>**** **** 5592</CardNumber>
                </div>
              </div>

              <CardBottom>
                <HolderInfo>
                  <Label>Valid Thru</Label>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>10/29</div>
                </HolderInfo>
                <PremiumBadge style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>EXECUTIVE</PremiumBadge>
              </CardBottom>
            </CardContainer>
          </CardsGrid>

          <div style={{ textAlign: 'center', padding: '48px 0', color: '#475569', fontSize: '0.95rem' }}>
            <p>These card previews are exclusive to your account tier.</p>
            <p style={{ marginTop: '4px' }}>Digital activation is available in Settings.</p>
          </div>
        </ScrollArea>

        <MobileOnly>
          <Footer>
            <FooterItem onClick={() => router.push('/')}><Home size={20} /><FooterLabel>Home</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/activity')}><ActivityIcon size={20} /><FooterLabel>Activity</FooterLabel></FooterItem>
            <AddButton whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => router.push('/')}><Plus size={28} strokeWidth={2.5} /></AddButton>
            <FooterItem $active><CreditCardIcon size={20} /><FooterLabel>Cards</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/settings')}><Settings size={20} /><FooterLabel>Settings</FooterLabel></FooterItem>
          </Footer>
        </MobileOnly>
      </MainContent>
      <CreateWalletBottomSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Page>
  );
}
