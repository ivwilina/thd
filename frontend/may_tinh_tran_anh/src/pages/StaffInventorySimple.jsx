import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../assets/unifiedAdminStaff.css';

// Simple CSS for basic styling
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  navbar: {
    backgroundColor: '#343a40',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navBrand: {
    color: '#fff',
    fontSize: '1.2rem',
    margin: 0,
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    transition: 'background-color 0.3s',
  },
  activeLink: {
    backgroundColor: '#007bff',
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  mainContent: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '30px 20px',
  },
  title: {
    color: '#343a40',
    textAlign: 'center',
    marginBottom: '30px',
    fontSize: '2rem',
  },
  searchContainer: {
    display: 'flex',
    gap: '15px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  searchInput: {
    padding: '10px 15px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '300px',
  },
  filterSelect: {
    padding: '10px 15px',
    border: '2px solid #e9ecef',
    borderRadius: '8px',
    fontSize: '1rem',
    background: 'white',
  },
  table: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderCollapse: 'collapse',
  },
  th: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#495057',
    borderBottom: '1px solid #e9ecef',
  },
  td: {
    padding: '15px',
    borderBottom: '1px solid #e9ecef',
  },
  statusBadge: {
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  inStock: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  lowStock: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  outOfStock: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  summary: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '20px',
    padding: '15px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryNumber: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#007bff',
  },
  summaryLabel: {
    fontSize: '0.9rem',
    color: '#666',
    marginTop: '5px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '1.2rem',
    color: '#6c757d',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #f5c6cb',
  }
};

const StaffNavBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Staff';
  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div>
        <h3 style={styles.navBrand}>👤 {userName}</h3>
      </div>
      <div style={styles.navLinks}>
        <Link 
          to="/staff/orders" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/staff/orders' ? styles.activeLink : {})
          }}
        >
          📋 Đơn hàng
        </Link>
        <Link 
          to="/staff/inventory" 
          style={{
            ...styles.navLink,
            ...(location.pathname === '/staff/inventory' ? styles.activeLink : {})
          }}
        >
          📦 Tồn kho
        </Link>
      </div>
      <button style={styles.logoutBtn} onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
    </nav>
  );
};

const StaffInventory = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Sử dụng API mới cho staff inventory
      const response = await apiService.getStaffInventoryProducts();
      
      if (response && response.products) {
        const productsWithType = response.products.map(product => ({
          ...product,
          displayName: product.displayName || product.name || 'Sản phẩm không tên'
        }));
        
        setAllProducts(productsWithType);
        
        console.log('✅ Loaded staff inventory:', {
          total: response.products.length,
          laptops: response.summary.laptopCount,
          printers: response.summary.printerCount,
          totalStock: response.summary.totalStock,
          totalValue: response.summary.totalValue
        });
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (err) {
      console.error('Error fetching staff inventory:', err);
      setError('Không thể tải dữ liệu tồn kho. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !searchTerm || 
      (product.displayName && product.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product._id && product._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
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

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Hết hàng', style: styles.outOfStock };
    if (stock <= 5) return { text: 'Sắp hết', style: styles.lowStock };
    return { text: 'Còn hàng', style: styles.inStock };
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <StaffNavBar />
        <div style={styles.loading}>
          🔄 Đang tải dữ liệu tồn kho...
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <StaffNavBar />
      <div style={styles.mainContent}>
        <h1 style={styles.title}>📦 Quản lý tồn kho</h1>
        
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div style={styles.searchContainer}>
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="laptop">Laptop</option>
            <option value="printer">Máy in</option>
          </select>
          <span>Hiển thị {filteredProducts.length} / {allProducts.length} sản phẩm</span>
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{totalStock}</div>
            <div style={styles.summaryLabel}>Tổng tồn kho</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={styles.summaryNumber}>{formatCurrency(totalValue)}</div>
            <div style={styles.summaryLabel}>Tổng giá trị</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={{ ...styles.summaryNumber, color: '#ffc107' }}>{lowStockCount}</div>
            <div style={styles.summaryLabel}>Sản phẩm sắp hết</div>
          </div>
          <div style={styles.summaryItem}>
            <div style={{ ...styles.summaryNumber, color: '#dc3545' }}>{outOfStockCount}</div>
            <div style={styles.summaryLabel}>Sản phẩm hết hàng</div>
          </div>
        </div>

        {/* Products Table */}
        {filteredProducts.length === 0 ? (
          <div style={styles.loading}>
            {searchTerm || filterCategory !== 'all' 
              ? '🔍 Không tìm thấy sản phẩm nào phù hợp với bộ lọc.'
              : '📭 Chưa có sản phẩm nào trong kho.'
            }
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Mã SP</th>
                <th style={styles.th}>Tên sản phẩm</th>
                <th style={styles.th}>Loại</th>
                <th style={styles.th}>Thương hiệu</th>
                <th style={styles.th}>Giá bán</th>
                <th style={styles.th}>Tồn kho</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const stock = product.stock || 0;
                const price = product.price || 0;
                const totalValue = stock * price;
                const status = getStockStatus(stock);

                return (
                  <tr key={product._id} style={{ ':hover': { backgroundColor: '#f8f9fa' } }}>
                    <td style={styles.td}>
                      <strong style={{ color: '#007bff' }}>
                        {product._id}
                      </strong>
                    </td>
                    <td style={styles.td}>
                      <strong>{product.displayName}</strong>
                    </td>
                    <td style={styles.td}>
                      {product.productType === 'laptop' ? '💻 Laptop' : '🖨️ Máy in'}
                    </td>
                    <td style={styles.td}>
                      {product.brand && (product.brand.name || product.brand)}
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: '#28a745' }}>
                        {formatCurrency(price)}
                      </strong>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ fontSize: '1.1rem' }}>
                        {stock}
                      </strong>
                    </td>
                    <td style={styles.td}>
                      <span style={{ ...styles.statusBadge, ...status.style }}>
                        {status.text}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <strong style={{ color: stock > 0 ? '#007bff' : '#6c757d' }}>
                        {formatCurrency(totalValue)}
                      </strong>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StaffInventory;
