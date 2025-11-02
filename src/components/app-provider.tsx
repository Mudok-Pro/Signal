"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'ar' | 'en';

type AppContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  direction: 'rtl' | 'ltr';
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar');
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.className = `font-body antialiased ${language === 'ar' ? 'font-arabic' : 'font-body'}`;
  }, [language, direction]);

  return (
    <AppContext.Provider value={{ language, setLanguage, direction }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
