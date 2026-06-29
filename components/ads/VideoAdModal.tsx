'use client';

import { useState, useEffect, useCallback } from 'react';
import { Play } from 'lucide-react';

interface VideoAdModalProps {
  isOpen: boolean;
  onComplete: () => void;
  onClose: () => void;
  adDurationSeconds?: number;
}

export function VideoAdModal({
  isOpen,
  onComplete,
  onClose,
  adDurationSeconds = 30,
}: VideoAdModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(adDurationSeconds);
  const [canSkip, setCanSkip] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeRemaining(adDurationSeconds);
      setCanSkip(false);
      return;
    }

    // Lock body scroll while modal is open
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const timeout = setTimeout(() => {
      setCanSkip(true);
    }, adDurationSeconds * 1000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      document.body.style.overflow = '';
    };
  }, [isOpen, adDurationSeconds]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && canSkip) {
        onComplete();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, canSkip, onComplete]);

  const handleSkip = useCallback(() => {
    if (canSkip) {
      onComplete();
    }
  }, [canSkip, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-300 font-medium">
              Watch this short ad to download your resume for free
            </span>
          </div>
          <div className="flex items-center gap-3">
            {!canSkip && (
              <span className="text-sm text-gray-400">
                Skip in {timeRemaining}s
              </span>
            )}
            {canSkip && (
              <button
                onClick={handleSkip}
                className="px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Download Now &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Ad Content Area */}
        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center px-8">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Play className="h-10 w-10 text-white fill-white" />
            </div>
            <p className="text-white text-lg font-semibold mb-2">
              Sponsored Content
            </p>
            <p className="text-gray-400 text-sm max-w-md">
              Your resume is being prepared. This brief ad supports our free service.
            </p>

            {/* Progress bar */}
            <div className="mt-8 max-w-sm mx-auto">
              <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${((adDurationSeconds - timeRemaining) / adDurationSeconds) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">Ad playing</span>
                <span className="text-xs text-gray-500">{timeRemaining}s remaining</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Upgrade to Premium to remove ads and unlock AI features
          </p>
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Cancel download
          </button>
        </div>
      </div>
    </div>
  );
}
