# Mardo Café - Next.js + Firebase Migration

## Project Summary

Successfully migrated the Mardo Café website from React CRA + FastAPI + MongoDB to:
- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: Firestore (ready to connect)
- **Authentication**: Firebase Auth
- **3D Features**: React Three Fiber + Drei

## Architecture

```
/app
├── apps/
│   ├── web/                 # Next.js App (UI + API Routes)
│   │   ├── src/
│   │   │   ├── app/         # App Router pages & API routes
│   │   │   ├── components/  # React components
│   │   │   ├── context/     # Auth, Language, Cart contexts
│   │   │   └── lib/         # Firebase, utilities
│   │   └── .env.local       # Firebase config (YOUR KEYS HERE)
│   └── functions/           # Firebase Cloud Functions
├── packages/
│   └── shared/              # Zod schemas, types, translations
├── scripts/                 # Seed scripts
├── firebase.json            # Firebase config
├── firestore.rules          # Security rules
└── storage.rules            # Storage rules
```

## Firebase Configuration

Your Firebase config is set up in `/app/apps/web/.env.local`:
- Project ID: mardo-2025
- All Firebase SDK keys configured

**To enable Firestore operations**, add your service account key:
1. Get from: Firebase Console → Project Settings → Service accounts → Generate new private key
2. Base64 encode: `cat serviceAccountKey.json | base64 -w 0`
3. Add to `.env.local` as `FIREBASE_SERVICE_ACCOUNT_KEY`

## Features Implemented

### Core Features
- ✅ Full menu with 24 items across 10 categories
- ✅ Daily specials with discounts
- ✅ Shopping cart with quantity controls
- ✅ Multi-step checkout flow (delivery/pickup)
- ✅ Table reservation system
- ✅ Newsletter subscription
- ✅ Loyalty program (stamp card)
- ✅ Coffee fortune telling (Turkish tradition)
- ✅ Testimonials section
- ✅ Photo gallery
- ✅ WhatsApp integration

### 3D Features (React Three Fiber)
- ✅ Hero: Floating 3D coffee cup with beans
- ✅ Gallery: 2D/3D toggle with fallback
- ✅ Performance optimized (reduced motion support)
- ✅ WebGL detection with graceful fallback

### Multilingual
- ✅ English and Turkish translations
- ✅ Language toggle in header
- ✅ All content localized

### Authentication
- ✅ Email/Password login/signup
- ✅ Google Sign-In
- ✅ Password reset
- ✅ User profile in Firestore

### API Routes
- ✅ GET /api/health
- ✅ GET /api/menu
- ✅ GET /api/specials
- ✅ POST /api/reservations
- ✅ POST /api/newsletter
- ✅ POST /api/orders
- ✅ GET /api/me

### Cloud Functions
- ✅ Daily summary (scheduled)
- ✅ Webhook handler (signature verified)
- ✅ Order created trigger (loyalty points)

## Running Locally

```bash
# Install dependencies
yarn install

# Start development server
cd apps/web && yarn dev

# Start Firebase emulators (optional)
yarn emulators

# Build for production
yarn build
```

## Testing Protocol

### Backend API Testing
Test with curl:
```bash
curl http://localhost:3000/api/health
curl http://localhost:3000/api/menu
curl http://localhost:3000/api/specials
```

### Frontend Testing
- Homepage loads with 3D hero
- Menu filtering by category works
- Cart add/remove/quantity works
- Checkout flow completes
- Language toggle switches EN/TR
- Auth pages load correctly

## Status

✅ **BUILD SUCCESSFUL** - All components compiled
✅ **APIs WORKING** - All routes responding
✅ **UI COMPLETE** - All sections rendered
✅ **3D FEATURES** - Hero coffee cup visible

## Notes

- Firebase Auth requires enabling in Firebase Console (Authentication → Sign-in method)
- Firestore data is currently mocked in /packages/shared/data.ts
- Run `yarn seed` to populate Firestore with sample data (requires service account)
