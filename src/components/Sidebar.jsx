import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import LanguageToggle from './LanguageToggle';

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="w-56 shrink-0 bg-ink text-paper min-h-screen flex flex-col justify-between px-5 py-6">
      <div>
        <div className="font-display text-xl mb-6">{t('appName')}</div>
        <div className="mb-6">
          <LanguageToggle className="!border-white/20 !text-paper hover:!bg-white/10" />
        </div>
        <nav className="space-y-1 text-sm">
          <div className="px-3 py-2 rounded-md bg-white/10 font-medium">{t('products')}</div>
        </nav>
      </div>

      <div className="text-xs text-paper/60 border-t border-white/10 pt-4">
        <div className="text-paper/90 mb-2">{admin?.username}</div>
        <button onClick={handleLogout} className="hover:text-clay transition-colors">
          {t('logOut')}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
