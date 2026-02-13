import { NextRequest, NextResponse } from 'next/server';
import { NewsletterSubscribeSchema } from '@shared';

// In production, this would use Firestore
const subscribers: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = NewsletterSubscribeSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      );
    }
    
    const { email, language } = validationResult.data;
    
    // Check if already subscribed
    const existing = subscribers.find(s => s.email === email);
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Already subscribed',
      });
    }
    
    // Create subscription
    const subscriber = {
      email,
      language: language || 'en',
      subscribedAt: new Date().toISOString(),
    };
    
    // In production: await adminDb.collection('newsletterSubscribers').doc(email).set(subscriber);
    subscribers.push(subscriber);
    
    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed',
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to subscribe' },
      { status: 500 }
    );
  }
}
