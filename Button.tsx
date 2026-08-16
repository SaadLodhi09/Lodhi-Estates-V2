import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type Variant = 'solid' | 'outline' | 'ghost';
type Tone = 'ink' | 'paper';

const base =
  'group relative inline-flex items-center gap-2 overflow-hidden font-mono text-[11px] uppercase tracking-widest2 transition-colors duration-500 ease-premium disabled:cursor-not-allowed disabled:opacity-50';

const variantClasses: Record<Variant, Record<Tone, string>> = {
  solid: {
    ink: 'bg-ink text-paper px-7 py-4 hover:bg-moss',
    paper: 'bg-paper text-ink px-7 py-4 hover:bg-moss hover:text-paper',
  },
  outline: {
    ink: 'border border-ink/30 text-ink px-7 py-4 hover:border-ink',
    paper: 'border border-paper/40 text-paper px-7 py-4 hover:border-paper',
  },
  ghost: {
    ink: 'text-ink px-0 py-1',
    paper: 'text-paper px-0 py-1',
  },
};

interface SharedProps {
  variant?: Variant;
  tone?: Tone;
  icon?: boolean;
  children: ReactNode;
  className?: string;
}

function Content({ children, icon }: { children: ReactNode; icon?: boolean }) {
  return (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowUpRight
          size={14}
          strokeWidth={1.75}
          className="transition-transform duration-500 ease-premium group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );
}

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' };
type ButtonAsAnchor = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: 'a' };
type ButtonAsLink = SharedProps & LinkProps & { as: 'link' };

type ButtonProps = ButtonAsButton | ButtonAsAnchor | ButtonAsLink;

export const Button = forwardRef<HTMLElement, ButtonProps>((props, ref) => {
  const { variant = 'solid', tone = 'ink', icon = true, children, className, ...rest } = props;
  const classes = cn(base, variantClasses[variant][tone], className);

  if (props.as === 'link') {
    const { to, ...linkRest } = rest as LinkProps;
    return (
      <Link ref={ref as never} to={to} className={classes} {...linkRest}>
        <Content icon={icon}>{children}</Content>
      </Link>
    );
  }

  if (props.as === 'a') {
    return (
      <a ref={ref as never} className={classes} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        <Content icon={icon}>{children}</Content>
      </a>
    );
  }

  return (
    <button ref={ref as never} className={classes} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      <Content icon={icon}>{children}</Content>
    </button>
  );
});

Button.displayName = 'Button';
