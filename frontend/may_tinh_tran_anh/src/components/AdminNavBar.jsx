import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/products', label: '📦 Sản phẩm', icon: '📦' },
    { path: '/admin/inventory', label: '📊 Kho hàng', icon: '📊' },
    { path: '/admin/accounts', label: '👥 Tài khoản', icon: '👥' },
    { path: '/admin/reports', label: '📈 Báo cáo', icon: '📈' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="admin-navbar-brand">
        <h2>🛠️ Quản trị hệ thống</h2>
        <span className="admin-welcome">Xin chào, {userName}</span>
      </div>
      
      <div className="admin-navbar-menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
      
      <div className="admin-navbar-actions">
        <button 
          onClick={handleLogout}
          className="admin-logout-btn"
          title="Đăng xuất"
        >
          🚪 Đăng xuất
        </button>
      </div>
    </nav>
  );
};

export default AdminNavBar;
