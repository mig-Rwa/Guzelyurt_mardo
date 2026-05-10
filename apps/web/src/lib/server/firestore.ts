/**
 * Firestore Admin SDK configuration for Next.js API routes
 * Uses service account credentials from environment
 */

import * as admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
let db: admin.firestore.Firestore;

try {
  if (!admin.apps.length) {
    // Try to use FIREBASE_SERVICE_ACCOUNT_KEY environment variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey) as ServiceAccount;
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      // Fall back to default credentials (works in Firebase hosting, Cloud Run, etc.)
      admin.initializeApp();
    }
  }

  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
} catch (error) {
  console.error('Failed to initialize Firestore:', error);
  throw error;
}

export { db };

/**
 * Collection names
 */
export const COLLECTIONS = {
  ORDERS: 'orders',
  MENU_ITEMS: 'menuItems',
  USERS: 'users',
  RESERVATIONS: 'reservations',
  PHOTOS: 'photos',
  SUBSCRIBERS: 'subscribers',
  AUDIT_LOGS: 'auditLogs',
  ADMIN_SETTINGS: 'adminSettings',
};

/**
 * Helper to batch initialize data from static exports
 * Useful for initial seeding or sync
 */
export async function seedCollectionIfEmpty(
  collectionName: string,
  data: any[],
  idField: string = 'id'
) {
  const snapshot = await db.collection(collectionName).limit(1).get();
  
  if (snapshot.empty && data.length > 0) {
    console.log(`Seeding ${collectionName} with ${data.length} documents...`);
    const batch = db.batch();
    
    data.forEach(item => {
      const docRef = db.collection(collectionName).doc(item[idField]);
      batch.set(docRef, item);
    });
    
    await batch.commit();
    console.log(`✓ Seeded ${collectionName}`);
  }
}

/**
 * Initialize all collections with seed data
 */
export async function initializeCollections() {
  try {
    const { menuItems } = await import('@shared');
    
    // Seed menu items
    await seedCollectionIfEmpty(COLLECTIONS.MENU_ITEMS, menuItems);
    
    console.log('✓ Firestore initialization complete');
  } catch (error) {
    console.error('Error initializing Firestore collections:', error);
    throw error;
  }
}
