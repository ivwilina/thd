import React, { useState, useEffect } from 'react';
import AdminNavBar from '../components/AdminNavBar';
import apiService from '../services/apiService';
import '../assets/unifiedAdminStaff.css';
import '../assets/AdminReportsScoped.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPrint, 
  faFileExcel,
  faChartBar
} from '@fortawesome/free-solid-svg-icons';

const AdminReports = () => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [realData, setRealData] = useState({ orders: [], products: [] });

  const reportTypes = [
    { value: 'sales', label: '📊 Báo cáo bán hàng', icon: '📊' },
    { value: 'inventory', label: '📦 Báo cáo tồn kho', icon: '📦' },
    { value: 'orders', label: '🛒 Báo cáo đơn hàng', icon: '🛒' },
    { value: 'revenue', label: '💰 Báo cáo doanh thu', icon: '💰' }
  ];

  const dateRanges = [
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'quarter', label: 'Quý này' },
    { value: 'year', label: 'Năm này' }
  ];

  useEffect(() => {
    fetchRealData();
  }, []);

  useEffect(() => {
    generateReport();
  }, [reportType, dateRange, realData]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRealData = async () => {
    try {
      const [ordersRes, laptopsRes, printersRes] = await Promise.all([
        apiService.get('/orders').catch(() => ({ orders: [] })),
        apiService.get('/laptops').catch(() => ({ laptops: [] })),
        apiService.get('/printers').catch(() => ({ printers: [] }))
      ]);

      const orders = ordersRes.orders || [];
      const laptops = laptopsRes.laptops || [];
      const printers = printersRes.printers || [];

      setRealData({
        orders,
        products: [...laptops, ...printers]
      });
    } catch (error) {
      console.error('Error fetching real data:', error);
      setRealData({ orders: [], products: [] });
    }
  };

  const generateReport = () => {
    setLoading(true);
    
    setTimeout(() => {
      const { orders, products } = realData;
      
      // Calculate real statistics or use mock data
      const mockData = {
        sales: {
          title: 'Báo cáo bán hàng',
          summary: {
            totalSales: orders.length || 125,
            totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0) || 2840000000,
            topProduct: products[0]?.name || 'Laptop Dell Inspiron 15',
            growthRate: 15.2
          },
          charts: [
            { label: 'Laptop', value: Math.ceil(orders.length * 0.45) || 45, color: '#007bff' },
            { label: 'Máy in', value: Math.ceil(orders.length * 0.25) || 25, color: '#28a745' },
            { label: 'Phụ kiện', value: Math.ceil(orders.length * 0.30) || 30, color: '#ffc107' }
          ]
        },
        inventory: {
          title: 'Báo cáo tồn kho',
          summary: {
            totalItems: products.length || 85,
            lowStockItems: products.filter(p => (p.stock || 0) < 5).length || 12,
            outOfStockItems: products.filter(p => (p.stock || 0) === 0).length || 3,
            inventoryValue: products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0) || 4200000000
          },
          charts: [
            { label: 'Còn hàng', value: products.filter(p => (p.stock || 0) > 5).length || 70, color: '#28a745' },
            { label: 'Sắp hết', value: products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) <= 5).length || 12, color: '#ffc107' },
            { label: 'Hết hàng', value: products.filter(p => (p.stock || 0) === 0).length || 3, color: '#dc3545' }
          ]
        },
        orders: {
          title: 'Báo cáo đơn hàng',
          summary: {
            totalOrders: orders.length || 156,
            completedOrders: orders.filter(o => o.status === 'delivered').length || 142,
            pendingOrders: orders.filter(o => o.status === 'pending').length || 8,
            cancelledOrders: orders.filter(o => o.status === 'cancelled').length || 6
          },
          charts: [
            { label: 'Hoàn thành', value: orders.filter(o => o.status === 'delivered').length || 142, color: '#28a745' },
            { label: 'Đang xử lý', value: orders.filter(o => ['pending', 'confirmed', 'processing'].includes(o.status)).length || 8, color: '#007bff' },
            { label: 'Đã hủy', value: orders.filter(o => o.status === 'cancelled').length || 6, color: '#dc3545' }
          ]
        },
        revenue: {
          title: 'Báo cáo doanh thu',
          summary: {
            totalRevenue: orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0) || 3850000000,
            profit: Math.round((orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0) || 3850000000) * 0.25),
            profitMargin: 25,
            averageOrderValue: orders.length > 0 ? Math.round((orders.reduce((sum, order) => sum + (parseFloat(order.totalAmount) || 0), 0)) / orders.length) : 24679487
          },
          charts: [
            { label: 'T1', value: 480000000, color: '#007bff' },
            { label: 'T2', value: 520000000, color: '#007bff' },
            { label: 'T3', value: 650000000, color: '#007bff' },
            { label: 'T4', value: 780000000, color: '#007bff' }
          ]
        }
      };

      setReportData(mockData[reportType]);
      setLoading(false);
    }, 800);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  const exportReport = () => {
    alert('Tính năng xuất báo cáo đang được phát triển!');
  };

  const printReport = () => {
    window.print();
  };

  return (
    <div className="admin-container">
      <AdminNavBar />
      <div className="admin-reports-page">
        <h1><FontAwesomeIcon icon={faChartBar} style={{marginRight: '10px'}} />Báo cáo thống kê</h1>
        
        {/* Controls */}
        <div className="reports-header-controls">
          <div className="reports-control-row">
            <div className="reports-type-buttons">
              {reportTypes.map(type => (
                <button
                  key={type.value}
                  className={`reports-type-btn ${reportType === type.value ? 'active' : ''}`}
                  onClick={() => setReportType(type.value)}
                >
                  <span className="reports-btn-icon">{type.icon}</span>
                  <span className="reports-btn-label">{type.label}</span>
                </button>
              ))}
            </div>
            <div className="reports-filter-group">
              <label>Khoảng thời gian:</label>
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="reports-date-range-select"
              >
                {dateRanges.map(range => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="reports-actions">
            <button className="reports-btn-secondary" onClick={printReport}>
              <FontAwesomeIcon icon={faPrint} />
              In báo cáo
            </button>
            <button className="reports-btn-primary" onClick={exportReport}>
              <FontAwesomeIcon icon={faFileExcel} />
              Xuất Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="reports-loading">🔄 Đang tạo báo cáo...</div>
        ) : reportData ? (
          <div className="reports-content">
            <h2 className="reports-content-title">{reportData.title} - {dateRanges.find(r => r.value === dateRange)?.label}</h2>
            
            {/* Summary Cards */}
            <div className="reports-summary">
              {Object.entries(reportData.summary).map(([key, value]) => (
                <div key={key} className="reports-summary-card">
                  <div className="reports-summary-value">
                    {typeof value === 'number' && value > 1000000 
                      ? formatCurrency(value)
                      : typeof value === 'number' 
                      ? formatNumber(value)
                      : value
                    }
                  </div>
                  <div className="reports-summary-label">
                    {key === 'totalSales' && 'Tổng số bán'}
                    {key === 'totalRevenue' && 'Tổng doanh thu'}
                    {key === 'topProduct' && 'Sản phẩm bán chạy'}
                    {key === 'growthRate' && 'Tỷ lệ tăng trưởng (%)'}
                    {key === 'totalItems' && 'Tổng sản phẩm'}
                    {key === 'lowStockItems' && 'Sắp hết hàng'}
                    {key === 'outOfStockItems' && 'Hết hàng'}
                    {key === 'inventoryValue' && 'Giá trị tồn kho'}
                    {key === 'totalOrders' && 'Tổng đơn hàng'}
                    {key === 'completedOrders' && 'Đã hoàn thành'}
                    {key === 'pendingOrders' && 'Đang xử lý'}
                    {key === 'cancelledOrders' && 'Đã hủy'}
                    {key === 'profit' && 'Lợi nhuận'}
                    {key === 'profitMargin' && 'Tỷ suất lợi nhuận (%)'}
                    {key === 'averageOrderValue' && 'Giá trị đơn hàng TB'}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="reports-chart">
              <h3 className="reports-chart-title">Biểu đồ thống kê</h3>
              <div className="reports-chart-container">
                {reportData.charts.map((item, index) => (
                  <div key={index} className="reports-chart-bar">
                    <div className="reports-bar-label">{item.label}</div>
                    <div className="reports-bar-container">
                      <div 
                        className="reports-bar"
                        style={{
                          width: reportType === 'revenue' 
                            ? `${(item.value / Math.max(...reportData.charts.map(c => c.value))) * 100}%`
                            : `${(item.value / reportData.charts.reduce((sum, c) => sum + c.value, 0)) * 100}%`,
                          backgroundColor: item.color
                        }}
                      ></div>
                    </div>
                    <div className="reports-bar-value">
                      {reportType === 'revenue' 
                        ? formatCurrency(item.value)
                        : formatNumber(item.value)
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Report Footer */}
            <div className="reports-footer">
              <p>
                📅 Báo cáo được tạo lúc: {new Date().toLocaleString('vi-VN')}
              </p>
              <p>
                👤 Người tạo: {localStorage.getItem('userName') || 'Admin'}
              </p>
            </div>
          </div>
        ) : (
          <div className="reports-no-data">
            <p>📊 Chọn loại báo cáo và khoảng thời gian để xem dữ liệu</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReports;
