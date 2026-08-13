import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import {
  SaudiRiyal,
  Plus,
  X,
  Upload,
  ArrowLeft,
  Printer,
  CheckCircle,
} from "lucide-react";

let colorIdCounter = 0;
const newColor = () => ({
  key: colorIdCounter++,
  name: "",
  files: [],
  previews: [],
});

const AddProduct = () => {
  const { t, tv } = useLanguage();
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
    // Reset createdProduct state when component mounts
    setCreatedProduct(null);
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
    const newFiles = Array.from(fileList);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setColors((prev) =>
      prev.map((c) =>
        c.key === key
          ? {
              ...c,
              files: [...c.files, ...newFiles],
              previews: [...c.previews, ...newPreviews],
            }
          : c,
      ),
    );
  };

  // New: remove a single photo from a color before submitting
  const removeColorImage = (key, index) => {
    setColors((prev) =>
      prev.map((c) =>
        c.key === key
          ? {
              ...c,
              files: c.files.filter((_, i) => i !== index),
              previews: c.previews.filter((_, i) => i !== index),
            }
          : c,
      ),
    );
  };

  const addColorRow = () => setColors((prev) => [...prev, newColor()]);
  const removeColorRow = (key) =>
    setColors((prev) => prev.filter((c) => c.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!categoryId) {
      setError(t("errorSelectCategory"));
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
      setError(err.response?.data?.message || t("errorSaveProduct"));
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
      <div className="min-h-screen bg-gradient-to-br from-ivory via-ivory to-pearl/50">
        <Sidebar />
        <main className="ml-64 px-8 pt-24 pb-8 max-w-lg">
          <div className="bg-pearl rounded-2xl border border-mist px-8 py-12 text-center shadow-lg">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-champagne/70 mb-3">
              {t("productAdded")}
            </p>
            <h1 className="font-display text-3xl text-noir mb-8">
              {createdProduct.name}
            </h1>
            <div className="relative inline-block mb-6">
              <img
                src={createdProduct.qrCodeUrl}
                alt={t("qrCode")}
                className="w-64 h-64 mx-auto border-2 border-mist rounded-2xl shadow-md"
              />
            </div>
            <p className="text-charcoal/60 text-sm mt-6 mb-8">
              {t("scanToView")}
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handlePrint}
                className="bg-noir text-pearl text-sm font-medium rounded-xl px-6 py-3 hover:bg-charcoal transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                {t("print")}
              </button>
              <button
                onClick={resetForm}
                className="text-sm font-medium text-charcoal hover:text-noir border border-mist rounded-xl px-6 py-3 hover:border-champagne/50 transition-all duration-300"
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
    <div className="min-h-screen bg-gradient-to-br from-ivory via-ivory to-pearl/50">
      <Sidebar />
      <main className="ml-64 px-8 pt-24 pb-8 max-w-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm text-shadow/60 hover:text-noir mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          {t("backToProducts")}
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-pearl rounded-2xl border border-mist px-8 pt-8 pb-8 shadow-lg"
        >
          <h1 className="font-display text-3xl text-noir mb-8">
            {t("addProduct")}
          </h1>

          {error && (
            <div className="mb-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
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
              className="w-full rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {tv(c.name)}
                </option>
              ))}
            </select>
          </label>

          <div className="flex gap-3 mb-6">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t("newCategory")}
              className="flex-1 rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="text-sm font-medium border border-mist rounded-xl px-5 hover:bg-ivory transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t("add")}
            </button>
          </div>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-charcoal/70 mb-2">
              {t("productName")}
            </span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30"
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
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="w-full rounded-xl border border-mist pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-ivory/30 rtl:pl-4 rtl:pr-10"
              />
            </div>
          </label>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="block text-xs font-medium text-charcoal/70">
                {t("colors")}
              </span>
              <button
                type="button"
                onClick={addColorRow}
                className="text-xs font-medium text-champagne hover:text-champagne/70 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                {t("addColor")}
              </button>
            </div>
            <div className="space-y-4">
              {colors.map((color) => (
                <div
                  key={color.key}
                  className="border border-mist rounded-xl p-4 bg-ivory/30"
                >
                  <div className="flex gap-3 mb-3">
                    <input
                      value={color.name}
                      onChange={(e) =>
                        updateColor(color.key, { name: e.target.value })
                      }
                      placeholder={t("colorName")}
                      className="flex-1 rounded-xl border border-mist px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-champagne/30 focus:border-champagne/50 transition-all bg-pearl"
                    />
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorRow(color.key)}
                        className="text-xs text-charcoal px-3 hover:text-noir hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <X className="w-3 h-3" />
                        {t("delete")}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        handleColorFiles(color.key, e.target.files);
                        e.target.value = ""; // lets you pick the same file again later if needed
                      }}
                      className="text-xs hidden"
                      id={`file-${color.key}`}
                    />
                    <label
                      htmlFor={`file-${color.key}`}
                      className="flex items-center justify-center gap-2 w-full rounded-xl border-2 border-dashed border-mist px-4 py-4 text-sm text-shadow/70 hover:border-champagne/50 hover:text-noir cursor-pointer transition-all bg-pearl"
                    >
                      <Upload className="w-4 h-4" />
                      {t("images")}
                    </label>
                  </div>
                  {color.previews.length > 0 && (
                    <div className="flex gap-3 mt-3 flex-wrap">
                      {color.previews.map((src, i) => (
                        <div key={i} className="relative group">
                          <img
                            src={src}
                            alt=""
                            className="w-16 h-16 object-cover rounded-xl border border-mist shadow-sm"
                          />
                          <button
                            type="button"
                            onClick={() => removeColorImage(color.key, i)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-noir text-pearl rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
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
            className="w-full bg-noir text-pearl text-sm font-medium rounded-xl py-4 hover:bg-charcoal transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
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
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
