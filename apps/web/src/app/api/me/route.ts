import { NextRequest } from 'next/server';
import { getRequestContext, ok } from '@/lib/server/api';

export async function GET(request: NextRequest) {
  const ctx = await getRequestContext(request);

  const profile = {
    uid: ctx.userId,
    email: ctx.email || 'guest@mardo.cafe',
    displayName: ctx.email ? ctx.email.split('@')[0] : 'Guest User',
    language: 'en',
    role: ctx.role,
    loyaltyStamps: 3,
    ordersCount: 5,
    authenticated: ctx.isAuthenticated,
  };

  return ok(profile);
}
