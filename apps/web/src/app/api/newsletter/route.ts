import { NextRequest } from 'next/server';
import { NewsletterSubscribeSchema } from '@shared';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = NewsletterSubscribeSchema.safeParse(body);
    if (!validationResult.success) {
      return fail('Invalid email', 400);
    }
 
    const { email, language } = validationResult.data;
    const normalizedEmail = email.toLowerCase();
    
    // Check if already subscribed
    const existing = db.subscribers.find((s) => s.email === normalizedEmail);
    if (existing) {
      return ok({ email: normalizedEmail, subscribed: true }, { meta: { message: 'Already subscribed' } });
    }
    
    // Create subscription
    const subscriber = {
      email: normalizedEmail,
      language: language || 'en',
      subscribedAt: new Date().toISOString(),
    };
    
    // In production: await adminDb.collection('newsletterSubscribers').doc(email).set(subscriber);
    db.subscribers.push(subscriber);
    
    return ok(subscriber, { status: 201, meta: { message: 'Successfully subscribed' } });
  } catch (error) {
    console.error('Newsletter error:', error);
    return fail('Failed to subscribe', 500);
  }
}

export async function GET(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  return ok(db.subscribers, { meta: { total: db.subscribers.length } });
}
