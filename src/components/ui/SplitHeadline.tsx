import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SplitHeadlineProps {
  lines: string[];
  className?: string;
  delay?: number;
}

/**
 * Reveals a headline one line at a time on mount, each line clipped by an
 * overflow mask so it rises into place rather than simply fading — the
 * orchestrated hero moment described in the design brief.
 */
export function SplitHeadline({ lines, className, delay = 0 }: SplitHeadlineProps) {
  return (
    <span className={cn('block', className)}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            transition={{
              duration: 1,
              delay: delay + i * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
