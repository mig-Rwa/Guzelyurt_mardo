'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { UserProfile } from '@shared';

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

// Helper to store user profile in localStorage
const saveProfileToStorage = (profile: UserProfile) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`user-profile-${profile.uid}`, JSON.stringify(profile));
  }
};

// Helper to get user profile from localStorage
const getProfileFromStorage = (uid: string): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(`user-profile-${uid}`);
  return data ? JSON.parse(data) : null;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [firebaseLoaded, setFirebaseLoaded] = useState(false);

  // Lazy load Firebase
  useEffect(() => {
    const initFirebase = async () => {
      if (typeof window === 'undefined') return;
      
      // Check if Firebase is configured
      const { isConfigured } = await import('@/lib/firebase');
      
      if (!isConfigured) {
        console.warn('Firebase not configured. Running in demo mode.');
        // Check for demo user in localStorage
        const demoUserData = localStorage.getItem('demo-user');
        if (demoUserData) {
          const demoUser = JSON.parse(demoUserData);
          setUser(demoUser);
          const profile = getProfileFromStorage(demoUser.uid);
          setUserProfile(profile || {
            uid: demoUser.uid,
            email: demoUser.email,
            displayName: demoUser.displayName,
            language: 'en',
            createdAt: new Date().toISOString(),
          });
        }
        setLoading(false);
        return;
      }
      
      try {
        const { auth } = await import('@/lib/firebase');
        const { onAuthStateChanged } = await import('firebase/auth');
        
        if (!auth) {
          console.error('Firebase auth not initialized');
          setLoading(false);
          return;
        }
        
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
            
            // Get profile from localStorage (no Firestore needed)
            let profile = getProfileFromStorage(firebaseUser.uid);
            if (!profile) {
              // Create initial profile
              profile = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || undefined,
                photoURL: firebaseUser.photoURL || undefined,
                language: 'en',
                createdAt: new Date().toISOString(),
              };
              saveProfileToStorage(profile);
            }
            setUserProfile(profile);
          } else {
            setUser(null);
            setUserProfile(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error initializing Firebase:', error);
        setLoading(false);
      }
    };

    initFirebase();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    // Demo mode fallback
    const { isConfigured } = await import('@/lib/firebase');
    
    if (!isConfigured) {
      const demoUser: User = {
        uid: 'demo-user',
        email: email,
        displayName: email.split('@')[0],
        photoURL: null,
      };
      setUser(demoUser);
      
      let profile = getProfileFromStorage(demoUser.uid);
      if (!profile) {
        profile = {
          uid: 'demo-user',
          email: email,
          displayName: email.split('@')[0],
          language: 'en',
          createdAt: new Date().toISOString(),
        };
        saveProfileToStorage(profile);
      }
      setUserProfile(profile);
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      return;
    }
    
    const { auth } = await import('@/lib/firebase');
    if (!auth) throw new Error('Firebase Auth not initialized');
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    // Demo mode fallback
    const { isConfigured } = await import('@/lib/firebase');
    if (!isConfigured) {
      const demoUser: User = {
        uid: 'demo-user-' + Date.now(),
        email: email,
        displayName: displayName || email.split('@')[0],
        photoURL: null,
      };
      setUser(demoUser);
      
      const profile: UserProfile = {
        uid: demoUser.uid,
        email: email,
        displayName: displayName || email.split('@')[0],
        language: 'en',
        createdAt: new Date().toISOString(),
      };
      saveProfileToStorage(profile);
      setUserProfile(profile);
      localStorage.setItem('demo-user', JSON.stringify(demoUser));
      return;
    }
    
    const { auth } = await import('@/lib/firebase');
    if (!auth) throw new Error('Firebase not initialized');
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    // Create user profile in localStorage (no Firestore needed)
    const newProfile: UserProfile = {
      uid: result.user.uid,
      email: result.user.email!,
      displayName: displayName || undefined,
      language: 'en',
      createdAt: new Date().toISOString(),
    };
    saveProfileToStorage(newProfile);
    setUserProfile(newProfile);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const { isConfigured } = await import('@/lib/firebase');
    if (!isConfigured) {
      throw new Error('Google Sign-In not available in demo mode. Please use email/password signup.');
    }
    
    const { auth, googleProvider } = await import('@/lib/firebase');
    if (!auth || !googleProvider) {
      throw new Error('Firebase not properly initialized');
    }
    const { signInWithPopup } = await import('firebase/auth');
    
    const result = await signInWithPopup(auth, googleProvider);
    
    // Create/update profile in localStorage
    let profile = getProfileFromStorage(result.user.uid);
    if (!profile) {
      profile = {
        uid: result.user.uid,
        email: result.user.email!,
        displayName: result.user.displayName || undefined,
        photoURL: result.user.photoURL || undefined,
        language: 'en',
        createdAt: new Date().toISOString(),
      };
      saveProfileToStorage(profile);
    }
    setUserProfile(profile);
  }, []);

  const logout = useCallback(async () => {
    // Demo mode fallback
    const { isConfigured } = await import('@/lib/firebase');
    if (!isConfigured) {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('demo-user');
      return;
    }
    
    const { auth } = await import('@/lib/firebase');
    if (!auth) return;
    const { signOut } = await import('firebase/auth');
    await signOut(auth);
    setUser(null);
    setUserProfile(null);
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const { isConfigured } = await import('@/lib/firebase');
    if (!isConfigured) {
      throw new Error('Password reset not available in demo mode');
    }
    const { auth } = await import('@/lib/firebase');
    if (!auth) throw new Error('Firebase Auth not initialized');
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  }, []);

  const updateUserProfile = useCallback(async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');
    
    const updatedProfile = userProfile ? { ...userProfile, ...data } : null;
    if (updatedProfile) {
      saveProfileToStorage(updatedProfile);
      setUserProfile(updatedProfile);
    }
  }, [user, userProfile]);

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
