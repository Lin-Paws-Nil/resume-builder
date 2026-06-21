'use client';
import { ReactLenis } from 'lenis/react';
import React, { forwardRef, ReactNode } from 'react';

interface StickyScrollProps {
  children: ReactNode;
}

const StickyScroll = forwardRef<HTMLElement, StickyScrollProps>(({ children }, ref) => {
  return (
    <ReactLenis root>
      <main className='bg-gradient-to-br from-slate-50 via-white to-slate-50' ref={ref}>
        {children}
      </main>
    </ReactLenis>
  );
});

StickyScroll.displayName = 'StickyScroll';

export default StickyScroll;
