import React from 'react';
import { Navigate } from 'react-router-dom';
import '../assets/staffRoute.css';

const StaffRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isStaffLoggedIn') === 'true';
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  // Bọc children bằng container để áp dụng style staff
  return <div className="staff-protected-container">{children}</div>;
};

export default StaffRoute;