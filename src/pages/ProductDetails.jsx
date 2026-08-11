import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
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
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
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

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: Number(form.price) || 0,
      });
      navigate("/dashboard");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    await api.delete(`/products/${id}`);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <main className="ml-64 px-10 py-10 max-w-3xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-shadow/60 hover:text-noir mb-8 transition-colors"
        >
          {t("backToProducts")}
        </button>

        {loading && <p className="text-shadow/60 text-sm">Loading…</p>}

        {!loading && product && (
          <form
            onSubmit={handleSave}
            className="bg-pearl rounded-xl border border-mist px-8 pt-8 pb-8"
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
                className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block mb-5">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                Product name
              </span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
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
                className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
              />
            </label>

            <label className="block mb-6">
              <span className="block text-xs font-medium text-charcoal/70 mb-2">
                {t("price")} ({t("sar")})
              </span>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
              />
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
                      className="flex items-center gap-3 border border-mist rounded-lg p-3"
                    >
                      <div className="flex gap-2">
                        {color.images.slice(0, 3).map((img, j) => (
                          <img
                            key={j}
                            src={img}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                        ))}
                      </div>
                      <input
                        value={color.name}
                        onChange={(e) => updateColorName(i, e.target.value)}
                        className="flex-1 text-sm border-none focus:outline-none bg-transparent"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.qrCodeUrl && (
              <div className="mb-6 flex items-center gap-4 border border-mist rounded-lg p-4">
                <img
                  src={product.qrCodeUrl}
                  alt="QR code"
                  className="w-20 h-20 rounded-lg"
                />
                <div>
                  <p className="text-sm text-noir font-medium">QR code</p>
                  <a
                    href={product.qrCodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-champagne hover:underline"
                  >
                    Open / print
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm font-medium text-charcoal hover:text-noir transition-colors"
              >
                {t("delete")}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-noir text-pearl text-sm font-medium rounded-lg px-6 py-3 hover:bg-charcoal transition-colors disabled:opacity-60"
              >
                {saving ? t("saving") : t("save")}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
