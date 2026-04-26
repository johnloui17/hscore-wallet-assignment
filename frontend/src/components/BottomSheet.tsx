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
  align-items: flex-end; /* Align to bottom */
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
  touch-action: none; /* Important for useDrag */
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
`;

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function BottomSheet({ isOpen, onClose, children }: BottomSheetProps) {
  const bind = useDrag(
    ({ last, velocity: [, vy], movement: [, my], cancel, canceled }) => {
      // If pulled down far enough or swiped down fast enough
      if (my > 100 || (vy > 0.5 && my > 0)) {
        cancel();
        onClose();
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
            {...(bind() as any)}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
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
