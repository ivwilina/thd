import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faShoppingCart,
  faBoxes,
  faCalendarCheck,
  faUser,
  faSignOutAlt,
  faTachometerAlt
} from '@fortawesome/free-solid-svg-icons';
import '../assets/staffNavBarScoped.css';

const StaffNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Staff User';
  const userRole = localStorage.getItem('userRole') || 'staff';
  
  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const navItems = [
    {
      path: '/staff',
      label: 'Dashboard',
      icon: faTachometerAlt,
      exact: true
    },
    {
      path: '/staff/orders',
      label: 'Quản lý đơn hàng',
      icon: faShoppingCart
    },
    // {
    //   path: '/staff/inventory',
    //   label: 'Thống kê kho',
    //   icon: faBoxes
    // },
    {
      path: '/staff/service-bookings',
      label: 'Đặt lịch dịch vụ',
      icon: faCalendarCheck
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="staff-nav-wrapper">
      <nav className="staff-nav-main">
        <div className="staff-nav-container">
          {/* Brand Section */}
          <div className="staff-nav-brand">
            <Link to="/staff" className="staff-nav-brand-link">
              <FontAwesomeIcon icon={faHome} className="staff-nav-brand-icon" />
              <div className="staff-nav-brand-text">
                <h3>Staff Portal</h3>
                <span>Trần Anh Computer</span>
              </div>
            </Link>
          </div>

          {/* Navigation Menu */}
          <div className="staff-nav-menu">
            <ul className="staff-nav-list">
              {navItems.map((item) => (
                <li key={item.path} className="staff-nav-item">
                  <Link 
                    to={item.path} 
                    className={`staff-nav-link ${isActive(item.path, item.exact) ? 'staff-nav-active' : ''}`}
                    title={item.label}
                  >
                    <FontAwesomeIcon icon={item.icon} className="staff-nav-icon" />
                    <span className="staff-nav-text">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* User Section */}
          <div className="staff-nav-user">
            <div className="staff-nav-user-info">
              <FontAwesomeIcon icon={faUser} className="staff-nav-user-icon" />
              <div className="staff-nav-user-details">
                <span className="staff-nav-user-name">{userName}</span>
                <span className="staff-nav-user-role">{userRole.toUpperCase()}</span>
              </div>
            </div>
            <button 
              className="staff-nav-logout-btn" 
              onClick={handleLogout}
              title="Đăng xuất"
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default StaffNavBar;
