import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, SaudiRiyal } from "lucide-react";
import { formatPrice } from "../utils/formatNumber";

const ProductCard = ({ product, tv, lang, aspectRatio = "aspect-[4/5]" }) => {
  const [activeColor, setActiveColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const currentColor = product.colors?.[activeColor];
  const images = currentColor?.images || [];

  const goToPreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleColorChange = (colorIndex) => {
    setActiveColor(colorIndex);
    setActiveImage(0);
  };

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50; // Minimum swipe distance
    const diff = touchStartX.current - touchEndX.current;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped left - go to next image
        goToNextImage();
      } else {
        // Swiped right - go to previous image
        goToPreviousImage();
      }
    }
  };

  return (
    <Link
      to={`/p/${product._id}`}
      className="group bg-pearl rounded-xl overflow-hidden border border-mist hover:border-champagne/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className={`${aspectRatio} bg-mist/50 overflow-hidden relative`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images[activeImage] && (
          <img
            src={images[activeImage]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* Image slider controls */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToPreviousImage();
              }}
              className="absolute start-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-20"
            >
              {lang === "ar" ? (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-noir" />
              ) : (
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-noir" />
              )}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute end-2 top-1/2 -translate-y-1/2 w-7 h-7 md:w-9 md:h-9 bg-white/95 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 z-20"
            >
              {lang === "ar" ? (
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-noir" />
              ) : (
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-noir" />
              )}
            </button>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/60 text-white text-[10px] md:text-xs px-2 py-0.5 md:px-3 md:py-1 rounded-full z-20">
              {activeImage + 1} / {images.length}
            </div>
          </>
        )}

        {/* Color dots */}
        {product.colors?.length > 1 && (
          <div className="absolute bottom-2 right-2 flex flex-col items-end gap-1.5 z-20">
            <div className="flex gap-1">
              {product.colors.map((color, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorChange(i);
                  }}
                  className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                    i === activeColor
                      ? "bg-champagne scale-125 ring-2 ring-white"
                      : "bg-white/70 hover:bg-white"
                  }`}
                />
              ))}
            </div>
            <span className="bg-noir/80 backdrop-blur-sm text-pearl text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-medium tracking-wide">
              {product.colors.length}{" "}
              {product.colors.length === 1 ? "color" : "colors"}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-noir/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-3 md:p-5">
        <p className="text-[10px] md:text-[11px] tracking-[0.15em] uppercase text-champagne/70 mb-1 md:mb-2">
          {tv(product.category?.name)}
        </p>
        <p className="font-display text-sm md:text-lg text-noir mb-1 md:mb-2 leading-tight">
          {product.name}
        </p>
        <p className="text-xs md:text-sm text-charcoal font-medium">
          <span className="flex items-center">
            {product.price}
            <SaudiRiyal className="w-4 h-4 md:w-5 md:h-5 text-champagne mr-1" />
          </span>
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
