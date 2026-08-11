import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper text-slate/70 text-sm">
        Checking your session…
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
