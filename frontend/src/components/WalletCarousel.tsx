'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wallet, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const WalletCard = styled(motion.div)<{ $index: number }>`
  width: 100%;
  background: linear-gradient(135deg,
    rgba(30, 41, 59, 0.8) 0%,
    rgba(15, 23, 42, 0.9) 100%
  );
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  user-select: none;

  /* Subtle accent glow */
  &::before {
    content: '';
    position: absolute;
    top: -60%;
    left: -40%;
    width: 180%;
    height: 180%;
    background: radial-gradient(
      circle at ${props => (props.$index % 2 === 0 ? '0% 0%' : '100% 100%')},
      ${props =>
        props.$index % 3 === 0
          ? 'rgba(59, 130, 246, 0.1)'
          : props.$index % 3 === 1
          ? 'rgba(167, 139, 250, 0.1)'
          : 'rgba(16, 185, 129, 0.1)'
      } 0%,
      transparent 50%
    );
    z-index: 0;
    pointer-events: none;
  }
`;

const IconWrapper = styled.div<{ $index: number }>`
  position: relative;
  z-index: 1;
  width: 48px;
  height: 48px;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  background: ${props =>
    props.$index % 3 === 0
      ? 'rgba(59, 130, 246, 0.15)'
      : props.$index % 3 === 1
      ? 'rgba(167, 139, 250, 0.15)'
      : 'rgba(16, 185, 129, 0.15)'
  };
  color: ${props =>
    props.$index % 3 === 0
      ? '#60a5fa'
      : props.$index % 3 === 1
      ? '#a78bfa'
      : '#34d399'
  };
`;

const Info = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;
`;

const WalletName = styled.h3`
  color: #e2e8f0;
  font-size: 1rem;
  margin: 0 0 4px 0;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WalletBal = styled.span`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.5px;
`;

const ArrowWrapper = styled.div`
  position: relative;
  z-index: 1;
  color: #334155;
  flex-shrink: 0;
`;

interface WalletCarouselProps {
  wallets: any[];
}

export function WalletCarousel({ wallets }: WalletCarouselProps) {
  const router = useRouter();

  if (!wallets || wallets.length === 0) {
    return null;
  }

  return (
    <ListContainer>
      {wallets.map((wallet, index) => (
        <WalletCard
          key={wallet.id}
          $index={index}
          onClick={() => router.push(`/wallet/${wallet.id}`)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, type: 'spring', damping: 20, stiffness: 200 }}
          whileTap={{ scale: 0.98 }}
        >
          <IconWrapper $index={index}>
            <Wallet size={22} />
          </IconWrapper>

          <Info>
            <WalletName>{wallet.name || 'Unnamed Wallet'}</WalletName>
            <WalletBal>
              {Number(wallet.balance).toLocaleString('en-IN', {
                style: 'currency',
                currency: 'INR',
                maximumFractionDigits: 0
              })}
            </WalletBal>
          </Info>

          <ArrowWrapper>
            <ChevronRight size={20} />
          </ArrowWrapper>
        </WalletCard>
      ))}
    </ListContainer>
  );
}
