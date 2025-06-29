import React from 'react';

const StaffDashboard = () => {
  return (
    <>
      <h2>Trang quản trị nhân viên</h2>
      <div className="staff-actions">
        <a href="/staff/inventory" className="btn">Thống kê kho</a>
        <a href="/staff/orders" className="btn">Quản lý đơn hàng</a>
      </div>
      <div className="info">Chọn chức năng quản trị bên trên để tiếp tục.</div>
    </>
  );
};

export default StaffDashboard;