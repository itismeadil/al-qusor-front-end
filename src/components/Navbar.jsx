import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from './LanguageToggle';

const Navbar = () => {
  const { t, lang } = useLanguage();
  const headingFont = lang === 'ar' ? 'font-displayAr' : 'font-display';

  return (
    <nav className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
      <Link to="/" className={`text-xl text-ink hover:text-clay transition-colors ${headingFont}`}>
        {t('appName')}
      </Link>
      <LanguageToggle />
    </nav>
  );
};

export default Navbar;
