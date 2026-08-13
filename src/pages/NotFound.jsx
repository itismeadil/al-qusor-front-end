import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "../components/Sidebar";
import { Home, ArrowRight } from "lucide-react";

const NotFound = ({ withSidebar = false }) => {
  const { t, lang } = useLanguage();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    // Generate random floating elements
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 0.5 + 0.2,
      delay: Math.random() * 2,
    }));
    setFloatingElements(elements);
  }, []);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    setMousePosition({
      x: (clientX / innerWidth - 0.5) * 20,
      y: (clientY / innerHeight - 0.5) * 20,
    });
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-ivory via-pearl to-ivory overflow-hidden relative ${withSidebar ? "ml-64" : ""}`}
      onMouseMove={handleMouseMove}
    >
      {withSidebar && <Sidebar />}
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((el) => (
          <div
            key={el.id}
            className="absolute rounded-full bg-champagne/10 animate-float"
            style={{
              left: `${el.x}%`,
              top: `${el.y}%`,
              width: `${el.size}px`,
              height: `${el.size}px`,
              animationDelay: `${el.delay}s`,
              animationDuration: `${3 + el.speed}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Large 404 with parallax effect */}
        <div
          className="relative mb-8"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <h1 className="text-[180px] md:text-[240px] font-display font-bold text-noir/5 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h1 className="text-[180px] md:text-[240px] font-display font-bold text-champagne/20 leading-none select-none animate-pulse">
              404
            </h1>
          </div>
        </div>

        {/* Text content */}
        <div className="text-center max-w-md">
          <h2 className="text-3xl md:text-4xl font-display text-noir mb-4">
            {t("oops")}
          </h2>
          <p className="text-lg text-charcoal/70 mb-2">
            {t("pageNotFoundMessage")}
          </p>
          <p className="text-sm text-charcoal/50 mb-8">
            {t("pageNotFoundHint")}
          </p>

          {/* Interactive button */}
          <Link
            to="/"
            className="group inline-flex items-center gap-3 bg-noir text-pearl px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            <span>{t("goHome")}</span>
            <ArrowRight
              className={`w-5 h-5 transition-transform duration-300 ${
                lang === "ar"
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        {/* Interactive hint */}
        <div className="absolute bottom-8 text-charcoal/40 text-sm animate-bounce">
          {lang === "ar" ? "حرك الماوس للتفاعل" : "Move your mouse to interact"}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
            opacity: 0.8;
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;
