import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = ({ className = '' }) => {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className={`group inline-flex items-center gap-2 text-xs font-medium border border-line rounded-full px-4 py-2 hover:border-clay/50 hover:bg-line/30 transition-all duration-300 hover:shadow-md ${className}`}
    >
      <Globe className="w-4 h-4 text-slate/50 group-hover:text-clay transition-colors" />
      <span className="text-slate/70 group-hover:text-ink transition-colors">
        {lang === 'en' ? 'العربية' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;
