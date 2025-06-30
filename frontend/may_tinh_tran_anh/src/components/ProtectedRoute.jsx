import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole, redirectTo = '/login' }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  // Nếu chưa đăng nhập, chuyển về trang login
  if (!isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  // Nếu có yêu cầu role cụ thể và user không đúng role
  if (requiredRole && userRole !== requiredRole) {
    // Chuyển về trang tương ứng với role của user
    if (userRole === 'staff') {
      return <Navigate to="/staff/orders" replace />;
    } else if (userRole === 'admin') {
      return <Navigate to="/admin/products" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  // Bọc children với container để áp dụng style
  const containerClass = userRole === 'admin' ? 'admin-protected-container' : 'staff-protected-container';
  return <div className={containerClass}>{children}</div>;
};

export default ProtectedRoute;
