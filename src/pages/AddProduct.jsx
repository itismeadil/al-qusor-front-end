import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

let colorIdCounter = 0;
const newColor = () => ({
  key: colorIdCounter++,
  name: "",
  files: [],
  previews: [],
});

const AddProduct = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [colors, setColors] = useState([newColor()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [createdProduct, setCreatedProduct] = useState(null);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const { data } = await api.post("/categories", {
      name: newCategoryName.trim(),
    });
    setCategories((prev) => {
      const exists = prev.find((c) => c._id === data._id);
      return exists
        ? prev
        : [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
    });
    setCategoryId(data._id);
    setNewCategoryName("");
  };

  const updateColor = (key, patch) => {
    setColors((prev) =>
      prev.map((c) => (c.key === key ? { ...c, ...patch } : c)),
    );
  };

  const handleColorFiles = (key, fileList) => {
    const files = Array.from(fileList);
    const previews = files.map((f) => URL.createObjectURL(f));
    updateColor(key, { files, previews });
  };

  const addColorRow = () => setColors((prev) => [...prev, newColor()]);
  const removeColorRow = (key) =>
    setColors((prev) => prev.filter((c) => c.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!categoryId) {
      setError("Please choose or add a category.");
      return;
    }
    setSubmitting(true);
    try {
      const uploadedColors = [];
      for (const color of colors) {
        if (!color.name.trim()) continue;
        let imageUrls = [];
        if (color.files.length > 0) {
          const formData = new FormData();
          color.files.forEach((f) => formData.append("images", f));
          const { data } = await api.post("/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          imageUrls = data.urls;
        }
        uploadedColors.push({ name: color.name.trim(), images: imageUrls });
      }

      const { data: product } = await api.post("/products", {
        name,
        category: categoryId,
        description,
        price: Number(price),
        colors: uploadedColors,
      });

      setCreatedProduct(product);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save this product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head><title>${createdProduct.name} — QR</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;margin:0;font-family:sans-serif;">
          <img src="${createdProduct.qrCodeUrl}" style="width:300px;height:300px;" />
          <p style="margin-top:12px;font-size:14px;">${createdProduct.name}</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const resetForm = () => {
    setCreatedProduct(null);
    setName("");
    setDescription("");
    setPrice("");
    setCategoryId("");
    setColors([newColor()]);
  };

  if (createdProduct) {
    return (
      <div className="min-h-screen bg-ivory">
        <Sidebar />
        <main className="ml-64 px-10 py-10 max-w-lg">
          <div className="bg-pearl rounded-xl border border-mist px-8 py-12 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-champagne/70 mb-3">
              {t("productAdded")}
            </p>
            <h1 className="font-display text-3xl text-noir mb-8">
              {createdProduct.name}
            </h1>
            <img
              src={createdProduct.qrCodeUrl}
              alt="QR code"
              className="w-64 h-64 mx-auto border border-mist rounded-xl"
            />
            <p className="text-charcoal/60 text-sm mt-6 mb-8">
              {t("scanToView")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="bg-noir text-pearl text-sm font-medium rounded-lg px-6 py-3 hover:bg-charcoal transition-colors"
              >
                {t("print")}
              </button>
              <button
                onClick={resetForm}
                className="text-sm font-medium text-charcoal hover:text-noir border border-mist rounded-lg px-6 py-3"
              >
                {t("doneAddAnother")}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <main className="ml-64 px-10 py-10 max-w-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-sm text-shadow/60 hover:text-noir mb-8 transition-colors"
        >
          {t("backToProducts")}
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-pearl rounded-xl border border-mist px-8 pt-8 pb-8"
        >
          <h1 className="font-display text-3xl text-noir mb-8">
            {t("addProduct")}
          </h1>

          {error && (
            <div className="mb-5 text-sm text-noir bg-noir/5 border border-noir/10 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <label className="block mb-5">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              {t("category")}
            </span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3 mb-6">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t("newCategory")}
              className="flex-1 rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="text-sm font-medium border border-mist rounded-lg px-5 hover:bg-ivory transition-colors"
            >
              {t("add")}
            </button>
          </div>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              Product name
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              {t("description")}
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
            />
          </label>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-xs font-medium text-charcoal/70">
                {t("colors")}
              </span>
              <button
                type="button"
                onClick={addColorRow}
                className="text-xs font-medium text-champagne hover:text-champagne/70"
              >
                {t("addColor")}
              </button>
            </div>
            <div className="space-y-4">
              {colors.map((color) => (
                <div
                  key={color.key}
                  className="border border-mist rounded-lg p-4"
                >
                  <div className="flex gap-3 mb-3">
                    <input
                      value={color.name}
                      onChange={(e) =>
                        updateColor(color.key, { name: e.target.value })
                      }
                      placeholder={t("colorName")}
                      className="flex-1 rounded-lg border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all"
                    />
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorRow(color.key)}
                        className="text-xs text-charcoal px-3 hover:text-noir"
                      >
                        {t("delete")}
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) =>
                      handleColorFiles(color.key, e.target.files)
                    }
                    className="text-xs"
                  />
                  {color.previews.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {color.previews.map((src, i) => (
                        <img
                          key={i}
                          src={src}
                          alt=""
                          className="w-16 h-16 object-cover rounded-lg border border-mist"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-noir text-pearl text-sm font-medium rounded-lg py-3 hover:bg-charcoal transition-colors disabled:opacity-60"
          >
            {submitting ? t("saving") : t("save")}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
