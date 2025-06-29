import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import '../assets/productListing.css';
import NavBar from '../components/NavBar';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import cartService from '../services/cartService';
import inventoryService from '../services/inventoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faTimes, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const ProductListing = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    price: [],
    features: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // Categories data
  const categories = {
    'laptop-chinh-hang': {
      title: 'Laptop Chính Hãng',
      filters: {
        brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI'],
        priceRanges: ['Dưới 10 triệu', '10-15 triệu', '15-20 triệu', '20-30 triệu', 'Trên 30 triệu'],
        features: ['Core i3', 'Core i5', 'Core i7', 'Core i9', 'SSD', 'HDD', '8GB RAM', '16GB RAM', '32GB RAM']
      }
    },
    'laptop-cu-gia-re': {
      title: 'Laptop Cũ Giá Rẻ',
      filters: {
        brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
        priceRanges: ['Dưới 5 triệu', '5-10 triệu', '10-15 triệu', 'Trên 15 triệu'],
        features: ['Core i3', 'Core i5', 'Core i7', 'SSD', 'HDD', '4GB RAM', '8GB RAM', '16GB RAM']
      }
    },
    'may-in-chinh-hang': {
      title: 'Máy In Chính Hãng',
      filters: {
        brands: ['Canon', 'HP', 'Epson', 'Brother', 'Samsung'],
        priceRanges: ['Dưới 2 triệu', '2-5 triệu', '5-10 triệu', 'Trên 10 triệu'],
        features: ['In laser', 'In phun', 'In màu', 'In đen trắng', 'In đa chức năng', 'WiFi', 'Duplex']
      }
    },
    'may-in-cu': {
      title: 'Máy In Cũ',
      filters: {
        brands: ['Canon', 'HP', 'Epson', 'Brother'],
        priceRanges: ['Dưới 1 triệu', '1-3 triệu', '3-5 triệu', 'Trên 5 triệu'],
        features: ['In laser', 'In phun', 'In màu', 'In đen trắng']
      }
    },
    'hop-muc-may-in': {
      title: 'Hộp Mực Máy In',
      filters: {
        brands: ['Canon', 'HP', 'Epson', 'Brother'],
        priceRanges: ['Dưới 500k', '500k-1 triệu', '1-2 triệu'],
        features: ['Mực đen', 'Mực màu', 'Combo màu', 'Chính hãng', 'Tương thích']
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let response;
        
        // Fetch products based on category
        switch (category) {
          case 'laptop-chinh-hang':
            response = await apiService.getNewLaptops();
            break;
          case 'laptop-cu-gia-re':
            response = await apiService.getUsedLaptops();
            break;
          case 'may-in-chinh-hang':
            response = await apiService.getNewPrinters();
            break;
          case 'may-in-cu':
            response = await apiService.getUsedPrinters();
            break;
          case 'hop-muc-may-in':
            // For now, return empty array since we don't have ink cartridge data
            response = { data: [], message: 'Hộp mực máy in sẽ sớm có mặt' };
            break;
          default:
            // Get all products for general category
            response = await apiService.getProductsByCategory(category);
            break;
        }
        
        // Format products for display
        const formattedProducts = response.data?.map(product => 
          apiService.formatProductForDisplay(product)
        ) || [];
        
        // Fetch inventory data for products to get real stock info
        console.log('📦 Fetching inventory for', formattedProducts.length, 'products...');
        const productsWithInventory = await Promise.all(
          formattedProducts.map(async (product) => {
            try {
              console.log(`📋 Fetching inventory for product: ${product.id}`);
              const inventoryData = await inventoryService.getProductInventory(product.id);
              console.log(`✅ Inventory for ${product.id}:`, {
                available: inventoryData.availableStock,
                status: inventoryData.stockStatus,
                fallback: inventoryData._fallback
              });
              return {
                ...product,
                stock: inventoryData.availableStock || 0,
                stockStatus: inventoryData.stockStatus || 'OUT_OF_STOCK',
                totalStock: inventoryData.currentStock || 0,
                reservedStock: inventoryData.reservedStock || 0
              };
            } catch (error) {
              console.log(`❌ No inventory found for product ${product.id}:`, error);
              return {
                ...product,
                stock: 0,
                stockStatus: 'OUT_OF_STOCK',
                totalStock: 0,
                reservedStock: 0
              };
            }
          })
        );
        
        setProducts(productsWithInventory);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, location.search]);

  const toggleFilter = (type, value) => {
    setSelectedFilters(prev => {
      const newFilters = {...prev};
      if (newFilters[type].includes(value)) {
        newFilters[type] = newFilters[type].filter(item => item !== value);
      } else {
        newFilters[type] = [...newFilters[type], value];
      }
      return newFilters;
    });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const getCategoryInfo = () => {
    return categories[category] || { title: 'Sản phẩm', filters: { brands: [], priceRanges: [], features: [] } };
  };

  const categoryInfo = getCategoryInfo();

  // Utility functions for filtering
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    // Remove non-numeric characters except dots
    const numericString = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };

  const isPriceInRange = (price, range) => {
    const numPrice = parsePrice(price) / 1000000; // Convert to millions

    switch (range) {
      case 'Dưới 500k':
        return numPrice < 0.5;
      case 'Dưới 1 triệu':
        return numPrice < 1;
      case 'Dưới 2 triệu':
        return numPrice < 2;
      case 'Dưới 5 triệu':
        return numPrice < 5;
      case 'Dưới 10 triệu':
        return numPrice < 10;
      case '500k-1 triệu':
        return numPrice >= 0.5 && numPrice < 1;
      case '1-2 triệu':
        return numPrice >= 1 && numPrice < 2;
      case '1-3 triệu':
        return numPrice >= 1 && numPrice < 3;
      case '2-5 triệu':
        return numPrice >= 2 && numPrice < 5;
      case '3-5 triệu':
        return numPrice >= 3 && numPrice < 5;
      case '5-10 triệu':
        return numPrice >= 5 && numPrice < 10;
      case '10-15 triệu':
        return numPrice >= 10 && numPrice < 15;
      case '15-20 triệu':
        return numPrice >= 15 && numPrice < 20;
      case '20-30 triệu':
        return numPrice >= 20 && numPrice < 30;
      case 'Trên 5 triệu':
        return numPrice >= 5;
      case 'Trên 10 triệu':
        return numPrice >= 10;
      case 'Trên 15 triệu':
        return numPrice >= 15;
      case 'Trên 30 triệu':
        return numPrice >= 30;
      default:
        return true;
    }
  };

  const hasFeature = (product, feature) => {
    const searchText = `${product.name} ${product.specs || ''} ${product.brand || ''}`.toLowerCase();
    
    switch (feature.toLowerCase()) {
      case 'core i3':
        return searchText.includes('core i3') || searchText.includes('i3-');
      case 'core i5':
        return searchText.includes('core i5') || searchText.includes('i5-');
      case 'core i7':
        return searchText.includes('core i7') || searchText.includes('i7-');
      case 'core i9':
        return searchText.includes('core i9') || searchText.includes('i9-');
      case 'ssd':
        return searchText.includes('ssd');
      case 'hdd':
        return searchText.includes('hdd');
      case '4gb ram':
        return searchText.includes('4gb') && searchText.includes('ram');
      case '8gb ram':
        return searchText.includes('8gb') && searchText.includes('ram');
      case '16gb ram':
        return searchText.includes('16gb') && searchText.includes('ram');
      case '32gb ram':
        return searchText.includes('32gb') && searchText.includes('ram');
      case 'in laser':
        return searchText.includes('laser');
      case 'in phun':
        return searchText.includes('phun') || searchText.includes('inkjet');
      case 'in màu':
        return searchText.includes('màu') || searchText.includes('color');
      case 'in đen trắng':
        return searchText.includes('đen trắng') || searchText.includes('mono');
      case 'in đa chức năng':
        return searchText.includes('đa chức năng') || searchText.includes('all-in-one');
      case 'wifi':
        return searchText.includes('wifi') || searchText.includes('wireless');
      case 'duplex':
        return searchText.includes('duplex') || searchText.includes('in 2 mặt');
      case 'mực đen':
        return searchText.includes('đen') || searchText.includes('black');
      case 'mực màu':
        return searchText.includes('màu') || searchText.includes('color');
      case 'combo màu':
        return searchText.includes('combo') || searchText.includes('set');
      case 'chính hãng':
        return product.isNew !== false;
      case 'tương thích':
        return searchText.includes('tương thích') || searchText.includes('compatible');
      default:
        return searchText.includes(feature.toLowerCase());
    }
  };

  // Filter and sort products
  const searchFilteredProducts = (products) => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      (product.specs && product.specs.toLowerCase().includes(query)) ||
      (product.brand && product.brand.toLowerCase().includes(query))
    );
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply search filter first
    filtered = searchFilteredProducts(filtered);

    // Apply brand filter
    if (selectedFilters.brand.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.brand.some(brand => 
          product.brand && product.brand.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    // Apply price filter
    if (selectedFilters.price.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.price.some(range => 
          isPriceInRange(product.discountPrice || product.originalPrice, range)
        )
      );
    }

    // Apply features filter
    if (selectedFilters.features.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.features.some(feature => hasFeature(product, feature))
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => {
          const priceA = parsePrice(a.discountPrice || a.originalPrice);
          const priceB = parsePrice(b.discountPrice || b.originalPrice);
          return priceA - priceB;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const priceA = parsePrice(a.discountPrice || a.originalPrice);
          const priceB = parsePrice(b.discountPrice || b.originalPrice);
          return priceB - priceA;
        });
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name, 'vi'));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'popularity':
      default:
        // Keep original order for popularity
        break;
    }

    return filtered;
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilters({
      brand: [],
      price: [],
      features: []
    });
  };

  // Count active filters
  const getActiveFilterCount = () => {
    return selectedFilters.brand.length + 
           selectedFilters.price.length + 
           selectedFilters.features.length;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  // Xử lý thêm vào giỏ hàng
  const handleAddToCart = (product) => {
    try {
      if (product.stock <= 0) {
        alert('Sản phẩm này hiện đã hết hàng!');
        return;
      }
      
      cartService.addToCart(product, 1);
      // Có thể thêm thông báo thành công ở đây nếu cần
      alert('Đã thêm sản phẩm vào giỏ hàng!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
  };

  return (
    <div className="product-listing-container product-listing">
      <NavBar />
      
      <main className="product-listing-content">
        <div className="container">          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>{categoryInfo.title}</span>
          </div>
          
          <h1 className="category-title">{categoryInfo.title}</h1>
          
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-bar">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search-btn"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </button>
              )}
            </div>
            
            {/* Mobile Filter Toggle */}
            <button 
              className="mobile-filter-toggle"
              onClick={() => setShowMobileFilter(!showMobileFilter)}
            >
              <FontAwesomeIcon icon={faFilter} />
              Bộ lọc {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </button>
          </div>
          
          <div className="product-listing-layout">
            {/* Filter Section */}
            <aside className={`filter-sidebar ${showMobileFilter ? 'mobile-open' : ''}`}>
              {showMobileFilter && (
                <div className="mobile-filter-header">
                  <h3>Bộ lọc</h3>
                  <button 
                    className="close-mobile-filter"
                    onClick={() => setShowMobileFilter(false)}
                  >
                    ×
                  </button>
                </div>
              )}
              
              <div className="filter-heading">
                <h2>
                  <FontAwesomeIcon icon={faFilter} />
                  Bộ lọc
                </h2>
                {getActiveFilterCount() > 0 && (
                  <div className="filter-actions">
                    <span className="active-filters">({getActiveFilterCount()} bộ lọc)</span>
                    <button className="clear-filters" onClick={clearAllFilters}>
                      Xóa tất cả
                    </button>
                  </div>
                )}
              </div>
              
              {/* Brand Filter */}
              <div className="filter-group">
                <h3>Thương hiệu</h3>
                <ul className="filter-list">
                  {categoryInfo.filters.brands.map((brand, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.brand.includes(brand)} 
                          onChange={() => toggleFilter('brand', brand)}
                        />
                        <span>{brand}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Price Range Filter */}
              <div className="filter-group">
                <h3>Mức giá</h3>
                <ul className="filter-list">
                  {categoryInfo.filters.priceRanges.map((range, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.price.includes(range)} 
                          onChange={() => toggleFilter('price', range)}
                        />
                        <span>{range}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Features Filter */}
              <div className="filter-group">
                <h3>Tính năng</h3>
                <ul className="filter-list">
                  {categoryInfo.filters.features.map((feature, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.features.includes(feature)} 
                          onChange={() => toggleFilter('features', feature)}
                        />
                        <span>{feature}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
            
            {/* Product Grid */}
            <div className="product-content">
              {/* Sorting Options */}
              <div className="sorting-options">
                <div className="results-info">
                  <span>Hiển thị {filteredProducts.length} / {products.length} sản phẩm</span>
                </div>
                <div className="sort-controls">
                  <span>Sắp xếp theo:</span>
                  <select value={sortBy} onChange={handleSortChange}>
                    <option value="popularity">Phổ biến nhất</option>
                    <option value="price-low">Giá thấp đến cao</option>
                    <option value="price-high">Giá cao đến thấp</option>
                    <option value="name-az">Tên A-Z</option>
                    <option value="name-za">Tên Z-A</option>
                    <option value="newest">Mới nhất</option>
                  </select>
                </div>
              </div>
              
              {/* Product Grid */}
              {loading ? (
                <div className="loading">Đang tải sản phẩm...</div>
              ) : error ? (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={() => window.location.reload()}>Thử lại</button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="no-products">
                  <p>Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                  <button onClick={clearAllFilters} className="btn-clear-filters">
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="product-grid">
                  {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                      {product.discount && (
                        <div className="discount-badge">Giảm {product.discount}</div>
                      )}
                      <div className="product-image">
                        <Link to={`/product/${product.id}`}>
                          <ImageWithFallback
                            src={product.image}
                            fallbackSrc={product.category === 'laptop' ? 
                              'http://localhost:3000/uploads/placeholder-laptop.jpg' : 
                              'http://localhost:3000/uploads/placeholder-printer.jpg'
                            }
                            alt={product.name}
                          />
                        </Link>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <div className="product-specs">{product.specs}</div>
                        <div className="product-price">
                          <div className="current-price">{product.discountPrice}</div>
                          {product.originalPrice !== product.discountPrice && (
                            <div className="original-price">{product.originalPrice}</div>
                          )}
                        </div>
                        <div className="product-brand">Thương hiệu: {product.brand}</div>
                        {product.isNew !== undefined && (
                          <div className="product-condition">
                            {product.isNew ? 'Máy mới' : 'Máy cũ'}
                          </div>
                        )}
                        <div className={`product-stock ${inventoryService.getStockStatusClass(product.stockStatus)}`}>
                          {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                          {product.stock > 0 && product.stockStatus === 'LOW_STOCK' && (
                            <span className="low-stock-warning"> ⚠️</span>
                          )}
                        </div>
                        <div className="product-actions">
                          <button 
                            className="btn-add-to-cart"
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock <= 0}
                            title={product.stock <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
                          >
                            <FontAwesomeIcon icon={faShoppingCart} />
                            {product.stock <= 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                          </button>
                          <button 
                            className="btn-buy-now" 
                            disabled={product.stock <= 0}
                            onClick={() => {
                              if (product.stock > 0) {
                                navigate('/checkout', { 
                                  state: { 
                                    product: {
                                      ...product,
                                      quantity: 1
                                    } 
                                  }
                                });
                              }
                            }}
                          >
                            {product.stock <= 0 ? 'Hết hàng' : 'Mua ngay'}
                          </button>
                          <Link to={`/product/${product.id}`} className="btn-details">Chi tiết</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductListing;
