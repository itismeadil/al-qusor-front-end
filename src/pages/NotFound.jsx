import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import Sidebar from "../components/Sidebar";
import { Home, ArrowRight, Armchair, Lamp, Sofa } from "lucide-react";

const FLOATING_ICONS = [Armchair, Lamp, Sofa];

const NotFound = ({ withSidebar = false }) => {
  const { t, lang } = useLanguage();
  const isRTL = lang === "ar";
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [floatingElements, setFloatingElements] = useState([]);

  useEffect(() => {
    const elements = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 16 + 20,
      delay: Math.random() * 2,
      duration: Math.random() * 2 + 4,
      Icon: FLOATING_ICONS[i % FLOATING_ICONS.length],
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

      {/* Floating furniture pieces drifting in the background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map(({ id, x, y, size, delay, duration, Icon }) => (
          <Icon
            key={id}
            className="absolute text-champagne/15 animate-float"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        {/* Armchair with an "out of stock" price tag, tilted like a real tag */}
        <div
          className="relative mb-10"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
            transition: "transform 0.1s ease-out",
          }}
        >
          <Armchair
            className="w-40 h-40 md:w-56 md:h-56 text-noir/10"
            strokeWidth={1}
          />

          <div
            className={`absolute -top-2 ${isRTL ? "-left-10 md:-left-14" : "-right-10 md:-right-14"} rotate-[18deg]`}
          >
            <div className="relative bg-noir text-pearl text-xs md:text-sm font-semibold tracking-wide px-4 py-2 md:px-5 md:py-2.5 rounded-md shadow-lg">
              404
              <div className="absolute top-1/2 -translate-y-1/2 -left-1.5 w-3 h-3 bg-ivory rounded-full border border-noir" />
            </div>
            <div className="mx-auto w-px h-4 bg-noir/40" />
          </div>
        </div>

        {/* Text content */}
        <div className="text-center max-w-md">
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase text-champagne/80 font-semibold mb-3">
            {t("oops")}
          </span>
          <h2 className="text-3xl md:text-4xl font-display text-noir mb-4">
            {t("pageNotFoundMessage")}
          </h2>
          <p className="text-sm text-charcoal/60 mb-8 leading-relaxed">
            {t("pageNotFoundHint")}
          </p>

          <Link
            to="/"
            className="group inline-flex items-center gap-3 bg-noir text-pearl px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <Home className="w-5 h-5 group-hover:animate-bounce" />
            <span>{t("goHome")}</span>
            <ArrowRight
              className={`w-5 h-5 transition-transform duration-300 ${
                isRTL
                  ? "rotate-180 group-hover:-translate-x-1"
                  : "group-hover:translate-x-1"
              }`}
            />
          </Link>
        </div>

        <div className="absolute bottom-8 text-charcoal/40 text-sm animate-bounce">
          {t("moveMouseHint")}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(-4deg);
            opacity: 0.6;
          }
          50% {
            transform: translateY(-18px) rotate(4deg);
            opacity: 1;
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
