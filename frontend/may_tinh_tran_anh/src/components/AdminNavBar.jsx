import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBox,
  faWarehouse,
  faUsers,
  faChartBar,
  faTools,
  faSignOutAlt,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import '../assets/unifiedAdminStaff.css';

const AdminNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Admin';
  const userRole = localStorage.getItem('userRole') || 'admin';

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/admin/products', label: 'Sản phẩm', icon: faBox },
    { path: '/admin/inventory', label: 'Kho hàng', icon: faWarehouse },
    
    { path: '/admin/reports', label: 'Báo cáo', icon: faChartBar },
  ];

  return (
    <div className="admin-nav-wrapper">
      <nav className="admin-navbar">
        <div className="admin-navbar-container">
          {/* Brand Section */}
          <div className="admin-navbar-brand">
            <Link to="/admin" className="admin-brand-link">
              <FontAwesomeIcon icon={faTools} className="admin-brand-icon" />
              <div className="admin-brand-text">
                <h2>Quản trị hệ thống</h2>
                <span className="admin-welcome">Xin chào, {userName}</span>
              </div>
            </Link>
          </div>
          
          {/* Navigation Menu */}
          <div className="admin-navbar-menu">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
              >
                <FontAwesomeIcon icon={item.icon} className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* User Section */}
          <div className="admin-navbar-actions">
            <div className="admin-user-info">
              <FontAwesomeIcon icon={faUser} className="admin-user-icon" />
              <div className="admin-user-details">
                <span className="admin-user-name">{userName}</span>
                <span className="admin-user-role">{userRole.toUpperCase()}</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="admin-logout-btn"
              title="Đăng xuất"
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="logout-icon" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default AdminNavBar;
