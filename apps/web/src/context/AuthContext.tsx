'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserProfile } from '@shared/types';

// Firebase types only (no runtime imports at module level)
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Lazy load Firebase
  useEffect(() => {
    const initFirebase = async () => {
      if (typeof window === 'undefined') return;
      
      try {
        const { auth } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        const { doc, getDoc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        
        setFirebaseLoaded(true);
        
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const userData: User = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            };
            setUser(userData);
            
            // Fetch user profile from Firestore
            try {
              const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (profileDoc.exists()) {
                setUserProfile(profileDoc.data() as UserProfile);
              } else {
                // Create initial profile
                const newProfile: UserProfile = {
                  uid: firebaseUser.uid,
                  email: firebaseUser.email!,
                  displayName: firebaseUser.displayName || undefined,
                  photoURL: firebaseUser.photoURL || undefined,
                  language: 'en',
                  createdAt: new Date().toISOString(),
                };
                await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
                setUserProfile(newProfile);
              }
            } catch (err) {
              console.error('Error fetching profile:', err);
            }
          } else {
            setUser(null);
            setUserProfile(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error('Error initializing Firebase:', err);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { auth } = await import('@/lib/firebase');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    const { auth, db } = await import('@/lib/firebase');
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const { doc, setDoc } = await import('firebase/firestore');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    // Create user profile
    const newProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName: displayName || undefined,
      language: 'en',
      createdAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', result.user.uid), newProfile);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { auth, googleProvider, db } = await import('@/lib/firebase');
    const { signInWithPopup } = await import('firebase/auth');
    const { doc, getDoc, setDoc } = await import('firebase/firestore');
    
    const result = await signInWithPopup(auth, googleProvider);
    
    // Check if profile exists
    const profileDoc = await getDoc(doc(db, 'users', result.user.uid));
    if (!profileDoc.exists()) {
      const newProfile: UserProfile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
        language: 'en',
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', result.user.uid), newProfile);
    }
  }, []);

  const logout = useCallback(async () => {
    const { auth } = await import('@/lib/firebase');
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUserProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { auth } = await import('@/lib/firebase');
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const { db } = await import('@/lib/firebase');
    const { doc, setDoc } = await import('firebase/firestore');
    
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    setUserProfile(prev => prev ? { ...prev, ...data } : null);
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signIn,
        signUp,
        signInWithGoogle,
        logout,
        resetPassword,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
