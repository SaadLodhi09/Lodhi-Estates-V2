/**
 * Configuration and helpers for single-admin access control.
 * Only the designated admin email is authorized to access the admin dashboard.
 */

export const DEFAULT_ADMIN_EMAIL = 'admin@lodhiestates.com';

/**
 * Returns the single authorized admin email (lowercased), configured via
 * VITE_ADMIN_EMAIL or the default 'admin@lodhiestates.com'.
 */
export function getAdminEmail(): string {
  const envAdmin = import.meta.env.VITE_ADMIN_EMAIL?.trim().toLowerCase();
  return envAdmin && envAdmin.length > 0 ? envAdmin : DEFAULT_ADMIN_EMAIL.toLowerCase();
}

/**
 * Checks if a given email string matches the designated single admin email.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return email.trim().toLowerCase() === getAdminEmail();
}

/**
 * Validates whether an authenticated user is the authorized admin.
 * Enforces strictly that the user's email matches the authorized admin email.
 */
export function isUserAdmin(
  user: { email?: string | null } | null,
  profile?: { role?: string; email?: string } | null
): boolean {
  if (!user?.email) return false;
  const userEmailMatches = isAdminEmail(user.email);
  if (!userEmailMatches) return false;

  // If profile is loaded with role information, require admin role or authorized email match
  if (profile && profile.role) {
    return profile.role === 'admin' || userEmailMatches;
  }

  return userEmailMatches;
}
