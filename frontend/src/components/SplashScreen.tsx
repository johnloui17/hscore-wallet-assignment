'use client';

import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const pulse = keyframes`
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
`;

const SplashContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: #0f172a;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  z-index: 99999;
`;

const LogoWrapper = styled(motion.div)`
  animation: ${pulse} 2s infinite ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BrandName = styled(motion.h2)`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
`;

const LoadingBar = styled.div`
  width: 120px;
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const Progress = styled(motion.div)`
  height: 100%;
  background: #3b82f6;
  width: 40%;
  border-radius: 10px;
`;

function VaultLogo({ size = 80 }: { size?: number }) {
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
    </svg>
  );
}

export function SplashScreen() {
  return (
    <SplashContainer
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.6, ease: "circIn" }}
    >
      <LogoWrapper
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <VaultLogo />
      </LogoWrapper>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <BrandName
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Pocket Feel
        </BrandName>
        
        <LoadingBar>
          <Progress
            animate={{ 
              x: [-120, 120],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5, 
              ease: "easeInOut" 
            }}
          />
        </LoadingBar>
      </div>
    </SplashContainer>
  );
}
