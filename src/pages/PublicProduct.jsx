import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { SaudiRiyal } from "lucide-react";

const downloadImage = async (url, filename) => {
  try {
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);
  } catch (err) {
    window.open(url, "_blank");
  }
};

const PublicProduct = () => {
  const { id } = useParams();
  const { t, tv, lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);

    api
      .get(`/products/public/${id}`)
      .then(({ data }) => {
        setProduct(data);
        return api.get("/products/public");
      })
      .then(({ data: all }) => {
        setProduct((current) => {
          const relatedProducts = all
            .filter(
              (p) => p._id !== id && p.category?._id === current?.category?._id,
            )
            .slice(0, 4);
          setRelated(relatedProducts);
          return current;
        });
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const allImages =
    product?.colors?.flatMap((color) =>
      (color.images || []).map((url) => ({ url, colorName: color.name })),
    ) || [];

  const fileNameFor = (index) => {
    const img = allImages[index];
    const productSlug =
      product?.name?.replace(/\s+/g, "-").toLowerCase() || "product";
    const colorSlug =
      img?.colorName?.replace(/\s+/g, "-").toLowerCase() || "photo";
    return `${productSlug}-${colorSlug}-${index + 1}.jpg`;
  };

  const handleDownloadCurrent = () => {
    const img = allImages[activeImage];
    if (img) downloadImage(img.url, fileNameFor(activeImage));
  };

  // Secondary option — grabs every photo across every color, matching
  // how the slider now shows everything together in one gallery.
  const handleDownloadAll = () => {
    allImages.forEach((img, i) => {
      setTimeout(() => downloadImage(img.url, fileNameFor(i)), i * 400);
    });
  };

  const goToPreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImage((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  // Jump the slider to this color's first photo in the combined gallery
  const goToColor = (colorName) => {
    const index = allImages.findIndex((img) => img.colorName === colorName);
    if (index !== -1) setActiveImage(index);
  };

  // Which color the photo currently on screen belongs to — used to
  // highlight the matching color button, without needing separate state
  const activeColorName = allImages[activeImage]?.colorName;

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-8 py-10">
        {notFound ? (
          <div className="flex items-center justify-center py-32 text-charcoal/70 text-sm px-4 text-center">
            {t("detailsUnavailable")}
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="loader"></div>
          </div>
        ) : (
          <>
            <nav className="flex items-center gap-2 text-xs text-shadow/60 mb-10">
              <Link to="/" className="hover:text-noir transition-colors">
                {t("home")}
              </Link>
              <span>/</span>
              <span>{tv(product.category?.name)}</span>
              <span>/</span>
              <span className="text-noir font-medium truncate max-w-[160px]">
                {product.name}
              </span>
            </nav>

            <div className="grid md:grid-cols-2 gap-15 md:gap-16">
              <div>
                <div className="rounded-xl overflow-hidden border border-mist bg-pearl shadow-sm relative">
                  <div className="aspect-square overflow-hidden bg-mist/50">
                    <div
                      className="flex h-full transition-transform duration-400 ease-out"
                      style={{
                        transform: `translateX(-${activeImage * 100}%)`,
                      }}
                    >
                      {allImages.map((img, i) => (
                        <img
                          key={i}
                          src={img.url}
                          alt={product.name}
                          className="w-full h-full object-cover shrink-0"
                        />
                      ))}
                    </div>
                  </div>

                  {allImages.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-noir"
                        >
                          <path
                            d="M15 18l-6-6 6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/95 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors z-10"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-noir"
                        >
                          <path
                            d="M9 18l6-6-6-6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>

                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                        {allImages.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`h-1.5 rounded-full transition-all ${
                              i === activeImage
                                ? "w-5 bg-noir"
                                : "w-1.5 bg-noir/30"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {allImages.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className="shrink-0"
                      >
                        <img
                          src={img.url}
                          alt=""
                          className={`w-20 h-20 rounded-lg object-cover border-2 transition-all ${
                            i === activeImage
                              ? "border-champagne scale-105"
                              : "border-transparent hover:border-mist"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                )}

                {allImages.length > 0 && (
                  <button
                    onClick={handleDownloadCurrent}
                    className="w-full mt-6 flex items-center justify-center gap-3 bg-noir text-pearl text-sm font-medium rounded-lg py-4 hover:bg-charcoal transition-colors duration-300"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {t("downloadPhoto")}
                  </button>
                )}

                {allImages.length > 1 && (
                  <button
                    onClick={handleDownloadAll}
                    className="w-full mt-2.5 text-xs font-medium text-shadow/70 hover:text-noir transition-colors py-1"
                  >
                    {t("downloadAllPhotos")} ({allImages.length})
                  </button>
                )}
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-[11px] tracking-[0.2em] uppercase text-champagne/70 mb-3">
                  {tv(product.category?.name)}
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-noir mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl text-charcoal font-semibold mb-8 flex items-center gap-2">
                  {product.price}
                  <SaudiRiyal className="w-9 h-9 text-champagne" />
                </p>

                {product.colors?.length > 0 && (
                  <div className="mb-8">
                    <p className="text-xs font-medium text-charcoal/70 mb-3">
                      {t("colors")}
                    </p>
                    <div className="flex gap-3 flex-wrap">
                      {product.colors.map((color, i) => (
                        <button
                          key={i}
                          onClick={() => goToColor(color.name)}
                          className={`text-sm px-5 py-2.5 rounded-lg border transition-all ${
                            color.name === activeColorName
                              ? "bg-noir text-pearl border-noir"
                              : "border-mist text-shadow hover:border-champagne/50 hover:text-noir"
                          }`}
                        >
                          {tv(color.name)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {product.description && (
                  <div>
                    <p className="text-xs font-medium text-charcoal/70 mb-2">
                      {t("description")}
                    </p>
                    <p className="text-sm text-charcoal leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-20 md:mt-28">
                <h2 className="font-display text-3xl text-noir mb-8">
                  {t("relatedProducts")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {related.map((p) => (
                    <ProductCard
                      key={p._id}
                      product={p}
                      tv={tv}
                      lang={lang}
                      aspectRatio="aspect-square"
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PublicProduct;
