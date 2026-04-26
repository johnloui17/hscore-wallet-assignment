'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { BottomSheet } from './BottomSheet';
import { createWalletAction } from '@/app/actions';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
    border-color: var(--primary);
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
  background: var(--primary);
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

interface CreateWalletBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateWalletBottomSheet({ isOpen, onClose }: CreateWalletBottomSheetProps) {
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Please enter a wallet name');
      return;
    }
    
    setIsPending(true);
    const initialBal = Number(balance.replace(/,/g, '')) || 0;
    
    const result = await createWalletAction(name.trim(), initialBal);
    
    if (result.success) {
      toast.success('Wallet created successfully!');
      setName('');
      setBalance('');
      onClose();
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
    <BottomSheet isOpen={isOpen} onClose={onClose}>
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
    </BottomSheet>
  );
}
