'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    if (adLoadedRef.current) return;
    adLoadedRef.current = true;

    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div ref={adRef} className={`ad-banner-container ${className}`}>
      {slot ? (
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        ></ins>
      ) : (
        // Placeholder until AdSense is approved
        <div className="w-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-4 text-center">
          <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Advertisement</div>
          <div className="h-[200px] flex items-center justify-center bg-white rounded-lg border border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-sm text-gray-500 font-medium">Ad Space</p>
              <p className="text-xs text-gray-400 mt-1">Upgrade to Premium to remove ads</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
