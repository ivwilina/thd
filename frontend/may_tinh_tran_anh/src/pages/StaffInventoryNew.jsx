import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../assets/unifiedAdminStaff.css';

const StaffNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Staff';
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="staff-navbar">
      <div className="staff-navbar-container">
        <div className="staff-navbar-brand">
          <h2>👤 {userName}</h2>
          <div style={{fontSize: '0.9rem', opacity: 0.9}}>Staff Portal</div>
        </div>
        <div className="staff-navbar-menu">
          <Link 
            to="/staff/orders" 
            className={`staff-nav-item ${location.pathname === '/staff/orders' ? 'active' : ''}`}
          >
            📋 Đơn hàng
          </Link>
          <Link 
            to="/staff/inventory" 
            className={`staff-nav-item ${location.pathname === '/staff/inventory' ? 'active' : ''}`}
          >
            📦 Tồn kho
          </Link>
          <button className="btn btn-danger btn-sm" onClick={handleLogout}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  );
};

const StaffInventory = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Load data from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const data = await apiService.getStaffInventoryProducts();
        
        if (Array.isArray(data)) {
          setAllProducts(data);
        } else {
          setAllProducts([]);
          setError('Dữ liệu không hợp lệ từ API');
        }
      } catch (err) {
        setError('Không thể tải dữ liệu tồn kho: ' + err.message);
        console.error('Error fetching staff inventory:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      (product.displayName && product.displayName.toLowerCase().includes(searchString)) ||
      (product._id && product._id.toLowerCase().includes(searchString)) ||
      (product.brand && typeof product.brand === 'string' && product.brand.toLowerCase().includes(searchString)) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchString));
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'laptop' && product.productType === 'laptop') ||
      (filterCategory === 'printer' && product.productType === 'printer');
    
    return matchesSearch && matchesCategory;
  });

  // Calculate summary
  const totalStock = filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
  const totalValue = filteredProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
  const lowStockCount = filteredProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length;
  const outOfStockCount = filteredProducts.filter(p => (p.stock || 0) === 0).length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getStockStatusBadge = (stock) => {
    if (stock === 0) return 'status-out-of-stock';
    if (stock <= 5) return 'badge-warning';
    return 'status-available';
  };

  const getStockStatusText = (stock) => {
    if (stock === 0) return 'Hết hàng';
    if (stock <= 5) return 'Sắp hết';
    return 'Còn hàng';
  };

  if (loading) {
    return (
      <div className="staff-page">
        <StaffNavBar />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <div>Đang tải dữ liệu tồn kho...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="staff-page">
      <StaffNavBar />
      
      {/* Header Section */}
      <div className="staff-page-header">
        <div>
          <h1 className="staff-page-title">📦 Quản lý tồn kho</h1>
          <div className="staff-breadcrumb">
            Staff / Tồn kho
          </div>
        </div>
      </div>

      <div className="staff-main-content">
        {error && (
          <div className="error-container">
            <h3>⚠️ Lỗi tải dữ liệu</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Search and Filter */}
        <div className="controls-section">
          <div className="controls-row">
            <div className="search-box">
              <label className="form-label">Tìm kiếm sản phẩm</label>
              <input
                type="text"
                placeholder="🔍 Tìm kiếm theo tên, mã sản phẩm, thương hiệu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-box">
              <label className="form-label">Lọc theo danh mục</label>
              <select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
                className="form-select"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="laptop">💻 Laptop</option>
                <option value="printer">🖨️ Máy in</option>
              </select>
            </div>
            
            <div style={{alignSelf: 'end', padding: '12px 0', color: 'var(--text-muted)', fontSize: '14px'}}>
              Hiển thị {filteredProducts.length} / {allProducts.length} sản phẩm
            </div>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="stats-grid">
          <div className="stats-card">
            <div className="stats-icon">📦</div>
            <div className="stats-value">{totalStock}</div>
            <div className="stats-label">Tổng tồn kho</div>
          </div>
          <div className="stats-card">
            <div className="stats-icon">💰</div>
            <div className="stats-value">{formatCurrency(totalValue)}</div>
            <div className="stats-label">Tổng giá trị</div>
          </div>
          <div className="stats-card">
            <div className="stats-icon">⚠️</div>
            <div className="stats-value" style={{color: 'var(--warning-color)'}}>{lowStockCount}</div>
            <div className="stats-label">Sản phẩm sắp hết</div>
          </div>
          <div className="stats-card">
            <div className="stats-icon">❌</div>
            <div className="stats-value" style={{color: 'var(--danger-color)'}}>{outOfStockCount}</div>
            <div className="stats-label">Sản phẩm hết hàng</div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          <div className="card-header">
            <h3 style={{margin: 0}}>Danh sách sản phẩm tồn kho ({filteredProducts.length})</h3>
          </div>
          <div className="card-body" style={{padding: 0}}>
            {filteredProducts.length === 0 ? (
              <div className="no-data">
                {searchTerm || filterCategory !== 'all' 
                  ? '🔍 Không tìm thấy sản phẩm nào phù hợp với bộ lọc.'
                  : '📭 Chưa có sản phẩm nào trong kho.'
                }
              </div>
            ) : (
              <div className="table-responsive">
                <table className="staff-table">
                  <thead>
                    <tr>
                      <th>Mã SP</th>
                      <th>Tên sản phẩm</th>
                      <th>Loại</th>
                      <th>Thương hiệu</th>
                      <th>Giá bán</th>
                      <th>Tồn kho</th>
                      <th>Trạng thái</th>
                      <th>Giá trị</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stock = product.stock || 0;
                      const price = product.price || 0;
                      const totalValue = stock * price;

                      return (
                        <tr key={product._id}>
                          <td>
                            <strong style={{ color: 'var(--primary-color)' }}>
                              {product._id}
                            </strong>
                          </td>
                          <td>
                            <strong>{product.displayName}</strong>
                          </td>
                          <td>
                            {product.productType === 'laptop' ? '💻 Laptop' : '🖨️ Máy in'}
                          </td>
                          <td>
                            {product.brand && (product.brand.name || product.brand)}
                          </td>
                          <td>
                            <strong style={{ color: 'var(--success-color)' }}>
                              {formatCurrency(price)}
                            </strong>
                          </td>
                          <td>
                            <strong style={{ fontSize: '1.1rem' }}>
                              {stock}
                            </strong>
                          </td>
                          <td>
                            <span className={`status-badge ${getStockStatusBadge(stock)}`}>
                              {getStockStatusText(stock)}
                            </span>
                          </td>
                          <td>
                            <strong style={{ color: stock > 0 ? 'var(--info-color)' : 'var(--text-muted)' }}>
                              {formatCurrency(totalValue)}
                            </strong>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffInventory;
