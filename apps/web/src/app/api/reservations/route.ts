import { NextRequest } from 'next/server';
import { ReservationCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

type StoredReservation = {
  id: string;
  userId: string;
  date: string;
  reservationDate: string;
  time: string;
  guests: number;
  guestCount: number;
  name: string;
  customerName: string;
  phone: string;
  email?: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
};

function reservationsStore() {
  return db.reservations as unknown as StoredReservation[];
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getRequestContext(request);
    const body = await request.json();

    const validationResult = ReservationCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return fail('Invalid reservation data', 400);
    }

    const data = validationResult.data;
    const reservation: StoredReservation = {
      id: uuidv4(),
      ...data,
      userId: ctx.userId,
      reservationDate: data.date,
      customerName: data.name,
      guestCount: data.guests,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    reservationsStore().push(reservation);
    return ok(reservation, { status: 201 });
  } catch (error) {
    console.error('Reservation error:', error);
    return fail('Failed to create reservation', 500);
  }
}

export async function GET(request: NextRequest) {
  const ctx = await getRequestContext(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const includeAll = searchParams.get('all') === 'true';

  let result = includeAll && ctx.isAdmin
    ? [...reservationsStore()]
    : reservationsStore().filter((r) => r.userId === ctx.userId);

  if (status) {
    result = result.filter((r) => r.status === status);
  }

  result.sort((a, b) => new Date(b.reservationDate || b.date).getTime() - new Date(a.reservationDate || a.date).getTime());
  return ok(result, { meta: { total: result.length } });
}

export async function PATCH(request: NextRequest) {
  const ctx = await getRequestContext(request);
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

    const existing = reservationsStore().find((r) => r.id === reservationId);
    if (!existing) {
      return fail('Reservation not found', 404);
    }

    if (status) existing.status = status;
    if (notes) existing.notes = notes;

    return ok(existing);
  } catch (error) {
    console.error('Reservation update error:', error);
    return fail('Failed to update reservation', 500);
  }
}

export async function DELETE(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  const { searchParams } = new URL(request.url);
  const reservationId = searchParams.get('id');

  if (!reservationId) {
    return fail('Reservation id is required', 400);
  }

  const index = reservationsStore().findIndex((r) => r.id === reservationId);
  if (index === -1) {
    return fail('Reservation not found', 404);
  }

  reservationsStore().splice(index, 1);
  return ok({ success: true });
}
