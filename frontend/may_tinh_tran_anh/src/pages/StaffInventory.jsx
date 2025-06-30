import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';
import '../assets/inventoryDashboardScoped.css';

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
      <div className="staff-nav-brand">
        <h3>👤 {userName}</h3>
      </div>
      <div className="staff-nav-links">
        <Link to="/staff/orders" className={location.pathname === '/staff/orders' ? 'active' : ''}>
          📋 Đơn hàng
        </Link>
        <Link to="/staff/inventory" className={location.pathname === '/staff/inventory' ? 'active' : ''}>
          📦 Tồn kho
        </Link>
      </div>
      <button className="staff-logout-btn" onClick={handleLogout}>
        🚪 Đăng xuất
      </button>
    </nav>
  );
};

const StaffInventory = () => {
  const [overview, setOverview] = useState(null);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [turnoverStats, setTurnoverStats] = useState(null);
  const [valueAnalysis, setValueAnalysis] = useState(null);
  const [movements, setMovements] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Luôn luôn load allProducts cho tab "Tất cả sản phẩm"
      const [laptopsRes, printersRes] = await Promise.all([
        apiService.getLaptops().catch(() => []),
        apiService.getPrinters().catch(() => [])
      ]);

      const laptops = Array.isArray(laptopsRes) ? laptopsRes : (laptopsRes.laptops || []);
      const printers = Array.isArray(printersRes) ? printersRes : (printersRes.printers || []);
      
      // Thêm một property để phân biệt loại sản phẩm
      const laptopsWithType = laptops.map(laptop => ({ ...laptop, productType: 'laptop' }));
      const printersWithType = printers.map(printer => ({ ...printer, productType: 'printer' }));
      
      const allProductsData = [...laptopsWithType, ...printersWithType];
      
      setAllProducts(allProductsData);
      console.log('✅ Loaded all products data:', allProductsData.length, 'products');

      // Thử gọi API thống kê
      try {
        const [overviewRes, lowStockRes, turnoverRes, valueRes, movementsRes] = await Promise.all([
          apiService.getInventoryOverview(),
          apiService.getLowStockProducts(),
          apiService.getTurnoverStats(selectedPeriod),
          apiService.getValueAnalysis(),
          apiService.getInventoryMovements({ period: selectedPeriod })
        ]);

        setOverview(overviewRes.overview);
        setLowStockProducts(lowStockRes.lowStockProducts || []);
        setTurnoverStats(turnoverRes);
        setValueAnalysis(valueRes);
        setMovements(movementsRes.movements || []);
        
        console.log('✅ Loaded inventory stats from API');
      } catch (err) {
        console.log('⚠️ Inventory stats API not available, generating from products data...');
        console.log('Stats API error:', err.message);
        
        // Tạo overview từ allProductsData đã load sẵn
        const totalProducts = allProductsData.length;
        const productsWithStock = allProductsData.filter(p => (p.stock || 0) > 0);
        const lowStockItems = allProductsData.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5);
        const outOfStockItems = allProductsData.filter(p => (p.stock || 0) === 0);
        const totalValue = allProductsData.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0);
        const totalStock = allProductsData.reduce((sum, p) => sum + (p.stock || 0), 0);

        const mockOverview = {
          totalProducts,
          lowStockProducts: lowStockItems.length,
          outOfStockProducts: outOfStockItems.length,
          totalValue,
          totalStock,
          totalAvailable: totalStock,
          categoryStats: [
            {
              _id: 'laptop',
              totalProducts: laptops.length,
              totalStock: laptops.reduce((sum, p) => sum + (p.stock || 0), 0),
              totalValue: laptops.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
              lowStockCount: laptops.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length
            },
            {
              _id: 'printer',
              totalProducts: printers.length,
              totalStock: printers.reduce((sum, p) => sum + (p.stock || 0), 0),
              totalValue: printers.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0),
              lowStockCount: printers.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length
            }
          ]
        };

        setOverview(mockOverview);

        // Tạo low stock products
        const mockLowStock = lowStockItems.map(product => ({
          productId: product._id,
          productInfo: { name: product.name },
          productType: product.productType || 'laptop',
          availableStock: product.stock || 0,
          reorderLevel: 5,
          location: { warehouse: 'Kho A', shelf: 'A-01' }
        }));

        setLowStockProducts(mockLowStock);
        
        // Mock turnover stats
        setTurnoverStats({
          fastMoving: productsWithStock.slice(0, 5).map(p => ({
            productId: p._id,
            productInfo: { name: p.name },
            salesVelocity: Math.floor(Math.random() * 10) + 1
          })),
          slowMoving: allProductsData.slice(-5).map(p => ({
            productId: p._id,
            productInfo: { name: p.name },
            salesVelocity: Math.floor(Math.random() * 2)
          }))
        });

        // Mock value analysis
        setValueAnalysis({
          abcAnalysis: {
            A: { count: Math.ceil(totalProducts * 0.2), value: totalValue * 0.8 },
            B: { count: Math.ceil(totalProducts * 0.3), value: totalValue * 0.15 },
            C: { count: Math.ceil(totalProducts * 0.5), value: totalValue * 0.05 }
          }
        });

        console.log('✅ Generated inventory stats from products data');
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Không thể tải dữ liệu thống kê tồn kho.');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !searchTerm || 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product._id && product._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.toLowerCase && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'laptop' && product.productType === 'laptop') ||
      (filterCategory === 'printer' && product.productType === 'printer');
    
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
  };

  const getStockStatus = (current, reorder) => {
    if (current === 0) return 'out-of-stock';
    if (current <= reorder) return 'low-stock';
    return 'in-stock';
  };

  const getStockStatusText = (current, reorder) => {
    if (current === 0) return 'Hết hàng';
    if (current <= reorder) return 'Sắp hết';
    return 'Còn hàng';
  };

  const OverviewTab = () => (
    <div>
      <div className="dashboard-grid">
        <div className="stats-card">
          <h3>Tổng số sản phẩm</h3>
          <div className="stats-number">{overview?.totalProducts || 0}</div>
          <p className="stats-subtitle">Sản phẩm đang hoạt động</p>
        </div>
        
        <div className="stats-card warning">
          <h3>Sản phẩm sắp hết</h3>
          <div className="stats-number">{overview?.lowStockProducts || 0}</div>
          <p className="stats-subtitle">Dưới mức đặt hàng lại</p>
        </div>
        
        <div className="stats-card danger">
          <h3>Sản phẩm hết hàng</h3>
          <div className="stats-number">{overview?.outOfStockProducts || 0}</div>
          <p className="stats-subtitle">Cần nhập hàng ngay</p>
        </div>
        
        <div className="stats-card success">
          <h3>Tổng giá trị tồn kho</h3>
          <div className="stats-number">{formatCurrency(overview?.totalValue || 0)}</div>
          <p className="stats-subtitle">Giá trị hiện tại</p>
        </div>
        
        <div className="stats-card">
          <h3>Tổng số lượng</h3>
          <div className="stats-number">{overview?.totalStock || 0}</div>
          <p className="stats-subtitle">Sản phẩm trong kho</p>
        </div>
        
        <div className="stats-card">
          <h3>Có thể bán</h3>
          <div className="stats-number">{overview?.totalAvailable || 0}</div>
          <p className="stats-subtitle">Không bao gồm đã đặt</p>
        </div>
      </div>

      {overview?.categoryStats && (
        <div className="chart-container">
          <h3>Thống kê theo loại sản phẩm</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Loại sản phẩm</th>
                <th>Số lượng SP</th>
                <th>Tồn kho</th>
                <th>Giá trị</th>
                <th>SP sắp hết</th>
              </tr>
            </thead>
            <tbody>
              {overview.categoryStats.map((category, index) => (
                <tr key={index}>
                  <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                    {category._id}
                  </td>
                  <td>{category.totalProducts}</td>
                  <td>{category.totalStock}</td>
                  <td>{formatCurrency(category.totalValue)}</td>
                  <td>
                    <span className={`status-badge ${category.lowStockCount > 0 ? 'low-stock' : 'in-stock'}`}>
                      {category.lowStockCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const LowStockTab = () => (
    <div className="chart-container">
      <h3>Sản phẩm sắp hết hàng ({lowStockProducts.length})</h3>
      {lowStockProducts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#28a745', fontSize: '1.1rem', padding: '20px' }}>
          🎉 Tuyệt vời! Không có sản phẩm nào sắp hết hàng.
        </p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Tồn kho</th>
              <th>Mức đặt lại</th>
              <th>Trạng thái</th>
              <th>Vị trí</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.productInfo?.name || 'Unknown'}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.productType}</td>
                <td>{product.availableStock}</td>
                <td>{product.reorderLevel}</td>
                <td>
                  <span className={`status-badge ${getStockStatus(product.availableStock, product.reorderLevel)}`}>
                    {getStockStatusText(product.availableStock, product.reorderLevel)}
                  </span>
                </td>
                <td>{product.location?.warehouse}-{product.location?.shelf}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const TurnoverTab = () => (
    <div>
      {turnoverStats?.categories && (
        <div className="dashboard-grid">
          <div className="stats-card success">
            <h3>Hàng bán nhanh</h3>
            <div className="stats-number">{turnoverStats.categories.fastMoving}</div>
            <p className="stats-subtitle">Tốc độ quay vòng &gt; 2</p>
          </div>
          
          <div className="stats-card">
            <h3>Hàng bán bình thường</h3>
            <div className="stats-number">{turnoverStats.categories.normalMoving}</div>
            <p className="stats-subtitle">Tốc độ quay vòng 0.5-2</p>
          </div>
          
          <div className="stats-card warning">
            <h3>Hàng bán chậm</h3>
            <div className="stats-number">{turnoverStats.categories.slowMoving}</div>
            <p className="stats-subtitle">Tốc độ quay vòng &lt; 0.5</p>
          </div>
        </div>
      )}

      <div className="value-grid">
        {turnoverStats?.fastMoving?.length > 0 && (
          <div className="value-category category-a">
            <h4>🚀 Top 10 hàng bán nhanh</h4>
            {turnoverStats.fastMoving.slice(0, 10).map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                <strong>{item._id}</strong> ({item.productType})
                <br />
                <small>Tốc độ: {item.turnoverRate.toFixed(2)} | Đã bán: {item.totalSold}</small>
              </div>
            ))}
          </div>
        )}

        {turnoverStats?.slowMoving?.length > 0 && (
          <div className="value-category category-c">
            <h4>🐌 Top 10 hàng bán chậm</h4>
            {turnoverStats.slowMoving.slice(0, 10).map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                <strong>{item._id}</strong> ({item.productType})
                <br />
                <small>Tốc độ: {item.turnoverRate.toFixed(2)} | Đã bán: {item.totalSold}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const ValueAnalysisTab = () => (
    <div>
      {valueAnalysis?.summary && (
        <div className="dashboard-grid">
          <div className="stats-card success">
            <h3>Tổng giá trị kho</h3>
            <div className="stats-number">{formatCurrency(valueAnalysis.summary.totalValue)}</div>
            <p className="stats-subtitle">Toàn bộ tồn kho</p>
          </div>
          
          <div className="stats-card">
            <h3>Tổng sản phẩm</h3>
            <div className="stats-number">{valueAnalysis.summary.totalProducts}</div>
            <p className="stats-subtitle">Số lượng SKU</p>
          </div>
          
          <div className="stats-card">
            <h3>Giá trị trung bình</h3>
            <div className="stats-number">{formatCurrency(valueAnalysis.summary.averageValue)}</div>
            <p className="stats-subtitle">Mỗi sản phẩm</p>
          </div>
        </div>
      )}

      <div className="value-grid">
        {valueAnalysis?.abcAnalysis?.A?.length > 0 && (
          <div className="value-category category-a">
            <h4>📊 Nhóm A - Giá trị cao (80%)</h4>
            <p>{valueAnalysis.abcAnalysis.A.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.A.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId}</strong>: {formatCurrency(item.totalValue)}
              </div>
            ))}
          </div>
        )}

        {valueAnalysis?.abcAnalysis?.B?.length > 0 && (
          <div className="value-category category-b">
            <h4>📊 Nhóm B - Giá trị trung bình (15%)</h4>
            <p>{valueAnalysis.abcAnalysis.B.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.B.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId}</strong>: {formatCurrency(item.totalValue)}
              </div>
            ))}
          </div>
        )}

        {valueAnalysis?.abcAnalysis?.C?.length > 0 && (
          <div className="value-category category-c">
            <h4>📊 Nhóm C - Giá trị thấp (5%)</h4>
            <p>{valueAnalysis.abcAnalysis.C.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.C.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId}</strong>: {formatCurrency(item.totalValue)}
              </div>
            ))}
          </div>
        )}
      </div>

      {valueAnalysis?.warehouseStats && (
        <div className="chart-container">
          <h3>Thống kê theo kho</h3>
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Kho</th>
                <th>Số sản phẩm</th>
                <th>Tổng số lượng</th>
                <th>Giá trị</th>
              </tr>
            </thead>
            <tbody>
              {valueAnalysis.warehouseStats.map((warehouse, index) => (
                <tr key={index}>
                  <td><strong>{warehouse._id}</strong></td>
                  <td>{warehouse.totalProducts}</td>
                  <td>{warehouse.totalStock}</td>
                  <td>{formatCurrency(warehouse.totalValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  const MovementsTab = () => (
    <div className="chart-container">
      <h3>Xuất nhập kho (Trong {selectedPeriod} ngày qua)</h3>
      {movements.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
          Không có giao dịch nào trong khoảng thời gian này.
        </p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Loại giao dịch</th>
              <th>Tổng số lượng</th>
              <th>Số lần giao dịch</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((movement, index) => (
              <tr key={index}>
                <td>
                  <span className={`status-badge ${
                    movement._id === 'IN' ? 'in-stock' : 
                    movement._id === 'OUT' ? 'low-stock' : 'normal'
                  }`}>
                    {movement._id === 'IN' ? 'Nhập kho' :
                     movement._id === 'OUT' ? 'Xuất kho' :
                     movement._id === 'ADJUSTMENT' ? 'Điều chỉnh' :
                     movement._id === 'RESERVED' ? 'Đặt hàng' :
                     movement._id === 'RELEASED' ? 'Hủy đặt' : movement._id}
                  </span>
                </td>
                <td>{Math.abs(movement.totalQuantity)}</td>
                <td>{movement.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const AllProductsTab = () => (
    <div>
      {/* Search and Filter Controls */}
      <div className="filter-bar" style={{ marginBottom: '20px', gap: '15px' }}>
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              width: '300px'
            }}
          />
        </div>
        
        <div className="filter-group">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            style={{
              padding: '10px 15px',
              border: '2px solid #e9ecef',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white'
            }}
          >
            <option value="all">Tất cả danh mục</option>
            <option value="laptop">Laptop</option>
            <option value="printer">Máy in</option>
          </select>
        </div>
        
        <div className="filter-group">
          <span style={{ color: '#666', fontSize: '0.9rem' }}>
            Hiển thị {filteredProducts.length} / {allProducts.length} sản phẩm
          </span>
        </div>
      </div>

      {/* Products Table */}
      <div className="chart-container">
        <h3>📦 Danh sách tất cả sản phẩm ({filteredProducts.length})</h3>
        {filteredProducts.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', padding: '20px' }}>
            {searchTerm || filterCategory !== 'all' 
              ? '🔍 Không tìm thấy sản phẩm nào phù hợp với bộ lọc.'
              : '📭 Chưa có sản phẩm nào trong kho.'
            }
          </p>
        ) : (
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Loại</th>
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
                const productType = product.productType || 'laptop'; // fallback to laptop if not set
                const status = stock === 0 ? 'out-of-stock' : stock <= 5 ? 'low-stock' : 'in-stock';
                const statusText = stock === 0 ? 'Hết hàng' : stock <= 5 ? 'Sắp hết' : 'Còn hàng';
                const totalValue = stock * price;

                return (
                  <tr key={product._id}>
                    <td>
                      <strong style={{ color: '#007bff' }}>
                        {product._id}
                      </strong>
                    </td>
                    <td>
                      <div style={{ maxWidth: '250px' }}>
                        <strong>{product.name || 'Sản phẩm không tên'}</strong>
                        {product.brand && (
                          <div style={{ fontSize: '0.8rem', color: '#666' }}>
                            Thương hiệu: {product.brand.name || product.brand}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontWeight: '500' }}>
                      {productType === 'laptop' ? '💻 Laptop' : '🖨️ Máy in'}
                    </td>
                    <td style={{ fontWeight: 'bold', color: '#28a745' }}>
                      {formatCurrency(price)}
                    </td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      {stock}
                    </td>
                    <td>
                      <span className={`status-badge ${status}`}>
                        {statusText}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold', color: stock > 0 ? '#007bff' : '#6c757d' }}>
                      {formatCurrency(totalValue)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* Summary Stats for Filtered Products */}
        {filteredProducts.length > 0 && (
          <div style={{ 
            marginTop: '20px', 
            padding: '15px', 
            background: '#f8f9fa', 
            borderRadius: '8px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#007bff', fontSize: '1.2rem' }}>
                {filteredProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng tồn kho</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#28a745', fontSize: '1.2rem' }}>
                {formatCurrency(filteredProducts.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0))}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng giá trị</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#ffc107', fontSize: '1.2rem' }}>
                {filteredProducts.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Sản phẩm sắp hết</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#dc3545', fontSize: '1.2rem' }}>
                {filteredProducts.filter(p => (p.stock || 0) === 0).length}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Sản phẩm hết hàng</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="inventory-dashboard-page">
        <StaffNavBar />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-dashboard-page">
      <StaffNavBar />
      <h1>📊 Thống kê tồn kho</h1>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="filter-bar">
        <div className="filter-group">
          <label>Khoảng thời gian:</label>
          <select 
            value={selectedPeriod} 
            onChange={(e) => setSelectedPeriod(e.target.value)}
          >
            <option value="7">7 ngày qua</option>
            <option value="30">30 ngày qua</option>
            <option value="90">90 ngày qua</option>
          </select>
        </div>
        
        <button className="refresh-btn" onClick={fetchAllData}>
          🔄 Làm mới
        </button>
      </div>

      <div className="filter-bar">
        <button 
          className={`refresh-btn ${activeTab === 'overview' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('overview')}
          style={{ background: activeTab === 'overview' ? '#007bff' : '#6c757d' }}
        >
          📈 Tổng quan
        </button>
        <button 
          className={`refresh-btn ${activeTab === 'lowStock' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('lowStock')}
          style={{ background: activeTab === 'lowStock' ? '#007bff' : '#6c757d' }}
        >
          ⚠️ Sắp hết hàng
        </button>
        <button 
          className={`refresh-btn ${activeTab === 'turnover' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('turnover')}
          style={{ background: activeTab === 'turnover' ? '#007bff' : '#6c757d' }}
        >
          🔄 Tốc độ bán
        </button>
        <button 
          className={`refresh-btn ${activeTab === 'value' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('value')}
          style={{ background: activeTab === 'value' ? '#007bff' : '#6c757d' }}
        >
          💰 Phân tích giá trị
        </button>
        <button 
          className={`refresh-btn ${activeTab === 'movements' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('movements')}
          style={{ background: activeTab === 'movements' ? '#007bff' : '#6c757d' }}
        >
          📦 Xuất nhập
        </button>
        <button 
          className={`refresh-btn ${activeTab === 'allProducts' ? '' : 'secondary'}`}
          onClick={() => setActiveTab('allProducts')}
          style={{ background: activeTab === 'allProducts' ? '#007bff' : '#6c757d' }}
        >
          📋 Tất cả sản phẩm
        </button>
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'lowStock' && <LowStockTab />}
      {activeTab === 'turnover' && <TurnoverTab />}
      {activeTab === 'value' && <ValueAnalysisTab />}
      {activeTab === 'movements' && <MovementsTab />}
      {activeTab === 'allProducts' && <AllProductsTab />}
    </div>
  );
};

export default StaffInventory;