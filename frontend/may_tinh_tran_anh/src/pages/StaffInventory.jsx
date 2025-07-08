import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../services/apiService';
import StaffNavBar from '../components/StaffNavBar';
import '../assets/inventoryDashboardScoped.css';

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
  const [apiDebugInfo, setApiDebugInfo] = useState({});

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    const debugInfo = {};
    
    try {
      // Thử gọi API thống kê trước
      try {
        console.log('🔄 Fetching inventory stats from API...');
        
        // Gọi API inventory overview
        let overviewRes;
        try {
          console.log('Calling getInventoryOverview API...');
          overviewRes = await apiService.getInventoryOverview();
          console.log('Raw API Overview Response:', overviewRes);
          debugInfo.overviewApiResponse = overviewRes;
          
          // Kiểm tra endpoint khác nếu không nhận được dữ liệu đúng
          if (!overviewRes || (!overviewRes.success && !overviewRes.overview && !overviewRes.byProductType)) {
            console.log('Trying alternative inventory stats endpoint...');
            try {
              const altResponse = await apiService.get('/inventory/stats/overview');
              console.log('Alternative API response:', altResponse);
              if (altResponse) {
                overviewRes = altResponse;
                debugInfo.alternativeOverviewResponse = altResponse;
              }
            } catch (altErr) {
              console.error('Alternative endpoint also failed:', altErr);
              debugInfo.alternativeOverviewError = altErr.message;
            }
          }
        } catch (err) {
          console.error('Error fetching overview:', err);
          debugInfo.overviewApiError = err.message;
        }
        
        // Gọi API low stock products
        let lowStockRes;
        try {
          lowStockRes = await apiService.getLowStockProducts();
          console.log('Raw API LowStock Response:', lowStockRes);
          debugInfo.lowStockApiResponse = lowStockRes;
        } catch (err) {
          console.error('Error fetching low stock:', err);
          debugInfo.lowStockApiError = err.message;
        }
        
        // Gọi API turnover stats
        let turnoverRes;
        try {
          turnoverRes = await apiService.getTurnoverStats(selectedPeriod);
          console.log('Raw API Turnover Response:', turnoverRes);
          debugInfo.turnoverApiResponse = turnoverRes;
        } catch (err) {
          console.error('Error fetching turnover:', err);
          debugInfo.turnoverApiError = err.message;
        }
        
        // Gọi API value analysis
        let valueRes;
        try {
          valueRes = await apiService.getValueAnalysis();
          console.log('Raw API Value Response:', valueRes);
          debugInfo.valueApiResponse = valueRes;
        } catch (err) {
          console.error('Error fetching value analysis:', err);
          debugInfo.valueApiError = err.message;
        }
        
        // Gọi API inventory movements
        let movementsRes;
        try {
          movementsRes = await apiService.getInventoryMovements({ period: selectedPeriod });
          console.log('Raw API Movements Response:', movementsRes);
          debugInfo.movementsApiResponse = movementsRes;
        } catch (err) {
          console.error('Error fetching movements:', err);
          debugInfo.movementsApiError = err.message;
        }
        
        // Check and normalize API responses - cải thiện xử lý dữ liệu overview
        let processedOverview = null;
        if (overviewRes) {
          if (overviewRes.success && overviewRes.overview) {
            processedOverview = overviewRes.overview;
          } else if (overviewRes.overview) {
            processedOverview = overviewRes.overview;
          } else if (overviewRes.byProductType && overviewRes.alerts) {
            // Format khác: Có byProductType và alerts
            const totalStock = overviewRes.byProductType.reduce((sum, item) => sum + (item.totalStock || 0), 0);
            const totalValue = overviewRes.byProductType.reduce((sum, item) => sum + (item.totalValue || 0), 0);
            const totalProducts = overviewRes.byProductType.reduce((sum, item) => sum + (item.totalProducts || 0), 0);
            const totalAvailable = overviewRes.byProductType.reduce((sum, item) => sum + (item.totalAvailable || 0), 0);
            
            processedOverview = {
              totalProducts: totalProducts,
              lowStockProducts: overviewRes.alerts.lowStock || 0,
              outOfStockProducts: overviewRes.alerts.outOfStock || 0,
              totalValue: totalValue,
              totalStock: totalStock,
              totalAvailable: totalAvailable || totalStock,
              categoryStats: overviewRes.byProductType.map(item => ({
                _id: item._id,
                totalProducts: item.totalProducts || 0,
                totalStock: item.totalStock || 0,
                totalValue: item.totalValue || 0,
                lowStockCount: 0 // Không có thông tin này
              }))
            };
          } else {
            // Trường hợp overviewRes là object khác
            processedOverview = overviewRes;
          }
        }
        
        console.log('Processed overview data:', processedOverview);
        setApiDebugInfo(prevInfo => ({...prevInfo, processedOverview}));
        
        setOverview(processedOverview);
        
        // Store the rest of the processed data
        setLowStockProducts(
          lowStockRes?.success ? lowStockRes.lowStockProducts : 
          lowStockRes?.lowStockProducts ? lowStockRes.lowStockProducts :
          (lowStockRes || [])
        );
        
        setTurnoverStats(
          turnoverRes?.success ? turnoverRes : 
          turnoverRes?.turnoverStats ? turnoverRes.turnoverStats :
          (turnoverRes || {})
        );
        
        setValueAnalysis(
          valueRes?.success ? valueRes : 
          valueRes?.valueAnalysis ? valueRes.valueAnalysis :
          (valueRes || {})
        );
        
        setMovements(
          movementsRes?.success ? movementsRes.movements : 
          movementsRes?.movements ? movementsRes.movements :
          (movementsRes || [])
        );
        
        console.log('✅ Loaded inventory stats from API');
        
        // Also load products data for the "All Products" tab
        const [laptopsRes, printersRes] = await Promise.all([
          apiService.getLaptops().catch(err => {
            console.error('Error fetching laptops:', err);
            return [];
          }),
          apiService.getPrinters().catch(err => {
            console.error('Error fetching printers:', err);
            return [];
          })
        ]);

        const laptops = Array.isArray(laptopsRes) ? laptopsRes : (laptopsRes.laptops || []);
        const printers = Array.isArray(printersRes) ? printersRes : (printersRes.printers || []);
        
        const laptopsWithType = laptops.map(laptop => ({ ...laptop, productType: 'laptop' }));
        const printersWithType = printers.map(printer => ({ ...printer, productType: 'printer' }));
        
        setAllProducts([...laptopsWithType, ...printersWithType]);
        debugInfo.laptopCount = laptops.length;
        debugInfo.printerCount = printers.length;
        
      } catch (err) {
        console.log('⚠️ Inventory stats API not available, generating from products data...');
        console.log('Stats API error:', err.message);
        debugInfo.statsApiError = err.message;
        
        // Fallback: Load products data and generate stats
        const [laptopsRes, printersRes] = await Promise.all([
          apiService.getLaptops().catch(() => []),
          apiService.getPrinters().catch(() => [])
        ]);

        const laptops = Array.isArray(laptopsRes) ? laptopsRes : (laptopsRes.laptops || []);
        const printers = Array.isArray(printersRes) ? printersRes : (printersRes.printers || []);
        
        const laptopsWithType = laptops.map(laptop => ({ ...laptop, productType: 'laptop' }));
        const printersWithType = printers.map(printer => ({ ...printer, productType: 'printer' }));
        
        const allProductsData = [...laptopsWithType, ...printersWithType];
        setAllProducts(allProductsData);
        debugInfo.laptopCount = laptops.length;
        debugInfo.printerCount = printers.length;

        // Generate mock stats from products data
        console.log('Generating mock stats from', allProductsData.length, 'products');
        
        const totalProducts = allProductsData.length;
        // Make sure we're reading the stock property correctly, could be named differently
        allProductsData.forEach((p, index) => {
          if (index < 5) {
            console.log('Sample product:', p);
            console.log('Stock value checks:', {
              stock: p.stock,
              currentStock: p.currentStock,
              quantity: p.quantity,
              availableStock: p.availableStock
            });
          }
        });
        
        // Try different property names for stock
        const getStockValue = (product) => {
          return product.stock || product.currentStock || product.availableStock || product.quantity || 0;
        };
        
        const lowStockItems = allProductsData.filter(p => {
          const stockVal = getStockValue(p);
          return stockVal > 0 && stockVal <= 5;
        });
        
        const outOfStockItems = allProductsData.filter(p => getStockValue(p) === 0);
        
        const totalValue = allProductsData.reduce((sum, p) => {
          return sum + ((p.price || 0) * getStockValue(p));
        }, 0);
        
        const totalStock = allProductsData.reduce((sum, p) => sum + getStockValue(p), 0);

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
              totalStock: laptops.reduce((sum, p) => sum + getStockValue(p), 0),
              totalValue: laptops.reduce((sum, p) => sum + ((p.price || 0) * getStockValue(p)), 0),
              lowStockCount: laptops.filter(p => {
                const stockVal = getStockValue(p);
                return stockVal > 0 && stockVal <= 5;
              }).length
            },
            {
              _id: 'printer',
              totalProducts: printers.length,
              totalStock: printers.reduce((sum, p) => sum + getStockValue(p), 0),
              totalValue: printers.reduce((sum, p) => sum + ((p.price || 0) * getStockValue(p)), 0),
              lowStockCount: printers.filter(p => {
                const stockVal = getStockValue(p);
                return stockVal > 0 && stockVal <= 5;
              }).length
            }
          ]
        };

        console.log('Generated mock overview:', mockOverview);
        debugInfo.mockOverview = mockOverview;
        
        setOverview(mockOverview);
        setLowStockProducts(lowStockItems.map(product => ({
          productId: product._id,
          productInfo: { name: product.name || product.displayName || 'Sản phẩm không tên' },
          productType: product.productType || 'laptop',
          availableStock: getStockValue(product),
          reorderLevel: 5,
          location: { warehouse: 'Kho A', shelf: 'A-01' }
        })));
        
        // Mock turnover stats
        const productsWithStock = allProductsData.filter(p => getStockValue(p) > 0);
        setTurnoverStats({
          categories: {
            fastMoving: productsWithStock.length > 0 ? Math.min(5, productsWithStock.length) : 0,
            normalMoving: productsWithStock.length > 5 ? Math.min(10, productsWithStock.length - 5) : 0,
            slowMoving: productsWithStock.length > 15 ? productsWithStock.length - 15 : 0
          },
          fastMoving: productsWithStock.slice(0, 5).map(p => ({
            productId: p._id,
            productInfo: { name: p.name || p.displayName || 'Sản phẩm không tên' },
            productType: p.productType || 'laptop',
            turnoverRate: Math.floor(Math.random() * 10) + 1,
            totalSold: Math.floor(Math.random() * 20) + 10
          })),
          slowMoving: allProductsData.slice(-5).map(p => ({
            productId: p._id,
            productInfo: { name: p.name || p.displayName || 'Sản phẩm không tên' },
            productType: p.productType || 'laptop',
            turnoverRate: Math.random().toFixed(2),
            totalSold: Math.floor(Math.random() * 3)
          }))
        });

        // Mock value analysis
        setValueAnalysis({
          summary: {
            totalValue,
            totalProducts,
            averageValue: totalProducts > 0 ? totalValue / totalProducts : 0
          },
          abcAnalysis: {
            A: allProductsData.slice(0, Math.ceil(totalProducts * 0.2)).map(p => ({
              productId: p._id,
              totalValue: (p.price || 0) * getStockValue(p)
            })),
            B: allProductsData.slice(
              Math.ceil(totalProducts * 0.2), 
              Math.ceil(totalProducts * 0.2) + Math.ceil(totalProducts * 0.3)
            ).map(p => ({
              productId: p._id,
              totalValue: (p.price || 0) * getStockValue(p)
            })),
            C: allProductsData.slice(
              Math.ceil(totalProducts * 0.2) + Math.ceil(totalProducts * 0.3)
            ).map(p => ({
              productId: p._id,
              totalValue: (p.price || 0) * getStockValue(p)
            }))
          }
        });

        console.log('✅ Generated inventory stats from products data');
      }
    } catch (err) {
      console.error('Error fetching inventory data:', err);
      setError('Không thể tải dữ liệu thống kê tồn kho: ' + err.message);
      debugInfo.fetchError = err.message;
    } finally {
      setLoading(false);
      setApiDebugInfo(debugInfo);
    }
  };

  // Filter products based on search and category
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = !searchTerm || 
      (product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.displayName && product.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product._id && product._id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && typeof product.brand === 'string' && product.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.brand && product.brand.name && product.brand.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || 
      (filterCategory === 'laptop' && product.productType === 'laptop') ||
      (filterCategory === 'printer' && product.productType === 'printer');
    
    return matchesSearch && matchesCategory;
  });

  // Tự động làm mới dữ liệu mỗi khi chọn khoảng thời gian khác
  useEffect(() => {
    console.log('Fetching data with period:', selectedPeriod);
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod]);
  
  // Tải dữ liệu ngay khi component được mount
  useEffect(() => {
    console.log('Component mounted - initial data fetch');
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const OverviewTab = () => {
    // Debug what's in the overview object
    console.log('Rendering overview with data:', overview);
    
    // Hiển thị thông báo nếu không có dữ liệu overview
    if (!overview) {
      return (
        <div className="chart-container" style={{textAlign: 'center', padding: '20px'}}>
          <h3>Không thể tải dữ liệu tổng quan</h3>
          <p>Không tìm thấy dữ liệu thống kê kho hàng. Vui lòng kiểm tra:</p>
          <ol style={{textAlign: 'left', display: 'inline-block'}}>
            <li>Kết nối đến máy chủ backend</li>
            <li>API endpoint /inventory/stats/overview đang hoạt động</li>
            <li>Dữ liệu sản phẩm và tồn kho đã được cài đặt</li>
          </ol>
          <div style={{marginTop: '20px'}}>
            <button className="refresh-btn" onClick={() => fetchAllData()}>
              🔄 Thử lại
            </button>
          </div>
        </div>
      );
    }
    
    return (
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

        {/* Hiển thị các danh mục sản phẩm nếu có */}
        {overview?.categoryStats && Array.isArray(overview.categoryStats) && overview.categoryStats.length > 0 ? (
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
                {overview.categoryStats.map((category, index) => {
                  // Tùy chỉnh hiển thị tên danh mục
                  const categoryDisplayName = category._id === 'laptop' ? 'Laptop' : 
                                             category._id === 'printer' ? 'Máy in' : 
                                             category._id;
                  
                  return (
                    <tr key={index}>
                      <td style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>
                        {categoryDisplayName}
                      </td>
                      <td>{category.totalProducts || 0}</td>
                      <td>{category.totalStock || 0}</td>
                      <td>{formatCurrency(category.totalValue || 0)}</td>
                      <td>
                        <span className={`status-badge ${(category.lowStockCount || 0) > 0 ? 'low-stock' : 'in-stock'}`}>
                          {category.lowStockCount || 0}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="chart-container">
            <h3>Thống kê theo loại sản phẩm</h3>
            <p style={{ textAlign: 'center', padding: '20px' }}>
              Không có dữ liệu phân loại sản phẩm.
            </p>
          </div>
        )}
      </div>
    );
  };

  const LowStockTab = () => (
    <div className="chart-container">
      <h3>Sản phẩm sắp hết hàng ({lowStockProducts?.length || 0})</h3>
      {!lowStockProducts || lowStockProducts.length === 0 ? (
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
              <tr key={product.productId || product._id}>
                <td>{product.productId || product._id}</td>
                <td>{product.productInfo?.name || 'Unknown'}</td>
                <td style={{ textTransform: 'capitalize' }}>{product.productType}</td>
                <td>{product.availableStock || 0}</td>
                <td>{product.reorderLevel || 5}</td>
                <td>
                  <span className={`status-badge ${getStockStatus(product.availableStock || 0, product.reorderLevel || 5)}`}>
                    {getStockStatusText(product.availableStock || 0, product.reorderLevel || 5)}
                  </span>
                </td>
                <td>{(product.location?.warehouse || 'Kho A')}-{(product.location?.shelf || 'A-01')}</td>
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
            <div className="stats-number">{turnoverStats.categories.fastMoving || 0}</div>
            <p className="stats-subtitle">Tốc độ quay vòng &gt; 2</p>
          </div>
          
          <div className="stats-card">
            <h3>Hàng bán bình thường</h3>
            <div className="stats-number">{turnoverStats.categories.normalMoving || 0}</div>
            <p className="stats-subtitle">Tốc độ quay vòng 0.5-2</p>
          </div>
          
          <div className="stats-card warning">
            <h3>Hàng bán chậm</h3>
            <div className="stats-number">{turnoverStats.categories.slowMoving || 0}</div>
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
                <strong>{item.productId || item._id}</strong> ({item.productType})
                <br />
                <small>
                  Tốc độ: {(item.turnoverRate || 0).toFixed(2)} | 
                  Đã bán: {item.totalSold || 0}
                </small>
              </div>
            ))}
          </div>
        )}

        {turnoverStats?.slowMoving?.length > 0 && (
          <div className="value-category category-c">
            <h4>🐌 Top 10 hàng bán chậm</h4>
            {turnoverStats.slowMoving.slice(0, 10).map((item, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                <strong>{item.productId || item._id}</strong> ({item.productType})
                <br />
                <small>
                  Tốc độ: {(item.turnoverRate || 0).toFixed(2)} | 
                  Đã bán: {item.totalSold || 0}
                </small>
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
            <div className="stats-number">{formatCurrency(valueAnalysis.summary.totalValue || 0)}</div>
            <p className="stats-subtitle">Toàn bộ tồn kho</p>
          </div>
          
          <div className="stats-card">
            <h3>Tổng sản phẩm</h3>
            <div className="stats-number">{valueAnalysis.summary.totalProducts || 0}</div>
            <p className="stats-subtitle">Số lượng SKU</p>
          </div>
          
          <div className="stats-card">
            <h3>Giá trị trung bình</h3>
            <div className="stats-number">{formatCurrency(valueAnalysis.summary.averageValue || 0)}</div>
            <p className="stats-subtitle">Mỗi sản phẩm</p>
          </div>
        </div>
      )}

      <div className="value-grid">
        {valueAnalysis?.abcAnalysis?.A && Array.isArray(valueAnalysis.abcAnalysis.A) && valueAnalysis.abcAnalysis.A.length > 0 && (
          <div className="value-category category-a">
            <h4>📊 Nhóm A - Giá trị cao (80%)</h4>
            <p>{valueAnalysis.abcAnalysis.A.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.A.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId || "Unknown"}</strong>: {formatCurrency(item.totalValue || 0)}
              </div>
            ))}
          </div>
        )}

        {valueAnalysis?.abcAnalysis?.B && Array.isArray(valueAnalysis.abcAnalysis.B) && valueAnalysis.abcAnalysis.B.length > 0 && (
          <div className="value-category category-b">
            <h4>📊 Nhóm B - Giá trị trung bình (15%)</h4>
            <p>{valueAnalysis.abcAnalysis.B.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.B.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId || "Unknown"}</strong>: {formatCurrency(item.totalValue || 0)}
              </div>
            ))}
          </div>
        )}

        {valueAnalysis?.abcAnalysis?.C && Array.isArray(valueAnalysis.abcAnalysis.C) && valueAnalysis.abcAnalysis.C.length > 0 && (
          <div className="value-category category-c">
            <h4>📊 Nhóm C - Giá trị thấp (5%)</h4>
            <p>{valueAnalysis.abcAnalysis.C.length} sản phẩm</p>
            {valueAnalysis.abcAnalysis.C.slice(0, 5).map((item, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                <strong>{item.productId || "Unknown"}</strong>: {formatCurrency(item.totalValue || 0)}
              </div>
            ))}
          </div>
        )}
      </div>

      {valueAnalysis?.warehouseStats && Array.isArray(valueAnalysis.warehouseStats) && valueAnalysis.warehouseStats.length > 0 && (
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
                  <td><strong>{warehouse._id || "Unknown"}</strong></td>
                  <td>{warehouse.totalProducts || 0}</td>
                  <td>{warehouse.totalStock || 0}</td>
                  <td>{formatCurrency(warehouse.totalValue || 0)}</td>
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
      {!movements || movements.length === 0 ? (
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
                <td>{Math.abs(movement.totalQuantity || 0)}</td>
                <td>{movement.count || 0}</td>
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
                // Use a function to get stock value, trying different property names
                const getStockValue = (p) => {
                  return p.stock || p.currentStock || p.availableStock || p.quantity || 0;
                };
                
                const stock = getStockValue(product);
                const price = product.price || 0;
                const productType = product.productType || 'laptop'; // fallback to laptop if not set
                const status = stock === 0 ? 'out-of-stock' : stock <= 5 ? 'low-stock' : 'in-stock';
                const statusText = stock === 0 ? 'Hết hàng' : stock <= 5 ? 'Sắp hết' : 'Còn hàng';
                const totalValue = stock * price;
                const productName = product.name || product.displayName || 'Sản phẩm không tên';
                const brandDisplay = typeof product.brand === 'string' ? product.brand : 
                                   (product.brand?.name || 'Unknown');

                return (
                  <tr key={product._id}>
                    <td>
                      <strong style={{ color: '#007bff' }}>
                        {product._id}
                      </strong>
                    </td>
                    <td>
                      <div style={{ maxWidth: '250px' }}>
                        <strong>{productName}</strong>
                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                          Thương hiệu: {brandDisplay}
                        </div>
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
                {filteredProducts.reduce((sum, p) => {
                  const stockVal = p.stock || p.currentStock || p.availableStock || p.quantity || 0;
                  return sum + stockVal;
                }, 0)}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng tồn kho</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#28a745', fontSize: '1.2rem' }}>
                {formatCurrency(filteredProducts.reduce((sum, p) => {
                  const stockVal = p.stock || p.currentStock || p.availableStock || p.quantity || 0;
                  return sum + ((p.price || 0) * stockVal);
                }, 0))}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Tổng giá trị</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#ffc107', fontSize: '1.2rem' }}>
                {filteredProducts.filter(p => {
                  const stockVal = p.stock || p.currentStock || p.availableStock || p.quantity || 0;
                  return stockVal > 0 && stockVal <= 5;
                }).length}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Sản phẩm sắp hết</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <strong style={{ color: '#dc3545', fontSize: '1.2rem' }}>
                {filteredProducts.filter(p => {
                  const stockVal = p.stock || p.currentStock || p.availableStock || p.quantity || 0;
                  return stockVal === 0;
                }).length}
              </strong>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Sản phẩm hết hàng</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Debugging component to show API details
  const ApiDebugInfo = () => {
    if (!apiDebugInfo || Object.keys(apiDebugInfo).length === 0) return null;
    return (
      <div className="debug-info">
        <h3>🛠️ Thông tin gỡ lỗi API</h3>
        <div className="debug-grid">
          {apiDebugInfo.laptopCount !== undefined && (
            <div><strong>Số laptop:</strong> {apiDebugInfo.laptopCount}</div>
          )}
          {apiDebugInfo.printerCount !== undefined && (
            <div><strong>Số máy in:</strong> {apiDebugInfo.printerCount}</div>
          )}
          {apiDebugInfo.overviewApiResponse && (
            <div>
              <strong>API Overview Response:</strong> {JSON.stringify(apiDebugInfo.overviewApiResponse).substring(0, 100)}...
            </div>
          )}
          {apiDebugInfo.processedOverview && (
            <div className="debug-info" style={{gridColumn: "1 / -1"}}>
              <details>
                <summary><strong>Processed Overview Data:</strong></summary>
                <pre style={{overflowX: 'auto', maxHeight: '200px', padding: '8px', fontSize: '12px', backgroundColor: '#f0f0f0'}}>
                  {JSON.stringify(apiDebugInfo.processedOverview, null, 2)}
                </pre>
              </details>
            </div>
          )}
          {apiDebugInfo.lowStockApiResponse && (
            <div><strong>API LowStock:</strong> {apiDebugInfo.lowStockApiResponse.success ? 'Thành công' : 'Không có dữ liệu'}</div>
          )}
          {apiDebugInfo.statsApiError && (
            <div className="debug-error">
              <strong>Lỗi API thống kê:</strong> {apiDebugInfo.statsApiError}
            </div>
          )}
          {apiDebugInfo.overviewApiError && (
            <div className="debug-error">
              <strong>Lỗi API Overview:</strong> {apiDebugInfo.overviewApiError}
            </div>
          )}
          {apiDebugInfo.lowStockApiError && (
            <div className="debug-error">
              <strong>Lỗi API LowStock:</strong> {apiDebugInfo.lowStockApiError}
            </div>
          )}
          {apiDebugInfo.fetchError && (
            <div className="debug-error">
              <strong>Lỗi tải dữ liệu:</strong> {apiDebugInfo.fetchError}
            </div>
          )}
        </div>
      </div>
    );
  };

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

      {/* Always show debugging info to help troubleshoot */}
      <ApiDebugInfo />

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