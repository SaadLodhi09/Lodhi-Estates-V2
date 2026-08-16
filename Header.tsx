import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Container } from './Container';
import { Button } from '@/components/ui/Button';
import { navLinks } from '@/data/content';
import { useScrolled } from '@/hooks/useScrolled';
import { cn } from '@/lib/utils';

export function Header() {
  const scrolled = useScrolled(48);
  const [open, setOpen] = useState(false);
  const solid = scrolled || open;

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-premium',
        solid ? 'bg-paper/95 backdrop-blur-md border-b border-line' : 'bg-transparent'
      )}
    >
      <Container className="flex h-20 items-center justify-between md:h-24">
        <Link
          to="/"
          onClick={() => setOpen(false)}
          className={cn(
            'font-display text-lg tracking-tight transition-colors duration-500',
            solid ? 'text-ink' : 'text-paper'
          )}
        >
          Lodhi Estates
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'font-mono text-[11px] uppercase tracking-widest2 transition-colors duration-500',
                  solid ? 'text-ink/70 hover:text-ink' : 'text-paper/75 hover:text-paper',
                  isActive && (solid ? 'text-moss' : 'text-paper')
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button as="link" to="/contact" variant={solid ? 'solid' : 'outline'} tone={solid ? 'ink' : 'paper'} icon={false}>
            Book a Viewing
          </Button>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          className={cn('md:hidden', solid ? 'text-ink' : 'text-paper')}
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </Container>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-paper md:hidden"
          >
            <Container className="flex flex-col gap-6 py-8">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn('font-display text-3xl text-ink', isActive && 'text-moss')
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <Button as="link" to="/contact" onClick={() => setOpen(false)} className="mt-4 w-fit">
                Book a Viewing
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
