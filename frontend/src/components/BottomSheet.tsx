'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import styled from 'styled-components';

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(2, 6, 23, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Mobile: Bottom */

  @media (min-width: 1024px) {
    align-items: center; /* Desktop: Center */
    background: rgba(2, 6, 23, 0.4); /* Lighter for desktop glass feel */
  }
`;

const SheetContent = styled.div`
  width: 100%;
  max-width: 600px;
  background: #1e293b;
  border-top-left-radius: 32px;
  border-top-right-radius: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 24px 48px 24px;
  box-shadow: 0 -25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  touch-action: none;

  @media (min-width: 1024px) {
    border-radius: 40px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 48px;
    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8);
    background: linear-gradient(145deg, #1e293b 0%, #0f172a 100%);
    width: 500px;
  }
`;

const HandleBar = styled.div`
  width: 40px;
  height: 5px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  margin: 0 auto 24px auto;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }

  @media (min-width: 1024px) {
    display: none; /* Hide on desktop modal */
  }
`;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const bind = useDrag(
    ({ velocity: [, vy], movement: [, my], cancel }) => {
      // Swipe down logic only on mobile-sized movement
      if (window.innerWidth < 1024) {
        if (my > 100 || (vy > 0.5 && my > 0)) {
          cancel();
          onClose();
        }
      }
    },
    { from: () => [0, 0], filterTaps: true, bounds: { top: 0 }, rubberband: true }
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            {...(bind() as any)}
            initial={{ y: '100%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '100%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center', touchAction: 'none' }}
          >
            <SheetContent>
              <HandleBar />
              {children}
            </SheetContent>
          </motion.div>
        </Overlay>
      )}
    </AnimatePresence>
  );
}
