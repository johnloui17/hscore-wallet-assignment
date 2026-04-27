'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2, Hexagon, Shield, Globe } from 'lucide-react';
import { loginAction } from '@/app/actions';

const drift = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  50% { transform: translate(30px, -30px) rotate(180deg); }
  100% { transform: translate(0, 0) rotate(360deg); }
`;

const Page = styled.div`
  width: 100%;
  min-height: 100dvh;
  background-color: #020617;
  background-image: 
    radial-gradient(at 0% 0%, hsla(217, 91%, 60%, 0.07) 0px, transparent 50%),
    radial-gradient(at 100% 100%, hsla(217, 91%, 60%, 0.07) 0px, transparent 50%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  position: relative;
  overflow: hidden;
  perspective: 1000px;
`;

const Shape = styled.div<{ size: number; top: string; left: string; delay: number }>`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  top: ${props => props.top};
  left: ${props => props.left};
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 4px;
  animation: ${drift} 20s infinite ease-in-out;
  animation-delay: ${props => props.delay}s;
  pointer-events: none;
  z-index: 0;

  @media (max-width: 1023px) {
    display: none;
  }
`;

const CardContainer = styled(motion.div)`
  width: 100%;
  max-width: 440px;
  z-index: 10;
  transition: transform 0.1s ease-out;
`;

const LoginCard = styled.div`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 32px;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  @media (min-width: 1024px) {
    padding: 64px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #8b5cf6);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  color: white;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -1px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1.1rem;
  margin-bottom: 40px;
  line-height: 1.5;
`;

const Input = styled.input`
  width: 100%;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s;

  &:focus {
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.15);
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 18px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-top: 24px;
  box-shadow: 0 10px 30px -5px rgba(37, 99, 235, 0.4);

  &:hover {
    box-shadow: 0 0 30px 2px rgba(59, 130, 246, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const router = useRouter();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX - innerWidth / 2) / 50;
    const y = (clientY - innerHeight / 2) / 50;
    setTilt({ x: -y, y: x });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) return;
    setIsLoading(true);
    try {
      await loginAction(userId.trim());
      localStorage.setItem('pocketfeel_user_id', userId.trim());
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Page onMouseMove={handleMouseMove}>
      <Shape size={120} top="10%" left="15%" delay={0} />
      <Shape size={80} top="60%" left="80%" delay={2} />
      <Shape size={160} top="20%" left="70%" delay={5} />
      <Shape size={100} top="75%" left="20%" delay={8} />

      <CardContainer
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <LoginCard>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <Hexagon color="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
            <span style={{ color: '#3b82f6', fontWeight: 700, letterSpacing: '2px' }}>POCKET FEEL</span>
          </div>

          <Title>Secure Access</Title>
          <Subtitle>Enter your User ID to verify your session and unlock your wallets.</Subtitle>

          <form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="User ID (e.g. Ronaldo)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !userId.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <>Continue <ArrowRight size={20} /></>}
            </Button>
          </form>

          <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
              <Shield size={14} /> Encrypted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.8rem' }}>
              <Globe size={14} /> Cloud Sync
            </div>
          </div>
        </LoginCard>
      </CardContainer>
    </Page>
  );
}
