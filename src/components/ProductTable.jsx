import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ProductTable = ({ products, onDelete }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line px-8 py-14 text-center">
        <p className="text-ink font-medium mb-1">{t('noProductsTitle')}</p>
        <p className="text-slate/60 text-sm">{t('noProductsBody')}</p>
      </div>
    );
  }

  return (
    <div className="tag-edge bg-white rounded-b-xl rounded-t-sm border border-line overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wide text-slate/50 border-b border-line">
            <th className="px-6 py-3 font-medium">{t('products')}</th>
            <th className="px-6 py-3 font-medium">{t('category')}</th>
            <th className="px-6 py-3 font-medium">{t('price')}</th>
            <th className="px-6 py-3 font-medium text-right">{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const firstImage = product.colors?.[0]?.images?.[0];
            return (
              <tr key={product._id} className="border-b border-line last:border-0 hover:bg-paper/60">
                <td
                  className="px-6 py-4 cursor-pointer"
                  onClick={() => navigate(`/dashboard/products/${product._id}`)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-line overflow-hidden shrink-0">
                      {firstImage && (
                        <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <span className="font-medium text-ink">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate/70">{product.category?.name || '—'}</td>
                <td className="px-6 py-4 text-slate/70">
                  {typeof product.price === 'number' ? `${product.price.toFixed(2)} ${t('sar')}` : '—'}
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <button
                    onClick={() => navigate(`/dashboard/products/${product._id}`)}
                    className="text-xs font-medium text-slate hover:text-ink"
                  >
                    {t('edit')}
                  </button>
                  <button
                    onClick={() => onDelete(product._id)}
                    className="text-xs font-medium text-clay hover:text-clay/70"
                  >
                    {t('delete')}
                  </button>
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
