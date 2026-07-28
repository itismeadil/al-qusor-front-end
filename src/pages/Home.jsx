import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

const Home = () => {
  const { t } = useLanguage();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/products/public'), api.get('/categories/public')])
      .then(([{ data: p }, { data: c }]) => {
        setProducts(p);
        setCategories(c);
      })
      .finally(() => setLoading(false));
  }, []);

  const visibleProducts =
    activeCategory === 'all' ? products : products.filter((p) => p.category?._id === activeCategory);

  return (
    <div className="min-h-screen bg-paper">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-5 max-w-6xl mx-auto">
        <span className="font-display text-xl text-ink">{t('appName')}</span>
        <LanguageToggle />
      </div>

      {/* Hero — a soft ink-toned panel gives the storefront a real "front page"
          feel instead of just floating text on the plain background */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto rounded-2xl bg-ink relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 20%, white 0, transparent 45%), radial-gradient(circle at 85% 75%, white 0, transparent 40%)'
            }}
          />
          <div className="relative px-8 py-14 md:py-20 text-center max-w-2xl mx-auto">
            <span className="inline-block text-[11px] tracking-[0.25em] uppercase text-paper/60 font-medium mb-4">
              {t('appName')}
            </span>
            <h1 className="font-display text-3xl md:text-5xl text-paper mb-4 leading-tight">
              {t('heroTitle')}
            </h1>
            <p className="text-paper/70 text-sm md:text-base">{t('heroSubtitle')}</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="px-6 max-w-6xl mx-auto mt-8 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveCategory('all')}
            className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${
              activeCategory === 'all'
                ? 'bg-ink text-paper border-ink'
                : 'border-line text-slate/70 hover:border-clay/50'
            }`}
          >
            {t('allCategories')}
          </button>
          {categories.map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c._id)}
              className={`shrink-0 text-sm px-4 py-1.5 rounded-full border transition-colors ${
                activeCategory === c._id
                  ? 'bg-ink text-paper border-ink'
                  : 'border-line text-slate/70 hover:border-clay/50'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Product grid */}
      <div className="px-6 max-w-6xl mx-auto pb-16">
        {loading && <p className="text-slate/60 text-sm">…</p>}

        {!loading && visibleProducts.length === 0 && (
          <p className="text-slate/60 text-sm text-center py-14">{t('noStoreProducts')}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {visibleProducts.map((product) => {
            const image = product.colors?.[0]?.images?.[0];
            return (
              <Link
                key={product._id}
                to={`/p/${product._id}`}
                className="group bg-white border border-line rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="aspect-square bg-line overflow-hidden relative">
                  {image && (
                    <img
                      src={image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                  <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/10 transition-colors duration-200 flex items-end justify-center">
                    <span className="mb-3 text-xs font-medium text-white bg-ink/80 px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {t('viewDetails')}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs text-slate/50 mb-0.5">{product.category?.name}</p>
                  <p className="text-sm font-medium text-ink truncate">{product.name}</p>
                  <p className="text-sm text-clay font-medium mt-1">
                    {product.price?.toFixed(2)} {t('sar')}
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
