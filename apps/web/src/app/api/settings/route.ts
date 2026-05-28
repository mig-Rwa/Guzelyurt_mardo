import { NextRequest } from 'next/server';
import { db, COLLECTIONS } from '@/lib/server/firestore';
import { createAuditLog } from '@/lib/server/firestore-helpers';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

export async function GET(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const { searchParams } = new URL(request.url);
    const logsOnly = searchParams.get('logs') === 'true';

    if (logsOnly) {
      // Get audit logs
      const limit = parseInt(searchParams.get('limit') || '50');
      const snapshot = await db
        .collection(COLLECTIONS.AUDIT_LOGS)
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toISOString?.() || doc.data().createdAt,
      }));

      return ok(logs, { meta: { total: logs.length } });
    }

    // Get settings
    const doc = await db.collection(COLLECTIONS.ADMIN_SETTINGS).doc('global').get();

    if (!doc.exists) {
      // Return default settings
      return ok({
        emailNotifications: true,
        autoModeration: false,
        darkMode: true,
        businessHours: { open: '09:00', close: '22:00' },
        deliveryRadius: 15,
        minOrderValue: 50,
      });
    }

    return ok(doc.data());
  } catch (error) {
    console.error('Get settings error:', error);
    return fail('Failed to fetch settings', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const body = await request.json();

    const docRef = db.collection(COLLECTIONS.ADMIN_SETTINGS).doc('global');
    const doc = await docRef.get();

    const existing = doc.exists ? doc.data() : {};

    // Merge with existing settings
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date(),
      updatedBy: ctx.userId,
    };

    await docRef.set(updated);

    // Log admin action
    await createAuditLog('UPDATE_SETTINGS', ctx.userId, {
      changes: body,
    });

    return ok(updated);
  } catch (error) {
    console.error('Update settings error:', error);
    return fail('Failed to update settings', 500);
  }
}
