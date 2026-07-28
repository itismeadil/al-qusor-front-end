import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';

let colorIdCounter = 0;
const newColor = () => ({ key: colorIdCounter++, name: '', files: [], previews: [] });

const AddProduct = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [colors, setColors] = useState([newColor()]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdProduct, setCreatedProduct] = useState(null); // holds result -> shows QR + print

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    const { data } = await api.post('/categories', { name: newCategoryName.trim() });
    setCategories((prev) => {
      const exists = prev.find((c) => c._id === data._id);
      return exists ? prev : [...prev, data].sort((a, b) => a.name.localeCompare(b.name));
    });
    setCategoryId(data._id);
    setNewCategoryName('');
  };

  const updateColor = (key, patch) => {
    setColors((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
  };

  const handleColorFiles = (key, fileList) => {
    const files = Array.from(fileList);
    const previews = files.map((f) => URL.createObjectURL(f));
    updateColor(key, { files, previews });
  };

  const addColorRow = () => setColors((prev) => [...prev, newColor()]);
  const removeColorRow = (key) => setColors((prev) => prev.filter((c) => c.key !== key));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!categoryId) {
      setError('Please choose or add a category.');
      return;
    }

    setSubmitting(true);
    try {
      // 1) Upload each color's images first, collecting the URLs Mongo will store
      const uploadedColors = [];
      for (const color of colors) {
        if (!color.name.trim()) continue;
        let imageUrls = [];
        if (color.files.length > 0) {
          const formData = new FormData();
          color.files.forEach((f) => formData.append('images', f));
          const { data } = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          imageUrls = data.urls;
        }
        uploadedColors.push({ name: color.name.trim(), images: imageUrls });
      }

      // 2) Create the product — the backend generates the QR code right after
      const { data: product } = await api.post('/products', {
        name,
        category: categoryId,
        description,
        price: Number(price),
        colors: uploadedColors
      });

      setCreatedProduct(product);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save this product. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
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
    setName('');
    setDescription('');
    setPrice('');
    setCategoryId('');
    setColors([newColor()]);
  };

  // ---- Success screen: QR code + print, shown right after saving ----
  if (createdProduct) {
    return (
      <div className="min-h-screen flex bg-paper">
        <Sidebar />
        <main className="flex-1 px-10 py-8 max-w-lg">
          <div className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line px-8 py-10 text-center">
            <p className="text-xs uppercase tracking-wide text-slate/50 mb-2">{t('productAdded')}</p>
            <h1 className="font-display text-2xl text-ink mb-6">{createdProduct.name}</h1>

            <img
              src={createdProduct.qrCodeUrl}
              alt="QR code"
              className="w-56 h-56 mx-auto border border-line rounded-md"
            />
            <p className="text-slate/60 text-sm mt-4 mb-6">{t('scanToView')}</p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handlePrint}
                className="bg-ink text-paper text-sm font-medium rounded-md px-5 py-2.5 hover:bg-clay transition-colors"
              >
                {t('print')}
              </button>
              <button
                onClick={resetForm}
                className="text-sm font-medium text-slate hover:text-ink border border-line rounded-md px-5 py-2.5"
              >
                {t('doneAddAnother')}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 px-10 py-8 max-w-2xl">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-slate/60 hover:text-ink mb-6">
          {t('backToProducts')}
        </button>

        <form onSubmit={handleSubmit} className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line px-7 pt-8 pb-7">
          <h1 className="font-display text-2xl text-ink mb-6">{t('addProduct')}</h1>

          {error && (
            <div className="mb-5 text-sm text-clay bg-clay/5 border border-clay/20 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          {/* Category: pick existing, or add a new one on the fly */}
          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('category')}</span>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            >
              <option value="">—</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </label>

          <div className="flex gap-2 mb-6">
            <input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={t('newCategory')}
              className="flex-1 rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="text-sm font-medium border border-line rounded-md px-4 hover:bg-paper"
            >
              {t('add')}
            </button>
          </div>

          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">Product name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('description')}</span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
          </label>

          <label className="block mb-6">
            <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('price')} ({t('sar')})</span>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
            />
          </label>

          {/* Colors — each with its own name and set of clean photos */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="block text-xs font-medium text-slate/70">{t('colors')}</span>
              <button type="button" onClick={addColorRow} className="text-xs font-medium text-clay hover:text-clay/70">
                {t('addColor')}
              </button>
            </div>

            <div className="space-y-4">
              {colors.map((color) => (
                <div key={color.key} className="border border-line rounded-md p-4">
                  <div className="flex gap-2 mb-3">
                    <input
                      value={color.name}
                      onChange={(e) => updateColor(color.key, { name: e.target.value })}
                      placeholder={t('colorName')}
                      className="flex-1 rounded-md border border-line px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
                    />
                    {colors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeColorRow(color.key)}
                        className="text-xs text-clay px-2"
                      >
                        {t('delete')}
                      </button>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleColorFiles(color.key, e.target.files)}
                    className="text-xs"
                  />

                  {color.previews.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {color.previews.map((src, i) => (
                        <img key={i} src={src} alt="" className="w-14 h-14 object-cover rounded-md border border-line" />
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
            className="w-full bg-ink text-paper text-sm font-medium rounded-md py-2.5 hover:bg-clay transition-colors disabled:opacity-60"
          >
            {submitting ? t('saving') : t('save')}
          </button>
        </form>
      </main>
    </div>
  );
};

export default AddProduct;
