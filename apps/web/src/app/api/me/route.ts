import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // In production, verify Firebase auth token from cookies/headers
    // const token = cookies().get('__session')?.value;
    // if (!token) { return unauthorized }
    // const decodedToken = await adminAuth.verifyIdToken(token);
    // const userProfile = await adminDb.collection('users').doc(decodedToken.uid).get();
    
    // Demo response
    return NextResponse.json({
      success: true,
      data: {
        uid: 'demo-user',
        email: 'demo@mardo.cafe',
        displayName: 'Demo User',
        language: 'en',
        loyaltyStamps: 3,
        ordersCount: 5,
      },
    });
  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }
}
