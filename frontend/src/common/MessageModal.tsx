import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type MessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  status: 'success' | 'warning' | 'fail';
  duration?: number;
};

const MessageModal: React.FC<MessageModalProps> = ({
  isOpen,
  onClose,
  message,
  status,
  duration = 3000,
}) => {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  const statusConfig = {
    success: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'bg-emerald-500',
      text: 'text-emerald-800',
      bg: 'bg-emerald-50',
    },
    warning: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'bg-amber-500',
      text: 'text-amber-800',
      bg: 'bg-amber-50',
    },
    fail: {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'bg-rose-500',
      text: 'text-rose-800',
      bg: 'bg-rose-50',
    },
  };

  const currentStatus = statusConfig[status];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className={`relative max-w-md w-full rounded-xl overflow-hidden shadow-xl ${currentStatus.bg}`}
          >
            {/* Status bar */}
            <div className={`h-1 w-full ${currentStatus.color}`} />
            
            <div className="p-6 flex items-start gap-4">
              <div className={`p-2 rounded-full ${currentStatus.color} text-white`}>
                {currentStatus.icon}
              </div>
              
              <div className="flex-1">
                <h3 className={`text-lg font-semibold ${currentStatus.text}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </h3>
                <p className="mt-1 text-gray-700">{message}</p>
              </div>
              
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Progress bar */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`h-1 ${currentStatus.color}`}
              />
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MessageModal;