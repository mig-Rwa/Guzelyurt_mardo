/**
 * Firestore helper functions for orders collection
 */

import { db, COLLECTIONS, seedCollectionIfEmpty } from './firestore';
import type { Order, MenuItem } from '@shared';
import type { QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { menuItems as staticMenuItems } from '@shared';

type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'verified' | 'rejected';

/**
 * Create a new order in Firestore
 */
export async function createOrder(orderData: any) {
  const docRef = db.collection(COLLECTIONS.ORDERS).doc(orderData.id);
  await docRef.set({
    ...orderData,
    createdAt: new Date(),
  });
  return orderData;
}

/**
 * Get all orders (admin) or user's orders
 */
export async function getOrders(userId: string, isAdmin: boolean, status?: string) {
  let query: any = db.collection(COLLECTIONS.ORDERS);

  if (!isAdmin) {
    query = query.where('userId', '==', userId);
  }

  if (status) {
    query = query.where('status', '==', status);
  }

  query = query.orderBy('createdAt', 'desc');

  const snapshot = await query.get();
  return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toISOString?.() || doc.data().createdAt,
  })) as any[];
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string) {
  const doc = await db.collection(COLLECTIONS.ORDERS).doc(orderId).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toISOString?.() || doc.data()?.createdAt,
  };
}

/**
 * Update order status and/or payment status
 * Handles stock depletion when payment is verified
 */
export async function updateOrder(
  orderId: string,
  updates: {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
  }
) {
  const docRef = db.collection(COLLECTIONS.ORDERS).doc(orderId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Order not found');
  }

  const existing = doc.data() as any;

  // Decrement stock when payment is verified
  if (updates.paymentStatus === 'verified' && existing.paymentStatus !== 'verified') {
    await decrementMenuStock(existing.items);
  }

  // Prepare update object
  const updateData: any = {
    updatedAt: new Date(),
  };

  if (updates.status) {
    updateData.status = updates.status;
  }

  if (updates.paymentStatus) {
    updateData.paymentStatus = updates.paymentStatus;
  }

  await docRef.update(updateData);

  return { id: docRef.id, ...existing, ...updateData };
}

/**
 * Decrement menu item stock when order is confirmed/paid
 */
async function decrementMenuStock(orderItems: any[]) {
  // Ensure menu items exist
  await seedCollectionIfEmpty(COLLECTIONS.MENU_ITEMS, staticMenuItems);

  for (const item of orderItems) {
    const menuDocRef = db.collection(COLLECTIONS.MENU_ITEMS).doc(item.id);
    const menuDoc = await menuDocRef.get();

    if (menuDoc.exists) {
      const data = menuDoc.data() as MenuItem;
      const newStock = Math.max(0, (data.stock || 50) - item.quantity);
      const newAvailable = newStock > 0;

      await menuDocRef.update({
        stock: newStock,
        available: newAvailable,
      });
    }
  }
}

/**
 * Get menu items from Firestore with fallback to seed data
 */
export async function getMenuItems() {
  // Ensure collection is seeded
  await seedCollectionIfEmpty(COLLECTIONS.MENU_ITEMS, staticMenuItems);

  const snapshot = await db.collection(COLLECTIONS.MENU_ITEMS).get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as MenuItem[];
}

/**
 * Get a single menu item
 */
export async function getMenuItemById(itemId: string) {
  const doc = await db.collection(COLLECTIONS.MENU_ITEMS).doc(itemId).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
  } as MenuItem;
}

/**
 * Create a new menu item
 */
export async function createMenuItem(itemData: MenuItem) {
  const docRef = db.collection(COLLECTIONS.MENU_ITEMS).doc(itemData.id);
  await docRef.set(itemData);
  return itemData;
}

/**
 * Update menu item
 */
export async function updateMenuItem(itemId: string, updates: Partial<MenuItem>) {
  const docRef = db.collection(COLLECTIONS.MENU_ITEMS).doc(itemId);
  await docRef.update(updates);

  const doc = await docRef.get();
  return {
    id: doc.id,
    ...doc.data(),
  } as MenuItem;
}

/**
 * Delete menu item
 */
export async function deleteMenuItem(itemId: string) {
  await db.collection(COLLECTIONS.MENU_ITEMS).doc(itemId).delete();
}

