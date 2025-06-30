import React, { useState, useEffect } from 'react';
import AdminNavBar from '../components/AdminNavBar';
import apiService from '../services/apiService';
import '../assets/unifiedAdminStaff.css';

const AdminInventory = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [_products, setProducts] = useState({ laptops: [], printers: [] });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [_error, setError] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [stockUpdate, setStockUpdate] = useState({ quantity: 0, reason: '' });

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch both inventory data and product data
      const [inventoryRes, laptopsRes, printersRes] = await Promise.all([
        apiService.get('/inventory').catch(() => ({ inventories: [] })),
        apiService.get('/laptops').catch(() => ({ laptops: [] })),
        apiService.get('/printers').catch(() => ({ printers: [] }))
      ]);

      // Process inventory data
      let inventoryItems = inventoryRes.inventories || [];
      
      // If no dedicated inventory, create from products
      if (inventoryItems.length === 0) {
        const laptops = laptopsRes.laptops || [];
        const printers = printersRes.printers || [];
        
        inventoryItems = [
          ...laptops.map(laptop => ({
            id: laptop._id,
            itemCode: laptop._id.substring(0, 8).toUpperCase(),
            itemName: laptop.name || 'Laptop không tên',
            category: 'Laptop',
            currentStock: laptop.stock || 0,
            minStock: 5,
            maxStock: 50,
            location: 'Kho A',
            lastUpdated: laptop.updatedAt || new Date().toISOString().split('T')[0],
            status: getStockStatus(laptop.stock || 0, 5)
          })),
          ...printers.map(printer => ({
            id: printer._id,
            itemCode: printer._id.substring(0, 8).toUpperCase(),
            itemName: printer.name || 'Máy in không tên',
            category: 'Printer',
            currentStock: printer.stock || 0,
            minStock: 2,
            maxStock: 20,
            location: 'Kho B',
            lastUpdated: printer.updatedAt || new Date().toISOString().split('T')[0],
            status: getStockStatus(printer.stock || 0, 2)
          }))
        ];
      }

      setInventoryData(inventoryItems);
      setProducts({ laptops: laptopsRes.laptops || [], printers: printersRes.printers || [] });
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Không thể tải dữ liệu kho hàng. Đang sử dụng dữ liệu mẫu.');
      
      // Fallback to sample data
      const mockData = [
        {
          id: 1,
          itemCode: 'LAP001',
          itemName: 'Laptop Dell Inspiron 15',
          category: 'Laptop',
          currentStock: 15,
          minStock: 5,
          maxStock: 50,
          location: 'Kho A-01',
          lastUpdated: '2024-01-15',
          status: 'in_stock'
        },
        {
          id: 2,
          itemCode: 'LAP002',
          itemName: 'Laptop HP Pavilion',
          category: 'Laptop',
          currentStock: 3,
          minStock: 5,
          maxStock: 30,
          location: 'Kho A-02',
          lastUpdated: '2024-01-14',
          status: 'low_stock'
        },
        {
          id: 3,
          itemCode: 'PRI001',
          itemName: 'Máy in Brother HL-L2321D',
          category: 'Printer',
          currentStock: 0,
          minStock: 2,
          maxStock: 20,
          location: 'Kho B-01',
          lastUpdated: '2024-01-13',
          status: 'out_of_stock'
        }
      ];
      setInventoryData(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getStockStatus = (currentStock, minStock) => {
    if (currentStock === 0) return 'out_of_stock';
    if (currentStock <= minStock) return 'low_stock';
    return 'in_stock';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_stock': return '#28a745';
      case 'low_stock': return '#ffc107';
      case 'out_of_stock': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng';
      case 'low_stock': return 'Sắp hết';
      case 'out_of_stock': return 'Hết hàng';
      default: return 'Không xác định';
    }
  };

  const filteredData = inventoryData.filter(item => {
    const matchesFilter = filter === 'all' || item.status === filter;
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.itemCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: inventoryData.length,
    inStock: inventoryData.filter(item => item.status === 'in_stock').length,
    lowStock: inventoryData.filter(item => item.status === 'low_stock').length,
    outOfStock: inventoryData.filter(item => item.status === 'out_of_stock').length
  };

  const handleUpdateStock = (item) => {
    setSelectedItem(item);
    setStockUpdate({ quantity: 0, reason: '' });
    setShowUpdateModal(true);
  };

  const submitStockUpdate = async () => {
    if (!selectedItem || !stockUpdate.quantity || !stockUpdate.reason) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      // Try API update first
      await apiService.post(`/inventory/${selectedItem.id}/update-stock`, {
        quantityChange: parseInt(stockUpdate.quantity),
        reason: stockUpdate.reason,
        reference: 'ADMIN_MANUAL'
      });

      // Update local state
      setInventoryData(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              currentStock: item.currentStock + parseInt(stockUpdate.quantity),
              lastUpdated: new Date().toISOString().split('T')[0],
              status: getStockStatus(item.currentStock + parseInt(stockUpdate.quantity), item.minStock)
            }
          : item
      ));

      setShowUpdateModal(false);
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating stock:', error);
      
      // Fallback to local update
      setInventoryData(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              currentStock: Math.max(0, item.currentStock + parseInt(stockUpdate.quantity)),
              lastUpdated: new Date().toISOString().split('T')[0],
              status: getStockStatus(Math.max(0, item.currentStock + parseInt(stockUpdate.quantity)), item.minStock)
            }
          : item
      ));

      setShowUpdateModal(false);
      setSelectedItem(null);
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <AdminNavBar />
        <div className="admin-content">
          <div className="loading">🔄 Đang tải dữ liệu kho hàng...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <AdminNavBar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>📊 Quản lý kho hàng</h1>
          <p>Theo dõi và quản lý tồn kho các sản phẩm</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>{stats.total}</h3>
            <p>Tổng sản phẩm</p>
            <span className="stat-icon">📦</span>
          </div>
          <div className="stat-card success">
            <h3>{stats.inStock}</h3>
            <p>Còn hàng</p>
            <span className="stat-icon">✅</span>
          </div>
          <div className="stat-card warning">
            <h3>{stats.lowStock}</h3>
            <p>Sắp hết</p>
            <span className="stat-icon">⚠️</span>
          </div>
          <div className="stat-card danger">
            <h3>{stats.outOfStock}</h3>
            <p>Hết hàng</p>
            <span className="stat-icon">❌</span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="admin-controls">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-buttons">
            <button 
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              Tất cả
            </button>
            <button 
              className={filter === 'in_stock' ? 'active' : ''}
              onClick={() => setFilter('in_stock')}
            >
              Còn hàng
            </button>
            <button 
              className={filter === 'low_stock' ? 'active' : ''}
              onClick={() => setFilter('low_stock')}
            >
              Sắp hết
            </button>
            <button 
              className={filter === 'out_of_stock' ? 'active' : ''}
              onClick={() => setFilter('out_of_stock')}
            >
              Hết hàng
            </button>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Tồn kho</th>
                <th>Min/Max</th>
                <th>Vị trí</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.itemCode}</strong></td>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className="stock-quantity">{item.currentStock}</span>
                  </td>
                  <td>
                    <small>{item.minStock} / {item.maxStock}</small>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(item.status) }}
                    >
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td>{item.lastUpdated}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit" 
                        title="Cập nhật tồn kho"
                        onClick={() => handleUpdateStock(item)}
                      >
                        ✏️
                      </button>
                      <button className="btn-history" title="Lịch sử">📋</button>
                      <button className="btn-update-stock" title="Cập nhật tồn kho" onClick={() => handleUpdateStock(item)}>⬆️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="no-data">
            <p>📭 Không tìm thấy sản phẩm nào phù hợp</p>
          </div>
        )}

        {/* Update Stock Modal */}
        {showUpdateModal && selectedItem && (
          <div className="modal-overlay" onClick={() => setShowUpdateModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>📦 Cập nhật tồn kho</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowUpdateModal(false)}
                >
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label><strong>Sản phẩm:</strong></label>
                  <p>{selectedItem.itemName} ({selectedItem.itemCode})</p>
                </div>
                <div className="form-group">
                  <label><strong>Tồn kho hiện tại:</strong></label>
                  <p>{selectedItem.currentStock} sản phẩm</p>
                </div>
                <div className="form-group">
                  <label htmlFor="quantity">Số lượng thay đổi:</label>
                  <input
                    type="number"
                    id="quantity"
                    value={stockUpdate.quantity}
                    onChange={(e) => setStockUpdate(prev => ({...prev, quantity: e.target.value}))}
                    placeholder="Nhập số dương để tăng, số âm để giảm"
                  />
                  <small>Tồn kho sau thay đổi: {selectedItem.currentStock + parseInt(stockUpdate.quantity || 0)}</small>
                </div>
                <div className="form-group">
                  <label htmlFor="reason">Lý do:</label>
                  <select
                    id="reason"
                    value={stockUpdate.reason}
                    onChange={(e) => setStockUpdate(prev => ({...prev, reason: e.target.value}))}
                  >
                    <option value="">Chọn lý do</option>
                    <option value="RESTOCK">Nhập hàng</option>
                    <option value="DAMAGE">Hàng hỏng</option>
                    <option value="LOST">Hàng mất</option>
                    <option value="RETURN">Hàng trả lại</option>
                    <option value="ADJUSTMENT">Điều chỉnh</option>
                    <option value="OTHER">Khác</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  className="btn-secondary"
                  onClick={() => setShowUpdateModal(false)}
                >
                  Hủy
                </button>
                <button 
                  className="btn-primary"
                  onClick={submitStockUpdate}
                  disabled={!stockUpdate.quantity || !stockUpdate.reason}
                >
                  Cập nhật
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventory;
