import { NextRequest, NextResponse } from 'next/server';
import { ReservationCreateSchema } from '@shared/schemas';
import { v4 as uuidv4 } from 'uuid';

// In production, this would use Firestore
const reservations: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = ReservationCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid reservation data' },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Create reservation
    const reservation = {
      id: uuidv4(),
      ...data,
      userId: 'guest', // Would be from auth token in production
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    
    // In production: await adminDb.collection('reservations').add(reservation);
    reservations.push(reservation);
    
    return NextResponse.json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.error('Reservation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create reservation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // In production: verify auth and fetch user's reservations from Firestore
  return NextResponse.json({
    success: true,
    data: reservations,
  });
}
