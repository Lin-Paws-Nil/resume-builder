'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, X } from 'lucide-react';
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
      setTimeout(onClose, 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        fixed top-6 left-1/2 transform -translate-x-1/2 z-[9999]
        ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-6 py-4 rounded-lg shadow-2xl
        flex items-center gap-3 min-w-[400px] max-w-[600px]
        transition-all duration-300
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
      style={{
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      }}
    >
      <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
      <p className="flex-1 font-semibold text-base">{message}</p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className={`text-white ${isError ? 'hover:bg-red-700' : 'hover:bg-green-700'} h-8 w-8 p-0`}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

