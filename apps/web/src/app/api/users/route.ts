import { NextRequest } from 'next/server';
import {
  getAllUsers,
  getUserProfile,
  updateUserRole,
  createAuditLog,
} from '@/lib/server/firestore-helpers';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

export async function GET(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (userId) {
      // Get single user
      const user = await getUserProfile(userId);
      if (!user) {
        return fail('User not found', 404);
      }
      return ok(user);
    }

    // Get all users (admin only)
    const users = await getAllUsers();
    return ok(users, { meta: { total: users.length } });
  } catch (error) {
    console.error('Get users error:', error);
    return fail('Failed to fetch users', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const userId = body?.id as string | undefined;
    const role = body?.role as 'user' | 'admin' | 'moderator' | undefined;

    if (!userId) {
      return fail('User id is required', 400);
    }

    if (role && !['user', 'admin', 'moderator'].includes(role)) {
      return fail('Invalid role', 400);
    }

    if (role) {
      const updated = await updateUserRole(userId, role);

      // Log admin action
      await createAuditLog('UPDATE_USER_ROLE', ctx.userId, {
        targetUserId: userId,
        newRole: role,
      });

      return ok(updated);
    }

    return fail('No updates provided', 400);
  } catch (error) {
    console.error('Update user error:', error);
    return fail('Failed to update user', 500);
  }
}
