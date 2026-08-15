import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { Search, X } from "lucide-react";

const Home = () => {
  const { t, tv, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeColor, setActiveColor] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/products/public"), api.get("/categories/public")])
      .then(([{ data: p }, { data: c }]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts = products.filter((p) => {
    const matchesCategory =
      activeCategory === "all" || p.category?._id === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tv(p.category?.name).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesColor =
      activeColor === "all" ||
      p.colors?.some((c) => c.name.toLowerCase() === activeColor);
    return matchesCategory && matchesSearch && matchesColor;
  });

  const activeCategoryName =
    activeCategory === "all"
      ? t("allCategories")
      : tv(categories.find((c) => c._id === activeCategory)?.name);

  // Get all unique colors from products
  const allColors = [
    "all",
    ...new Set(
      products.flatMap((p) => p.colors?.map((c) => c.name.toLowerCase()) || []),
    ),
  ];

  // Get translated color name for display
  const getTranslatedColor = (colorName) => {
    if (colorName === "all") return t("allColors");
    return tv(colorName.charAt(0).toUpperCase() + colorName.slice(1));
  };

  return (
    <div className="flex flex-col min-h-screen bg-ivory">
      <Navbar />

      {/* Hero */}
      <div className="relative min-h-[50vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Background with split design */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-ivory via-pearl to-champagne/20" />

          {/* Abstract geometric shapes */}
          <div className="absolute top-20 right-20 w-64 h-64 md:w-96 md:h-96 bg-champagne/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 md:w-80 md:h-80 bg-noir/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-champagne/5 rounded-full blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                             linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 w-full">
          <div className="max-w-3xl">
            <div className="space-y-6 md:space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 md:gap-3 bg-noir/5 backdrop-blur-sm border border-champagne/20 rounded-full px-3 py-1.5 md:px-5 md:py-2.5">
                <div className="flex gap-1">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-champagne rounded-full animate-pulse" />
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-champagne rounded-full animate-pulse delay-100" />
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-champagne rounded-full animate-pulse delay-200" />
                </div>
                <span className="text-[10px] md:text-xs tracking-[0.2em] uppercase text-noir/70 font-medium">
                  {t("heroEyebrow")}
                </span>
              </div>

              {/* Main heading */}
              <div className="space-y-3 md:space-y-4">
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl text-noir leading-[1.1]">
                  {t("heroTitle")}
                </h1>
                <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-champagne to-transparent rounded-full" />
              </div>

              {/* Subtitle */}
              <p className="text-charcoal/70 text-sm md:text-lg md:text-xl max-w-lg leading-relaxed">
                {t("heroSubtitle")}
              </p>

              {/* CTA button */}
              <div className="pt-3 md:pt-4">
                <a
                  href="#collection"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 bg-noir text-pearl text-xs md:text-sm font-semibold px-6 py-3 md:px-8 md:py-4 rounded-xl hover:bg-charcoal transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
                >
                  {t("heroCta")}
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="rtl:rotate-180 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <path
                      d="M5 12h14m0 0l-6-6m6 6l-6 6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>

              {/* Stats/features */}
              <div className="flex gap-4 md:gap-8 pt-6 md:pt-8 border-t border-mist/50">
                <div>
                  <div className="text-2xl md:text-3xl font-display text-noir mb-1">
                    ✦
                  </div>
                  <div className="text-[10px] md:text-xs text-charcoal/60 uppercase tracking-wider">
                    Premium
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display text-noir mb-1">
                    ◈
                  </div>
                  <div className="text-[10px] md:text-xs text-charcoal/60 uppercase tracking-wider">
                    Crafted
                  </div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-display text-noir mb-1">
                    ❖
                  </div>
                  <div className="text-[10px] md:text-xs text-charcoal/60 uppercase tracking-wider">
                    Elegant
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div
        id="collection"
        className="px-4 md:px-8 max-w-7xl mx-auto mt-12 mb-8 scroll-mt-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-xl md:text-2xl text-noir">
            {t("theCollection")}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-shadow/40 rtl:left-auto rtl:right-3" />
              <input
                type="text"
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-pearl border border-mist rounded-lg text-xs text-noir pl-9 pr-8 py-2 w-36 md:w-48 rtl:pl-8 rtl:pr-9 hover:border-champagne/50 focus:outline-none focus:border-champagne transition-colors duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-shadow/40 hover:text-noir transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="appearance-none bg-pearl border border-mist rounded-lg text-xs text-noir pl-3 pr-8 py-2 w-32 md:w-40 cursor-pointer hover:border-champagne/50 focus:outline-none focus:border-champagne transition-colors duration-300"
              >
                <option value="all">{t("allCategories")}</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {tv(c.name)}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Color dropdown */}
            <div className="relative">
              <select
                value={activeColor}
                onChange={(e) => setActiveColor(e.target.value)}
                className="appearance-none bg-pearl border border-mist rounded-lg text-xs text-noir pl-3 pr-10 py-2 w-32 md:w-36 cursor-pointer hover:border-champagne/50 focus:outline-none focus:border-champagne transition-colors duration-300"
              >
                <option value="all">{t("allColors")}</option>
                {allColors.slice(1).map((color) => (
                  <option key={color} value={color}>
                    {getTranslatedColor(color)}
                  </option>
                ))}
              </select>
              <svg
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  d="M6 9l6 6 6-6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>

        {(activeCategory !== "all" || searchQuery || activeColor !== "all") && (
          <p className="text-xs text-shadow/60">
            {t("showing")}{" "}
            <span className="text-noir font-medium">
              {activeCategoryName}
              {activeColor !== "all" && ` • ${getTranslatedColor(activeColor)}`}
              {searchQuery && ` • "${searchQuery}"`}
            </span>
          </p>
        )}
      </div>

      {/* Product grid */}
      <div className="px-4 md:px-8 max-w-7xl mx-auto pb-24">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="loader"></div>
          </div>
        )}

        {!loading && visibleProducts.length === 0 && (
          <p className="text-shadow/60 text-sm text-center py-16">
            {t("noStoreProducts")}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              tv={tv}
              lang={lang}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
