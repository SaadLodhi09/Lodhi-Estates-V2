import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EyebrowProps {
  children: ReactNode;
  tone?: 'moss' | 'paper' | 'stone';
  className?: string;
}

const toneClasses: Record<NonNullable<EyebrowProps['tone']>, string> = {
  moss: 'text-moss',
  paper: 'text-paper/80',
  stone: 'text-stone',
};

export function Eyebrow({ children, tone = 'moss', className }: EyebrowProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest2',
        toneClasses[tone],
        className
      )}
    >
      <span className="h-px w-6 bg-current opacity-60" />
      {children}
    </span>
  );
}
