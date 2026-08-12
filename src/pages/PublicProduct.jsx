import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
import { SaudiRiyal, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { formatPrice } from "../utils/formatNumber";

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

const RelatedCard = ({ product, t, tv, lang }) => {
  const image = product.colors?.[0]?.images?.[0];
  return (
    <Link
      to={`/p/${product._id}`}
      className="group bg-pearl rounded-xl overflow-hidden border border-mist hover:border-champagne/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="aspect-square bg-mist/50 overflow-hidden">
        {image && (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
      </div>
      <div className="p-5">
        <p className="text-[11px] tracking-[0.15em] uppercase text-champagne/70 mb-2">
          {tv(product.category?.name)}
        </p>
        <p className="font-display text-lg text-noir mb-2 leading-tight">
          {product.name}
        </p>
        <p className="text-sm text-charcoal font-medium flex items-center gap-1">
          <SaudiRiyal className="w-3 h-3 text-champagne" />
          {formatPrice(product.price, lang)}
        </p>
      </div>
    </Link>
  );
};

const PublicProduct = () => {
  const { id } = useParams();
  const { t, tv, lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeColor, setActiveColor] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setActiveColor(0);
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

  const currentColor = product?.colors?.[activeColor];
  const images = currentColor?.images || [];

  const fileNameFor = (index) =>
    `${product?.name?.replace(/\s+/g, "-").toLowerCase() || "product"}-${currentColor?.name?.replace(/\s+/g, "-").toLowerCase() || "photo"}-${index + 1}.jpg`;

  const handleDownloadAll = () => {
    images.forEach((img, i) => {
      setTimeout(() => downloadImage(img, fileNameFor(i)), i * 400);
    });
  };

  const goToPreviousImage = () => {
    setActiveImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

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
            {/* Breadcrumb */}
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

            <div className="grid md:grid-cols-2 gap-12 md:gap-16">
              {/* Gallery */}
              <div>
                <div className="rounded-xl overflow-hidden border border-mist bg-pearl shadow-sm relative">
                  <div className="aspect-square bg-mist/50">
                    {images[activeImage] && (
                      <img
                        src={images[activeImage]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={goToPreviousImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronLeft className="w-5 h-5 text-noir rtl:rotate-180" />
                      </button>
                      <button
                        onClick={goToNextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
                      >
                        <ChevronRight className="w-5 h-5 text-noir rtl:rotate-180" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                        {activeImage + 1} / {images.length}
                      </div>
                    </>
                  )}
                </div>

                {images.length > 1 && (
                  <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                    {images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className="shrink-0"
                      >
                        <img
                          src={img}
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

                {images.length > 0 && (
                  <button
                    onClick={handleDownloadAll}
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
                    {t("downloadAllPhotos")}{" "}
                    {images.length > 1 ? `(${images.length})` : ""}
                  </button>
                )}
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center">
                <p className="text-[11px] tracking-[0.2em] uppercase text-champagne/70 mb-3">
                  {tv(product.category?.name)}
                </p>
                <h1 className="font-display text-4xl md:text-5xl text-noir mb-4 leading-tight">
                  {product.name}
                </h1>
                <p className="text-3xl text-charcoal font-semibold mb-8 flex items-center gap-2">
                  <SaudiRiyal className="w-6 h-6 text-champagne" />
                  {formatPrice(product.price, lang)}
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
                          onClick={() => {
                            setActiveColor(i);
                            setActiveImage(0);
                          }}
                          className={`text-sm px-5 py-2.5 rounded-lg border transition-all ${
                            i === activeColor
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

            {/* Related products */}
            {related.length > 0 && (
              <div className="mt-20 md:mt-28">
                <h2 className="font-display text-3xl text-noir mb-8">
                  {t("relatedProducts")}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                  {related.map((p) => (
                    <RelatedCard
                      key={p._id}
                      product={p}
                      t={t}
                      tv={tv}
                      lang={lang}
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
