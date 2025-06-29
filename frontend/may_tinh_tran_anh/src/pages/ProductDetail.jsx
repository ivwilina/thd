import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import '../assets/productDetail.css';
import NavBar from '../components/NavBar';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import cartService from '../services/cartService';
import inventoryService from '../services/inventoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCheck, faExclamationCircle, faStar, faCartPlus } from '@fortawesome/free-solid-svg-icons';

const ProductDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addToCartLoading, setAddToCartLoading] = useState(false);
  const [showCartMessage, setShowCartMessage] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from both laptop and printer endpoints
        let productData = null;
        
        try {
          productData = await apiService.getLaptopById(id);
        } catch {
          try {
            productData = await apiService.getPrinterById(id);
          } catch {
            throw new Error('Không tìm thấy sản phẩm');
          }
        }
        
        if (productData && productData.data) {
          // Fetch inventory data for this product
          console.log(`📋 Fetching inventory for product: ${id}`);
          const inventoryData = await inventoryService.getProductInventory(id);
          console.log(`✅ Inventory data for ${id}:`, {
            available: inventoryData.availableStock,
            status: inventoryData.stockStatus,
            fallback: inventoryData._fallback,
            reason: inventoryData._reason
          });
          setInventory(inventoryData);
          
          // Show warning if using fallback data
          if (inventoryData._fallback) {
            if (inventoryData._reason === 'BACKEND_UNAVAILABLE') {
              console.warn('⚠️ Inventory service unavailable, showing estimated stock');
            } else if (inventoryData._reason === 'NOT_FOUND') {
              console.warn('⚠️ No inventory data found for this product');
            }
          }
          
          // Format product data for display with inventory info
          const formattedProduct = formatProductDetail(productData.data, inventoryData);
          setProduct(formattedProduct);
        } else {
          throw new Error('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError(err.message || 'Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Format product data for detailed view
  const formatProductDetail = (productData, inventoryData = null) => {
    const isLaptop = productData.cpu; // Laptops have CPU field
    
    // Get stock info from inventory data
    const stockInfo = inventoryData ? {
      currentStock: inventoryData.currentStock || 0,
      availableStock: inventoryData.availableStock || 0,
      reservedStock: inventoryData.reservedStock || 0,
      stockStatus: inventoryData.stockStatus || 'OUT_OF_STOCK',
      needsReorder: inventoryData.needsReorder || true
    } : {
      currentStock: 0,
      availableStock: 0,
      reservedStock: 0,
      stockStatus: 'OUT_OF_STOCK',
      needsReorder: true
    };
    
    if (isLaptop) {
      return {
        id: productData._id,
        name: productData.displayName,
        description: productData.description || 'Laptop chất lượng cao với hiệu năng mạnh mẽ.',
        specs: `${productData.cpu?.name || ''} ${productData.ramDetails} ${productData.storageDetails} ${productData.screenDetails}`,
        originalPrice: `${productData.price.toLocaleString('vi-VN')}đ`,
        discountPrice: productData.discount ? 
          `${Math.round(productData.price * (1 - productData.discount / 100)).toLocaleString('vi-VN')}đ` : 
          `${productData.price.toLocaleString('vi-VN')}đ`,
        discount: productData.discount ? `${productData.discount}%` : null,
        savingAmount: productData.discount ? 
          `${Math.round(productData.price * productData.discount / 100).toLocaleString('vi-VN')}đ` : '0đ',
        brand: productData.brand?.name || 'Unknown',
        images: productData.images?.map(img => 
          img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
        ) || ['http://localhost:3000/uploads/placeholder-laptop.jpg'],
        // Use inventory data for stock info
        stock: stockInfo.availableStock,
        stockStatus: stockInfo.stockStatus,
        totalStock: stockInfo.currentStock,
        reservedStock: stockInfo.reservedStock,
        warrantyInfo: productData.warranty || '12 tháng chính hãng',
        category: 'laptop',
        isNew: productData.isNewProduct,
        isFeatured: productData.isFeatured,
        specifications: [
          { name: 'CPU', value: productData.cpu?.name || 'N/A' },
          { name: 'RAM', value: productData.ramDetails || 'N/A' },
          { name: 'Ổ cứng', value: productData.storageDetails || 'N/A' },
          { name: 'Màn hình', value: productData.screenDetails || 'N/A' },
          { name: 'Card đồ họa', value: productData.graphicsCard?.name || 'N/A' },
          { name: 'Hệ điều hành', value: productData.operatingSystem || 'N/A' },
          { name: 'Cân nặng', value: productData.weight ? `${productData.weight} kg` : 'N/A' },
          { name: 'Màu sắc', value: productData.color || 'N/A' }
        ],
        features: [
          'Hiệu năng mạnh mẽ cho công việc và giải trí',
          'Thiết kế mỏng nhẹ, dễ dàng mang theo',
          'Màn hình sắc nét, màu sắc chân thực',
          'Bàn phím thoải mái, thời lượng pin lâu dài',
          'Cổng kết nối đa dạng, mở rộng linh hoạt'
        ],
        ratings: {
          average: 4.5,
          count: Math.floor(Math.random() * 50) + 10
        }
      };
    } else {
      // Printer
      return {
        id: productData._id,
        name: productData.description,
        description: productData.description || 'Máy in chất lượng cao với tính năng hiện đại.',
        specs: `${productData.printType} ${productData.printFeatures?.map(f => f.name).join(', ') || ''}`,
        originalPrice: `${productData.price.toLocaleString('vi-VN')}đ`,
        discountPrice: productData.discount ? 
          `${Math.round(productData.price * (1 - productData.discount / 100)).toLocaleString('vi-VN')}đ` : 
          `${productData.price.toLocaleString('vi-VN')}đ`,
        discount: productData.discount ? `${productData.discount}%` : null,
        savingAmount: productData.discount ? 
          `${Math.round(productData.price * productData.discount / 100).toLocaleString('vi-VN')}đ` : '0đ',
        brand: productData.brand?.name || 'Unknown',
        images: productData.images?.map(img => 
          img.startsWith('http') ? img : `http://localhost:3000/uploads/${img}`
        ) || ['http://localhost:3000/uploads/placeholder-printer.jpg'],
        // Use inventory data for stock info
        stock: stockInfo.availableStock,
        stockStatus: stockInfo.stockStatus,
        totalStock: stockInfo.currentStock,
        reservedStock: stockInfo.reservedStock,
        warrantyInfo: productData.warranty || '12 tháng chính hãng',
        category: 'printer',
        isNew: productData.isNewProduct,
        isFeatured: productData.isFeatured,
        specifications: [
          { name: 'Loại in', value: productData.printType || 'N/A' },
          { name: 'Tốc độ in', value: productData.printSpeed || 'N/A' },
          { name: 'Độ phân giải', value: productData.resolution || 'N/A' },
          { name: 'Kết nối', value: productData.connectivity?.join(', ') || 'N/A' },
          { name: 'Định dạng giấy', value: productData.paperSizes?.join(', ') || 'N/A' },
          { name: 'Hệ điều hành hỗ trợ', value: productData.operatingSystem || 'N/A' },
          { name: 'Kích thước', value: productData.dimensions || 'N/A' },
          { name: 'Cân nặng', value: productData.weight ? `${productData.weight} kg` : 'N/A' }
        ],
        features: [
          'Chất lượng in cao, văn bản sắc nét',
          'Tốc độ in nhanh, tiết kiệm thời gian',
          'Kết nối đa dạng: USB, WiFi, Ethernet',
          'Hỗ trợ nhiều định dạng giấy khác nhau',
          'Tiết kiệm mực in, thân thiện môi trường'
        ],
        ratings: {
          average: 4.3,
          count: Math.floor(Math.random() * 30) + 5
        }
      };
    }
  };

  const handleQuantityChange = (action) => {
    if (action === 'increase') {
      if (product && quantity < product.stock) {
        setQuantity(prev => prev + 1);
      }
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

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = async () => {
    try {
      setAddToCartLoading(true);
      cartService.addToCart(product, quantity);
      setShowCartMessage(true);
      
      // Ẩn thông báo sau 3 giây
      setTimeout(() => {
        setShowCartMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddToCartLoading(false);
    }
  };

  // Xử lý mua ngay
  const handleBuyNow = () => {
    const productToCheckout = {
      ...product,
      quantity: quantity
    };
    navigate('/checkout', { state: { product: productToCheckout } });
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

  if (error) {
    return (
      <div className="product-detail-container">
        <NavBar />
        <div className="container">
          <div className="product-error">
            <h2>Có lỗi xảy ra</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Thử lại</button>
            <Link to="/" className="back-to-home">Quay lại trang chủ</Link>
          </div>
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
    <div className="product-detail-container product-detail">
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
                <ImageWithFallback
                  src={product.images[selectedImage]}
                  fallbackSrc={product.category === 'laptop' ? 
                    'http://localhost:3000/uploads/placeholder-laptop.jpg' : 
                    'http://localhost:3000/uploads/placeholder-printer.jpg'
                  }
                  alt={product.name}
                />
              </div>
              <div className="product-thumbnail-images">
                {product.images.map((img, index) => (
                  <div 
                    key={index} 
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <ImageWithFallback
                      src={img}
                      fallbackSrc={product.category === 'laptop' ? 
                        'http://localhost:3000/uploads/placeholder-laptop.jpg' : 
                        'http://localhost:3000/uploads/placeholder-printer.jpg'
                      }
                      alt={`${product.name} - thumbnail ${index + 1}`}
                    />
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
                {product.discount && (
                  <div className="price-discount-badge">-{product.discount}</div>
                )}
              </div>
                {/* Product promotions section removed */}
              
              <div className="product-availability">
                <FontAwesomeIcon 
                  icon={product.stock > 0 ? faCheck : faExclamationCircle} 
                  className={`icon ${inventoryService.getStockStatusClass(product.stockStatus)}`}
                />
                <div className="stock-info">
                  <span className="stock-status">
                    {product.stock > 0 ? 
                      `Còn hàng (${product.stock} sản phẩm)` : 
                      inventoryService.formatStockStatus(product.stockStatus)
                    }
                    {inventory && inventory._fallback && (
                      <span className="estimated-stock"> *Ước tính</span>
                    )}
                  </span>
                  {product.stock > 0 && product.stockStatus === 'LOW_STOCK' && (
                    <span className="low-stock-warning">⚠️ Chỉ còn ít hàng!</span>
                  )}
                  {inventory && inventory.reservedStock > 0 && (
                    <span className="reserved-info">
                      ({inventory.reservedStock} sản phẩm đang được đặt trước)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="product-actions">
                <div className="quantity-selector">
                  <button 
                    className="qty-btn decrease" 
                    onClick={() => handleQuantityChange('decrease')}
                    disabled={quantity <= 1 || product.stock <= 0}
                  >
                    -
                  </button>
                  <input 
                    type="text" 
                    value={quantity} 
                    readOnly 
                    disabled={product.stock <= 0}
                  />
                  <button 
                    className="qty-btn increase" 
                    onClick={() => handleQuantityChange('increase')}
                    disabled={quantity >= product.stock || product.stock <= 0}
                  >
                    +
                  </button>
                </div>
                
                <button 
                  className="add-to-cart-btn" 
                  disabled={product.stock <= 0 || addToCartLoading || quantity > product.stock}
                  onClick={handleAddToCart}
                >
                  <FontAwesomeIcon icon={faShoppingCart} />
                  {product.stock <= 0 ? 'Hết hàng' : 
                   addToCartLoading ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
                </button>
                
                <button 
                  className="buy-now-btn" 
                  disabled={product.stock <= 0 || quantity > product.stock}
                  onClick={handleBuyNow}
                >
                  {product.stock <= 0 ? 'Hết hàng' : 'Mua ngay'}
                </button>
              </div>
              
              {/* Thông báo thêm vào giỏ hàng thành công */}
              {showCartMessage && (
                <div className="cart-success-message">
                  <FontAwesomeIcon icon={faCheck} />
                  Đã thêm sản phẩm vào giỏ hàng!
                </div>
              )}
              
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
