import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ConfirmationModal from "../components/ConfirmationModal";
import NotFound from "./NotFound";
import { useLanguage } from "../context/LanguageContext";
import {
  SaudiRiyal,
  ArrowLeft,
  Printer,
  Trash2,
  CheckCircle,
  QrCode,
  Upload,
  X,
} from "lucide-react";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, tv } = useLanguage();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    colors: [],
  });
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false });
  const [newImages, setNewImages] = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: p }, { data: cats }] = await Promise.all([
          api.get(`/products/${id}`),
          api.get("/categories"),
        ]);
        setProduct(p);
        setCategories(cats);
        setForm({
          name: p.name || "",
          description: p.description || "",
          price: p.price ?? "",
          category: p.category?._id || "",
          colors: p.colors || [],
        });
        setLoading(false);
      } catch (err) {
        setNotFound(true);
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const updateColorName = (index, newName) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === index ? { ...c, name: newName } : c,
      ),
    }));
  };

  const handleAddImages = (colorIndex, files) => {
    const fileArray = Array.from(files);
    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setNewImages((prev) => ({
      ...prev,
      [colorIndex]: [...(prev[colorIndex] || []), ...fileArray],
    }));
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === colorIndex ? { ...c, images: [...c.images, ...previews] } : c,
      ),
    }));
  };

  const handleRemoveImage = (colorIndex, imageIndex) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === colorIndex
          ? { ...c, images: c.images.filter((_, idx) => idx !== imageIndex) }
          : c,
      ),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Upload new images first
      const updatedColors = [...form.colors];

      for (const colorIndex in newImages) {
        const files = newImages[colorIndex];
        if (files.length > 0) {
          const formData = new FormData();
          files.forEach((f) => formData.append("images", f));
          const { data } = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // Add new image URLs to the color
          updatedColors[colorIndex] = {
            ...updatedColors[colorIndex],
            images: [...updatedColors[colorIndex].images, ...data.urls],
          };
        }
      }

      await api.put(`/products/${id}`, {
        ...form,
        colors: updatedColors,
        price: Number(form.price) || 0,
      });
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    setDeleteModal({ isOpen: true });
  };

  const confirmDelete = async () => {
    await api.delete(`/products/${id}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-ivory to-pearl/50">
      <Sidebar />
      <main className="ml-64 px-8 pt-24 pb-8 max-w-3xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-shadow/60 hover:text-noir mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t("backToProducts")}
        </button>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="loader"></div>
          </div>
        )}

        {notFound && <NotFound withSidebar={true} />}

        {!loading && !notFound && product && (
          <form
            onSubmit={handleSave}
            className="bg-pearl rounded-2xl border border-mist px-8 pt-8 pb-8 shadow-lg"
          >
            <h1 className="font-display text-3xl text-noir mb-8">
              {t("edit")}
            </h1>

            <label className="block mb-5">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                {t("category")}
              </span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {tv(c.name)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-5">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                {t("productName")}
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
              />
            </label>

            <label className="block mb-5">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                {t("description")}
              </span>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                rows={4}
                className="w-full rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
              />
            </label>

            <label className="block mb-6">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                {t("price")}
              </span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none rtl:left-auto rtl:right-0 rtl:pl-0 rtl:pr-4">
                  <SaudiRiyal className="w-4 h-4 text-champagne" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full rounded-xl border border-mist pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30 rtl:pl-4 rtl:pr-10"
                />
              </div>
            </label>

            {form.colors.length > 0 && (
              <div className="mb-6">
                <span className="block text-xs font-medium text-charcoal/70 mb-3">
                  {t("colors")}
                </span>
                <div className="space-y-3">
                  {form.colors.map((color, i) => (
                    <div
                      key={i}
                      className="border border-mist rounded-xl p-4 bg-ivory/30"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex gap-2 flex-wrap">
                          {color.images.slice(0, 6).map((img, j) => (
                            <div key={j} className="relative">
                              <img
                                src={img}
                                alt=""
                                className="w-12 h-12 rounded-xl object-cover border border-mist/50"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveImage(i, j)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          {color.images.length > 6 && (
                            <div className="w-12 h-12 rounded-xl bg-mist/30 flex items-center justify-center text-xs text-charcoal/60">
                              +{color.images.length - 6}
                            </div>
                          )}
                        </div>
                        <input
                          value={color.name}
                          onChange={(e) => updateColorName(i, e.target.value)}
                          className="flex-1 text-sm border-none focus:outline-none bg-transparent"
                        />
                      </div>

                      {/* Add more images for this color */}
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handleAddImages(i, e.target.files)}
                          className="text-xs hidden"
                          id={`add-images-${i}`}
                        />
                        <label
                          htmlFor={`add-images-${i}`}
                          className="flex items-center justify-center gap-2 w-full rounded-lg border border-dashed border-mist px-3 py-2 text-xs text-shadow/70 hover:border-champagne/50 hover:text-noir cursor-pointer transition-all bg-pearl"
                        >
                          <Upload className="w-3 h-3" />
                          Add more images for {color.name || "this color"}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.qrCodeUrl && (
              <div className="mb-6 flex items-center gap-4 border border-mist rounded-xl p-4 bg-ivory/30">
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-mist/50">
                  <img
                    src={product.qrCodeUrl}
                    alt={t("qrCode")}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <QrCode className="w-4 h-4 text-champagne" />
                    <p className="text-sm text-noir font-medium">
                      {t("qrCode")}
                    </p>
                  </div>
                  <a
                    href={product.qrCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-champagne hover:underline flex items-center gap-1"
                  >
                    <Printer className="w-3 h-3" />
                    {t("openPrint")}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-mist">
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm font-medium text-charcoal hover:text-red-600 transition-colors flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                {t("delete")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-noir text-pearl text-sm font-medium rounded-xl px-6 py-3 hover:bg-charcoal transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <svg
                      className="animate-spin w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {t("saving")}
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    {t("save")}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </main>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false })}
        onConfirm={confirmDelete}
        message={t("confirmDeleteProduct")}
      />
    </div>
  );
};

export default ProductDetails;
