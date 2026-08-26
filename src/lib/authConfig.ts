/**
 * Configuration and helpers for single-admin access control.
 * Only designated admin emails are authorized to access the admin dashboard.
 */

export const DEFAULT_ADMIN_EMAILS = [
  'saadlodhi2022@gmail.com',
  'admin@lodhiestates.com',
];

/**
 * Returns the list of authorized admin emails (lowercased).
 */
export function getAdminEmails(): string[] {
  const envAdmin = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
  const list = DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase());
  if (envAdmin && !list.includes(envAdmin)) {
    list.unshift(envAdmin);
  }
  return list;
}

/**
 * Checks if a given email string matches any authorized admin email.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return getAdminEmails().includes(normalized);
}

/**
 * Validates whether an authenticated user is an authorized admin.
 */
export function isUserAdmin(
  user: { email?: string | null } | null,
  profile?: { role?: string; email?: string } | null
): boolean {
  if (!user?.email) return false;
  const userEmailMatches = isAdminEmail(user.email);
  if (profile?.role === 'admin') return true;
  return userEmailMatches;
}
