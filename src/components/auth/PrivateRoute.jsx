import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  if (!currentUser) {
    console.log('No authenticated user, redirecting to login');
    return <Navigate to="/login" />;
  }

  return children;
}
