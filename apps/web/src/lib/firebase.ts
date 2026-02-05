'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Safely read environment variables
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
const messagingSenderId = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
const appId = process.env.NEXT_PUBLIC_FIREBASE_APP_ID;
const measurementId = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID;

// Check if Firebase is configured with valid values
export const isConfigured = Boolean(
  apiKey && 
  authDomain &&
  projectId &&
  appId &&
  apiKey.trim() !== '' && 
  authDomain.trim() !== '' &&
  projectId.trim() !== '' &&
  appId.trim() !== '' &&
  apiKey !== 'undefined' &&
  projectId !== 'undefined'
);

// Only create config object if we have valid values
const firebaseConfig = isConfigured ? {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
  measurementId,
} : null;

// Initialize Firebase (singleton pattern) - only if configured
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isConfigured && firebaseConfig && typeof window !== 'undefined') {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('⚠️ Running in demo mode without Firebase');
  }
} else if (typeof window !== 'undefined') {
  console.log('ℹ️ Firebase not configured. Running in demo mode.');
  console.log('To enable Firebase:');
  console.log('1. Create apps/web/.env.local file');
  console.log('2. Add your Firebase configuration from Firebase Console');
  console.log('3. Enable Authentication, Firestore, and Storage in Firebase Console');
}

export { auth, db, storage, googleProvider };
export default app;
