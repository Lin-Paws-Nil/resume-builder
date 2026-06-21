'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number;
  type?: 'success' | 'error';
}

export function Notification({ message, onClose, duration = 3000, type = 'success' }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const isError = type === 'error';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -15, scale: 0.95 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999]"
        >
          <div className={`
            border rounded-xl shadow-lg px-5 py-3
            flex items-center gap-3
            ${isError 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : 'bg-green-50 border-green-200 text-green-800'}
          `}>
            {isError ? (
              <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
            ) : (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
            )}
            <p className="font-semibold text-sm">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
