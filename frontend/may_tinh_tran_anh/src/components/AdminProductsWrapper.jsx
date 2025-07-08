import React from 'react';
import './adminProductsHighPriority.css';

/**
 * Wrapper component để đảm bảo CSS scoping cho trang Admin Products
 * Tránh xung đột CSS với các trang khác
 */
const AdminProductsWrapper = ({ children }) => {
  return (
    <div className="admin-page admin-products-page" data-page="admin-products">
      {children}
    </div>
  );
};

export default AdminProductsWrapper;
