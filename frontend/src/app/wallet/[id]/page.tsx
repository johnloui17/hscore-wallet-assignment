'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { getBalance, credit, debit, getHistory } from '@/lib/api';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PageLoader, VaultLogo } from '@/components/PageLoader';
import {
  ChevronLeft,
  ArrowUpCircle,
  ArrowDownCircle,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  FileText,
  Utensils,
  Film,
  Plane,
  Briefcase,
  Loader2,
  Calendar,
  History as HistoryIcon,
  CheckCircle2,
  X,
  AlignLeft,
  Trash2,
  AlertCircle,
  Home,
  Activity as ActivityIcon,
  CreditCard,
  Settings as SettingsIcon,
  Plus,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';
import { deleteWalletAction } from '@/app/actions';
import { CreateWalletBottomSheet } from '@/components/CreateWalletBottomSheet';

interface TransactionData {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number | string;
  description?: string;
  created_at: string;
  category?: string;
}

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

  @media (min-width: 1024px) {
    max-width: 100%;
    flex-direction: row;
  }
`;

const Sidebar = styled.nav`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 280px;
    background: #020617;
    border-right: 1px solid rgba(255, 255, 255, 0.06);
    padding: 48px 24px;
    gap: 32px;
    z-index: 100;
  }
`;

const SidebarBrand = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
`;

const BrandName = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  color: #ffffff;
  font-weight: 800;
  letter-spacing: -0.5px;
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SidebarItem = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 16px;
  background: ${props => props.$active ? 'rgba(59, 130, 246, 0.1)' : 'transparent'};
  color: ${props => props.$active ? '#3b82f6' : '#94a3b8'};
  border: none;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(255, 255, 255, 0.05); color: white; }
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  position: relative;
`;

const WorkspaceGrid = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  @media (min-width: 1024px) {
    flex-direction: row;
    padding: 0 80px;
    gap: 60px;
  }
`;

const ActionPane = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 48px 20px 120px 20px;
  
  &::-webkit-scrollbar { display: none; }
  -ms-overflow-style: none;
  scrollbar-width: none;

  @media (min-width: 1024px) {
    padding: 60px 0 100px 0;
    max-width: 600px;
  }
`;

const LedgerPane = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: flex;
    flex-direction: column;
    width: 480px;
    padding: 60px 0 100px 0;
    border-left: 1px solid rgba(255, 255, 255, 0.04);
    padding-left: 60px;
    /* Disable scrolling */
    overflow: hidden;
  }
`;

const HeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
  @media (min-width: 1024px) {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 40px;
    padding-top: 60px;
    position: relative;
    width: 100%;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 1024px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const BackBtn = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 10px 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  width:fit-content;
  &:hover { background: rgba(255, 255, 255, 0.1); color: white; }
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const WalletTitle = styled.h1`
  font-size: 1.6rem;
  margin: 0;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: -0.5px;
  @media (min-width: 1024px) { 
    font-size: 2.2rem;
    text-align: center;
  }
`;

const DesktopStatus = styled.div`
  display: none;
  @media (min-width: 1024px) { 
    display: flex; 
    align-items: center; 
    gap: 24px;
    position: absolute;
    right: 0;
  }
`;

const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const StatusLabel = styled.span`
  font-size: 0.6rem;
  color: #475569;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
`;

const StatusValue = styled.div`
  display: flex; align-items: center; gap: 6px; color: #f1f5f9; font-size: 0.85rem; font-weight: 700;
  svg { color: #10b981; }
`;

const BalanceCard = styled(motion.div)`
  text-align: center;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  padding: 32px 24px;
  border-radius: 28px;
  box-shadow: 0 15px 30px -10px rgba(37, 99, 235, 0.4);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 140px;

  &::after {
    content: ''; 
    position: absolute; 
    top: -50%; 
    right: -20%; 
    width: 150px; 
    height: 150px;
    background: rgba(255, 255, 255, 0.1); 
    border-radius: 50%;
    z-index: 0;
  }

  @media (min-width: 1024px) { 
    padding: 48px 40px; 
    border-radius: 40px; 
    width: 100%; 
    margin-bottom: 40px;
    min-height: 200px;
  }
`;

const BalanceLabel = styled.p`
  font-size: 0.75rem; 
  color: rgba(255, 255, 255, 0.8); 
  margin-bottom: 8px;
  text-transform: uppercase; 
  letter-spacing: 1.5px; 
  font-weight: 700;
  position: relative;
  z-index: 1;
`;

const BalanceAmount = styled.h2`
  font-size: 3.2rem; 
  margin: 0; 
  font-weight: 800; 
  color: #fff; 
  letter-spacing: -1px;
  position: relative;
  z-index: 1;

  @media (max-width: 400px) { font-size: 2.6rem; }
  @media (min-width: 1024px) { font-size: 4rem; }
`;

/* ── Integrated Actions (Desktop) ── */
const ActionHub = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const DesktopActionGrid = styled.div`
  display: none;
  @media (min-width: 1024px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
`;

const ActionCard = styled(motion.button) <{ $active: boolean; $color: string }>`
  background: ${props => props.$active ? props.$color + '15' : 'rgba(30, 41, 59, 0.4)'};
  border: 1px solid ${props => props.$active ? props.$color : 'rgba(255, 255, 255, 0.05)'};
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  color: #f1f5f9;
  transition: all 0.2s;
  svg { color: ${props => props.$color}; width: 28px; height: 28px; }
  span { font-weight: 800; font-size: 0.95rem; }
`;

/* ── Choice UI (Mobile Only) ── */
const ChoiceGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 32px;
  @media (min-width: 1024px) { display: none; }
`;

const ChoiceCard = styled(motion.button) <{ $variant?: 'ledger' | 'credit' | 'debit'; $fullWidth?: boolean }>`
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: ${({ $fullWidth }) => ($fullWidth ? '20px 24px' : '24px 16px')};
  display: flex;
  flex-direction: ${({ $fullWidth }) => ($fullWidth ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  gap: ${({ $fullWidth }) => ($fullWidth ? '16px' : '12px')};
  cursor: pointer;
  color: #f1f5f9;
  transition: all 0.2s;
  grid-column: ${({ $fullWidth }) => ($fullWidth ? 'span 2' : 'auto')};

  &:hover {
    background: rgba(30, 41, 59, 0.7);
    border-color: ${({ $variant }) =>
    $variant === 'credit' ? '#10b981' : $variant === 'debit' ? '#ef4444' : '#3b82f6'};
  }

  svg {
    color: ${({ $variant }) =>
    $variant === 'credit' ? '#10b981' : $variant === 'debit' ? '#ef4444' : '#3b82f6'};
    width: ${({ $fullWidth }) => ($fullWidth ? '24px' : '32px')};
    height: ${({ $fullWidth }) => ($fullWidth ? '24px' : '32px')};
  }
`;

/* ── Amount Entry UI ── */
const FlowContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 24px;
  @media (min-width: 1024px) {
    max-width: 600px;
  }
`;

const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  width: 100%;
  background: rgba(30, 41, 59, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 22px 20px 22px 48px;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  outline: none;
  transition: all 0.2s ease;
  &:focus { border-color: #3b82f6; background: rgba(30, 41, 59, 0.8); box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
  &::placeholder { color: #475569; }
  &::-webkit-outer-spin-button, &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  appearance: none; -moz-appearance: textfield;
`;

const DescriptionInput = styled(Input)`
  font-size: 1rem; font-weight: 600; padding: 18px 20px 18px 48px;
`;

const SubmitButton = styled(motion.button) <{ $type: 'credit' | 'debit' }>`
  width: 100%; padding: 20px; border-radius: 20px; font-weight: 700; font-size: 1.1rem;
  display: flex; justify-content: center; align-items: center; gap: 10px;
  cursor: pointer; border: none; text-transform: uppercase; letter-spacing: 1px;
  
  ${({ $type }) =>
    $type === 'credit'
      ? `background: #10b981; color: white; box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.4);`
      : `background: #ef4444; color: white; box-shadow: 0 8px 20px -4px rgba(239, 68, 68, 0.4);`}

  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const CategoryLabel = styled.p`
  color: #64748b; font-size: 0.8rem; font-weight: 700; margin-bottom: 16px;
  text-align: center; text-transform: uppercase; letter-spacing: 1px;
`;

const IconBtn = styled(motion.button) <{ $active: boolean }>`
  background: ${({ $active }) => ($active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(30, 41, 59, 0.5)')};
  border: 1px solid ${({ $active }) => ($active ? '#3b82f6' : 'rgba(255, 255, 255, 0.05)')};
  color: ${({ $active }) => ($active ? '#3b82f6' : '#64748b')};
  aspect-ratio: 1; border-radius: 18px; display: flex; justify-content: center; align-items: center; cursor: pointer;
  transition: all 0.2s;
  &:hover { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.3); }
`;

/* ── History UI ── */
const HistoryHeader = styled.div`
  margin-bottom: 16px;
  padding: 0 4px;
`;

const HistoryTitle = styled.h3`
  font-size: 1.1rem; color: #ffffff; font-weight: 700; margin: 0;
  @media (min-width: 1024px) { font-size: 1.4rem; }
`;

const LedgerBox = styled(motion.div)`
  display: flex; flex-direction: column; gap: 12px; padding-bottom: 32px;
  @media (min-width: 1024px) { gap: 14px; max-width: 800px; }
`;

const TransactionRow = styled(motion.div)`
  display: flex; justify-content: space-between; align-items: center; padding: 20px;
  border-radius: 24px; background: rgba(30, 41, 59, 0.4); border: 1px solid rgba(255, 255, 255, 0.03);
  @media (min-width: 1024px) { padding: 20px 24px; border-radius: 28px; }
`;

const TransLeft = styled.div` display: flex; align-items: center; gap: 16px; `;
const TransIcon = styled.div<{ $type: string }>`
  background: ${({ $type }) => ($type === 'CREDIT' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)')};
  color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
  padding: 12px; border-radius: 14px;
`;

const TransTitle = styled.span` font-weight: 700; color: #f1f5f9; font-size: 0.95rem; `;
const TransDesc = styled.p` color: #94a3b8; font-size: 0.8rem; font-weight: 500; margin: 2px 0; `;
const TransSub = styled.div` display: flex; align-items: center; gap: 6px; color: #64748b; font-size: 0.7rem; font-weight: 600; `;
const TransAmount = styled.span<{ $type: string }>`
  font-weight: 800; font-size: 1.05rem; color: ${({ $type }) => ($type === 'CREDIT' ? '#10b981' : '#ef4444')};
`;

const DeleteSection = styled.div`
  margin-top: auto; padding: 40px 0; display: flex; flex-direction: column; align-items: center; gap: 16px;
  @media (min-width: 1024px) { align-items: flex-start; padding: 60px 0 0 0; }
`;

const DeleteBtn = styled(motion.button)`
  background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 14px 24px; border-radius: 16px; font-size: 0.9rem; font-weight: 700;
  display: flex; align-items: center; gap: 10px; cursor: pointer;
`;

const ConfirmDeleteBox = styled(motion.div)`
  background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2);
  padding: 24px; border-radius: 24px; width: 100%; display: flex; flex-direction: column; gap: 16px;
  align-items: center; text-align: center;
  @media (min-width: 1024px) { width: 400px; }
`;

/* ── Nav & Success UI ── */
const Footer = styled.nav`
  position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 12px 12px 12px;
  display: flex; justify-content: space-around; align-items: center;
  background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(20px); border-top: 1px solid rgba(255, 255, 255, 0.06); z-index: 20;
  @media (min-width: 1024px) { display: none; }
`;

const FooterItem = styled.button<{ $active?: boolean }>`
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  background: none; border: none; cursor: pointer; padding: 6px 12px; color: ${props => props.$active ? '#3b82f6' : '#475569'};
  transition: color 0.2s;
`;

const FooterLabel = styled.span` font-size: 0.65rem; font-weight: 600; `;

const AddButton = styled(motion.button)`
  width: 52px; height: 52px; border-radius: 50%; background: #3b82f6; color: white; border: none;
  display: flex; justify-content: center; align-items: center; box-shadow: 0 8px 24px -4px rgba(59, 130, 246, 0.45);
  cursor: pointer; margin-top: -20px;
  @media (min-width: 1024px) { margin-top: 0; width: 100%; height: auto; padding: 16px; border-radius: 18px; font-size: 1rem; gap: 12px; }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
`;
const PageBtn = styled.button`
  background: rgba(255, 255, 255, 0.05); color: #f1f5f9; border: none; padding: 12px 24px;
  border-radius: 14px; font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
  &:disabled { opacity: 0.25; cursor: not-allowed; }
  &:hover:not(:disabled) { background: rgba(255, 255, 255, 0.1); }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed; inset: 0; background: rgba(2, 6, 23, 0.85); backdrop-filter: blur(12px);
  z-index: 1000; display: flex; justify-content: center; align-items: center; padding: 20px;
`;

const ModalContent = styled(motion.div)`
  width: 100%; max-width: 400px; background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
  border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; padding: 40px 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center; position: relative;
`;

const SuccessMessage = styled.h2` font-size: 1.5rem; font-weight: 800; color: #fff; margin-bottom: 12px; letter-spacing: -0.5px; `;
const SuccessSubMessage = styled.p` color: #94a3b8; font-size: 1rem; font-weight: 500; line-height: 1.5; `;

const MobileOnly = styled.div` display: block; @media (min-width: 1024px) { display: none; } `;

export default function WalletDetails() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const walletId = params.id as string;

  const [isDesktop, setIsDesktop] = useState(false);
  const [viewMode, setViewMode] = useState<'choice' | 'amount' | 'history'>('choice');
  const [txType, setTxType] = useState<'credit' | 'debit' | null>(null);
  const [amountInput, setAmountInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [successModal, setSuccessModal] = useState<{ visible: boolean; message: string }>({ visible: false, message: '' });

  const limit = 5;
  const categories = [
    { icon: <ShoppingBag size={20} />, name: 'Groceries' }, { icon: <FileText size={20} />, name: 'Bills' },
    { icon: <Utensils size={20} />, name: 'Dining' }, { icon: <Film size={20} />, name: 'Entertainment' },
    { icon: <Plane size={20} />, name: 'Travel Cost' }, { icon: <Briefcase size={20} />, name: 'Salary' },
  ];

  const { data: balanceData, isLoading: isBalanceLoading } = useQuery({ 
    queryKey: ['balance', walletId], 
    queryFn: () => getBalance(walletId),
    enabled: !!walletId 
  });
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({ 
    queryKey: ['history', walletId, page], 
    queryFn: () => getHistory(walletId, limit, page * limit),
    placeholderData: keepPreviousData,
    enabled: !!walletId
  });

  useEffect(() => {
    if (successModal.visible) {
      const timer = setTimeout(() => setSuccessModal({ visible: false, message: '' }), 5000);
      return () => clearTimeout(timer);
    }
  }, [successModal.visible]);

  useEffect(() => {
    const checkDesktop = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) { setViewMode('amount'); }
    };
    checkDesktop(); // Call once on mount
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9.]/g, '');
    if (!rawValue) { setAmountInput(''); return; }
    if (rawValue.endsWith('.')) { setAmountInput(rawValue); return; }
    const parts = rawValue.split('.');
    let formatted = Number(parts[0]).toLocaleString('en-IN');
    if (parts.length > 1) formatted += '.' + parts[1].substring(0, 2);
    setAmountInput(formatted);
  };

  const creditMutation = useMutation({
    mutationFn: (amount: number) => credit(walletId, amount, selectedCategory || undefined, descriptionInput || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] }); // refresh home page portfolio
      queryClient.invalidateQueries({ queryKey: ['all-activity'] }); // Update activity feed
      setSuccessModal({ visible: true, message: `Successfully added ₹${amountInput}` });
      resetForm();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Credit failed'),
  });

  const debitMutation = useMutation({
    mutationFn: (amount: number) => debit(walletId, amount, selectedCategory || undefined, descriptionInput || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balance', walletId] });
      queryClient.invalidateQueries({ queryKey: ['history', walletId] });
      queryClient.invalidateQueries({ queryKey: ['wallets'] }); // refresh home page portfolio
      queryClient.invalidateQueries({ queryKey: ['all-activity'] }); // Update activity feed
      setSuccessModal({ visible: true, message: `Successfully withdrawn ₹${amountInput}` });
      resetForm();
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : 'Debit failed'),
  });

  const resetForm = () => {
    setAmountInput('');
    setDescriptionInput('');
    setSelectedCategory(null);
    setTxType(null);
    if (window.innerWidth < 1024) {
      setViewMode('choice');
    }
  };

  const handleAction = () => {
    if (!amountInput || !txType) return;
    const numericAmount = Number(amountInput.replace(/,/g, ''));
    if (isNaN(numericAmount) || numericAmount <= 0) { toast.error('Enter valid amount'); return; }
    if (txType === 'credit') creditMutation.mutate(numericAmount);
    else debitMutation.mutate(numericAmount);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteWalletAction(walletId);
      if (result.success) { 
        toast.success('Wallet deleted'); 
        queryClient.invalidateQueries({ queryKey: ['wallets'] });
        queryClient.invalidateQueries({ queryKey: ['all-activity'] }); // Update activity feed
        window.location.href = '/'; 
      }
      else { toast.error(result.error); setIsDeleting(false); }
    } catch { toast.error('Deletion failed'); setIsDeleting(false); }
  };

  const handleBack = () => {
    if (viewMode === 'choice' || isDesktop) router.push('/');
    else setViewMode('choice');
  };

  // Scroll to bottom when page changes or history is opened
  useEffect(() => {
    if (viewMode === 'history' || isDesktop) {
      // Small timeout to allow content to render
      setTimeout(() => {
        const containers = document.querySelectorAll('[data-scroll-container="true"]');
        containers.forEach(container => {
          container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
        });
      }, 100);
    }
  }, [page, viewMode, isDesktop]);

  const currentBalance = balanceData?.balance || 0;
  const transactions = (historyData?.transactions as TransactionData[]) || [];
  const totalPages = Math.ceil((historyData?.total || 0) / limit);
  const isPending = creditMutation.isPending || debitMutation.isPending;

  if (isBalanceLoading || isHistoryLoading) {
    return <PageLoader />;
  }

  return (
    <Page>
      <Sidebar>
        <SidebarBrand><VaultLogo size={32} /><BrandName>Pocket Feel</BrandName></SidebarBrand>
        <SidebarNav>
          <SidebarItem onClick={() => router.push('/')}><Home size={20} />Home</SidebarItem>
          <SidebarItem onClick={() => router.push('/activity')}><ActivityIcon size={20} />Activity</SidebarItem>
          <SidebarItem onClick={() => router.push('/cards')}><CreditCard size={20} />Cards</SidebarItem>
          <SidebarItem onClick={() => router.push('/settings')}><SettingsIcon size={20} />Settings</SidebarItem>
        </SidebarNav>
        <div style={{ marginTop: 'auto' }}>
          <AddButton whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setIsCreateOpen(true)}>
            <Plus size={20} strokeWidth={2.5} /><span>Create Wallet</span>
          </AddButton>
        </div>
      </Sidebar>

      <MainContent>
        <WorkspaceGrid>
          <ActionPane data-scroll-container="true">
            <HeaderSection>
              <HeaderRow>
                <BackBtn whileHover={{ x: -4 }} onClick={handleBack}><ChevronLeft size={18} />{isDesktop ? 'Dashboard' : (viewMode === 'choice' ? 'Dashboard' : 'Options')}</BackBtn>
                <WalletTitle>{balanceData?.name || 'Vault Details'}</WalletTitle>
              </HeaderRow>
              <DesktopStatus>
                <StatusItem><StatusLabel>Identity</StatusLabel><StatusValue><ShieldCheck size={14} />Verified</StatusValue></StatusItem>
                <StatusItem><StatusLabel>Network</StatusLabel><StatusValue><RefreshCw size={14} />System Live</StatusValue></StatusItem>
              </DesktopStatus>
            </HeaderSection>

            <BalanceCard initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <BalanceLabel>Available Balance</BalanceLabel>
              <BalanceAmount>{Number(currentBalance).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</BalanceAmount>
            </BalanceCard>

            <ActionHub>
              <DesktopActionGrid>
                <ActionCard $active={txType === 'credit'} $color="#10b981" onClick={() => { setTxType('credit'); setViewMode('amount'); }} whileTap={{ scale: 0.98 }}>
                  <ArrowUpCircle /><span>Credit Funds</span>
                </ActionCard>
                <ActionCard $active={txType === 'debit'} $color="#ef4444" onClick={() => { setTxType('debit'); setViewMode('amount'); }} whileTap={{ scale: 0.98 }}>
                  <ArrowDownCircle /><span>Debit Funds</span>
                </ActionCard>
              </DesktopActionGrid>

              <AnimatePresence mode="wait">
                {viewMode === 'choice' && (
                  <ChoiceGrid key="choice">
                    <ChoiceCard $fullWidth $variant="ledger" onClick={() => setViewMode('history')}><HistoryIcon />View Ledger</ChoiceCard>
                    <ChoiceCard $variant="credit" onClick={() => { setTxType('credit'); setViewMode('amount'); }}><ArrowUpCircle />Credit</ChoiceCard>
                    <ChoiceCard $variant="debit" onClick={() => { setTxType('debit'); setViewMode('amount'); }}><ArrowDownCircle />Debit</ChoiceCard>
                  </ChoiceGrid>
                )}

                {viewMode === 'amount' && txType && (
                  <motion.div key="amount" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <FlowContainer>
                      <Controls>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '1.4rem', fontWeight: 700 }}>₹</div>
                          <Input type="text" placeholder="0.00" autoFocus value={amountInput} onChange={handleAmountChange} />
                        </div>
                        <div style={{ position: 'relative' }}>
                          <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}><AlignLeft size={20} /></div>
                          <DescriptionInput type="text" placeholder="Description (Optional)" value={descriptionInput} onChange={(e) => setDescriptionInput(e.target.value)} />
                        </div>
                        <SubmitButton $type={txType} onClick={handleAction} disabled={isPending || !amountInput}>
                          {isPending ? <Loader2 className="animate-spin" size={20} /> : <>{txType === 'credit' ? <CheckCircle2 /> : <ArrowDownCircle />} Confirm {txType}</>}
                        </SubmitButton>
                      </Controls>
                      <div>
                        <CategoryLabel>Tag a Category</CategoryLabel>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                          {categories.map((cat) => (
                            <IconBtn key={cat.name} $active={selectedCategory === cat.name} onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}>
                              {cat.icon}
                            </IconBtn>
                          ))}
                        </div>
                      </div>
                    </FlowContainer>
                  </motion.div>
                )}

                {viewMode === 'history' && (
                  <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ paddingBottom: '40px' }}>
                    <HistoryHeader><HistoryTitle>Ledger</HistoryTitle></HistoryHeader>
                    <LedgerBox>
                      {transactions.length === 0 ? (
                        <p style={{ color: '#94a3b8', textAlign: 'center', margin: '40px 0' }}>No transactions recorded yet.</p>
                      ) : (
                        transactions.map((tx) => (
                          <TransactionRow key={tx.id}>
                            <TransLeft>
                              <TransIcon $type={tx.type}>{tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</TransIcon>
                              <div><TransTitle>{tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Withdrawn'}</TransTitle>{tx.description && <TransDesc>{tx.description}</TransDesc>}<TransSub><Calendar size={12} />{new Date(tx.created_at).toLocaleDateString()}</TransSub></div>
                            </TransLeft>
                            <TransAmount $type={tx.type}>{tx.type === 'CREDIT' ? '+' : '-'}{Number(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</TransAmount>
                          </TransactionRow>
                        ))
                      )}
                    </LedgerBox>
                    <Pagination>
                      <PageBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</PageBtn>
                      <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{page + 1} / {totalPages || 1}</span>
                      <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</PageBtn>
                    </Pagination>
                  </motion.div>
                )}
              </AnimatePresence>

              {viewMode !== 'history' && (
                <DeleteSection>
                  {!confirmDelete ? (
                    <DeleteBtn onClick={() => setConfirmDelete(true)} whileTap={{ scale: 0.95 }}><Trash2 size={18} />Delete Wallet</DeleteBtn>
                  ) : (
                    <ConfirmDeleteBox initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      <AlertCircle size={32} color="#ef4444" />
                      <div><h4 style={{ color: 'white', margin: '0 0 4px 0' }}>Are you sure?</h4><p style={{ color: '#94a3b8', fontSize: '0.8rem', margin: 0 }}>This action cannot be undone.</p></div>
                      <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                        <SubmitButton $type="credit" style={{ background: 'rgba(255,255,255,0.05)', color: 'white', boxShadow: 'none' }} onClick={() => setConfirmDelete(false)}>Cancel</SubmitButton>
                        <SubmitButton $type="debit" onClick={handleDelete} disabled={isDeleting}>{isDeleting ? <Loader2 className="animate-spin" size={20} /> : 'Delete'}</SubmitButton>
                      </div>
                    </ConfirmDeleteBox>
                  )}
                </DeleteSection>
              )}
            </ActionHub>
          </ActionPane>

          <LedgerPane data-scroll-container="true">
            <HistoryHeader><HistoryTitle>Live Ledger</HistoryTitle></HistoryHeader>
            <LedgerBox>
              {transactions.length === 0 ? (
                <p style={{ color: '#94a3b8', textAlign: 'center', margin: '40px 0' }}>No transactions recorded yet.</p>
              ) : (
                transactions.map((tx) => (
                  <TransactionRow key={tx.id}>
                    <TransLeft>
                      <TransIcon $type={tx.type}>{tx.type === 'CREDIT' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}</TransIcon>
                      <div>
                        <TransTitle>{tx.type === 'CREDIT' ? 'Funds Received' : 'Funds Withdrawn'}</TransTitle>
                        {tx.description && <TransDesc>{tx.description}</TransDesc>}
                        <TransSub><Calendar size={12} />{new Date(tx.created_at).toLocaleDateString()}</TransSub>
                      </div>
                    </TransLeft>
                    <TransAmount $type={tx.type}>{tx.type === 'CREDIT' ? '+' : '-'}{Number(tx.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</TransAmount>
                  </TransactionRow>
                ))
              )}
            </LedgerBox>
            <Pagination>
              <PageBtn disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</PageBtn>
              <span style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>{page + 1} / {totalPages || 1}</span>
              <PageBtn disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</PageBtn>
            </Pagination>
          </LedgerPane>
        </WorkspaceGrid>

        <MobileOnly>
          <Footer>
            <FooterItem onClick={() => router.push('/')}><Home size={20} /><FooterLabel>Home</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/activity')}><ActivityIcon size={20} /><FooterLabel>Activity</FooterLabel></FooterItem>
            <AddButton whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }} onClick={() => setIsCreateOpen(true)}><Plus size={28} strokeWidth={2.5} /></AddButton>
            <FooterItem onClick={() => router.push('/cards')}><CreditCard size={20} /><FooterLabel>Cards</FooterLabel></FooterItem>
            <FooterItem onClick={() => router.push('/settings')}><SettingsIcon size={20} /><FooterLabel>Settings</FooterLabel></FooterItem>
          </Footer>
        </MobileOnly>
      </MainContent>

      <AnimatePresence>
        {successModal.visible && (
          <ModalOverlay initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ModalContent initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}>
              <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#94a3b8', padding: '8px', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setSuccessModal({ visible: false, message: '' })}><X size={20} /></button>
              <div style={{ width: '80px', height: '80px', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#10b981', marginBottom: '24px' }}><CheckCircle2 size={48} strokeWidth={2.5} /></div>
              <SuccessMessage>Transaction Successful</SuccessMessage><SuccessSubMessage>{successModal.message}</SuccessSubMessage>
              <motion.div initial={{ width: '100%' }} animate={{ width: 0 }} transition={{ duration: 5, ease: 'linear' }} style={{ height: '4px', background: '#10b981', borderRadius: '2px', marginTop: '24px', opacity: 0.6 }} />
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
      <CreateWalletBottomSheet isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </Page>
  );
}
