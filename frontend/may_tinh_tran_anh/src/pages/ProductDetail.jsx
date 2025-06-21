import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../assets/productDetail.css';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faExclamationCircle, faHeart, faShare, faStar } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
    // Sample product details (in a real app, this would come from an API)
  const productDetails = useMemo(() => ({
    1: {
      id: 1,
      name: 'Laptop Dell Inspiron 15 3520 5310BLK 102F0',
      description: 'Laptop Dell Inspiron 15 3520 với thiết kế mỏng nhẹ, hiệu năng mạnh mẽ từ bộ vi xử lý Intel Core i5 thế hệ 11, phù hợp cho công việc văn phòng và học tập hàng ngày.',
      specs: 'Intel Core i5-1155G7, 8GB RAM, 256GB SSD, 15.6" Full HD',      originalPrice: '13.990.000đ',
      discountPrice: '11.990.000đ',
      discount: '11%',
      savingAmount: '119.900đ',
      brand: 'Dell',
      images: ['/laptop1.jpg', '/laptop1-side.jpg', '/laptop1-back.jpg', '/laptop1-keyboard.jpg'],
      stock: 15,
      warrantyInfo: '12 tháng chính hãng',
      specifications: [
        { name: 'CPU', value: 'Intel Core i5-1155G7 (up to 4.50 GHz, 8MB Cache)' },
        { name: 'RAM', value: '8GB DDR4 3200MHz' },
        { name: 'Ổ cứng', value: '256GB SSD NVMe PCIe' },
        { name: 'Màn hình', value: '15.6 inch Full HD (1920 x 1080), Anti-Glare' },
        { name: 'Card đồ họa', value: 'Intel Iris Xe Graphics' },
        { name: 'Cổng giao tiếp', value: '1 x USB 3.2, 2 x USB 2.0, 1 x HDMI, 1 x RJ45, 1 x SD Card' },
        { name: 'Hệ điều hành', value: 'Windows 11 Home' },
        { name: 'Pin', value: '3 Cell 41WHr' },
        { name: 'Trọng lượng', value: '1.83 kg' },
        { name: 'Màu sắc', value: 'Đen' }
      ],
      features: [
        'Hiệu năng mạnh mẽ với CPU Intel thế hệ 11',
        'Màn hình Full HD sắc nét, chống chói',
        'Thời lượng pin cả ngày cho công việc và học tập',
        'Bàn phím chiclet thoải mái khi đánh máy',
        'Webcam HD tích hợp cho học trực tuyến'
      ],
      ratings: {
        average: 4.5,
        count: 28
      }
    },
    2: {
      id: 2,
      name: 'Laptop Dell Inspiron 15 3520 6H3D73',
      description: 'Laptop Dell Inspiron 15 3520 phiên bản cao cấp với bộ vi xử lý Intel Core i7 thế hệ 12, RAM 16GB và SSD 512GB, đáp ứng tốt nhu cầu đa nhiệm và làm việc nặng.',
      specs: 'Intel Core i7-1255U, 16GB RAM, 512GB SSD, 15.6" Full HD',      originalPrice: '19.990.000đ',
      discountPrice: '17.990.000đ',
      discount: '10%',
      savingAmount: '179.900đ',
      brand: 'Dell',
      images: ['/laptop2.jpg', '/laptop2-side.jpg', '/laptop2-back.jpg', '/laptop2-keyboard.jpg'],
      stock: 8,
      warrantyInfo: '12 tháng chính hãng',
      specifications: [
        { name: 'CPU', value: 'Intel Core i7-1255U (up to 4.70 GHz, 12MB Cache)' },
        { name: 'RAM', value: '16GB DDR4 3200MHz' },
        { name: 'Ổ cứng', value: '512GB SSD NVMe PCIe' },
        { name: 'Màn hình', value: '15.6 inch Full HD (1920 x 1080), Anti-Glare' },
        { name: 'Card đồ họa', value: 'Intel Iris Xe Graphics' },
        { name: 'Cổng giao tiếp', value: '1 x USB 3.2, 2 x USB 2.0, 1 x HDMI, 1 x RJ45, 1 x SD Card' },
        { name: 'Hệ điều hành', value: 'Windows 11 Home' },
        { name: 'Pin', value: '3 Cell 41WHr' },
        { name: 'Trọng lượng', value: '1.83 kg' },
        { name: 'Màu sắc', value: 'Đen' }
      ],
      features: [
        'Hiệu năng mạnh mẽ với CPU Intel thế hệ 12',
        'RAM 16GB cho đa nhiệm mượt mà',
        'SSD 512GB tốc độ cao, khởi động nhanh',
        'Màn hình Full HD sắc nét, chống chói',
        'Thiết kế gọn nhẹ, dễ dàng di chuyển'
      ],
      ratings: {
        average: 4.7,
        count: 15
      }
    },    // More products can be added here
  }), []);
  useEffect(() => {
    // Simulate API call to fetch product details
    setLoading(true);
    setTimeout(() => {
      if (productDetails[id]) {
        setProduct(productDetails[id]);
        setLoading(false);
      } else {
        // Handle product not found
        setLoading(false);
      }
    }, 500);
  }, [id, productDetails]);

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesomeIcon 
          key={i}
          icon={faStar} 
          className={i <= rating ? 'star filled' : 'star empty'} 
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="product-detail-container">
        <NavBar />
        <div className="container">
          <div className="loading">Đang tải thông tin sản phẩm...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-container">
        <NavBar />
        <div className="container">
          <div className="product-not-found">
            <h2>Không tìm thấy sản phẩm</h2>
            <p>Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
            <Link to="/" className="back-to-home">Quay lại trang chủ</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <NavBar />
      
      <main className="product-detail-content">
        <div className="container">
          {/* Breadcrumb */}
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <Link to="/laptop-chinh-hang">Laptop Chính Hãng</Link> / <span>{product.name}</span>
          </div>
          
          {/* Product Info Section */}
          <div className="product-detail-main">
            {/* Product Images */}
            <div className="product-images">
              <div className="product-main-image">
                <img src={product.images[selectedImage]} alt={product.name} />
              </div>
              <div className="product-thumbnail-images">
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img} alt={`${product.name} - thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div className="product-info">
              <h1 className="product-name">{product.name}</h1>
              
              <div className="product-meta">
                <div className="product-brand">
                  <strong>Thương hiệu:</strong> {product.brand}
                </div>
                <div className="product-rating">
                  {renderStars(product.ratings.average)}
                  <span className="rating-count">({product.ratings.count} đánh giá)</span>
                </div>
              </div>
              
              <div className="product-specs-highlight">
                {product.specs}
              </div>
              
              <div className="product-price-section">
                <div className="current-price">{product.discountPrice}</div>
                <div className="original-price">{product.originalPrice}</div>
                <div className="discount-badge">-{product.discount}</div>
              </div>
                {/* Product promotions section removed */}
              
              <div className="product-availability">
                <FontAwesomeIcon 
                  icon={product.stock > 0 ? faCheck : faExclamationCircle} 
                  className={`icon ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`} 
                />
                <span>{product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : 'Hết hàng'}</span>
              </div>
              
              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="qty-btn decrease" 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                  />
                  <button 
                    className="qty-btn increase" 
                    onClick={() => handleQuantityChange('increase')}
                  >
                    +
                  </button>
                </div>
                
                <button className="add-to-cart-btn" disabled={product.stock <= 0}>
                  <FontAwesomeIcon icon={faShoppingCart} />
                  Thêm vào giỏ hàng
                </button>
                  <button 
                  className="buy-now-btn" 
                  disabled={product.stock <= 0}
                  onClick={() => {
                    const productToCheckout = {
                      ...product,
                      quantity: quantity
                    };
                    navigate('/checkout', { state: { product: productToCheckout } });
                  }}
                >
                  Mua ngay
                </button>
              </div>
              
              <div className="product-secondary-actions">
                <button className="wishlist-btn">
                  <FontAwesomeIcon icon={faHeart} />
                  Thêm vào yêu thích
                </button>
                <button className="share-btn">
                  <FontAwesomeIcon icon={faShare} />
                  Chia sẻ
                </button>
              </div>
              
              <div className="product-warranty">
                <strong>Bảo hành:</strong> {product.warrantyInfo}
              </div>
            </div>
          </div>
          
          {/* Product Details Tabs */}
          <div className="product-detail-tabs">
            <div className="tabs-header">
              <div className="tab active">Mô tả sản phẩm</div>
              <div className="tab">Thông số kỹ thuật</div>
              <div className="tab">Đánh giá sản phẩm</div>
            </div>
            
            <div className="tabs-content">
              <div className="tab-panel active">
                <div className="product-description">
                  <p>{product.description}</p>
                  
                  <h3>Tính năng nổi bật</h3>
                  <ul className="product-features-list">
                    {product.features.map((feature, index) => (
                      <li key={index}>
                        <FontAwesomeIcon icon={faCheck} className="icon" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detailed Specifications */}
          <div className="specifications-section">
            <h2 className="section-title">Thông số kỹ thuật</h2>
            <table className="specs-table">
              <tbody>
                {product.specifications.map((spec, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'even' : 'odd'}>
                    <td className="spec-name">{spec.name}</td>
                    <td className="spec-value">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Related Products */}
          <div className="related-products-section">
            <h2 className="section-title">Sản phẩm tương tự</h2>
            <div className="related-products-slider">
              {/* In a real implementation, this would be a slider of related products */}
              <div className="related-product">
                <div className="related-product-image">
                  <img src="/laptop3.jpg" alt="Related Product" />
                </div>
                <div className="related-product-info">
                  <h3 className="related-product-name">
                    <Link to="/product/3">Laptop Dell Inspiron 15 3520 6R6NK</Link>
                  </h3>
                  <div className="related-product-price">13.490.000đ</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
