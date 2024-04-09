import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { modalVariant } from '../../constants/variants';

export const Modal = ({
  isOpen,
  onClose,
  children,
  className = '',
  maxWidth = 'max-w-[850px]',
  'aria-label': ariaLabel = 'Dialog',
}) => {
  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // Click outside backdrop to close
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-modal flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            key="modal-content"
            variants={modalVariant}
            initial="initial"
            animate="animate"
            exit="exit"
            className={[
              'relative w-full bg-nethero-bgLight rounded-modal shadow-modal overflow-y-auto max-h-[90vh]',
              maxWidth,
              className,
            ].join(' ')}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-nethero-bgHover text-nethero-white hover:bg-nethero-gray transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-nethero-white"
            >
              <X size={20} aria-hidden="true" />
            </button>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
