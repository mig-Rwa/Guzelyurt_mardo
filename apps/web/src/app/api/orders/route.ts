import { NextRequest } from 'next/server';
import { OrderCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/server/mockDb';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';
import { menuItems } from '@shared';

function generateOrderNumber(): string {
  return 'MRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

// Initialize menu items in db on first load (if empty)
function initializeMenu() {
  if (db.menuItems.length === 0) {
    db.menuItems = menuItems.map(item => ({
      ...item,
      stock: item.stock || 50,
    }));
  }
}

export async function POST(request: NextRequest) {
  try {
    const ctx = await getRequestContext(request);
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
      paymentStatus: 'pending' as PaymentStatus,
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
  const ctx = await getRequestContext(request);
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const includeAll = searchParams.get('all') === 'true';

  let result = includeAll && ctx.isModerator
    ? [...db.orders]
    : db.orders.filter((o) => o.userId === ctx.userId);

  if (status) {
    result = result.filter((o) => o.status === status);
  }

  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return ok(result, { meta: { total: result.length } });
}

export async function PATCH(request: NextRequest) {
  const ctx = await getRequestContext(request);
  if (!ctx.isModerator) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const orderId = body?.id as string | undefined;
    const status = body?.status as OrderStatus | undefined;
    const paymentStatus = body?.paymentStatus as PaymentStatus | undefined;

    if (!orderId || (!status && !paymentStatus)) {
      return fail('Order id and an update value are required', 400);
    }

    if (paymentStatus && !ctx.isAdmin) {
      return forbidden();
    }

    const allowed: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    const allowedPayment: PaymentStatus[] = ['pending', 'verified', 'rejected'];

    if (status && !allowed.includes(status)) {
      return fail('Invalid status', 400);
    }

    if (paymentStatus && !allowedPayment.includes(paymentStatus)) {
      return fail('Invalid payment status', 400);
    }

    const existing = db.orders.find((o) => o.id === orderId);
    if (!existing) {
      return fail('Order not found', 404);
    }

    // Decrement stock when payment is verified
    if (paymentStatus === 'verified' && existing.paymentStatus !== 'verified') {
      initializeMenu();
      
      for (const item of existing.items) {
        const menuItem = db.menuItems.find(m => m.id === item.id);
        if (menuItem) {
          menuItem.stock = Math.max(0, menuItem.stock - item.quantity);
          
          // Auto-disable item if stock runs out
          if (menuItem.stock === 0) {
            menuItem.available = false;
          }
        }
      }
    }

    if (status) {
      existing.status = status;
    }

    if (paymentStatus) {
      existing.paymentStatus = paymentStatus;
    }

    return ok(existing);
  } catch (error) {
    console.error('Order update error:', error);
    return fail('Failed to update order', 500);
  }
}
