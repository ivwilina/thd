import React, { useEffect, useState } from 'react';
import apiService from '../services/apiService';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const StaffNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isStaffLoggedIn');
    navigate('/login');
  };
  return (
    <nav className="staff-navbar">
      <Link to="/staff/orders" className={location.pathname === '/staff/orders' ? 'active' : ''}>Đơn hàng</Link>
      <Link to="/staff/inventory" className={location.pathname === '/staff/inventory' ? 'active' : ''}>Tồn kho</Link>
      <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
    </nav>
  );
};

const StaffInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.get('/inventory?limit=100');
        setInventory(res.inventory || []);
      } catch (err) {
        setError('Không thể tải dữ liệu tồn kho.');
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div>
      <StaffNavBar />
      <h1>Thống kê tồn kho</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Tồn kho</th>
              <th>Đã bán</th>
              <th>Đã đặt</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.productId}>
                <td>{item.productId}</td>
                <td>{item.productName}</td>
                <td>{item.stock}</td>
                <td>{item.sold}</td>
                <td>{item.ordered}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffInventory;