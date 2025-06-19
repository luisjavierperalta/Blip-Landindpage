import { useState, useEffect } from 'react';
import { translations, LanguageCode, TranslationKey } from '@/lib/translations';

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('blip-language') as LanguageCode;
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('blip-language', currentLanguage);
  }, [currentLanguage]);

  const t = (key: TranslationKey): string => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const changeLanguage = (language: LanguageCode) => {
    setCurrentLanguage(language);
  };

  return {
    t,
    currentLanguage,
    changeLanguage,
    availableLanguages: Object.keys(translations) as LanguageCode[]
  };
} 