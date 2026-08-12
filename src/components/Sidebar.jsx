import React from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import LanguageToggle from "./LanguageToggle";
import { LayoutDashboard, LogOut, User, Settings } from "lucide-react";

const Sidebar = () => {
  const { admin, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-gradient-to-b from-noir to-charcoal text-pearl flex flex-col justify-between px-6 py-8 z-10 shadow-2xl">
      <div>
        <div className="font-display text-2xl mb-10 tracking-wide text-champagne font-semibold">
          {t("appName")}
        </div>
        <div className="mb-8">
          <LanguageToggle className="!border-white/20 !text-pearl hover:!bg-white/10" />
        </div>
        <nav className="space-y-2 text-sm">
          <div className="px-4 py-3 rounded-xl bg-white/10 font-medium flex items-center gap-3">
            <LayoutDashboard className="w-5 h-5 text-champagne" />
            {t("theCollection")}
          </div>
        </nav>
      </div>

      <div className="text-xs text-pearl/60 border-t border-white/10 pt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-champagne" />
          </div>
          <div>
            <div className="text-pearl/90 font-medium text-sm">
              {admin?.username}
            </div>
            <div className="text-pearl/50 text-xs">Admin</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-pearl/70 hover:text-champagne transition-colors duration-200"
        >
          <LogOut className="w-4 h-4" />
          {t("logOut")}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
