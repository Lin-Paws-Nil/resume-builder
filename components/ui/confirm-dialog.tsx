"use client";

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GradientButton } from '@/components/ui/gradient-button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  confirmVariant?: 'default' | 'secondary' | 'green';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'info',
  confirmVariant = 'default',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-12 w-12 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-12 w-12 text-yellow-500" />;
      case 'success':
        return <CheckCircle className="h-12 w-12 text-green-500" />;
      default:
        return <Info className="h-12 w-12 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'error':
        return 'border-red-500/30';
      case 'warning':
        return 'border-yellow-500/30';
      case 'success':
        return 'border-green-500/30';
      default:
        return 'border-blue-500/30';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Dialog Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className={cn(
              "relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 shadow-2xl",
              getBorderColor()
            )}
          >
            <div className="relative p-8 text-center">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Icon */}
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm">
                {getIcon()}
              </div>

              {/* Title */}
              <h2 className="mb-3 text-2xl font-bold text-white">
                {title}
              </h2>

              {/* Description */}
              <p className="mb-8 text-sm text-gray-300 leading-relaxed">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <GradientButton
                  onClick={handleConfirm}
                  variant={confirmVariant}
                  className="w-full px-6 py-3"
                >
                  {confirmText}
                </GradientButton>
                <button
                  onClick={onClose}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Hook to use confirm dialog
export function useConfirmDialog() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [config, setConfig] = React.useState<Omit<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>>({
    title: '',
    description: '',
  });
  const resolveRef = React.useRef<(value: boolean) => void>();

  const confirm = (options: Omit<ConfirmDialogProps, 'isOpen' | 'onClose' | 'onConfirm'>) => {
    setConfig(options);
    setIsOpen(true);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const handleConfirm = () => {
    resolveRef.current?.(true);
    setIsOpen(false);
  };

  const handleClose = () => {
    resolveRef.current?.(false);
    setIsOpen(false);
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      {...config}
    />
  );

  return { confirm, ConfirmDialog: ConfirmDialogComponent };
}
