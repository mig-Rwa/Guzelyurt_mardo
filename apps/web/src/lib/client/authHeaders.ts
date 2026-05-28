type ClientUser = {
  uid?: string | null;
  email?: string | null;
  role?: string | null;
} | null | undefined;

interface AuthHeaderOptions {
  json?: boolean;
}

/**
 * Builds auth headers for Next.js API calls.
 *
 * Production uses a Firebase ID token in the Authorization header. The legacy
 * x-user-* headers are only sent when Firebase is unavailable so local demo
 * mode can still work if ALLOW_DEV_HEADER_AUTH=true is set server-side.
 */
export async function getAuthHeaders(user?: ClientUser, options: AuthHeaderOptions = {}) {
  const headers: Record<string, string> = {};

  if (options.json) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const { auth, isConfigured } = await import('@/lib/firebase');
    const token = isConfigured && auth?.currentUser
      ? await auth.currentUser.getIdToken()
      : null;

    if (token) {
      headers.Authorization = `Bearer ${token}`;
      return headers;
    }
  } catch (error) {
    console.warn('Could not load Firebase auth token for API request:', error);
  }

  if (process.env.NODE_ENV !== 'production' && user) {
    headers['x-user-id'] = user.uid || 'guest';
    headers['x-user-email'] = user.email || '';
    headers['x-user-role'] = user.role || 'user';
  }

  return headers;
}
