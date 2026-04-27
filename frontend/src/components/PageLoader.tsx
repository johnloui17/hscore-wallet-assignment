'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #0f172a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  gap: 16px;
`;

export function WalletLogo({ size = 40 }: { size?: number }) {
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

export function PageLoader() {
  return (
    <LoadingOverlay>
      <WalletLogo size={64} />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 size={32} color="#3b82f6" />
      </motion.div>
    </LoadingOverlay>
  );
}
