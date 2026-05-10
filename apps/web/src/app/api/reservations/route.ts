import { NextRequest } from 'next/server';
import { ReservationCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import {
  createReservation,
  getReservations,
  getAllReservations,
  updateReservation,
  deleteReservation,
  createAuditLog,
} from '@/lib/server/firestore-helpers';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export async function POST(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const body = await request.json();

    // Validate input
    const validationResult = ReservationCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return fail('Invalid reservation data', 400);
    }

    const data = validationResult.data;

    // Create reservation
    const reservation = {
      id: uuidv4(),
      ...data,
      userId: ctx.userId,
      status: 'pending' as ReservationStatus,
      createdAt: new Date().toISOString(),
    };

    await createReservation(reservation);
    return ok(reservation, { status: 201 });
  } catch (error) {
    console.error('Reservation error:', error);
    return fail('Failed to create reservation', 500);
  }
}

export async function GET(request: NextRequest) {
  const ctx = getRequestContext(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const includeAll = searchParams.get('all') === 'true';

  try {
    let result = includeAll && ctx.isAdmin
      ? await getAllReservations(status || undefined)
      : await getReservations(ctx.userId);

    if (status && !includeAll) {
      result = result.filter((r: any) => r.status === status);
    }

    return ok(result, { meta: { total: result.length } });
  } catch (error) {
    console.error('Get reservations error:', error);
    return fail('Failed to fetch reservations', 500);
  }
}

export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const reservationId = body?.id as string | undefined;
    const status = body?.status as ReservationStatus | undefined;
    const notes = body?.notes as string | undefined;

    if (!reservationId) {
      return fail('Reservation id is required', 400);
    }

    const allowed: ReservationStatus[] = ['pending', 'confirmed', 'cancelled'];
    if (status && !allowed.includes(status)) {
      return fail('Invalid status', 400);
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (notes) updates.notes = notes;

    const updated = await updateReservation(reservationId, updates);

    // Log admin action
    await createAuditLog('UPDATE_RESERVATION', ctx.userId, {
      reservationId,
      changes: updates,
    });

    return ok(updated);
  } catch (error) {
    console.error('Reservation update error:', error);
    return fail('Failed to update reservation', 500);
  }
}

export async function DELETE(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const { searchParams } = new URL(request.url);
    const reservationId = searchParams.get('id');

    if (!reservationId) {
      return fail('Reservation id is required', 400);
    }

    await deleteReservation(reservationId);

    // Log admin action
    await createAuditLog('DELETE_RESERVATION', ctx.userId, {
      reservationId,
    });

    return ok({ success: true });
  } catch (error) {
    console.error('Reservation delete error:', error);
    return fail('Failed to delete reservation', 500);
  }
}
