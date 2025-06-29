import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import '../assets/productListing.css';
import NavBar from '../components/NavBar';
import ImageWithFallback from '../components/ImageWithFallback';
import apiService from '../services/apiService';
import cartService from '../services/cartService';
import inventoryService from '../services/inventoryService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSearch, faShoppingCart } from '@fortawesome/free-solid-svg-icons';

const AllProducts = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState({
    category: [],
    brand: [],
    price: [],
    features: [],
    condition: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [brands, setBrands] = useState([]);
  const [features, setFeatures] = useState([]);

  // Get search query from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query');
    const condition = searchParams.get('condition');
    
    if (query) {
      setSearchQuery(query);
    }
    
    if (condition) {
      setSelectedFilters(prev => ({
        ...prev,
        condition: [condition]
      }));
    }
  }, [location.search]);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both laptops and printers
        const [laptops, printers] = await Promise.all([
          apiService.getLaptops(),
          apiService.getPrinters()
        ]);
        
        // Format products for display
        const laptopsFormatted = laptops.map(product => {
          const formattedProduct = apiService.formatProductForDisplay(product);
          return {
            ...formattedProduct,
            category: 'Laptop',
            condition: product.isNewProduct ? 'Mới' : 'Cũ',
            isUsed: !product.isNewProduct,
            cpu: product.cpu?.name || '',
            ram: product.ramDetails || '',
            storage: product.storageDetails || '',
            screen: product.screenDetails || '',
            specs: formattedProduct.specs,
            price: formattedProduct.discountPrice,
            originalPrice: formattedProduct.originalPrice,
            image: formattedProduct.image,
            images: [formattedProduct.image],
            brand: product.brand?.name || product.brand || 'Unknown',
            printFeatures: [],
          };
        });
        
        const printersFormatted = printers.map(product => {
          const formattedProduct = apiService.formatProductForDisplay(product);
          return {
            ...formattedProduct,
            category: 'Máy In',
            condition: product.isNewProduct ? 'Mới' : 'Cũ',
            isUsed: !product.isNewProduct,
            printType: product.printType || '',
            printFeatures: product.printFeatures || [],
            specs: formattedProduct.specs,
            price: formattedProduct.discountPrice,
            originalPrice: formattedProduct.originalPrice,
            image: formattedProduct.image,
            images: [formattedProduct.image],
            brand: product.brand?.name || product.brand || 'Unknown',
            cpu: '', ram: '', storage: '', screen: '',
          };
        });
        
        const allProducts = [...laptopsFormatted, ...printersFormatted];

        // Lấy brand động
        const uniqueBrands = Array.from(new Set(allProducts.map(p => p.brand || 'Unknown')));
        setBrands(uniqueBrands);
        // Lấy features động (cpu, printFeatures, ram, storage, ...)
        const cpuSet = new Set();
        const printFeatureSet = new Set();
        const ramSet = new Set();
        const storageSet = new Set();
        allProducts.forEach(p => {
          if (p.cpu) cpuSet.add(p.cpu);
          if (p.ram) ramSet.add(p.ram);
          if (p.storage) storageSet.add(p.storage);
          if (Array.isArray(p.printFeatures)) p.printFeatures.forEach(f => printFeatureSet.add(f.name || f));
        });
        setFeatures([...cpuSet, ...ramSet, ...storageSet, ...printFeatureSet].filter(Boolean));
        
        // Fetch inventory data for all products
        const productsWithInventory = await Promise.all(
          allProducts.map(async (product) => {
            try {
              const inventoryData = await inventoryService.getProductInventory(product.id);
              return {
                ...product,
                stock: inventoryData.availableStock || 0,
                stockStatus: inventoryData.stockStatus || 'OUT_OF_STOCK',
                totalStock: inventoryData.currentStock || 0,
                reservedStock: inventoryData.reservedStock || 0
              };
            } catch {
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
      } catch {
        setError('Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

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

  // Utility functions for filtering
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    // Remove all non-numeric characters except dots
    const numericString = priceString.replace(/[^\d.]/g, '');
    return parseFloat(numericString) || 0;
  };

  const isPriceInRange = (price, range) => {
    const numPrice = parsePrice(price) / 1000000; // Convert to millions

    switch (range) {
      case 'Dưới 5 triệu':
        return numPrice < 5;
      case '5-10 triệu':
        return numPrice >= 5 && numPrice < 10;
      case '10-15 triệu':
        return numPrice >= 10 && numPrice < 15;
      case '15-20 triệu':
        return numPrice >= 15 && numPrice < 20;
      case '20-30 triệu':
        return numPrice >= 20 && numPrice < 30;
      case 'Trên 30 triệu':
        return numPrice >= 30;
      default:
        return true;
    }
  };

  const hasFeature = (product, feature) => {
    const productText = [
      product.name,
      product.specs,
      product.cpu,
      product.ram,
      product.storage,
      product.screen,
      product.printType,
      ...(product.printFeatures || []).map(f => f.name || f)
    ].join(' ').toLowerCase();
    
    const featureLower = feature.toLowerCase();
    
    return productText.includes(featureLower);
  };

  const searchFilteredProducts = (products) => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(' ').filter(term => term.length > 0);
    
    return products.filter(product => {
      const productText = [
        product.name,
        product.specs,
        product.brand,
        product.category,
        product.condition,
        product.cpu,
        product.ram,
        product.storage,
        product.screen,
        product.printType,
        ...(product.printFeatures || []).map(f => f.name || f)
      ].join(' ').toLowerCase();
      
      // Tìm kiếm tất cả các từ khóa
      return searchTerms.every(term => productText.includes(term));
    });
  };

  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Apply search filter
    filtered = searchFilteredProducts(filtered);

    // Apply category filter
    if (selectedFilters.category.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.category.includes(product.category)
      );
    }

    // Apply brand filter
    if (selectedFilters.brand.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.brand.includes(product.brand)
      );
    }

    // Apply price filter
    if (selectedFilters.price.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.price.some(range => isPriceInRange(product.price, range))
      );
    }

    // Apply features filter
    if (selectedFilters.features.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.features.some(feature => hasFeature(product, feature))
      );
    }

    // Apply condition filter
    if (selectedFilters.condition.length > 0) {
      filtered = filtered.filter(product => 
        selectedFilters.condition.includes(product.condition)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'name-az':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'popularity':
      default:
        // Keep original order (most popular first from API)
        break;
    }

    return filtered;
  };

  const clearAllFilters = () => {
    setSelectedFilters({
      category: [],
      brand: [],
      price: [],
      features: [],
      condition: []
    });
    setSearchQuery('');
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length + (searchQuery ? 1 : 0);
  };

  const handleAddToCart = (product) => {
    cartService.addToCart(product);
  };

  const filteredProducts = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <div className="product-listing-container">
        <NavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-listing-container">
        <NavBar />
        <div className="error-container">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </div>
    );
  }

  return (
    <div className="product-listing-container">
      <NavBar />
      
      <main className="main-content">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>Tất cả sản phẩm</span>
          </div>
          
          <h1 className="category-title">Tất cả sản phẩm</h1>
          
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
              
              {/* Category Filter */}
              <div className="filter-group">
                <h3>Danh mục</h3>
                <ul className="filter-list">
                  {['Laptop', 'Máy In'].map((category, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.category.includes(category)} 
                          onChange={() => toggleFilter('category', category)}
                        />
                        <span>{category}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Brand Filter */}
              <div className="filter-group">
                <h3>Thương hiệu</h3>
                <ul className="filter-list">
                  {brands.map((brand, index) => (
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
                  {['Dưới 5 triệu', '5-10 triệu', '10-15 triệu', '15-20 triệu', '20-30 triệu', 'Trên 30 triệu'].map((range, index) => (
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
              
              {/* Condition Filter */}
              <div className="filter-group">
                <h3>Tình trạng</h3>
                <ul className="filter-list">
                  {['Mới', 'Cũ'].map((condition, index) => (
                    <li key={index}>
                      <label>
                        <input 
                          type="checkbox" 
                          checked={selectedFilters.condition.includes(condition)} 
                          onChange={() => toggleFilter('condition', condition)}
                        />
                        <span>{condition}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* Features Filter */}
              <div className="filter-group">
                <h3>Tính năng</h3>
                <ul className="filter-list">
                  {features.map((feature, index) => (
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
                            fallbackSrc={product.category === 'Laptop' ? 
                              '/placeholder-laptop.jpg' : 
                              '/placeholder-printer.jpg'
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
                          <div className="current-price">{product.price}</div>
                          {product.originalPrice && product.originalPrice !== product.price && (
                            <div className="original-price">{product.originalPrice}</div>
                          )}
                        </div>
                        <div className="product-brand">Thương hiệu: {product.brand}</div>
                        <div className="product-condition">
                          {product.category} - {product.condition}
                        </div>
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

export default AllProducts; 