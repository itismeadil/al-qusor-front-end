import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useLanguage } from '../context/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';

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
  const { t } = useLanguage();
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
    <div className="min-h-screen bg-paper px-4 py-6">
      <div className="max-w-md mx-auto">
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Photo gallery for the selected color */}
        <div className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line overflow-hidden mb-3">
          <div className="aspect-square bg-line relative">
            {images[activeImage] && (
              <img src={images[activeImage]} alt={product.name} className="w-full h-full object-cover" />
            )}

            {images[activeImage] && (
              <button
                onClick={handleDownloadCurrent}
                title={t('downloadPhoto')}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
                  <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)}>
                  <img
                    src={img}
                    alt=""
                    className={`w-14 h-14 rounded-md object-cover border-2 ${
                      i === activeImage ? 'border-clay' : 'border-transparent'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {images.length > 1 && (
          <button
            onClick={handleDownloadAll}
            className="w-full mb-6 text-sm font-medium border border-line rounded-md py-2.5 text-slate hover:border-clay/50 hover:text-ink transition-colors"
          >
            {t('downloadAllPhotos')} ({images.length})
          </button>
        )}
        {images.length <= 1 && <div className="mb-6" />}

        {/* Details */}
        <p className="text-xs uppercase tracking-wide text-slate/50 mb-1">{product.category?.name}</p>
        <h1 className="font-display text-2xl text-ink mb-2">{product.name}</h1>
        <p className="text-lg text-clay font-medium mb-4">
          {product.price?.toFixed(2)} {t('sar')}
        </p>

        {/* Color tabs — clicking one swaps the gallery above to that color's photos */}
        {product.colors?.length > 0 && (
          <div className="mb-5">
            <p className="text-xs font-medium text-slate/70 mb-2">{t('colors')}</p>
            <div className="flex gap-2 flex-wrap">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveColor(i);
                    setActiveImage(0);
                  }}
                  className={`text-sm px-3 py-1.5 rounded-full border ${
                    i === activeColor
                      ? 'bg-ink text-paper border-ink'
                      : 'border-line text-slate/70 hover:border-clay/50'
                  }`}
                >
                  {color.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.description && (
          <div>
            <p className="text-xs font-medium text-slate/70 mb-1.5">{t('description')}</p>
            <p className="text-sm text-slate leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicProduct;
