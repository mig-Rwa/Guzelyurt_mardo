# Firestore Integration Checklist

**Status**: firebase-admin is installing (usually takes 2-5 minutes)

## ✅ Completed
- [x] Created Firestore client configuration (`apps/web/src/lib/server/firestore.ts`)
- [x] Created Firestore helper functions (`apps/web/src/lib/server/firestore-helpers.ts`)
- [x] Both files compile with zero errors
- [x] npm install firebase-admin in progress...

## 📋 Next Steps (In Order)

### 1. Get Service Account Credentials
- [ ] Go to [Firebase Console](https://console.firebase.google.com)
- [ ] Select project **mardo-93c90**
- [ ] **Project Settings** → **Service Accounts** tab
- [ ] Click **Generate New Private Key**
- [ ] Copy the JSON content
- [ ] Add to `apps/web/.env.local`:
  ```
  FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
  ```

### 2. Verify firebase-admin Installation
```bash
# When npm install completes, verify it worked:
npm list firebase-admin
```
Should show: `firebase-admin@12.7.0` (or similar)

### 3. Update API Routes (One at a Time)

#### Start with Orders API
- [ ] Copy code from `FIRESTORE_MIGRATION_EXAMPLE.ts`
- [ ] Replace `apps/web/src/app/api/orders/route.ts` content
- [ ] Test: Create an order in your app UI
- [ ] Verify in Firebase Console > Firestore > `orders` collection

#### Then Update Menu API
- [ ] Update `apps/web/src/app/api/menu/route.ts` to use:
  - `getMenuItems()`
  - `getMenuItemById(itemId)`
  - `createMenuItem(itemData)`
  - `updateMenuItem(itemId, updates)`
  - `deleteMenuItem(itemId)`

**Import Example**:
```typescript
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '@/lib/server/firestore-helpers';
```

#### Then Update Remaining Routes
- [ ] Reservations API
- [ ] Users API
- [ ] Photos API
- [ ] Newsletter API

### 4. Set Firestore Security Rules (Optional but Recommended)
- [ ] Go to Firebase Console > Firestore > Rules
- [ ] Copy the rules from `FIRESTORE_SETUP.md`
- [ ] Deploy

### 5. Test End-to-End
- [ ] Create an order
- [ ] Check Firestore console shows new order
- [ ] Admin verify payment
- [ ] Check stock decremented in menuItems
- [ ] Admin create/edit menu item
- [ ] Check menu updates reflect immediately

### 6. Migration Cleanup
- [ ] Confirm all routes work with Firestore
- [ ] Delete `apps/web/src/lib/server/mockDb.ts`
- [ ] Remove mockDb imports from all files
- [ ] Delete `FIRESTORE_MIGRATION_EXAMPLE.ts` (this file)

## 🔧 Troubleshooting

### "firebase-admin is not defined"
→ npm install is still running, wait for completion

### "FIREBASE_SERVICE_ACCOUNT_KEY is missing"
→ Add service account key to `.env.local` and restart dev server

### "Permission denied" in Firestore
→ Check security rules are set correctly OR temporarily allow all for testing:
```javascript
match /{document=**} {
  allow read, write: if true; // TEMPORARY - remove in production!
}
```

### Stock not decrementing
→ Verify payment verification flow:
1. Order created with `paymentStatus: 'pending'`
2. Admin clicks verify payment button
3. API calls PATCH with `paymentStatus: 'verified'`
4. `updateOrder()` should auto-decrement stock

### Collections appear empty in Firebase Console
→ Check:
1. Service account credentials are correct
2. App is pointing to right Firebase project (mardo-93c90)
3. Collections are spelled correctly

## 📚 Reference Files

- **Setup Guide**: `FIRESTORE_SETUP.md` - Complete setup instructions
- **Migration Example**: `FIRESTORE_MIGRATION_EXAMPLE.ts` - Copy/paste ready code
- **Helper Functions**: `apps/web/src/lib/server/firestore-helpers.ts` - All available functions
- **Firestore Config**: `apps/web/src/lib/server/firestore.ts` - Client initialization

## 🚀 Quick Commands

```bash
# Check installation
npm list firebase-admin

# Start dev server (after service account is set)
npm run dev

# Build for production
npm run build

# Check for errors
npm run lint
```

## 🎯 Success Indicators

Once fully migrated to Firestore:
- ✅ Creating orders adds documents to `orders` collection
- ✅ Updating menu items updates `menuItems` collection
- ✅ Admin payment verification decrements stock
- ✅ Reservations persist across restarts
- ✅ User profiles save and load correctly
- ✅ No more mockDb console logs

---

**Estimated Time**: 15-30 minutes total (depending on internet speed for npm install)

**Questions?** Check `FIRESTORE_SETUP.md` for detailed explanations
