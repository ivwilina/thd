import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import NavBar from '../components/NavBar';

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.get('/orders?limit=100');
        setOrders(res.orders || []);
      } catch (err) {
        setError('Không thể tải danh sách đơn hàng.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [refresh]);

  const handleComplete = async (orderId) => {
    if (!window.confirm('Bạn chắc chắn muốn hoàn thành đơn hàng này?')) return;
    try {
      await apiService.put(`/orders/${orderId}/complete`, {});
      alert('Đã hoàn thành đơn hàng!');
      setRefresh(r => !r);
    } catch (err) {
      alert('Có lỗi khi hoàn thành đơn hàng!');
    }
  };

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

  return (
    <div className="staff-orders-container">
      <StaffNavBar />
      <div className="container">
        <h1>Quản lý đơn hàng</h1>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Điện thoại</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Ngày đặt</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.customerPhoneNumber}</td>
                  <td>{order.customerAddress}</td>
                  <td>{order.status}</td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    {order.status !== 'delivered' && (
                      <button onClick={() => handleComplete(order._id)}>
                        Hoàn thành
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffOrders;