'use client';

import { useEffect, useState } from 'react';
import { Button } from './button';
import { AlertTriangle } from 'lucide-react';

interface SessionWarningProps {
  onExtend: () => void;
  onLogout: () => void;
  timeRemaining: number; // seconds
}

export function SessionWarning({ onExtend, onLogout, timeRemaining }: SessionWarningProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show warning when less than 2 minutes remaining
    if (timeRemaining < 120 && timeRemaining > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [timeRemaining]);

  if (!isVisible) return null;

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className="fixed top-4 right-4 z-50 bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4 max-w-md">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-900 mb-1">Session Expiring Soon</h3>
          <p className="text-sm text-yellow-800 mb-3">
            Your session will expire in {minutes}:{seconds.toString().padStart(2, '0')}. 
            Please save your work.
          </p>
          <div className="flex gap-2">
            <Button
              onClick={onExtend}
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700 text-white"
            >
              Extend Session
            </Button>
            <Button
              onClick={onLogout}
              size="sm"
              variant="outline"
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}





