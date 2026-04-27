'use client';

import { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { BottomSheet } from './BottomSheet';
import { createWalletAction } from '@/app/actions';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';

const Title = styled.h2`
  margin: 0 0 24px 0;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  padding-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 18px 20px;
  color: white;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: #3b82f6;
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  background: #3b82f6;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 10px;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

/* ── Success Screen Components ── */
const SuccessContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
`;

const SuccessIconWrapper = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: rgba(16, 185, 129, 0.15);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #10b981;
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h2`
  color: white;
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 8px;
`;

const SuccessSub = styled.p`
  color: #94a3b8;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 32px;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 12px;
`;

const ProgressFill = styled(motion.div)`
  height: 100%;
  background: #10b981;
`;

interface CreateWalletBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWalletBottomSheet({ isOpen, onClose }: CreateWalletBottomSheetProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClose = useCallback(() => {
    setName('');
    setBalance('');
    setShowSuccess(false);
    onClose();
  }, [onClose]);

  // Auto-close after success
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccess) {
      timer = setTimeout(() => {
        handleClose();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showSuccess, handleClose]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a wallet name');
      return;
    }

    setIsPending(true);
    const initialBal = Number(balance.replace(/,/g, '')) || 0;
    const userId = localStorage.getItem('pocketfeel_user_id') || undefined;

    const result = await createWalletAction(name.trim(), initialBal, userId);

    if (result.success && result.data) {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      setShowSuccess(true);
      // Navigate to the home page after a short delay (let success screen show)
      setTimeout(() => {
        router.push('/');
        handleClose();
      }, 2000);
    } else {
      toast.error(result.error);
    }
    setIsPending(false);
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue) {
      setBalance('');
      return;
    }

    if (rawValue.endsWith('.')) {
      setBalance(rawValue);
      return;
    }

    const parts = rawValue.split('.');
    let formatted = Number(parts[0]).toLocaleString('en-IN');
    if (parts.length > 1) {
      formatted += '.' + parts[1].substring(0, 2);
    }
    setBalance(formatted);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={handleClose}>
      <AnimatePresence mode="wait">
        {!showSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Title>Create New Wallet</Title>

            <InputGroup>
              <Label>Wallet Name</Label>
              <Input
                placeholder="e.g. Vacation Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </InputGroup>

            <InputGroup>
              <Label>Initial Deposit</Label>
              <Input
                type="text"
                placeholder="₹ 0"
                value={balance}
                onChange={handleBalanceChange}
              />
            </InputGroup>

            <SubmitButton onClick={handleSubmit} disabled={isPending}>
              {isPending ? <Loader2 className="animate-spin" size={24} /> : 'Create Wallet'}
            </SubmitButton>
          </motion.div>
        ) : (
          <SuccessContainer
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <SuccessIconWrapper
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            >
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </SuccessIconWrapper>

            <SuccessTitle>Wallet Created!</SuccessTitle>
            <SuccessSub>Your new wallet <b>{name}</b> is ready for use.</SuccessSub>

            <SubmitButton
              style={{ background: 'rgba(255,255,255,0.05)', color: 'white', boxShadow: 'none' }}
              onClick={handleClose}
            >
              Done
            </SubmitButton>

            <ProgressBar>
              <ProgressFill
                initial={{ width: '100%' }}
                animate={{ width: 0 }}
                transition={{ duration: 5, ease: 'linear' }}
              />
            </ProgressBar>
          </SuccessContainer>
        )}
      </AnimatePresence>
    </BottomSheet>
  );
}
