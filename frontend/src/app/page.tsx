'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styled from 'styled-components';
import { getAllWallets, createWallet, deleteWallet } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Wallet, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const DashboardContainer = styled(motion.main)`
  width: 100%;
  max-width: 900px;
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--card-border);
  border-radius: 32px;
  padding: 48px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
  margin: 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.h1`
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -1px;
`;

const CreateBtn = styled(motion.button)`
  background: var(--primary);
  color: white;
  padding: 12px 28px;
  font-size: 1rem;
  border-radius: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
`;

const WalletList = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
`;

const WalletCard = styled(motion.div)`
  background: rgba(30, 41, 59, 0.4);
  padding: 24px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(30, 41, 59, 0.6);
    border-color: var(--primary);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2);
  }
`;

const WalletHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const IconWrapper = styled.div`
  background: rgba(59, 130, 246, 0.1);
  color: var(--primary);
  padding: 10px;
  border-radius: 12px;
`;

const WalletInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const WalletName = styled.h3`
  color: #f8fafc;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 600;
`;

const WalletBal = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.5px;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
`;

const ManageLink = styled.span`
  color: #94a3b8;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s;

  ${WalletCard}:hover & {
    color: var(--primary);
  }
`;

const DeleteBtn = styled.button`
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #ef4444;
    color: white;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled(motion.div)`
  background: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 28px;
  padding: 40px;
  width: 90%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
`;

const ModalTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #94a3b8;
  font-size: 0.9rem;
  font-weight: 500;
  padding-left: 4px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(15, 23, 42, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 14px 18px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;

  &:focus {
    border-color: var(--primary);
    background: rgba(15, 23, 42, 0.6);
    box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const Button = styled(motion.button)<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  ${({ $variant }) =>
    $variant === 'secondary'
      ? `
    background: rgba(255, 255, 255, 0.05);
    color: #94a3b8;
    &:hover { background: rgba(255, 255, 255, 0.1); color: white; }
  `
      : `
    background: var(--primary);
    color: white;
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
    &:hover { background: var(--primary-hover); }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Home() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBalance, setNewBalance] = useState('');

  const { data: wallets = [], isLoading } = useQuery({
    queryKey: ['wallets'],
    queryFn: getAllWallets,
    refetchInterval: 5000,
  });

  const createMutation = useMutation({
    mutationFn: ({ name, initialBalance }: { name: string; initialBalance: number }) =>
      createWallet(name, initialBalance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Wallet created successfully!');
      setIsModalOpen(false);
      setNewName('');
      setNewBalance('');
    },
    onError: () => toast.error('Failed to create wallet'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteWallet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] });
      toast.success('Wallet deleted');
    },
    onError: () => toast.error('Failed to delete wallet'),
  });

  const handleCreateSubmit = () => {
    if (!newName.trim()) {
      toast.error('Please enter a wallet name');
      return;
    }
    createMutation.mutate({
      name: newName.trim(),
      initialBalance: Number(newBalance.replace(/,/g, '')) || 0,
    });
  };

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue) {
      setNewBalance('');
      return;
    }

    if (rawValue.endsWith('.')) {
      setNewBalance(rawValue);
      return;
    }

    const parts = rawValue.split('.');
    let formatted = Number(parts[0]).toLocaleString('en-IN');
    if (parts.length > 1) {
      formatted += '.' + parts[1].substring(0, 2);
    }
    setNewBalance(formatted);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <>
      <DashboardContainer
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <HeaderRow>
          <div>
            <Header>Digital Vault</Header>
            <p style={{ color: '#94a3b8', margin: '8px 0 0 0' }}>Manage your assets with high integrity.</p>
          </div>
          <CreateBtn
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Create Vault
          </CreateBtn>
        </HeaderRow>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Loader2 className="animate-spin" color="#3b82f6" size={40} />
          </div>
        ) : (
          <WalletList>
            <AnimatePresence mode="popLayout">
              {wallets.length === 0 ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ color: '#94a3b8', textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}
                >
                  No vaults found. Start by creating your first one.
                </motion.p>
              ) : (
                wallets.map((wallet: any) => (
                  <WalletCard
                    key={wallet.id}
                    variants={itemVariants}
                    layout
                    whileHover={{ y: -5 }}
                    onClick={() => router.push(`/wallet/${wallet.id}`)}
                  >
                    <WalletHeader>
                      <IconWrapper>
                        <Wallet size={24} />
                      </IconWrapper>
                      <DeleteBtn
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this vault?')) {
                            deleteMutation.mutate(wallet.id);
                          }
                        }}
                      >
                        <Trash2 size={18} />
                      </DeleteBtn>
                    </WalletHeader>

                    <WalletInfo>
                      <WalletName>{wallet.name || 'Unnamed Vault'}</WalletName>
                      <WalletBal>
                        {Number(wallet.balance).toLocaleString('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                          maximumFractionDigits: 0
                        })}
                      </WalletBal>
                    </WalletInfo>

                    <CardFooter>
                      <ManageLink>
                        Manage Vault <ArrowRight size={14} />
                      </ManageLink>
                    </CardFooter>
                  </WalletCard>
                ))
              )}
            </AnimatePresence>
          </WalletList>
        )}
      </DashboardContainer>

      <AnimatePresence>
        {isModalOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsModalOpen(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>New Vault Setup</ModalTitle>
              
              <InputGroup>
                <Label>Vault Name</Label>
                <Input
                  autoFocus
                  placeholder="e.g. Personal Savings"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </InputGroup>

              <InputGroup>
                <Label>Initial Deposit</Label>
                <Input
                  type="text"
                  placeholder="₹ 0"
                  value={newBalance}
                  onChange={handleBalanceChange}
                />
              </InputGroup>

              <ModalActions>
                <Button $variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateSubmit}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : 'Create Vault'}
                </Button>
              </ModalActions>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
}
