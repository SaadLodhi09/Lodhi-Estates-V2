import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a numeric price into a compact, currency-agnostic display string.
 * e.g. 185000000 -> "PKR 18.5 Cr"
 */
export function formatPrice(value: number): string {
  const crore = value / 10_000_000;
  return `PKR ${crore.toFixed(crore >= 10 ? 0 : 1)} Cr`;
}
