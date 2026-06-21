'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';
import Link from 'next/link';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function AnimatedLogo({ size = 'md', showText = true, className = '' }: AnimatedLogoProps) {
  const sizes = {
    sm: { icon: 'h-5 w-5', container: 'p-2', text: 'text-lg' },
    md: { icon: 'h-6 w-6', container: 'p-2', text: 'text-xl' },
    lg: { icon: 'h-8 w-8', container: 'p-3', text: 'text-2xl' },
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className={`relative bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl ${sizes[size].container}`}>
          <FileText className={`${sizes[size].icon} text-white`} />
        </div>
      </motion.div>
      {showText && (
        <div>
          <h1 className={`${sizes[size].text} font-bold gradient-text leading-none`}>createresume.co</h1>
        </div>
      )}
    </Link>
  );
}
