import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const { t } = useLanguage();

  return (
    <div className="sticky top-0 z-20 bg-ivory/90 backdrop-blur-md border-b border-mist">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-5 flex items-center justify-between">
        <Link
          to="/"
          className="font-display text-2xl text-noir tracking-wide transition-all duration-300 hover:text-champagne hover:drop-shadow-[0_0_15px_rgba(201,169,98,0.6)]"
        >
          {t("appName")}
        </Link>
        <LanguageToggle />
      </div>
    </div>
  );
};

export default Navbar;
