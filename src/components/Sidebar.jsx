import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-noir text-pearl flex flex-col justify-between px-6 py-8 z-10">
      <div>
        <div className="font-display text-2xl mb-8 tracking-wide">
          {t("appName")}
        </div>
        <div className="mb-8">
          <LanguageToggle className="!border-white/20 !text-pearl hover:!bg-white/10" />
        </div>
        <nav className="space-y-1 text-sm">
          <div className="px-4 py-3 rounded-lg bg-white/10 font-medium">
            {t("products")}
          </div>
        </nav>
      </div>

      <div className="text-xs text-pearl/60 border-t border-white/10 pt-6">
        <div className="text-pearl/90 mb-3 font-medium">{admin?.username}</div>
        <button
          onClick={handleLogout}
          className="hover:text-champagne transition-colors"
        >
          {t("logOut")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
