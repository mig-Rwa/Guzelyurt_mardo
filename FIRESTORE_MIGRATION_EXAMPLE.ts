/**
 * EXAMPLE: Updated orders API route using Firestore
 * 
 * This shows how to migrate from mockDb to Firestore.
 * Copy this logic to your actual route.ts file once firebase-admin is installed.
 */

import { NextRequest } from 'next/server';
import { OrderCreateSchema } from '@shared';
import { v4 as uuidv4 } from 'uuid';
import { fail, forbidden, getRequestContext, ok } from '@/lib/server/api';
import {
  createOrder,
  getOrders,
  updateOrder,
  getMenuItemById,
  seedCollectionIfEmpty,
  COLLECTIONS,
} from '@/lib/server/firestore-helpers';
import { db } from '@/lib/server/firestore';
import { menuItems as staticMenuItems } from '@shared';

function generateOrderNumber(): string {
  return 'MRD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

/**
 * POST /api/orders
 * Create a new order
 */
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

    // Create order object
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

    // Save to Firestore instead of mockDb
    await createOrder(order);

    return ok(order, {
      status: 201,
      meta: {
        orderNumber: order.orderNumber,
        estimatedTime: order.estimatedTime,
      },
    });
  } catch (error) {
    console.error('Order creation error:', error);
    return fail('Failed to create order', 500);
  }
}

/**
 * GET /api/orders
 * Get orders (user's own or all if admin)
 */
export async function GET(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const includeAll = searchParams.get('all') === 'true';

    // Fetch from Firestore
    const orders = await getOrders(
      ctx.userId,
      ctx.isAdmin && includeAll,
      status || undefined
    );

    return ok(orders, { meta: { total: orders.length } });
  } catch (error) {
    console.error('Orders fetch error:', error);
    return fail('Failed to fetch orders', 500);
  }
}

/**
 * PATCH /api/orders
 * Update order status and/or payment status
 */
export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
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

    const allowed: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];
    const allowedPayment: PaymentStatus[] = ['pending', 'verified', 'rejected'];

    if (status && !allowed.includes(status)) {
      return fail('Invalid status', 400);
    }

    if (paymentStatus && !allowedPayment.includes(paymentStatus)) {
      return fail('Invalid payment status', 400);
    }

    // Update via Firestore helper (handles stock depletion automatically)
    const updated = await updateOrder(orderId, { status, paymentStatus });

    return ok(updated);
  } catch (error) {
    console.error('Order update error:', error);
    if (error instanceof Error && error.message === 'Order not found') {
      return fail('Order not found', 404);
    }
    return fail('Failed to update order', 500);
  }
}
