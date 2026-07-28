import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Wraps any page that requires a logged-in admin. While the session check
// is in flight we show nothing flashy — just a quiet loading state.
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
    // Send anyone without a session to the public Home page rather than
    // revealing the admin login URL.
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
