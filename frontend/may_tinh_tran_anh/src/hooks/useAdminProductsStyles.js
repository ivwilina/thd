import { useEffect } from 'react';

/**
 * Custom hook để đảm bảo CSS isolation cho trang Admin Products
 * Ngăn chặn xung đột CSS với các trang khác
 */
export const useAdminProductsStyles = () => {
  useEffect(() => {
    // Thêm class vào body để tạo namespace riêng
    document.body.classList.add('admin-products-active');
    
    // Thêm data attribute để CSS selector có thể target chính xác
    document.documentElement.setAttribute('data-admin-page', 'products');
    
    // Cleanup khi component unmount
    return () => {
      document.body.classList.remove('admin-products-active');
      document.documentElement.removeAttribute('data-admin-page');
    };
  }, []);
  
  // Return style constants để sử dụng inline nếu cần
  return {
    variables: {
      '--ap-primary': '#e63312',
      '--ap-secondary': '#2c3e50',
      '--ap-success': '#28a745',
      '--ap-warning': '#ffc107',
      '--ap-danger': '#dc3545',
      '--ap-info': '#17a2b8',
      '--ap-light': '#f8f9fa',
      '--ap-dark': '#343a40',
      '--ap-border': '#e9ecef',
      '--ap-shadow': '0 2px 10px rgba(0, 0, 0, 0.1)',
      '--ap-border-radius': '8px',
      '--ap-border-radius-sm': '4px'
    }
  };
};

export default useAdminProductsStyles;
