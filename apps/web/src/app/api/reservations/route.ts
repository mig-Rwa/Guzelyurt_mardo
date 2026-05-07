import { NextRequest } from 'next/server';
import { ReservationCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
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
    
    // In production: await adminDb.collection('reservations').add(reservation);
    db.reservations.push(reservation);
    
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

  let result = includeAll && ctx.isAdmin
    ? [...db.reservations]
    : db.reservations.filter((r) => r.userId === ctx.userId);

  if (status) {
    result = result.filter((r) => r.status === status);
  }

  result.sort((a, b) => {
    const aTime = new Date(`${a.date}T${a.time}`).getTime();
    const bTime = new Date(`${b.date}T${b.time}`).getTime();
    return aTime - bTime;
  });

  return ok(result, { meta: { total: result.length } });
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

    if (!reservationId || !status) {
      return fail('Reservation id and status are required', 400);
    }

    const allowed: ReservationStatus[] = ['pending', 'confirmed', 'cancelled'];
    if (!allowed.includes(status)) {
      return fail('Invalid status', 400);
    }

    const existing = db.reservations.find((r) => r.id === reservationId);
    if (!existing) {
      return fail('Reservation not found', 404);
    }

    existing.status = status;
    return ok(existing);
  } catch (error) {
    console.error('Reservation update error:', error);
    return fail('Failed to update reservation', 500);
  }
}
