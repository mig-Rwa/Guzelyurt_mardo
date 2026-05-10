# Firestore Integration Setup Guide

## Overview
This guide walks you through connecting your Mardo Café application to Firebase Firestore for persistent data storage.

## Current Status
✅ Firebase SDK already configured  
✅ Firestore helper modules created  
⏳ `firebase-admin` package installing...

## What Was Added

### 1. **Server-Side Firestore Client** (`apps/web/src/lib/server/firestore.ts`)
- Initializes Firebase Admin SDK
- Manages all Firestore collections
- Auto-seeds menu items on first load

### 2. **Firestore Helper Functions** (`apps/web/src/lib/server/firestore-helpers.ts`)
Provides functions for:
- **Orders**: Create, read, update (with stock depletion logic)
- **Menu Items**: CRUD operations with stock tracking
- **Users**: Profile creation and updates
- **Reservations**: Create and retrieve

## Setup Steps

### Step 1: Add Service Account Credentials

You need to provide Firebase service account credentials so the server can access Firestore.

#### Option A: Local Development with Service Account Key (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/) → Select "mardo-93c90"
2. **Project Settings** → **Service Accounts** tab
3. Click **Generate new private key**
4. Save the downloaded JSON file
5. Add to your `.env.local` file:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"mardo-93c90",...}'
   ```
   (Replace with the content of your service account key JSON)

#### Option B: Environment-Based Credentials (Production/Cloud Run)
- Firebase Admin SDK will auto-detect credentials if deployed to:
  - Google Cloud Run
  - Cloud Functions
  - App Engine
  - Compute Engine

### Step 2: Update API Routes to Use Firestore

Replace mockDb with Firestore in your API routes. Here's an example for the orders endpoint:

```typescript
// apps/web/src/app/api/orders/route.ts
import { getOrders, createOrder, updateOrder } from '@/lib/server/firestore-helpers';

export async function POST(request: NextRequest) {
  try {
    const ctx = getRequestContext(request);
    const body = await request.json();
    
    const validationResult = OrderCreateSchema.safeParse(body);
    if (!validationResult.success) {
      return fail('Invalid order data', 400);
    }
    
    const order = {
      id: uuidv4(),
      orderNumber: generateOrderNumber(),
      userId: ctx.userId,
      // ... order data
      createdAt: new Date().toISOString(),
    };
    
    // Save to Firestore instead of mockDb
    await createOrder(order);
    
    return ok(order, {
      status: 201,
      meta: { orderNumber: order.orderNumber },
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

  // Use Firestore helper
  const orders = await getOrders(
    ctx.userId,
    ctx.isAdmin && includeAll,
    status || undefined
  );

  return ok(orders, { meta: { total: orders.length } });
}

export async function PATCH(request: NextRequest) {
  const ctx = getRequestContext(request);
  if (!ctx.isAdmin) {
    return forbidden();
  }

  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    // Update via Firestore helper (handles stock decrement)
    const updated = await updateOrder(id, { status, paymentStatus });
    
    return ok(updated);
  } catch (error) {
    console.error('Update error:', error);
    return fail('Failed to update order', 500);
  }
}
```

### Step 3: Firestore Collection Structure

Your data will be organized like this:

```
mardo-93c90 (Project)
├── orders/
│   ├── order-id-1/
│   │   ├── id: string
│   │   ├── orderNumber: string
│   │   ├── userId: string
│   │   ├── items: array
│   │   ├── total: number
│   │   ├── status: 'pending'|'confirmed'|'preparing'|'ready'|'completed'|'cancelled'
│   │   ├── paymentStatus: 'pending'|'verified'|'rejected'
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│
├── menuItems/
│   ├── item-id-1/
│   │   ├── id: string
│   │   ├── name: {en: string, tr: string}
│   │   ├── description: {en: string, tr: string}
│   │   ├── price: number
│   │   ├── category: string
│   │   ├── image: string
│   │   ├── stock: number
│   │   └── available: boolean
│
├── users/
│   ├── user-id-1/
│   │   ├── id: string
│   │   ├── email: string
│   │   ├── name: string
│   │   ├── role: 'user'|'admin'|'moderator'
│   │   └── createdAt: timestamp
│
├── reservations/
│   ├── reservation-id-1/
│   │   ├── id: string
│   │   ├── userId: string
│   │   ├── date: timestamp
│   │   ├── time: string
│   │   ├── guests: number
│   │   ├── notes: string
│   │   └── createdAt: timestamp
│
├── photos/
│   └── [user-submitted photos]
│
└── subscribers/
    └── [newsletter subscribers]
```

### Step 4: Firestore Security Rules (Optional but Recommended)

Add these security rules to your Firestore in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read, authenticated write for photos
    match /photos/{document=**} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if isAdmin();
    }

    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth.uid == userId || isAdmin();
      allow write: if request.auth.uid == userId;
    }

    // Users can read/write their own orders
    match /orders/{orderId} {
      allow read: if hasProperty(resource.data, 'userId') && 
                     (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }

    // Menu items readable by all, writable only by admin
    match /menuItems/{itemId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    // Reservations readable by user who created them
    match /reservations/{resId} {
      allow read: if hasProperty(resource.data, 'userId') && 
                     (request.auth.uid == resource.data.userId || isAdmin());
      allow create: if request.auth != null;
      allow update: if isAdmin();
    }

    // Helper function
    function isAdmin() {
      return request.auth.token.role == 'admin' || 
             request.auth.token.email == 'miguelmbabatunga31@gmail.com';
    }

    function hasProperty(resource, property) {
      return property in resource;
    }
  }
}
```

## Migration from MockDb to Firestore

### Phase 1: Read from Firestore (Add parallel reads)
Keep mockDb and Firestore in sync during testing

### Phase 2: Write to Firestore (Gradual migration)
- Update one API route at a time
- Test thoroughly before moving to the next

### Phase 3: Remove mockDb
Once all routes are using Firestore, delete mockDb.ts

## API Routes to Update (in order of priority)

1. ✅ **orders** - Most important for real-time inventory
2. **menu** - Critical for dynamic pricing/stock
3. **reservations** - User-facing feature
4. **users** - Profile persistence
5. **photos** - Gallery moderation
6. **newsletter** - Subscriber management

## Troubleshooting

### "Firebase app not initialized"
- Check that `FIREBASE_SERVICE_ACCOUNT_KEY` env variable is set
- Verify JSON is valid (no line breaks)

### "Permission denied" errors
- Check Firestore security rules
- Ensure service account has proper permissions
- Verify user authentication state

### Stock not updating
- Check `initializeMenu()` is called before querying
- Verify payment verification flow in admin panel

## Testing Firestore Locally

Use Firebase Emulator:
```bash
# Install emulator suite
firebase init emulators

# Start emulator
firebase emulators:start

# Connect your app (set env var):
# FIRESTORE_EMULATOR_HOST=localhost:8080
```

## Next Steps

1. ✅ Copy the service account key to `.env.local`
2. ✅ Test API routes with Firestore
3. ✅ Update remaining API routes
4. ✅ Set Firestore security rules
5. ✅ Remove mockDb after full migration
6. ✅ Deploy to production

---

**Questions?** Check the [Firebase Firestore Docs](https://firebase.google.com/docs/firestore) or [Next.js Server-Side Docs](https://nextjs.org/docs/app/building-your-application/data-fetching/server-functions)
