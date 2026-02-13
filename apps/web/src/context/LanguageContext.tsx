'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations, type Language } from '@shared';

type TranslationValue = string | Record<string, unknown>;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'tr' : 'en');
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let value: TranslationValue = translations[language];
    
    for (const k of keys) {
      if (typeof value === 'object' && value !== null && k in value) {
        value = value[k] as TranslationValue;
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === 'string' ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
