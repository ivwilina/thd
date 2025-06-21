import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import '../assets/productListing.css';
import NavBar from '../components/NavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faSortAmountDown, faSortAmountUp, faCheck } from '@fortawesome/free-solid-svg-icons';

const ProductListing = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('popularity');
  const [selectedFilters, setSelectedFilters] = useState({
    brand: [],
    price: [],
    features: []
  });  // Mock data for laptop products
  const laptopProducts = useMemo(() => [
    {      
      id: 1,
      name: 'Laptop Dell Inspiron 15 3520 5310BLK 102F0',
      specs: 'i5-1155G7 8GB 256GB 15.6" Full HD',
      originalPrice: '13.990.000đ',
      discountPrice: '11.990.000đ',
      savingAmount: '119.900đ',
      image: 'https://example.com/laptop1.jpg',
      discount: '11%',
      brand: 'Dell'
    },
    {      
      id: 2,
      name: 'Laptop Dell Inspiron 15 3520 6H3D73',
      specs: 'i7-1255U 16GB 512GB 15.6" Full HD',
      originalPrice: '19.990.000đ',
      discountPrice: '17.990.000đ',
      savingAmount: '179.900đ',
      image: 'https://example.com/laptop2.jpg',
      discount: '10%',
      brand: 'Dell'
    },
    {      
      id: 3,
      name: 'Laptop Dell Inspiron 15 3520 6R6NK',
      specs: 'i5-1235U 8GB 512GB 15.6" Full HD',
      originalPrice: '14.490.000đ',
      discountPrice: '13.490.000đ',
      savingAmount: '134.900đ',
      image: 'https://example.com/laptop3.jpg',
      discount: '7%',
      brand: 'Dell'
    },
    {      
      id: 4,
      name: 'Laptop Dell Inspiron 15 3520 6R6NK V2',
      specs: 'i5-1235U 16GB 512GB 15.6" Full HD',
      originalPrice: '14.490.000đ',
      discountPrice: '14.290.000đ',
      savingAmount: '142.900đ',
      image: 'https://example.com/laptop4.jpg',
      discount: '1%',
      brand: 'Dell'
    },
    {      
      id: 5,
      name: 'Laptop Dell Inspiron 15 3520-7896BLK-PUS',
      specs: 'i7-1255U 16GB 1TB 15.6" Full HD',
      originalPrice: '20.490.000đ',
      discountPrice: '18.990.000đ',
      savingAmount: '189.900đ',
      image: 'https://example.com/laptop5.jpg',
      discount: '7%',
      brand: 'Dell'
    }
  ], []);

  // Categories data
  const categories = {
    'laptop-chinh-hang': {
      title: 'Laptop Chính Hãng',
      filters: {
        brands: ['Dell', 'HP', 'Lenovo', 'Asus', 'Acer'],
        priceRanges: ['Dưới 10 triệu', '10-15 triệu', '15-20 triệu', '20-30 triệu', 'Trên 30 triệu'],
        features: ['Core i3', 'Core i5', 'Core i7', 'SSD', 'HDD', '8GB RAM', '16GB RAM']
      }
    },
    'man-hinh-may-tinh': {
      title: 'Màn hình máy tính',
      filters: {
        brands: ['Dell', 'Samsung', 'LG', 'Asus', 'AOC'],
        priceRanges: ['Dưới 3 triệu', '3-5 triệu', '5-10 triệu', 'Trên 10 triệu'],
        features: ['Full HD', '2K', '4K', 'IPS', 'VA', 'TN', '60Hz', '144Hz', '240Hz']
      }
    }
    // Add more categories as needed
  };  useEffect(() => {
    // In a real application, this would be an API call to fetch products based on the category
    // For now, we'll just simulate loading and then set the mock data
    setLoading(true);
    setTimeout(() => {
      setProducts(laptopProducts);
      setLoading(false);
    }, 500);
  }, [category, location.search, laptopProducts]);

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

  return (
    <div className="product-listing-container">
      <NavBar />
      
      <main className="product-listing-content">
        <div className="container">          <div className="breadcrumb">
            <Link to="/">Trang chủ</Link> / <span>{categoryInfo.title}</span>
          </div>
          
          <h1 className="category-title">{categoryInfo.title}</h1>
          
          <div className="product-listing-layout">
            {/* Filter Section */}
            <aside className="filter-sidebar">
              <div className="filter-heading">
                <FontAwesomeIcon icon={faFilter} />
                <h2>Bộ lọc</h2>
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
                <span>Sắp xếp theo:</span>
                <select value={sortBy} onChange={handleSortChange}>
                  <option value="popularity">Phổ biến nhất</option>
                  <option value="priceAsc">Giá thấp đến cao</option>
                  <option value="priceDesc">Giá cao đến thấp</option>
                  <option value="newest">Mới nhất</option>
                </select>
              </div>
              
              {/* Product Grid */}
              {loading ? (
                <div className="loading">Đang tải sản phẩm...</div>
              ) : (
                <div className="product-grid">
                  {products.map(product => (
                    <div key={product.id} className="product-card">
                      {product.discount && (
                        <div className="discount-badge">Giảm {product.discount}</div>
                      )}                      <div className="product-image">
                        <Link to={`/product/${product.id}`}>
                          <img src={`/laptop${product.id}.jpg`} alt={product.name} />
                        </Link>
                      </div>
                      <div className="product-info">
                        <h3 className="product-name">
                          <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                        <div className="product-specs">{product.specs}</div>
                        <div className="product-price">
                          <div className="current-price">{product.discountPrice}</div>
                          <div className="original-price">{product.originalPrice}</div>
                        </div>                        {/* Removed S-member and S-student references */}                        <div className="product-actions">
                          <button 
                            className="btn-buy-now" 
                            onClick={() => {
                              navigate('/checkout', { 
                                state: { 
                                  product: {
                                    ...product,
                                    quantity: 1,
                                    image: `/laptop${product.id}.jpg`
                                  } 
                                }
                              });
                            }}
                          >
                            Mua ngay
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
