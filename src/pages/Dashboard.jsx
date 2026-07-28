import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Sidebar from '../components/Sidebar';
import ProductTable from '../components/ProductTable';
import { useLanguage } from '../context/LanguageContext';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      setError('Could not load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert('Could not delete this product. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex bg-paper">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl text-ink">{t('products')}</h1>
            <p className="text-slate/60 text-sm mt-1">{t('productsSubtitle')}</p>
          </div>

          <button
            onClick={() => navigate('/dashboard/add-product')}
            className="bg-clay text-white text-sm font-medium px-4 py-2.5 rounded-md hover:bg-clay/90 transition-colors"
          >
            {t('addProduct')}
          </button>
        </div>

        {loading && <p className="text-slate/60 text-sm">Loading…</p>}
        {error && <p className="text-clay text-sm">{error}</p>}
        {!loading && !error && (
          <ProductTable products={products} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
