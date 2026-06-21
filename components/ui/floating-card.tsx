'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface FloatingCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  perspective?: boolean;
}

export function FloatingCard({ 
  children, 
  className, 
  delay = 0,
  perspective = true 
}: FloatingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: perspective ? 20 : 0 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
      }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.16, 1, 0.3, 1] // Custom easing for smooth animation
      }}
      whileHover={{ 
        y: -10,
        rotateX: perspective ? -5 : 0,
        rotateY: perspective ? 5 : 0,
        transition: { duration: 0.3 }
      }}
      className={cn(
        'transform-gpu perspective-1000',
        className
      )}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity" />
        <div className="relative">
          {children}
        </div>
      </div>
    </motion.div>
  );
}
