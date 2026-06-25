'use client';

import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/ui/gradient-button';
import { ArrowRight } from 'lucide-react';

interface CTAButtonProps {
  variant?: 'default' | 'green';
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export function CTAButton({ variant, children, className, href = '/templates' }: CTAButtonProps) {
  const router = useRouter();

  return (
    <GradientButton
      onClick={() => router.push(href)}
      variant={variant}
      className={className}
    >
      {children}
    </GradientButton>
  );
}

export function HeroCTAButtons() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <GradientButton
        onClick={() => router.push('/templates')}
        className="px-8 py-6 text-lg"
      >
        Create a New Resume
        <ArrowRight className="ml-2 h-5 w-5" />
      </GradientButton>
      <GradientButton
        onClick={() => router.push('/templates')}
        variant="green"
        className="px-8 py-6 text-lg"
      >
        Improve My Resume
      </GradientButton>
    </div>
  );
}
