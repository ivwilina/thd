import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import '../assets/checkout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const Checkout = () => {
  const location = useLocation();
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    content: '',
    paymentMethod: 'bank-transfer'
  });

  useEffect(() => {
    // Check if product was passed via location state
    if (location.state && location.state.product) {
      setCart([location.state.product]);
    } else {
      // You could also load cart from localStorage or context
      const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCart(savedCart);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleRadioChange = (e) => {
    setFormData(prevData => ({
      ...prevData,
      paymentMethod: e.target.value
    }));
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Process the order (in a real app, send to backend)
    console.log('Order submitted:', { formData, items: cart });
    
    // Clear cart and redirect to success page
    localStorage.removeItem('cart');
    alert('Đặt hàng thành công! Cảm ơn quý khách.');
    // You could redirect to a success page here
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.discountPrice?.replace(/[^\d]/g, '')) || 
                  parseFloat(item.price?.replace(/[^\d]/g, '')) || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' VND';
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-container">
        <NavBar />
        <div className="container">
          <div className="empty-cart">
            <h2>Giỏ hàng trống</h2>
            <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            <Link to="/" className="btn-back-shopping">Tiếp tục mua sắm</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <NavBar />
      
      <div className="container">
        <div className="checkout-header">
          <h1>Thanh toán</h1>
        </div>
        
        <div className="checkout-content">
          <div className="cart-summary">
            <div className="cart-items">
              <h2>Thông tin đơn hàng</h2>
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Tên sản phẩm</th>
                    <th>Giá bán</th>
                    <th>S.Lượng</th>
                    <th>Thành tiền</th>
                    <th>Xóa</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => {
                    const price = parseFloat(item.discountPrice?.replace(/[^\d]/g, '')) || 
                                parseFloat(item.price?.replace(/[^\d]/g, '')) || 0;
                    const quantity = item.quantity || 1;
                    const total = price * quantity;
                    
                    return (
                      <tr key={item.id}>
                        <td className="product-image">
                          <img 
                            src={item.image || `/laptop${item.id}.jpg`} 
                            alt={item.name} 
                          />
                        </td>
                        <td className="product-name">{item.name}</td>
                        <td className="product-price">
                          {item.discountPrice || item.price}
                        </td>
                        <td className="product-quantity">
                          <input 
                            type="number" 
                            min="1" 
                            value={quantity}
                            onChange={() => {}} // Placeholder for quantity change handler
                            readOnly
                          />
                        </td>
                        <td className="product-total">
                          {formatPrice(total)}
                        </td>
                        <td className="product-remove">
                          <button 
                            onClick={() => handleRemoveItem(item.id)}
                            className="btn-remove"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="order-total-label">Tổng thành tiền:</td>
                    <td colSpan="2" className="order-total-value">
                      {formatPrice(calculateTotal())}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="customer-info">
            <h2>Thông tin khách hàng</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">
                  Họ tên: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">
                  Email: <span className="required">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="phone">
                  Điện thoại: <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="address">
                  Địa chỉ giao hàng: <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Nội dung:</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Vui lòng ghi chú Mã đơn hàng + SĐT của bạn trong phần Nội dung thanh toán (Chúng tôi sẽ hỗ trợ chậm nhất sau 15 phút quý khách chuyển khoản)"
                ></textarea>
              </div>
              
              <div className="form-group payment-options">
                <label>Chọn phương thức thanh toán: <span className="required">*</span></label>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="bank-transfer"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={formData.paymentMethod === 'bank-transfer'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="bank-transfer">
                    Chuyển khoản ngân hàng
                  </label>
                </div>
                
                <div className="payment-method">
                  <input
                    type="radio"
                    id="cash-on-delivery"
                    name="paymentMethod"
                    value="cash-on-delivery"
                    checked={formData.paymentMethod === 'cash-on-delivery'}
                    onChange={handleRadioChange}
                  />
                  <label htmlFor="cash-on-delivery">
                    Thanh toán khi nhận hàng
                  </label>
                </div>
                
                {formData.paymentMethod === 'bank-transfer' && (
                  <div className="bank-info">
                    <p>
                      Thực hiện thanh toán vào ngày tài khoản ngân hàng của chúng tôi. 
                      Vui lòng ghi chú Mã đơn hàng + SĐT của bạn trong phần Nội dung thanh toán 
                      (Chúng tôi sẽ hỗ trợ chậm nhất sau 15 phút quý khách chuyển khoản)
                    </p>
                    <p>
                      <strong>Chủ tài khoản:</strong> Nguyễn Văn Hiếu | <strong>Số tài khoản:</strong> 19024547021018 | <strong>Ngân hàng</strong> techcombank Hà Nội
                    </p>
                  </div>
                )}
              </div>
              
              <button type="submit" className="btn-place-order">
                Đặt hàng
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
