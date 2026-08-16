import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpecTagProps {
  rows: { label: string; value: string }[];
  className?: string;
  align?: 'left' | 'right';
}

/**
 * The site's signature device: a small monospace annotation, styled after an
 * architectural drawing's spec block, laid over photography. Appears on the
 * hero, listing cards, and property panels so every image carries the same
 * "documented like a building" language described in the brand copy.
 */
export function SpecTag({ rows, className, align = 'left' }: SpecTagProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'border border-paper/25 bg-ink/40 px-4 py-3 font-mono text-[11px] text-paper backdrop-blur-md',
        align === 'right' && 'text-right',
        className
      )}
    >
      {rows.map((row, i) => (
        <div
          key={row.label}
          className={cn(
            'flex items-center gap-4 py-1',
            align === 'right' && 'flex-row-reverse',
            i !== rows.length - 1 && 'border-b border-paper/15'
          )}
        >
          <span className="uppercase tracking-widest2 text-paper/55">{row.label}</span>
          <span className="text-paper">{row.value}</span>
        </div>
      ))}
    </motion.div>
  );
}
