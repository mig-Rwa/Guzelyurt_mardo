import { NextRequest } from 'next/server';
import { OrderCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';

function generateOrderNumber(): string {
  return 'MRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export async function POST(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const body = await request.json();
    
    // Validate input
    const validationResult = OrderCreateSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return fail('Invalid order data', 400);
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
      userId: ctx.userId,
      items: data.items,
      total,
      orderType: data.orderType,
      paymentMethod: data.paymentMethod,
      status: 'pending' as OrderStatus,
      customer: data.customer,
      createdAt: new Date().toISOString(),
      estimatedTime: data.orderType === 'delivery' ? 40 : 20,
    };
    
    // In production: await adminDb.collection('orders').add(order);
    db.orders.push(order);
    
    return ok(order, {
      status: 201,
      meta: {
        orderNumber: order.orderNumber,
        estimatedTime: order.estimatedTime,
      },
    });
  } catch (error) {
    console.error('Order error:', error);
    return fail('Failed to create order', 500);
  }
}

export async function GET(request: NextRequest) {
  const ctx = getRequestContext(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const includeAll = searchParams.get('all') === 'true';

  let result = includeAll && ctx.isAdmin
    ? [...db.orders]
    : db.orders.filter((o) => o.userId === ctx.userId);

  if (status) {
    result = result.filter((o) => o.status === status);
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ok(result, { meta: { total: result.length } });
}

export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const orderId = body?.id as string | undefined;
    const status = body?.status as OrderStatus | undefined;

    if (!orderId || !status) {
      return fail('Order id and status are required', 400);
    }

    const allowed: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) {
      return fail('Invalid status', 400);
    }

    const existing = db.orders.find((o) => o.id === orderId);
    if (!existing) {
      return fail('Order not found', 404);
    }

    existing.status = status;
    return ok(existing);
  } catch (error) {
    console.error('Order update error:', error);
    return fail('Failed to update order', 500);
  }
}
