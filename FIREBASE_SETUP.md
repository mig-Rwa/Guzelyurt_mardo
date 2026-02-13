# Firebase Setup Guide for Mardo Café

## Current Status
Your app is running in **Demo Mode** because Firebase is not configured. This means:
- ✅ Authentication works with localStorage (any email/password)
- ❌ Data is not persisted to a real database
- ❌ Google Sign-In is disabled
- ❌ Photo uploads won't work (no storage)

## Option 1: Continue with Demo Mode (Quick)
If you want to test the app without Firebase:
1. Just use any email/password to sign up
2. Data will be stored in browser localStorage
3. Features like photo uploads will be simulated

## Option 2: Enable Firebase (Production Ready)

### Step 1: Get Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project **"mardo-2025"**
3. Click the ⚙️ icon > **Project settings**
4. Scroll down to **"Your apps"** section
5. Find your web app or click **Add app** > Web
6. Copy the configuration values

### Step 2: Create .env.local File
1. Create a new file: `apps/web/.env.local`
2. Add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...your-actual-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=mardo-2025.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=mardo-2025
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=mardo-2025.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123XYZ
```

### Step 3: Enable Firebase Services

#### Enable Authentication
1. In Firebase Console, go to **Authentication** > **Get Started**
2. Click **Sign-in method** tab
3. Enable **Email/Password**
   - Toggle the switch
   - Save
4. Enable **Google** (optional)
   - Toggle the switch
   - Add support email
   - Save

#### Enable Firestore Database
1. Go to **Firestore Database** > **Create database**
2. Choose **Start in test mode** (for development)
3. Select location closest to your users
4. Click **Enable**

#### Enable Storage
1. Go to **Storage** > **Get started**
2. Choose **Start in test mode** (for development)
3. Click **Done**

#### Deploy Security Rules
After enabling services, deploy your security rules:

```bash
cd apps/web
npm run deploy:rules
```

Or manually:
1. Go to **Firestore Database** > **Rules** tab
2. Copy content from `firestore.rules` in your project
3. Publish rules

4. Go to **Storage** > **Rules** tab
5. Copy content from `storage.rules` in your project
6. Publish rules

### Step 4: Restart Development Server
```bash
cd apps/web
npm run dev
```

### Step 5: Verify Setup
1. Open browser console (F12)
2. You should see: **"✅ Firebase initialized successfully"**
3. Try signing up with a new account
4. Check Firebase Console > Authentication to see the new user

## Troubleshooting

### Still seeing "configuration-not-found" error?
- Make sure `.env.local` is in `apps/web/` directory
- All environment variables must start with `NEXT_PUBLIC_`
- Restart your dev server after creating/editing .env.local
- Check browser console for detailed error messages

### Google Sign-In not working?
- Enable Google provider in Firebase Console > Authentication
- Add your domain to authorized domains
- Make sure you added a support email

### Photo uploads failing?
- Enable Storage in Firebase Console
- Deploy storage.rules from your project
- Check Storage bucket name matches your .env.local

## Need Help?
Check the Firebase documentation:
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Authentication](https://firebase.google.com/docs/auth/web/start)
- [Firestore](https://firebase.google.com/docs/firestore/quickstart)
- [Storage](https://firebase.google.com/docs/storage/web/start)
