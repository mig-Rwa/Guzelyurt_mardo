import { NextRequest, NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

export type AppRole = 'user' | 'admin' | 'moderator';

export interface RequestContext {
  userId: string;
  email: string;
  role: AppRole;
  isAuthenticated: boolean;
  isModerator: boolean;
  isAdmin: boolean;
}

const OWNER_EMAIL = (process.env.ADMIN_OWNER_EMAIL || 'miguelmbabatunga31@gmail.com').toLowerCase();
const ALLOW_DEV_HEADER_AUTH =
  process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_HEADER_AUTH === 'true';

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};

function normalizeRole(input: unknown): AppRole {
  if (input === 'admin' || input === true || input === 'true') {
    return 'admin';
  }

  if (input === 'moderator') {
    return 'moderator';
  }

  return 'user';
}

function getBearerToken(request: NextRequest): string | null {
  const authorization = request.headers.get('authorization');
  if (!authorization) return null;

  const [scheme, token] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;

  return token;
}

function getRoleFromClaims(claims: admin.auth.DecodedIdToken): AppRole {
  return normalizeRole(claims.role ?? claims.admin ?? claims.moderator);
}

function buildContext(userId: string, email: string, role: AppRole): RequestContext {
  const normalizedEmail = email.toLowerCase();
  const isAuthenticated = userId !== 'guest' || normalizedEmail.length > 0;
  const isAdmin = role === 'admin' || normalizedEmail === OWNER_EMAIL;
  const isModerator = isAdmin || role === 'moderator';

  return {
    userId,
    email: normalizedEmail,
    role: isAdmin ? 'admin' : role,
    isAuthenticated,
    isModerator,
    isAdmin,
  };
}

export async function getRequestContext(request: NextRequest): Promise<RequestContext> {
  const token = getBearerToken(request);

  if (token) {
    try {
      const decoded = await admin.auth().verifyIdToken(token);
      return buildContext(decoded.uid, decoded.email ?? '', getRoleFromClaims(decoded));
    } catch (error) {
      console.warn('Invalid Firebase ID token supplied to API route:', error);
      return buildContext('guest', '', 'user');
    }
  }

  // Header-based auth is intentionally disabled in production because browsers can spoof it.
  // Keep it available only for explicit local development/emulator workflows.
  if (ALLOW_DEV_HEADER_AUTH) {
    const userId = request.headers.get('x-user-id') ?? 'guest';
    const email = request.headers.get('x-user-email') ?? '';
    const role = normalizeRole(request.headers.get('x-user-role'));
    return buildContext(userId, email, role);
  }

  return buildContext('guest', '', 'user');
}

export function ok<T>(data: T, init?: { status?: number; meta?: Record<string, unknown> }) {
  const payload = {
    success: true,
    data,
    ...(init?.meta ?? {}),
  };
  return NextResponse.json(payload, {
    status: init?.status ?? 200,
    headers: jsonHeaders,
  });
}

export function fail(error: string, status = 400, meta?: Record<string, unknown>) {
  const payload = {
    success: false,
    error,
    ...(meta ?? {}),
  };
  return NextResponse.json(payload, {
    status,
    headers: jsonHeaders,
  });
}

export function methodNotAllowed() {
  return fail('Method not allowed', 405);
}

export function unauthorized() {
  return fail('Unauthorized', 401);
}

export function forbidden() {
  return fail('Forbidden', 403);
}

export function parseBooleanParam(value: string | null): boolean {
  return value === '1' || value === 'true';
}
