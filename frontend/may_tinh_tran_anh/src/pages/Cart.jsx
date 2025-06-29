import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/cart.css';
import NavBar from '../components/NavBar';
import ImageWithFallback from '../components/ImageWithFallback';
import cartService from '../services/cartService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faMinus, faPlus, faShoppingCart, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lấy giỏ hàng từ localStorage
    const cart = cartService.getCart();
    setCartItems(cart);
    setLoading(false);

    // Lắng nghe thay đổi giỏ hàng
    const handleCartChange = (updatedCart) => {
      setCartItems(updatedCart);
    };

    cartService.addListener(handleCartChange);

    return () => {
      cartService.removeListener(handleCartChange);
    };
  }, []);

  const handleQuantityChange = (productId, newQuantity) => {
    cartService.updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    cartService.removeFromCart(productId);
  };

  const handleClearCart = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?')) {
      cartService.clearCart();
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.discountPrice.replace(/[^\d]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return `${price.toLocaleString('vi-VN')}đ`;
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }
    navigate('/checkout', { state: { cartItems } });
  };

  if (loading) {
    return (
      <div className="cart-container">
        <NavBar />
        <div className="container">
          <div className="loading">Đang tải giỏ hàng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <NavBar />
      
      <main className="cart-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Giỏ hàng</span>
          </div>
          
          <h1 className="cart-title">
            <FontAwesomeIcon icon={faShoppingCart} />
            Giỏ hàng của bạn ({cartItems.length} sản phẩm)
          </h1>
          
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <FontAwesomeIcon icon={faShoppingCart} />
              </div>
              <h2>Giỏ hàng trống</h2>
              <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
              <Link to="/" className="continue-shopping-btn">
                <FontAwesomeIcon icon={faArrowLeft} />
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            <div className="cart-layout">
              <div className="cart-items">
                <div className="cart-header">
                  <button className="clear-cart-btn" onClick={handleClearCart}>
                    <FontAwesomeIcon icon={faTrash} />
                    Xóa toàn bộ giỏ hàng
                  </button>
                </div>
                
                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="item-image">
                        <Link to={`/product/${item.id}`}>
                          <ImageWithFallback
                            src={item.image}
                            fallbackSrc={item.category === 'laptop' ? 
                              'http://localhost:3000/uploads/placeholder-laptop.jpg' : 
                              'http://localhost:3000/uploads/placeholder-printer.jpg'
                            }
                            alt={item.name}
                          />
                        </Link>
                      </div>
                      
                      <div className="item-info">
                        <h3 className="item-name">
                          <Link to={`/product/${item.id}`}>{item.name}</Link>
                        </h3>
                        <div className="item-brand">Thương hiệu: {item.brand}</div>
                        {item.discount && (
                          <div className="item-discount">Giảm {item.discount}</div>
                        )}
                      </div>
                      
                      <div className="item-price">
                        <div className="current-price">{item.discountPrice}</div>
                        {item.originalPrice !== item.discountPrice && (
                          <div className="original-price">{item.originalPrice}</div>
                        )}
                      </div>
                      
                      <div className="item-quantity">
                        <button 
                          className="qty-btn decrease"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </button>
                        <input 
                          type="number" 
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          max={item.stock}
                        />
                        <button 
                          className="qty-btn increase"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </div>
                      
                      <div className="item-total">
                        {formatPrice(parseFloat(item.discountPrice.replace(/[^\d]/g, '')) * item.quantity)}
                      </div>
                      
                      <div className="item-actions">
                        <button 
                          className="remove-item-btn"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="cart-summary">
                <div className="summary-card">
                  <h3>Tóm tắt đơn hàng</h3>
                  
                  <div className="summary-line">
                    <span>Tạm tính ({cartItems.length} sản phẩm)</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  <div className="summary-line">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  
                  <div className="summary-divider"></div>
                  
                  <div className="summary-total">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(calculateTotal())}</span>
                  </div>
                  
                  <button className="checkout-btn" onClick={handleCheckout}>
                    Tiến hành thanh toán
                  </button>
                  
                  <Link to="/" className="continue-shopping">
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart;
