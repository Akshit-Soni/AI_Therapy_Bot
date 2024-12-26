import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { isAdmin } from '../../utils/adminUtils';

const AdminRoute = ({ children }) => {
  const { currentUser } = useAuth();
  console.log('Current User:', currentUser);
  console.log('Is Admin:', isAdmin(currentUser));

  if (!currentUser || !isAdmin(currentUser)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute; 