/**
 * Create reservation
 */
export async function createReservation(reservationData: any) {
  const docRef = db.collection(COLLECTIONS.RESERVATIONS).doc(reservationData.id);
  await docRef.set({
    ...reservationData,
    createdAt: new Date(),
  });
  return reservationData;
}

/**
 * Get reservations
 */
export async function getReservations(userId?: string) {
  let query: any = db.collection(COLLECTIONS.RESERVATIONS);

  if (userId) {
    query = query.where('userId', '==', userId);
  }

  query = query.orderBy('reservationDate', 'desc');
  const snapshot = await query.get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toISOString?.() || doc.data().createdAt,
    reservationDate: doc.data().reservationDate?.toISOString?.() || doc.data().reservationDate,
  }));
}

/**
 * Create user profile
 */
export async function createUserProfile(userId: string, profileData: any) {
  const docRef = db.collection(COLLECTIONS.USERS).doc(userId);
  await docRef.set({
    ...profileData,
    createdAt: new Date(),
  });
  return profileData;
}

/**
 * Get user profile
 */
export async function getUserProfile(userId: string) {
  const doc = await db.collection(COLLECTIONS.USERS).doc(userId).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toISOString?.() || doc.data()?.createdAt,
  };
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: any) {
  const docRef = db.collection(COLLECTIONS.USERS).doc(userId);
  await docRef.update(updates);

  const doc = await docRef.get();
  return {
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toISOString?.() || doc.data()?.createdAt,
  };
}

/**
 * Get all users (admin only)
 */
export async function getAllUsers() {
  const snapshot = await db.collection(COLLECTIONS.USERS).orderBy('createdAt', 'desc').get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data()?.createdAt?.toISOString?.() || doc.data()?.createdAt,
  })) as any[];
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin' | 'moderator') {
  const docRef = db.collection(COLLECTIONS.USERS).doc(userId);
  await docRef.update({ role, updatedAt: new Date() });
  return getUserProfile(userId);
}

/**
 * Get all reservations (admin only)
 */
export async function getAllReservations(status?: string) {
  let query: any = db.collection(COLLECTIONS.RESERVATIONS);

  if (status) {
    query = query.where('status', '==', status);
  }

  query = query.orderBy('reservationDate', 'desc');
  const snapshot = await query.get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toISOString?.() || doc.data().createdAt,
    reservationDate: doc.data().reservationDate?.toISOString?.() || doc.data().reservationDate,
  })) as any[];
}

/**
 * Update reservation status
 */
export async function updateReservation(
  reservationId: string,
  updates: { status?: string; notes?: string }
) {
  const docRef = db.collection(COLLECTIONS.RESERVATIONS).doc(reservationId);
  const doc = await docRef.get();

  if (!doc.exists) {
    throw new Error('Reservation not found');
  }

  await docRef.update({
    ...updates,
    updatedAt: new Date(),
  });

  const updated = await docRef.get();
  return {
    id: updated.id,
    ...updated.data(),
    createdAt: updated.data()?.createdAt?.toISOString?.() || updated.data()?.createdAt,
    reservationDate: updated.data()?.reservationDate?.toISOString?.() || updated.data()?.reservationDate,
  };
}

/**
 * Delete reservation
 */
export async function deleteReservation(reservationId: string) {
  await db.collection(COLLECTIONS.RESERVATIONS).doc(reservationId).delete();
}

/**
 * Create audit log entry
 */
export async function createAuditLog(action: string, adminId: string, details: any) {
  const docRef = db.collection(COLLECTIONS.AUDIT_LOGS).doc();
  await docRef.set({
    action,
    adminId,
    details,
    createdAt: new Date(),
    timestamp: new Date().toISOString(),
  });
  return { id: docRef.id };
}

/**
 * Get audit logs
 */
export async function getAuditLogs(adminId?: string, limit: number = 50) {
  let query: any = db.collection(COLLECTIONS.AUDIT_LOGS);

  if (adminId) {
    query = query.where('adminId', '==', adminId);
  }

  query = query.orderBy('createdAt', 'desc').limit(limit);
  const snapshot = await query.get();

  return snapshot.docs.map((doc: QueryDocumentSnapshot<any>) => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toISOString?.() || doc.data().createdAt,
  })) as any[];
}
