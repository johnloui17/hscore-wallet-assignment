'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import {
  User,
  Shield,
  Settings as SettingsIcon,
  CreditCard,
  ChevronRight,
  Bell,
  Fingerprint,
  Moon,
  IndianRupee,
  BarChart3,
  Download,
  Crown,
  LogOut,
  Home,
  Activity as ActivityIcon,
  Plus,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { logoutAction } from '@/app/actions';
import { motion } from 'framer-motion';
import { CreateWalletBottomSheet } from '@/components/CreateWalletBottomSheet';

/* ── SVG Logo Component (Shared) ── */
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
  padding: 48px 20px 120px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 1024px) {
    padding: 60px 80px 100px 80px;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    text-align: left;
    margin-bottom: 48px;
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

const SettingsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 1024px) {
    max-width: 800px;
  }
`;

const SettingsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionHeader = styled.h2`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 4px;
  padding-left: 8px;
`;

const GroupBox = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: 28px;
  overflow: hidden;
`;

const SettingItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.03);
  }

  @media (min-width: 1024px) {
    padding: 22px 28px;
  }
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconBox = styled.div<{ $color: string }>`
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  padding: 10px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemLabel = styled.span`
  color: #f1f5f9;
  font-weight: 700;
  font-size: 0.95rem;

  @media (min-width: 1024px) {
    font-size: 1.05rem;
  }
`;

const ItemSub = styled.span`
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 500;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
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

export default function SettingsPage() {
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setUserId(localStorage.getItem('pocketfeel_user_id'));
  }, []);

  const handleSignOut = async () => {
    await logoutAction();
    localStorage.removeItem('pocketfeel_user_id');
    router.push('/login');
    router.refresh();
  };

  const sections = [
    {
      title: 'Account & Security',
      items: [
        { icon: <User size={20} />, label: 'Profile Details', sub: `${userId || 'User'} • Platinum member`, color: '#3b82f6' },
        { icon: <Shield size={20} />, label: 'Privacy & Permissions', sub: 'Biometric unlock active', color: '#10b981' },
        { icon: <Fingerprint size={20} />, label: 'Face ID & Passcode', sub: 'Manage security keys', color: '#6366f1' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: <Moon size={20} />, label: 'Display Mode', sub: 'Automatic • Dark', color: '#f59e0b' },
        { icon: <IndianRupee size={20} />, label: 'Primary Currency', sub: 'INR (₹)', color: '#ec4899' },
        { icon: <Bell size={20} />, label: 'Notifications', sub: 'Transactions and alerts', color: '#06b6d4' },
      ]
    },
    {
      title: 'Data & Growth',
      items: [
        { icon: <BarChart3 size={20} />, label: 'Analytics Opt-in', sub: 'Usage insights enabled', color: '#8b5cf6' },
        { icon: <Download size={20} />, label: 'Export History', sub: 'CSV, PDF, JSON', color: '#10b981' },
        { icon: <Crown size={20} />, label: 'Subscription Plan', sub: 'Premium lifetime access', color: '#f59e0b' },
      ]
    }
  ];

  return (
    <Page>
      <Sidebar>
        <SidebarBrand>
          <VaultLogo size={32} />
          <BrandName>Pocket Feel</BrandName>
        </SidebarBrand>
        <SidebarNav>
          <SidebarItem onClick={() => router.push('/')}><Home size={20} />Home</SidebarItem>
          <SidebarItem onClick={() => router.push('/activity')}><ActivityIcon size={20} />Activity</SidebarItem>
          <SidebarItem onClick={() => router.push('/cards')}><CreditCard size={20} />Cards</SidebarItem>
          <SidebarItem $active><SettingsIcon size={20} />Settings</SidebarItem>
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
              <PageTitle>Settings</PageTitle>
              <DesktopOnly><p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500, marginTop: '8px' }}>Manage your global preferences and security.</p></DesktopOnly>
            </div>
            <DesktopStatus>
              <StatusItem><StatusLabel>Identity</StatusLabel><StatusValue><ShieldCheck size={14} />Verified</StatusValue></StatusItem>
              <StatusItem><StatusLabel>Updates</StatusLabel><StatusValue><RefreshCw size={14} />Up to date</StatusValue></StatusItem>
            </DesktopStatus>
          </HeaderRow>

          <SettingsGrid>
            {sections.map((section, idx) => (
              <SettingsSection key={idx}>
                <SectionHeader>{section.title}</SectionHeader>
                <GroupBox>
                  {section.items.map((item, i) => (
                    <SettingItem key={i} whileTap={{ background: 'rgba(255,255,255,0.05)' }}>
                      <ItemLeft>
                        <IconBox $color={item.color}>{item.icon}</IconBox>
                        <ItemInfo>
                          <ItemLabel>{item.label}</ItemLabel>
                          <ItemSub>{item.sub}</ItemSub>
                        </ItemInfo>
                      </ItemLeft>
                      <ItemRight><ChevronRight size={18} /></ItemRight>
                    </SettingItem>
                  ))}
                </GroupBox>
              </SettingsSection>
            ))}

            <SettingItem
              style={{ marginTop: '12px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.1)', cursor: 'pointer' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSignOut}
            >
              <ItemLeft>
                <IconBox $color="#ef4444"><LogOut size={20} /></IconBox>
                <ItemLabel style={{ color: '#ef4444' }}>Sign Out</ItemLabel>
              </ItemLeft>
            </SettingItem>
          </SettingsGrid>
        </ScrollArea>

        <MobileOnly>
          <Footer>
            <FooterItem onClick={() => router.push('/')}><Home size={20} /><FooterLabel>Home</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/activity')}><ActivityIcon size={20} /><FooterLabel>Activity</FooterLabel></FooterItem>
            <AddButton whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => router.push('/')}><Plus size={28} strokeWidth={2.5} /></AddButton>
            <FooterItem onClick={() => router.push('/cards')}><CreditCard size={20} /><FooterLabel>Cards</FooterLabel></FooterItem>
            <FooterItem $active><SettingsIcon size={20} /><FooterLabel>Settings</FooterLabel></FooterItem>
          </Footer>
        </MobileOnly>
      </MainContent>
      <CreateWalletBottomSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Page>
  );
}
