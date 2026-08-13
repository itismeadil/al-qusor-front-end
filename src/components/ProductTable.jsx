import React from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { SaudiRiyal, Edit, Trash2 } from "lucide-react";
import { formatPrice } from "../utils/formatNumber";

const ProductTable = ({ products, onDelete }) => {
  const navigate = useNavigate();
  const { t, tv, lang } = useLanguage();
  const isRTL = lang === "ar";

  if (products.length === 0) {
    return (
      <div className="bg-pearl rounded-2xl border border-mist px-8 py-16 text-center">
        <p className="text-noir font-medium mb-2">{t("noProductsTitle")}</p>
        <p className="text-shadow/60 text-sm">{t("noProductsBody")}</p>
      </div>
    );
  }

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-pearl rounded-2xl border border-mist overflow-hidden shadow-sm"
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-shadow/50 border-b border-mist bg-ivory/40">
            <th className="px-6 py-4 font-medium text-start">
              {t("products")}
            </th>
            <th className="px-6 py-4 font-medium text-start">
              {t("category")}
            </th>
            <th className="px-6 py-4 font-medium text-start">{t("price")}</th>
            <th className="px-6 py-4 font-medium text-end">{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const firstImage = product.colors?.[0]?.images?.[0];
            return (
              <tr
                key={product._id}
                className="border-b border-mist last:border-0 hover:bg-ivory/60 transition-colors duration-200"
              >
                <td
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => navigate(`/dashboard/products/${product._id}`)}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-mist/50 overflow-hidden shrink-0 border border-mist/30">
                      {firstImage && (
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <span className="font-medium text-noir text-base">
                      {product.name}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-ivory/60 text-shadow/80 text-xs font-medium">
                    {tv(product.category?.name) || "—"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  {typeof product.price === "number" ? (
                    <div className="flex items-center gap-2 text-noir font-semibold">
                      <SaudiRiyal className="w-3 h-3 text-champagne" />
                      <span className="text-sm">{product.price}</span>
                    </div>
                  ) : (
                    "—"
                  )}
                </td>

                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/products/${product._id}`)
                      }
                      className="p-2 rounded-lg hover:bg-ivory text-shadow hover:text-noir transition-colors duration-200"
                      title={t("edit")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(product._id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-charcoal hover:text-red-600 transition-colors duration-200"
                      title={t("delete")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
