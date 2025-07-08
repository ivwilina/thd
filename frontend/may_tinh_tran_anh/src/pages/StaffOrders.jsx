import React, { useEffect, useState } from 'react';
import StaffNavBar from '../components/StaffNavBar';
import apiService from '../services/apiService';
import '../assets/staffOrdersScoped.css';

const StaffOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.get('/orders?limit=100');
        setOrders(res.orders || []);
      } catch (err) {
        console.error('Error fetching orders:', err);
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
      const response = await apiService.put(`/orders/${orderId}/complete`, {});
      if (response.success) {
        alert('Đã hoàn thành đơn hàng!');
        setRefresh(r => !r);
      } else {
        throw new Error(response.message || 'Có lỗi khi hoàn thành đơn hàng!');
      }
    } catch (err) {
      console.error('Error completing order:', err);
      alert('Có lỗi khi hoàn thành đơn hàng: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirm = async (orderId) => {
    if (!window.confirm('Bạn chắc chắn muốn xác nhận đơn hàng này?')) return;
    try {
      const response = await apiService.put(`/orders/${orderId}/confirm`, {});
      if (response.success) {
        alert('Đã xác nhận đơn hàng!');
        setRefresh(r => !r);
      } else {
        throw new Error(response.message || 'Có lỗi khi xác nhận đơn hàng!');
      }
    } catch (err) {
      console.error('Error confirming order:', err);
      alert('Có lỗi khi xác nhận đơn hàng: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCancel = async (orderId) => {
    const reason = prompt('Vui lòng nhập lý do hủy đơn hàng:');
    if (reason === null) return; // User clicked cancel
    
    if (!window.confirm('Bạn chắc chắn muốn hủy đơn hàng này?')) return;
    
    try {
      const response = await apiService.put(`/orders/${orderId}/cancel`, { reason });
      if (response.success) {
        alert('Đã hủy đơn hàng!');
        setRefresh(r => !r);
      } else {
        throw new Error(response.message || 'Có lỗi khi hủy đơn hàng!');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Có lỗi khi hủy đơn hàng: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': '#ffa500',
      'confirmed': '#007bff',
      'processing': '#17a2b8',
      'shipping': '#6f42c1',
      'delivered': '#28a745',
      'cancelled': '#dc3545'
    };
    return colors[status] || '#6c757d';
  };

  const getStatusText = (status) => {
    const statusTexts = {
      'pending': 'Chờ xử lý',
      'confirmed': 'Đã xác nhận',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'delivered': 'Đã giao',
      'cancelled': 'Đã hủy'
    };
    return statusTexts[status] || status;
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const closeOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const OrderDetailModal = () => {
    if (!showOrderDetail || !selectedOrder) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '30px',
          maxWidth: '800px',
          maxHeight: '80vh',
          overflow: 'auto',
          position: 'relative'
        }}>
          <button 
            onClick={closeOrderDetail}
            style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          
          <h2 style={{ marginBottom: '20px', color: '#343a40' }}>
            Chi tiết đơn hàng: {selectedOrder._id}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <h3>Thông tin khách hàng</h3>
              <p><strong>Tên:</strong> {selectedOrder.customerName}</p>
              <p><strong>Email:</strong> {selectedOrder.customerEmail}</p>
              <p><strong>Điện thoại:</strong> {selectedOrder.customerPhoneNumber}</p>
              <p><strong>Địa chỉ:</strong> {selectedOrder.customerAddress}</p>
            </div>
            <div>
              <h3>Thông tin đơn hàng</h3>
              <p><strong>Ngày đặt:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> 
                <span style={{ color: getStatusColor(selectedOrder.status), fontWeight: 'bold' }}>
                  {getStatusText(selectedOrder.status)}
                </span>
              </p>
              <p><strong>Thanh toán:</strong> {selectedOrder.billingMethod}</p>
              <p><strong>Tổng tiền:</strong> 
                <span style={{ color: '#28a745', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('vi-VN').format(selectedOrder.finalPrice)} VND
                </span>
              </p>
              {selectedOrder.processedBy && (
                <p><strong>Người xử lý:</strong> {selectedOrder.processedBy}</p>
              )}
              {selectedOrder.processedAt && (
                <p><strong>Ngày xử lý:</strong> {new Date(selectedOrder.processedAt).toLocaleString()}</p>
              )}
            </div>
          </div>

          {selectedOrder.note && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Ghi chú</h3>
              <p style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                {selectedOrder.note}
              </p>
            </div>
          )}

          {selectedOrder.cancelReason && (
            <div style={{ marginBottom: '20px' }}>
              <h3>Lý do hủy</h3>
              <p style={{ background: '#ffebee', padding: '10px', borderRadius: '4px', color: '#c62828' }}>
                {selectedOrder.cancelReason}
              </p>
            </div>
          )}

          <div>
            <h3>Sản phẩm đặt mua</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#f8f9fa' }}>
                  <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #dee2e6' }}>Tên sản phẩm</th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6' }}>Số lượng</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>Đơn giá</th>
                  <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.orderItems?.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: '10px', border: '1px solid #dee2e6' }}>{item.itemName}</td>
                    <td style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6' }}>{item.quantity}</td>
                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                      {new Intl.NumberFormat('vi-VN').format(item.unitPrice)} VND
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', border: '1px solid #dee2e6' }}>
                      {new Intl.NumberFormat('vi-VN').format(item.totalPrice)} VND
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="staff-orders-page">
      <StaffNavBar />
      <div className="staff-orders-container">
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
                <th>Tổng tiền</th>
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
                  <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {order.customerAddress}
                  </td>
                  <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                    {new Intl.NumberFormat('vi-VN').format(order.finalPrice)} VND
                  </td>
                  <td>
                    <span 
                      style={{ 
                        color: getStatusColor(order.status), 
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: getStatusColor(order.status) + '20'
                      }}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td>{new Date(order.orderDate).toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      <button 
                        onClick={() => handleViewOrder(order)}
                        style={{ backgroundColor: '#6c757d', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                      >
                        Xem
                      </button>
                      {order.status === 'pending' && (
                        <>
                          <button 
                            onClick={() => handleConfirm(order._id)}
                            style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Xác nhận
                          </button>
                          <button 
                            onClick={() => handleCancel(order._id)}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Hủy
                          </button>
                        </>
                      )}
                      {['confirmed', 'processing', 'shipping'].includes(order.status) && (
                        <>
                          <button 
                            onClick={() => handleComplete(order._id)}
                            style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Hoàn thành
                          </button>
                          <button 
                            onClick={() => handleCancel(order._id)}
                            style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '3px', cursor: 'pointer' }}
                          >
                            Hủy
                          </button>
                        </>
                      )}
                      {order.status === 'delivered' && (
                        <span style={{ color: '#28a745', fontWeight: 'bold' }}>✓ Đã hoàn thành</span>
                      )}
                      {order.status === 'cancelled' && (
                        <span style={{ color: '#dc3545', fontWeight: 'bold' }}>✗ Đã hủy</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <OrderDetailModal />
    </div>
  );
};

export default StaffOrders;