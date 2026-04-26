'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  User, 
  Shield, 
  Settings as SettingsIcon, 
  CreditCard, 
  ChevronRight, 
  Bell, 
  Lock, 
  Fingerprint, 
  Globe, 
  Moon, 
  IndianRupee, 
  BarChart3, 
  Download, 
  Crown, 
  LogOut,
  Home,
  Activity as ActivityIcon,
  Plus
} from 'lucide-react';

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
  padding: 48px 20px 10px 20px;
  background-color: #0f172a;
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

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 10px 20px 120px 20px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/* ── Grouped List Components ── */
const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionLabel = styled.h2`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  margin-left: 4px;
`;

const List = styled.div`
  background: rgba(30, 41, 59, 0.4);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  overflow: hidden;
`;

const ListItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);

  &:last-child {
    border-bottom: none;
  }
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const IconWrapper = styled.div<{ $color: string }>`
  background: ${props => props.$color}15;
  color: ${props => props.$color};
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemTitle = styled.span`
  color: #f1f5f9;
  font-size: 0.95rem;
  font-weight: 600;
`;

const ItemValue = styled.span`
  color: #64748b;
  font-size: 0.8rem;
  font-weight: 500;
`;

const ItemRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
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

export default function SettingsPage() {
  const router = useRouter();

  return (
    <Page>
      <FixedHeader>
        <HeaderRow>
          <PageTitle>Settings</PageTitle>
        </HeaderRow>
      </FixedHeader>

      <ScrollArea>
        {/* Account Section */}
        <Section>
          <SectionLabel>Account</SectionLabel>
          <List>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#60a5fa">
                  <User size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Edit Profile</ItemTitle>
                  <ItemValue>John Doe</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#f472b6">
                  <Bell size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Notifications</ItemTitle>
                  <ItemValue>Email, Push, SMS</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
          </List>
        </Section>

        {/* Security Section */}
        <Section>
          <SectionLabel>Security</SectionLabel>
          <List>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#10b981">
                  <Fingerprint size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Biometric Lock</ItemTitle>
                  <ItemValue>Enabled</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#f59e0b">
                  <Shield size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>2-Step Verification</ItemTitle>
                  <ItemValue>Active</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
          </List>
        </Section>

        {/* Preference Section */}
        <Section>
          <SectionLabel>Preference</SectionLabel>
          <List>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#3b82f6">
                  <IndianRupee size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Primary Currency</ItemTitle>
                  <ItemValue>INR (₹)</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#8b5cf6">
                  <Moon size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Theme</ItemTitle>
                  <ItemValue>Dark Mode</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
          </List>
        </Section>

        {/* Financial Section */}
        <Section>
          <SectionLabel>Financial</SectionLabel>
          <List>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#ec4899">
                  <BarChart3 size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Spending Limit</ItemTitle>
                  <ItemValue>₹1,00,000 / month</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#6366f1">
                  <Download size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Export Data</ItemTitle>
                  <ItemValue>CSV, PDF, Excel</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight><ChevronRight size={18} /></ItemRight>
            </ListItem>
          </List>
        </Section>

        {/* Membership Section */}
        <Section>
          <SectionLabel>Membership</SectionLabel>
          <List>
            <ListItem whileTap={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
              <ItemLeft>
                <IconWrapper $color="#fbbf24">
                  <Crown size={20} />
                </IconWrapper>
                <ItemInfo>
                  <ItemTitle>Current Tier</ItemTitle>
                  <ItemValue>Elysian Black (Prime)</ItemValue>
                </ItemInfo>
              </ItemLeft>
              <ItemRight>
                <span style={{ color: '#fbbf24', fontSize: '0.75rem', fontWeight: 800 }}>ACTIVE</span>
                <ChevronRight size={18} />
              </ItemRight>
            </ListItem>
          </List>
        </Section>

        <ListItem 
          style={{ marginTop: '20px', borderRadius: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
          whileTap={{ scale: 0.98 }}
        >
          <ItemLeft>
            <IconWrapper $color="#ef4444">
              <LogOut size={20} />
            </IconWrapper>
            <ItemTitle style={{ color: '#ef4444' }}>Log Out</ItemTitle>
          </ItemLeft>
        </ListItem>

        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#475569', fontSize: '0.8rem' }}>
          <p>Pocket Feel v1.0.4</p>
          <p style={{ marginTop: '4px' }}>Build 2026.04.26</p>
        </div>
      </ScrollArea>

      <Footer>
        <FooterItem onClick={() => router.push('/')}>
          <Home size={20} />
          <FooterLabel>Home</FooterLabel>
        </FooterItem>

        <FooterItem onClick={() => router.push('/activity')}>
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

        <FooterItem $active>
          <SettingsIcon size={20} />
          <FooterLabel>Settings</FooterLabel>
        </FooterItem>
      </Footer>
    </Page>
  );
}
