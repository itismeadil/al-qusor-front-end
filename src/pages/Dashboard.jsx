import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ProductTable from "../components/ProductTable";
import ConfirmationModal from "../components/ConfirmationModal";
import { useLanguage } from "../context/LanguageContext";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    productId: null,
  });
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError(t("errorLoadProducts"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    setDeleteModal({ isOpen: true, productId: id });
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/products/${deleteModal.productId}`);
      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteModal.productId),
      );
      setDeleteModal({ isOpen: false, productId: null });
    } catch (err) {
      alert(t("errorDeleteProduct"));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-ivory to-pearl/50">
      <Sidebar />
      <main className="ml-64 px-8 pt-24 pb-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-noir mb-2">
              {t("theCollection")}
            </h1>
            <p className="text-charcoal/60 text-sm">{t("productsSubtitle")}</p>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="bg-noir text-pearl text-sm font-medium px-6 py-3 rounded-xl hover:bg-charcoal transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {t("addProduct")}
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="loader"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl text-sm">
            {error}
          </div>
        )}
        {!loading && !error && (
          <ProductTable products={products} onDelete={handleDelete} />
        )}
      </main>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, productId: null })}
        onConfirm={confirmDelete}
        message={t("confirmDeleteProduct")}
      />
    </div>
  );
};

export default Dashboard;
