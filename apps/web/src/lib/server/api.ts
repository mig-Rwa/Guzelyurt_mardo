import { NextRequest, NextResponse } from 'next/server';

export type AppRole = 'user' | 'admin' | 'moderator';

export interface RequestContext {
  userId: string;
  email: string;
  role: AppRole;
  isAuthenticated: boolean;
  isModerator: boolean;
  isAdmin: boolean;
}

const OWNER_EMAIL = 'miguelmbabatunga31@gmail.com';

const jsonHeaders = {
  'Cache-Control': 'no-store',
  'Content-Type': 'application/json',
};

function normalizeRole(input: string | null): AppRole {
  if (input === 'admin' || input === 'moderator') {
    return input;
  }
  return 'user';
}

export function getRequestContext(request: NextRequest): RequestContext {
  const userId = request.headers.get('x-user-id') ?? 'guest';
  const email = (request.headers.get('x-user-email') ?? '').toLowerCase();
  const role = normalizeRole(request.headers.get('x-user-role'));
  const isAuthenticated = userId !== 'guest' || email.length > 0;
  const isAdmin = role === 'admin' || email === OWNER_EMAIL;
  const isModerator = isAdmin || role === 'moderator';

  return {
    userId,
    email,
    role,
    isAuthenticated,
    isModerator,
    isAdmin,
  };
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
