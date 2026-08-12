import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import { SaudiRiyal } from "lucide-react";
import { formatPrice } from "../utils/formatNumber";

const Home = () => {
  const { t, tv, lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/products/public"), api.get("/categories/public")])
      .then(([{ data: p }, { data: c }]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category?._id === activeCategory);

  const activeCategoryName =
    activeCategory === "all"
      ? t("allCategories")
      : tv(categories.find((c) => c._id === activeCategory)?.name);

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      {/* Hero */}
      <div className="px-6 md:px-8">
        <div className="max-w-7xl mx-auto relative overflow-hidden rounded-b-2xl mt-4">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2832&auto=format&fit=crop"
              alt=""
              className="w-full h-full object-cover blur-sm scale-105"
            />
            <div className="absolute inset-0 bg-ivory/40" />
          </div>

          <div className="relative max-w-3xl px-6 md:px-12 pt-20 pb-24 md:pt-28 md:pb-32 mr-auto text-left rtl:mr-0 rtl:ml-auto rtl:text-right">
            <span className="inline-block text-xs tracking-[0.25em] uppercase text-champagne font-semibold mb-6">
              {t("heroEyebrow")}
            </span>

            <h1 className="font-display text-5xl md:text-7xl text-noir mb-6 leading-tight">
              {t("heroTitle")}
            </h1>

            <p className="text-charcoal/70 text-base md:text-lg mb-10 max-w-xl leading-relaxed">
              {t("heroSubtitle")}
            </p>

            <a
              href="#collection"
              className="inline-flex items-center gap-3 bg-noir text-pearl text-sm font-medium px-8 py-4 rounded-lg hover:bg-charcoal transition-colors duration-300"
            >
              {t("heroCta")}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="rtl:rotate-180"
              >
                <path
                  d="M5 12h14m0 0l-6-6m6 6l-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div
        id="collection"
        className="px-6 md:px-8 max-w-7xl mx-auto mt-16 mb-10 scroll-mt-6"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h2 className="font-display text-2xl md:text-3xl text-noir">
            {t("theCollection")}
          </h2>

          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className="appearance-none bg-pearl border border-mist rounded-lg text-sm text-noir pl-5 pr-11 py-3 min-w-[190px] cursor-pointer hover:border-champagne/50 focus:outline-none focus:border-champagne transition-colors duration-300"
            >
              <option value="all">{t("allCategories")}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {tv(c.name)}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-4"
              width="14"
              height="14"
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

        {activeCategory !== "all" && (
          <p className="text-sm text-shadow/60 mt-3">
            {t("showing")}{" "}
            <span className="text-noir font-medium">{activeCategoryName}</span>
          </p>
        )}
      </div>

      {/* Product grid */}
      <div className="px-6 md:px-8 max-w-7xl mx-auto pb-24">
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {visibleProducts.map((product) => {
            const image = product.colors?.[0]?.images?.[0];
            return (
              <Link
                key={product._id}
                to={`/p/${product._id}`}
                className="group bg-pearl rounded-xl overflow-hidden border border-mist hover:border-champagne/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[4/5] bg-mist/50 overflow-hidden relative">
                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-noir/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <p className="text-[11px] tracking-[0.15em] uppercase text-champagne/70 mb-2">
                    {tv(product.category?.name)}
                  </p>
                  <p className="font-display text-lg text-noir mb-2 leading-tight">
                    {product.name}
                  </p>
                  <p className="text-sm text-charcoal font-medium">
                    <span className="flex items-center">
                      <SaudiRiyal className="w-3 h-3 text-champagne mr-1" />
                      {formatPrice(product.price, lang)}
                    </span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Home;
