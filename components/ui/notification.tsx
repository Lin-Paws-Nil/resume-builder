'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X, AlertCircle } from 'lucide-react';
import { Button } from './button';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

export function Notification({ message, onClose, duration = 5000, type = 'success' }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isError = type === 'error';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className={`
            glass-strong border-2 ${isError ? 'border-red-500/50 bg-red-500/10' : 'border-cyan-500/50 bg-cyan-500/10'}
            px-6 py-4 rounded-2xl shadow-2xl
            flex items-center gap-3 min-w-[400px] max-w-[600px]
            ${isError ? 'shadow-red-500/20' : 'shadow-cyan-500/20'}
          `}>
            {isError ? (
              <AlertCircle className="h-6 w-6 flex-shrink-0 text-red-400" />
            ) : (
              <CheckCircle2 className="h-6 w-6 flex-shrink-0 text-cyan-400" />
            )}
            <p className={`flex-1 font-semibold text-base ${isError ? 'text-red-100' : 'text-cyan-100'}`}>
              {message}
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className={`text-white ${isError ? 'hover:bg-red-500/20' : 'hover:bg-cyan-500/20'} h-8 w-8 p-0 rounded-lg`}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

