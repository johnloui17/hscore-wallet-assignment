'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { loginAction } from '@/app/actions';

const Page = styled.div`
  min-height: 100dvh;
  background-color: #0f172a;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
`;

const LoginCard = styled(motion.div)`
  width: 100%;
  max-width: 400px;
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  padding: 40px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  backdrop-filter: blur(12px);
`;

const LogoContainer = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 20px 40px -10px rgba(37, 99, 235, 0.4);
`;

const Title = styled.h1`
  font-size: 1.8rem;
  color: white;
  font-weight: 800;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px 20px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    background: rgba(15, 23, 42, 0.8);
  }

  &::placeholder {
    color: #475569;
  }
`;

const Button = styled(motion.button)`
  width: 100%;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 16px;
  padding: 16px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 20px -5px rgba(37, 99, 235, 0.4);

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  margin-top: 32px;
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 500;
`;

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
    </svg>
  );
}

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUserId = userId.trim();
    if (!cleanUserId) return;

    setIsLoading(true);

    try {
      // Save to cookie via Server Action (secure httpOnly)
      await loginAction(cleanUserId);

      // Save to localStorage for minor client-side persistence/UX
      localStorage.setItem('pocketfeel_user_id', cleanUserId);

      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
    }
  };

  return (
    <Page>
      <LoginCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <LogoContainer>
          <VaultLogo size={40} />
        </LogoContainer>

        <Title>Pocket Feel</Title>
        <Subtitle>
          Enter your User ID to access your vaults. <br />
          New here? Just pick any name.
        </Subtitle>

        <form style={{ width: '100%' }} onSubmit={handleLogin}>
          <InputContainer>
            <Input
              type="text"
              placeholder="e.g. ronaldo, john_doe"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={isLoading}
              autoFocus
            />
          </InputContainer>

          <Button
            type="submit"
            disabled={isLoading || !userId.trim()}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <>
                Continue
                <ArrowRight size={20} />
              </>
            )}
          </Button>
        </form>

        <Footer>
          Secure User-ID session. No password required.
        </Footer>
      </LoginCard>
    </Page>
  );
}
