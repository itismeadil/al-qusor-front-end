import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";

// A single "technical drawing" sketch of an armchair, used as the hero's
// signature element — framed like a catalog spec plate rather than a
// product photo, so it never depends on catalog data being present.
const ArmchairSketch = () => (
  <svg viewBox="0 0 200 160" fill="none" className="w-full h-full">
    <path
      d="M52 84V52a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v32"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 84v28a10 10 0 0 0 10 10h100a10 10 0 0 0 10-10V84a10 10 0 0 0-20 0v16H60V84a10 10 0 0 0-20 0Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M52 122v14M148 122v14"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M60 60h80"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeDasharray="3 4"
      opacity="0.5"
    />
  </svg>
);

// Short L-shaped registration marks at each corner of the spec plate —
// a nod to blueprint / print-plate alignment marks.
const CornerTicks = () => (
  <>
    <span className="absolute top-3 start-3 w-3 h-3 border-t border-s border-clay/60" />
    <span className="absolute top-3 end-3 w-3 h-3 border-t border-e border-clay/60" />
    <span className="absolute bottom-3 start-3 w-3 h-3 border-b border-s border-clay/60" />
    <span className="absolute bottom-3 end-3 w-3 h-3 border-b border-e border-clay/60" />
  </>
);

const Home = () => {
  const { t, lang, toArabicNumerals } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const catScrollRef = useRef(null);

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

  const countFor = (categoryId) =>
    categoryId === "all"
      ? products.length
      : products.filter((p) => p.category?._id === categoryId).length;

  const headingFont = lang === "ar" ? "font-displayAr" : "font-display";

  // Physical left/right regardless of language direction — predictable
  // regardless of RTL scroll-direction quirks across browsers.
  const scrollCategories = (direction) => {
    catScrollRef.current?.scrollBy({
      left: direction * 260,
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-paper">
      <style>{`
        .cat-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
          scroll-snap-type: x proximity;
          mask-image: linear-gradient(
            to right,
            transparent,
            black 24px,
            black calc(100% - 24px),
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 24px,
            black calc(100% - 24px),
            transparent
          );
        }
        .cat-scroll::-webkit-scrollbar {
          display: none;
        }
        .cat-pill {
          scroll-snap-align: start;
        }
      `}</style>

      {/* Top bar */}
      <Navbar />

      {/* Hero — dark "showroom" band with a single spec-plate illustration */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto rounded-[32px] bg-ink relative overflow-hidden">
          {/* Fine dot-grid, evokes graph/blueprint paper, kept subtle */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, #F4F1EA 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -top-24 -start-16 w-72 h-72 rounded-full bg-clay/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -end-10 w-80 h-80 rounded-full bg-clay/10 blur-3xl pointer-events-none" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center px-8 md:px-14 py-16 md:py-24">
            <div>
              <div className="flex items-center gap-2 mb-5">
                <span className="w-6 h-px bg-clay" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-clay">
                  {lang === "ar" ? "كتالوج الأثاث" : "Furniture Catalog"}
                </span>
              </div>

              <h1
                className={`text-4xl md:text-6xl lg:text-7xl text-paper mb-5 leading-[1.05] ${headingFont}`}
              >
                {t("heroTitle")}
              </h1>
              <p className="text-paper/60 text-base md:text-lg max-w-md mb-9">
                {t("heroSubtitle")}
              </p>

              <div className="flex items-center gap-8">
                <a
                  href="#collection"
                  className="inline-flex items-center gap-2 bg-clay text-ink text-sm font-medium px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  {t("shopNow")}
                  <span aria-hidden="true">{lang === "ar" ? "←" : "→"}</span>
                </a>

                <div className="flex items-center gap-5 text-paper/80">
                  <div>
                    <p className={`text-2xl leading-none ${headingFont}`}>
                      {lang === "ar" ? toArabicNumerals(products.length) : products.length}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-paper/40 mt-1">
                      {lang === "ar" ? "منتج" : "pieces"}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-paper/15" />
                  <div>
                    <p className={`text-2xl leading-none ${headingFont}`}>
                      {lang === "ar" ? toArabicNumerals(categories.length) : categories.length}
                    </p>
                    <p className="text-[11px] uppercase tracking-wide text-paper/40 mt-1">
                      {lang === "ar" ? "تصنيف" : "categories"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Spec plate — a single, confident signature element instead
                of scattered floating photos. Reads as a catalog page laid
                on the showroom table. */}
            <div className="relative hidden md:flex justify-center">
              <div className="relative w-full max-w-xs aspect-[4/5] bg-paper rounded-2xl rotate-[-2deg] shadow-2xl p-6">
                <CornerTicks />

                <span className="absolute top-5 start-5 rotate-[-2deg] text-[10px] uppercase tracking-[0.14em] text-slate/50 border border-line rounded-full px-2.5 py-1 bg-paper">
                  {lang === "ar" ? "اللوحة ٠١" : "Plate 01"}
                </span>

                <div className="h-full w-full flex items-center justify-center text-ink px-4">
                  <ArmchairSketch />
                </div>

                {/* Dimension line */}
                <div className="absolute bottom-8 start-8 end-8 flex items-center gap-2">
                  <span className="flex-1 border-t border-dashed border-slate/30" />
                </div>
                <p className="absolute bottom-3 start-0 end-0 text-center text-[11px] uppercase tracking-wide text-slate/50">
                  {lang === "ar" ? "يُصنع حسب الطلب" : "Made to measure"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div
        id="collection"
        className="px-6 max-w-6xl mx-auto mt-14 mb-8 scroll-mt-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[11px] uppercase tracking-[0.14em] text-slate/50">
            {lang === "ar" ? "تسوق حسب الفئة" : "Shop by category"}
          </h2>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollCategories(-1)}
              aria-label={lang === "ar" ? "السابق" : "Scroll left"}
              className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/60 hover:border-clay/50 hover:text-ink transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollCategories(1)}
              aria-label={lang === "ar" ? "التالي" : "Scroll right"}
              className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/60 hover:border-clay/50 hover:text-ink transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          ref={catScrollRef}
          className="cat-scroll flex flex-nowrap gap-2.5 overflow-x-auto scroll-smooth px-1 py-1"
        >
          <button
            onClick={() => setActiveCategory("all")}
            className={`cat-pill shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ${
              activeCategory === "all"
                ? "bg-ink text-paper border-ink"
                : "border-line text-slate/70 hover:border-clay/50"
            }`}
          >
            {t("allCategories")}
            <span
              className={`text-[11px] ${
                activeCategory === "all" ? "text-paper/60" : "text-slate/40"
              }`}
            >
              {lang === "ar" ? toArabicNumerals(countFor("all")) : countFor("all")}
            </span>
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c._id)}
              className={`cat-pill shrink-0 flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border transition-colors ${
                activeCategory === c._id
                  ? "bg-ink text-paper border-ink"
                  : "border-line text-slate/70 hover:border-clay/50"
              }`}
            >
              {c.name}
              <span
                className={`text-[11px] ${
                  activeCategory === c._id ? "text-paper/60" : "text-slate/40"
                }`}
              >
                {lang === "ar" ? toArabicNumerals(countFor(c._id)) : countFor(c._id)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-6 max-w-6xl mx-auto pb-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className={`text-2xl text-ink ${headingFont}`}>
            {lang === "ar" ? "المجموعة" : "The Collection"}
          </h2>
          {!loading && (
            <span className="text-xs text-slate/50">
              {lang === "ar" ? toArabicNumerals(visibleProducts.length) : visibleProducts.length} {lang === "ar" ? "قطعة" : "pieces"}
            </span>
          )}
        </div>

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <div className="aspect-[4/5] bg-line/70 animate-pulse" />
                <div className="pt-3 space-y-2">
                  <div className="h-3 w-2/3 bg-line/70 rounded animate-pulse" />
                  <div className="h-3 w-1/3 bg-line/70 rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && visibleProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line py-16 text-center">
            <p className="text-slate/60 text-sm">{t("noStoreProducts")}</p>
          </div>
        )}

        {!loading && visibleProducts.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {visibleProducts.map((product) => {
              const image = product.colors?.[0]?.images?.[0];
              const swatches = product.colors?.slice(0, 4) ?? [];
              return (
                <Link
                  key={product._id}
                  to={`/p/${product._id}`}
                  className="group block"
                >
                  <div className="relative aspect-[4/5] bg-line rounded-2xl overflow-hidden border border-line/60 group-hover:shadow-lg transition-shadow duration-300">
                    {image && (
                      <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                      />
                    )}
                    {product.category?.name && (
                      <span className="absolute top-3 start-3 text-[10px] uppercase tracking-wide bg-white/95 backdrop-blur-sm text-ink px-2.5 py-1 rounded-full shadow-sm">
                        {product.category.name}
                      </span>
                    )}
                  </div>

                  <div className="pt-3">
                    <p className="text-sm font-medium text-ink truncate">
                      {product.name}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-clay font-semibold">
                        {lang === "ar" ? toArabicNumerals(product.price?.toFixed(2)) : product.price?.toFixed(2)} {t("sar")}
                      </p>
                      {swatches.length > 1 && (
                        <div className="flex items-center gap-1">
                          {swatches.map((sw, idx) => (
                            <span
                              key={idx}
                              className="w-2.5 h-2.5 rounded-full border border-line/60"
                              style={{
                                backgroundColor: sw.hex || sw.code || "#ccc",
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer — echoes the dark hero band so the page feels bookended
          rather than stopping abruptly after the grid. */}
      <footer className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-3 text-center">
          <span className="w-10 h-px bg-clay" />
          <p className={`text-lg text-paper ${headingFont}`}>{t("appName")}</p>
          <p className="text-xs text-paper/40">
            {lang === "ar"
              ? "قطع مصنوعة بعناية لمنزلك"
              : "Pieces made with care, for your home"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
