import React from 'react';
import StaffNavBar from '../components/StaffNavBar';
import '../assets/staffDashboardScoped.css';

const StaffDashboard = () => {
  return (
    <div className="staff-dashboard-container">
      <StaffNavBar />
      <main className="staff-dashboard-content">
        <div className="container">
          <div className="staff-dashboard-header">
            <h1>Dashboard Nhân viên</h1>
            <p>Chào mừng bạn đến với trang quản trị nhân viên</p>
          </div>
          
          <div className="staff-dashboard-grid">
            <div className="staff-dashboard-card">
              <div className="staff-dashboard-card-icon staff-dashboard-orders-icon">📋</div>
              <div className="staff-dashboard-card-content">
                <h3>Quản lý đơn hàng</h3>
                <p>Xem và xử lý các đơn hàng từ khách hàng</p>
                <a href="/staff/orders" className="staff-dashboard-card-btn">Xem đơn hàng</a>
              </div>
            </div>
            
            <div className="staff-dashboard-card">
              <div className="staff-dashboard-card-icon staff-dashboard-inventory-icon">📦</div>
              <div className="staff-dashboard-card-content">
                <h3>Thống kê kho</h3>
                <p>Kiểm tra tồn kho và quản lý sản phẩm</p>
                <a href="/staff/inventory" className="staff-dashboard-card-btn">Xem tồn kho</a>
              </div>
            </div>
            
            <div className="staff-dashboard-card">
              <div className="staff-dashboard-card-icon staff-dashboard-service-icon">📅</div>
              <div className="staff-dashboard-card-content">
                <h3>Quản lý đặt lịch dịch vụ</h3>
                <p>Xem và xử lý các yêu cầu đặt lịch dịch vụ</p>
                <a href="/staff/service-bookings" className="staff-dashboard-card-btn">Xem đặt lịch</a>
              </div>
            </div>
            
            <div className="staff-dashboard-card">
              <div className="staff-dashboard-card-icon staff-dashboard-inventory-icon">�</div>
              <div className="staff-dashboard-card-content">
                <h3>Thống kê kho hàng</h3>
                <p>Xem thống kê và phân tích dữ liệu kho hàng</p>
                <a href="/staff/inventory" className="staff-dashboard-card-btn">Xem thống kê</a>
              </div>
            </div>
          </div>
          
          <div className="staff-dashboard-info">
            <div className="staff-dashboard-info-card">
              <h3>Hướng dẫn sử dụng</h3>
              <ul>
                <li>Sử dụng menu điều hướng phía trên để chuyển đổi giữa các chức năng</li>
                <li>Kiểm tra đơn hàng mới trong mục "Quản lý đơn hàng"</li>
                <li>Theo dõi tồn kho trong mục "Thống kê kho"</li>
                <li>Xử lý yêu cầu dịch vụ trong mục "Quản lý đặt lịch dịch vụ"</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;