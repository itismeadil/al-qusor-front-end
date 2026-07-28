import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import { useLanguage } from '../context/LanguageContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', colors: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const [{ data: p }, { data: cats }] = await Promise.all([
        api.get(`/products/${id}`),
        api.get('/categories')
      ]);
      setProduct(p);
      setCategories(cats);
      setForm({
        name: p.name || '',
        description: p.description || '',
        price: p.price ?? '',
        category: p.category?._id || '',
        colors: p.colors || []
      });
      setLoading(false);
    };
    load();
  }, [id]);

  const updateColorName = (index, newName) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.map((c, i) => (i === index ? { ...c, name: newName } : c))
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/products/${id}`, { ...form, price: Number(form.price) || 0 });
      navigate('/dashboard');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    await api.delete(`/products/${id}`);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />
      <main className="flex-1 px-10 py-8 max-w-2xl">
        <button onClick={() => navigate('/dashboard')} className="text-sm text-slate/60 hover:text-ink mb-6">
          {t('backToProducts')}
        </button>

        {loading && <p className="text-slate/60 text-sm">Loading…</p>}

        {!loading && product && (
          <form onSubmit={handleSave} className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line px-7 pt-8 pb-7">
            <h1 className="font-display text-2xl text-ink mb-6">{t('edit')}</h1>

            <label className="block mb-4">
              <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('category')}</span>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-medium text-slate/70 mb-1.5">Product name</span>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
            </label>

            <label className="block mb-4">
              <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('description')}</span>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={4}
                className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
            </label>

            <label className="block mb-6">
              <span className="block text-xs font-medium text-slate/70 mb-1.5">{t('price')} ({t('sar')})</span>
              <input
                type="number"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-md border border-line px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-clay/40"
              />
            </label>

            {/* Renaming colors here; to add/replace photos, use Add Product's
                upload flow for now — a dedicated photo manager comes later. */}
            {form.colors.length > 0 && (
              <div className="mb-6">
                <span className="block text-xs font-medium text-slate/70 mb-2">{t('colors')}</span>
                <div className="space-y-2">
                  {form.colors.map((color, i) => (
                    <div key={i} className="flex items-center gap-3 border border-line rounded-md p-2">
                      <div className="flex gap-1">
                        {color.images.slice(0, 3).map((img, j) => (
                          <img key={j} src={img} alt="" className="w-8 h-8 rounded object-cover" />
                        ))}
                      </div>
                      <input
                        value={color.name}
                        onChange={(e) => updateColorName(i, e.target.value)}
                        className="flex-1 text-sm border-none focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {product.qrCodeUrl && (
              <div className="mb-6 flex items-center gap-4 border border-line rounded-md p-4">
                <img src={product.qrCodeUrl} alt="QR code" className="w-16 h-16" />
                <div>
                  <p className="text-sm text-ink font-medium">QR code</p>
                  <a href={product.qrCodeUrl} target="_blank" rel="noreferrer" className="text-xs text-clay hover:underline">
                    Open / print
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleDelete}
                className="text-sm font-medium text-clay hover:text-clay/70"
              >
                {t('delete')}
              </button>
              <button
                type="submit"
                disabled={saving}
                className="bg-ink text-paper text-sm font-medium rounded-md px-5 py-2.5 hover:bg-clay transition-colors disabled:opacity-60"
              >
                {saving ? t('saving') : t('save')}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
