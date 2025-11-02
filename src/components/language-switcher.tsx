"use client";

import { useApp } from "@/components/app-provider";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

export function LanguageSwitcher() {
  const { language, setLanguage } = useApp();

  const toggleLanguage = () => {
    const newLang = language === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleLanguage} aria-label="Toggle language">
      <Languages className="h-5 w-5" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
