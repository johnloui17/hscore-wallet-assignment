'use client';

import styled from 'styled-components';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Home, 
  Activity as ActivityIcon, 
  CreditCard as CreditCardIcon, 
  Settings, 
  Plus,
  Wifi,
  Contact2,
  ShieldCheck,
  Zap
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
  gap: 24px;

  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

/* ── Card Designs ── */
const CardContainer = styled(motion.div)<{ $bg: string; $color: string }>`
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

const BrandName = styled.div`
  font-weight: 900;
  font-size: 1.1rem;
  letter-spacing: 2px;
  text-transform: uppercase;
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

const CardMiddle = styled.div`
  margin-top: 15px;
  z-index: 1;
`;

const CardNumber = styled.div`
  font-size: 1.5rem;
  letter-spacing: 3px;
  font-family: 'Courier New', Courier, monospace;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
  font-weight: 600;
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

export default function CardsPage() {
  const router = useRouter();

  return (
    <Page>
      <FixedHeader>
        <HeaderRow>
          <PageTitle>My Cards</PageTitle>
        </HeaderRow>
      </FixedHeader>

      <ScrollArea>
        {/* Elysian Black Card */}
        <CardContainer 
          $bg="linear-gradient(145deg, #0f172a 0%, #020617 100%)" 
          $color="#f8fafc"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GeometricPattern style={{ opacity: 0.05 }} />
          <CardTop>
            <CardBrand>
              <BrandName>ELYSIAN</BrandName>
              <BrandSub>BLACK</BrandSub>
            </CardBrand>
            <ShieldCheck size={28} strokeWidth={1.5} style={{ opacity: 0.6 }} />
          </CardTop>
          
          <CardMiddle>
            <Chip />
            <div style={{ marginTop: '24px' }}>
              <CardNumber>**** **** 4410</CardNumber>
            </div>
          </CardMiddle>

          <CardBottom>
            <HolderInfo>
              <Label>Valued Member</Label>
              <HolderName>JOHN DOE</HolderName>
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
        >
          <GeometricPattern style={{ opacity: 0.08, backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px)' }} />
          <CardTop>
            <CardBrand>
              <BrandName style={{ color: '#ffffff' }}>OBSIDIAN</BrandName>
              <BrandSub style={{ color: '#3b82f6' }}>ONYX</BrandSub>
            </CardBrand>
            <Zap size={28} strokeWidth={1.5} style={{ color: '#3b82f6', opacity: 0.8 }} />
          </CardTop>

          <CardMiddle>
            <Chip style={{ background: 'linear-gradient(135deg, #94a3b8 0%, #475569 100%)' }} />
            <div style={{ marginTop: '24px' }}>
              <CardNumber style={{ color: '#ffffff' }}>**** **** 5592</CardNumber>
            </div>
          </CardMiddle>

          <CardBottom>
            <HolderInfo>
              <Label>Valid Thru</Label>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>10/29</div>
            </HolderInfo>
            <PremiumBadge style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>EXECUTIVE</PremiumBadge>
          </CardBottom>
        </CardContainer>

        <div style={{ textAlign: 'center', padding: '20px', color: '#475569', fontSize: '0.9rem' }}>
          <p>These card previews are exclusive to your account tier.</p>
          <p style={{ marginTop: '4px' }}>Digital activation is available in Settings.</p>
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

        <FooterItem $active>
          <CreditCardIcon size={20} />
          <FooterLabel>Cards</FooterLabel>
        </FooterItem>

        <FooterItem onClick={() => router.push('/settings')}>
          <Settings size={20} />
          <FooterLabel>Settings</FooterLabel>
        </FooterItem>
      </Footer>
    </Page>
  );
}
