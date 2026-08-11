import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = ({ className = '' }) => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className={`text-xs font-medium border border-line rounded-md px-3 py-1.5 hover:bg-line/40 transition-colors ${className}`}
    >
      {lang === 'en' ? 'العربية' : 'English'}
    </button>
  );
};

export default LanguageToggle;
