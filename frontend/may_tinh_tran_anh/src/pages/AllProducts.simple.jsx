import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import NavBar from '../components/NavBar';
import apiService from '../services/apiService';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Simple product fetching
        const laptops = await apiService.getLaptops();
        const printers = await apiService.getPrinters();
        
        const allProducts = [...laptops, ...printers];
        setProducts(allProducts);
        setError(null);
      } catch (err) {
        setError('Không thể tải sản phẩm');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="product-listing-container">
        <NavBar />
        <div className="loading-container">
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
          
          <div className="product-grid">
            {products.map((product, index) => (
              <div key={product._id || index} className="product-card">
                <div className="product-image">
                  <img 
                    src={product.images?.[0] || '/api/placeholder/300/200'} 
                    alt={product.displayName || product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.displayName || product.name}</h3>
                  <p className="price">{product.price?.toLocaleString()} VNĐ</p>
                  <Link to={`/product/${product._id}`} className="view-detail-btn">
                    Xem chi tiết
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {products.length === 0 && (
            <div className="no-products">
              <p>Không tìm thấy sản phẩm nào.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AllProducts;
