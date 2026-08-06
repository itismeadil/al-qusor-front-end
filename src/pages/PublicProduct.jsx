import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import Navbar from '../components/Navbar';

// Downloads a remote image as a real file save (not just opening it in a
// new tab). Falls back to opening it directly if the fetch is blocked.
const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, '_blank');
  }
};

const PublicProduct = () => {
  const { id } = useParams();
  const { t, lang, toArabicNumerals } = useLanguage();
  const [product, setProduct] = useState(null);
  const [activeColor, setActiveColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    api
      .get(`/products/public/${id}`)
      .then(({ data }) => setProduct(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-paper text-slate/60 text-sm">…</div>;
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-slate/70 text-sm px-4 text-center">
        {t('detailsUnavailable')}
      </div>
    );
  }

  const currentColor = product.colors?.[activeColor];
  const images = currentColor?.images || [];
  const headingFont = lang === 'ar' ? 'font-displayAr' : 'font-display';

  const fileNameFor = (index) =>
    `${product.name.replace(/\s+/g, '-').toLowerCase()}-${currentColor?.name?.replace(/\s+/g, '-').toLowerCase() || 'photo'}-${index + 1}.jpg`;

  const handleDownloadCurrent = () => {
    if (images[activeImage]) downloadImage(images[activeImage], fileNameFor(activeImage));
  };

  const handleDownloadAll = () => {
    images.forEach((img, i) => {
      // Small stagger so the browser doesn't block a burst of downloads
      setTimeout(() => downloadImage(img, fileNameFor(i)), i * 400);
    });
  };

  return (
    <div className="min-h-screen bg-paper">
      <Navbar />
      
      <div className="px-6 max-w-6xl mx-auto pt-8 pb-20">

        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate/60 hover:text-ink mb-6 transition-colors">
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          {lang === 'ar' ? 'العودة إلى الصفحة الرئيسية' : 'Back to Home'}
        </Link>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Photo gallery for the selected color */}
          <div className="relative">
            <div className="relative aspect-square bg-line rounded-[32px] overflow-hidden border border-line/60 shadow-xl">
              {images[activeImage] && (
                <img 
                  src={images[activeImage]} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                />
              )}

              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronLeft className="w-5 h-5 text-ink" />
                  </button>
                  <button
                    onClick={() => setActiveImage(prev => prev === images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110"
                  >
                    <ChevronRight className="w-5 h-5 text-ink" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {activeImage + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      i === activeImage 
                        ? 'border-clay shadow-lg scale-105' 
                        : 'border-transparent hover:border-line/60'
                    }`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product details */}
          <div className="space-y-8">
            {/* Category badge */}
            {product.category?.name && (
              <div className="flex items-center gap-2">
                <span className="w-6 h-px bg-clay" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-clay">
                  {product.category.name}
                </span>
              </div>
            )}

            {/* Product name */}
            <h1 className={`text-4xl md:text-5xl text-ink leading-tight ${headingFont}`}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <p className="text-3xl text-clay font-semibold">
                {lang === 'ar' ? toArabicNumerals(product.price?.toFixed(2)) : product.price?.toFixed(2)}
              </p>
              <p className="text-sm text-slate/60">{t('sar')}</p>
            </div>

            {/* Description */}
            {product.description && (
              <div className="prose prose-slate">
                <p className="text-slate/70 leading-relaxed text-base">
                  {product.description}
                </p>
              </div>
            )}

            {/* Color tabs */}
            {product.colors?.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate/70 mb-3">{t('colors')}</p>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveColor(i);
                        setActiveImage(0);
                      }}
                      className={`text-sm px-4 py-2 rounded-full border transition-all ${
                        i === activeColor
                          ? 'bg-ink text-paper border-ink shadow-md'
                          : 'border-line text-slate/70 hover:border-clay/50 hover:text-ink'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Download buttons - prominent and expressive */}
            <div className="pt-6 border-t border-line/60 space-y-3">
              <button
                onClick={handleDownloadCurrent}
                className="w-full inline-flex items-center justify-center gap-3 bg-clay text-ink text-sm font-medium px-6 py-4 rounded-full hover:opacity-90 transition-opacity"
              >
                <Download className="w-5 h-5" />
                {t('downloadPhoto')}
              </button>
              
              {images.length > 1 && (
                <button
                  onClick={handleDownloadAll}
                  className="w-full inline-flex items-center justify-center gap-3 bg-ink text-paper text-sm font-medium px-6 py-4 rounded-full hover:bg-clay transition-colors"
                >
                  <Download className="w-5 h-5" />
                  {t('downloadAllPhotos')} ({images.length})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col items-center gap-3 text-center">
          <span className="w-10 h-px bg-clay" />
          <p className={`text-lg text-paper ${headingFont}`}>{t('appName')}</p>
          <p className="text-xs text-paper/40">
            {lang === 'ar'
              ? 'قطع مصنوعة بعناية لمنزلك'
              : 'Pieces made with care, for your home'}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicProduct;
