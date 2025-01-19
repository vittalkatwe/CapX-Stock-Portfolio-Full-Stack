// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();

  // While loading authentication status, don't redirect yet
  if (loading) {
    return <div>Loading...</div>;
  }

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // If authenticated, render the protected route
  if (!user) {
    return <Navigate to="/login" replace />; // Redirect to login if not authenticated
  }
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
