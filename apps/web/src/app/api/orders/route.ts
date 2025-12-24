import { NextRequest, NextResponse } from 'next/server';
import { OrderCreateSchema } from '@shared/schemas';
import { v4 as uuidv4 } from 'uuid';

function generateOrderNumber(): string {
  return 'MRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

// In production, this would use Firestore
const orders: any[] = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validationResult = OrderCreateSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Calculate total
    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    
    // Create order
    const order = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
      userId: 'guest', // Would be from auth token in production
      items: data.items,
      total,
      orderType: data.orderType,
      paymentMethod: data.paymentMethod,
      status: 'pending',
      customer: data.customer,
      createdAt: new Date().toISOString(),
      estimatedTime: data.orderType === 'delivery' ? 40 : 20,
    };
    
    // In production: await adminDb.collection('orders').add(order);
    orders.push(order);
    
    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      estimatedTime: order.estimatedTime,
      data: order,
    });
  } catch (error) {
    console.error('Order error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // In production: verify auth and fetch user's orders from Firestore
  return NextResponse.json({
    success: true,
    data: orders,
  });
}
