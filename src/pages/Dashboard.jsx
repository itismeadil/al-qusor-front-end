import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import Sidebar from "../components/Sidebar";
import ProductTable from "../components/ProductTable";
import { useLanguage } from "../context/LanguageContext";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { t } = useLanguage();
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products");
      setProducts(data);
    } catch (err) {
      setError("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert("Could not delete this product. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Sidebar />
      <main className="ml-64 px-10 py-10">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-3xl text-noir">{t("products")}</h1>
            <p className="text-charcoal/60 text-sm mt-2">
              {t("productsSubtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/dashboard/add-product")}
            className="bg-noir text-pearl text-sm font-medium px-5 py-3 rounded-lg hover:bg-charcoal transition-colors"
          >
            {t("addProduct")}
          </button>
        </div>

        {loading && <p className="text-shadow/60 text-sm">Loading…</p>}
        {error && <p className="text-noir text-sm">{error}</p>}
        {!loading && !error && (
          <ProductTable products={products} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;
