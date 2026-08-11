import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import PublicProduct from './pages/PublicProduct';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProductDetails from './pages/ProductDetails';
import AddProduct from './pages/AddProduct';
import PrivateRoute from './components/PrivateRoute';

const ADMIN_LOGIN_PATH = import.meta.env.VITE_ADMIN_LOGIN_PATH || '/alqusor-owner-7x2k';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/p/:id" element={<PublicProduct />} />
      <Route path={ADMIN_LOGIN_PATH} element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/products/:id"
        element={
          <PrivateRoute>
            <ProductDetails />
          </PrivateRoute>
        }
      />
      <Route
        path="/dashboard/add-product"
        element={
          <PrivateRoute>
            <AddProduct />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
