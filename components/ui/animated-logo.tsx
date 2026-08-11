'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function AnimatedLogo({ size = 'md', showText = true, className = '' }: AnimatedLogoProps) {
  const sizes = {
    sm: { img: 36, text: 'text-lg' },
    md: { img: 40, text: 'text-xl' },
    lg: { img: 52, text: 'text-2xl' },
  };

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div 
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/logo.jpeg"
          alt="createresume.co logo"
          width={sizes[size].img}
          height={sizes[size].img}
          className="rounded-xl"
        />
      </motion.div>
      {showText && (
        <div>
          <h1 className={`${sizes[size].text} font-bold gradient-text leading-none`}>createresume.co</h1>
        </div>
      )}
    </Link>
  );
}
