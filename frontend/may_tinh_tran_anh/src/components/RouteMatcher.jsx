import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RouteMatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    if (!isLoggedIn) {
      // Chưa đăng nhập, chuyển về trang Home (trang chủ cho khách hàng)
      navigate('/home', { replace: true });
    } else {
      // Đã đăng nhập, chuyển về dashboard tương ứng với role
      if (userRole === 'staff') {
        navigate('/staff/orders', { replace: true });
      } else if (userRole === 'admin') {
        navigate('/admin/products', { replace: true });
      } else {
        // Role không xác định, logout và về trang login
        localStorage.clear();
        navigate('/login', { replace: true });
      }
    }
  }, [navigate]);

  // Hiển thị loading trong khi chuyển hướng
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '18px',
      color: '#666'
    }}>
      🔄 Đang chuyển hướng...
    </div>
  );
};

export default RouteMatcher;
