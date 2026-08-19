import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSavedPropertyIds, useToggleSavedProperty } from '@/hooks/useSavedProperties';
import { cn } from '@/lib/utils';

interface SaveButtonProps {
  propertyId: string;
  className?: string;
  size?: number;
}

export function SaveButton({ propertyId, className, size = 16 }: SaveButtonProps) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: savedIds } = useSavedPropertyIds();
  const toggle = useToggleSavedProperty();

  const isSaved = savedIds?.has(propertyId) ?? false;

  function handleClick(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/account/sign-in');
      return;
    }

    toggle.mutate({ propertyId, isSaved });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={toggle.isPending}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved properties' : 'Save this property'}
      title={isAuthenticated ? (isSaved ? 'Saved' : 'Save') : 'Sign in to save'}
      className={cn(
        'flex h-8 w-8 items-center justify-center bg-ink/50 backdrop-blur-sm transition-colors hover:bg-ink/70 disabled:opacity-60',
        className
      )}
    >
      <Heart
        size={size}
        strokeWidth={1.75}
        className={cn('transition-colors', isSaved ? 'fill-brass text-brass' : 'text-paper')}
      />
    </button>
  );
}
