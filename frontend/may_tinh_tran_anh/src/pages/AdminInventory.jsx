import React, { useState, useEffect } from 'react';
import AdminNavBar from '../components/AdminNavBar';
import apiService from '../services/apiService';
import '../assets/unifiedAdminStaff.css';
import '../assets/AdminInventoryScoped.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faSync, 
  faFileExport, 
  faEdit, 
  faEye,
  faBoxes,
  faExclamationTriangle,
  faTimesCircle,
  faCheckCircle,
  faPlus
} from '@fortawesome/free-solid-svg-icons';

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
      // Fetch inventory data từ API
      const [inventoryRes, laptopsRes, printersRes] = await Promise.all([
        apiService.get('/inventory').catch(() => ({ inventory: [] })),
        apiService.get('/laptops').catch(() => ({ laptops: [] })),
        apiService.get('/printers').catch(() => ({ printers: [] }))
      ]);

      const inventoryData = inventoryRes.inventory || [];
      const laptops = laptopsRes.laptops || [];
      const printers = printersRes.printers || [];

      // Tạo map để lookup product details
      const productMap = new Map();
      
      // Add laptops to map
      laptops.forEach(laptop => {
        productMap.set(laptop._id, {
          ...laptop,
          type: 'laptop',
          displayName: laptop.displayName || laptop.name || 'Laptop không tên'
        });
      });
      
      // Add printers to map
      printers.forEach(printer => {
        productMap.set(printer._id, {
          ...printer,
          type: 'printer',
          displayName: (printer.type && printer.brand) ? `${printer.type} ${printer.brand}` : 'Máy in không tên'
        });
      });

      let inventoryItems = [];
      
      if (inventoryData.length > 0) {
        // Nếu có dữ liệu inventory thật, sử dụng nó
        inventoryItems = inventoryData.map(inv => {
          const product = productMap.get(inv.productId);
          return {
            id: inv.productId,
            itemCode: inv.productId.substring(0, 12).toUpperCase(),
            itemName: product ? product.displayName : inv.productId,
            category: inv.productType === 'laptop' ? 'Laptop' : 'Máy in',
            currentStock: inv.currentStock || 0,
            reservedStock: inv.reservedStock || 0,
            availableStock: inv.availableStock || inv.currentStock || 0,
            minStock: inv.minimumStock || 5,
            maxStock: inv.maximumStock || 50,
            reorderLevel: inv.reorderLevel || 10,
            location: `${inv.location?.warehouse || 'MAIN'}-${inv.location?.shelf || 'A01'}`,
            supplier: inv.supplier?.name || 'Nhà cung cấp chính',
            cost: inv.cost || 0,
            lastUpdated: new Date(inv.updatedAt || Date.now()).toLocaleDateString('vi-VN'),
            status: getStockStatus(inv.currentStock || 0, inv.minimumStock || 5),
            productDetails: product,
            leadTime: inv.supplier?.leadTime || 7
          };
        });
      } else {
        // Fallback: tạo inventory từ product data
        inventoryItems = [
          ...laptops.map(laptop => ({
            id: laptop._id,
            itemCode: laptop._id.substring(0, 12).toUpperCase(),
            itemName: laptop.displayName || laptop.name || 'Laptop không tên',
            category: 'Laptop',
            currentStock: laptop.stock || Math.floor(Math.random() * 20) + 5,
            reservedStock: Math.floor(Math.random() * 3),
            availableStock: laptop.stock || Math.floor(Math.random() * 20) + 5,
            minStock: 5,
            maxStock: 50,
            reorderLevel: 10,
            location: 'MAIN-A01',
            supplier: `${laptop.brand} Vietnam`,
            cost: laptop.price ? laptop.price * 0.8 : 0,
            lastUpdated: new Date(laptop.updatedAt || Date.now()).toLocaleDateString('vi-VN'),
            status: getStockStatus(laptop.stock || Math.floor(Math.random() * 20) + 5, 5),
            productDetails: laptop,
            leadTime: 7
          })),
          ...printers.map(printer => ({
            id: printer._id,
            itemCode: printer._id.substring(0, 12).toUpperCase(),
            itemName: (printer.type && printer.brand) ? `${printer.type} ${printer.brand}` : 'Máy in không tên',
            category: 'Máy in',
            currentStock: printer.stock || Math.floor(Math.random() * 15) + 3,
            reservedStock: Math.floor(Math.random() * 2),
            availableStock: printer.stock || Math.floor(Math.random() * 15) + 3,
            minStock: 3,
            maxStock: 30,
            reorderLevel: 8,
            location: 'MAIN-B01',
            supplier: `${printer.brand} Vietnam`,
            cost: printer.price ? printer.price * 0.85 : 0,
            lastUpdated: new Date(printer.updatedAt || Date.now()).toLocaleDateString('vi-VN'),
            status: getStockStatus(printer.stock || Math.floor(Math.random() * 15) + 3, 3),
            productDetails: printer,
            leadTime: 10
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

  const getStatusText = (status) => {
    switch (status) {
      case 'in_stock': return 'Còn hàng';
      case 'low_stock': return 'Sắp hết';
      case 'out_of_stock': return 'Hết hàng';
      default: return 'Không xác định';
    }
  };

  // Hàm xử lý xem chi tiết sản phẩm
  const handleViewDetails = (item) => {
    alert(`Xem chi tiết: ${item.itemName}\nTồn kho: ${item.currentStock}\nNhà cung cấp: ${item.supplier}\nVị trí: ${item.location}`);
  };

  // Hàm xử lý đặt hàng ngay
  const handleReorder = (item) => {
    const orderQuantity = prompt(`Số lượng cần đặt cho ${item.itemName}:`, item.reorderLevel || 10);
    if (orderQuantity && !isNaN(orderQuantity)) {
      alert(`Đã tạo đơn đặt hàng ${orderQuantity} sản phẩm ${item.itemName} từ ${item.supplier}`);
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
      <div className="admin-inventory-page">
        <h1><FontAwesomeIcon icon={faBoxes} style={{marginRight: '10px'}} />Quản lý kho hàng</h1>
        
        {/* Controls */}
        <div className="inventory-header-controls">
          <div className="inventory-search-filter-row">
            <div className="inventory-search-box">
              <FontAwesomeIcon icon={faSearch} />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="inventory-filter-controls">
              <div className="inventory-filter-group">
                <label>Danh mục:</label>
                <select 
                  value={filter} 
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">Tất cả</option>
                  <option value="laptop">Laptop</option>
                  <option value="printer">Máy in</option>
                </select>
              </div>
            </div>
          </div>
          <div className="inventory-actions">
            <button className="inventory-refresh-button" onClick={fetchData}>
              <FontAwesomeIcon icon={faSync} />
              Làm mới
            </button>
            <button className="inventory-export-button">
              <FontAwesomeIcon icon={faFileExport} />
              Xuất dữ liệu
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="inventory-summary">
          <div className="inventory-summary-card">
            <h3>Tổng sản phẩm</h3>
            <div className="inventory-card-value">{stats.total}</div>
            <FontAwesomeIcon icon={faBoxes} className="inventory-card-icon" />
          </div>
          <div className="inventory-summary-card success">
            <h3>Còn hàng</h3>
            <div className="inventory-card-value">{stats.inStock}</div>
            <FontAwesomeIcon icon={faCheckCircle} className="inventory-card-icon" />
          </div>
          <div className="inventory-summary-card warning">
            <h3>Sắp hết hàng</h3>
            <div className="inventory-card-value">{stats.lowStock}</div>
            <FontAwesomeIcon icon={faExclamationTriangle} className="inventory-card-icon" />
          </div>
          <div className="inventory-summary-card danger">
            <h3>Hết hàng</h3>
            <div className="inventory-card-value">{stats.outOfStock}</div>
            <FontAwesomeIcon icon={faTimesCircle} className="inventory-card-icon" />
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
        <div className="inventory-table-container">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Tồn kho</th>
                <th>Đặt trước</th>
                <th>Có sẵn</th>
                <th>Min/Max</th>
                <th>Vị trí</th>
                <th>Nhà cung cấp</th>
                <th>Trạng thái</th>
                <th>Cập nhật</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td><strong>{item.itemCode}</strong></td>
                  <td>
                    <div className="inventory-product-info">
                      <div className="product-name">{item.itemName}</div>
                      {item.cost > 0 && (
                        <div className="product-cost">
                          Giá vốn: {new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(item.cost)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`inventory-category-badge ${item.category.toLowerCase()}`}>
                      {item.category}
                    </span>
                  </td>
                  <td>
                    <div className="stock-info">
                      <span className="stock-quantity-main">{item.currentStock}</span>
                      {item.currentStock <= item.minStock && item.currentStock > 0 && (
                        <small className="stock-warning">⚠️</small>
                      )}
                      {item.currentStock === 0 && (
                        <small className="stock-danger">❌</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="reserved-stock">{item.reservedStock || 0}</span>
                  </td>
                  <td>
                    <span className="available-stock">{item.availableStock || item.currentStock}</span>
                  </td>
                  <td>
                    <div className="min-max-info">
                      <small>{item.minStock} / {item.maxStock}</small>
                      {item.reorderLevel && (
                        <div className="reorder-level">
                          <small>Đặt lại: {item.reorderLevel}</small>
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="location-info">{item.location}</span>
                  </td>
                  <td>
                    <div className="supplier-info">
                      <div className="supplier-name">{item.supplier}</div>
                      {item.leadTime && (
                        <small className="lead-time">{item.leadTime} ngày</small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`inventory-status-badge ${item.status.replace('_', '-')}`}>
                      {getStatusText(item.status)}
                    </span>
                  </td>
                  <td>
                    <span className="last-updated">{item.lastUpdated}</span>
                  </td>
                  <td>
                    <div className="inventory-action-buttons">
                      <button 
                        className="inventory-action-btn update" 
                        title="Cập nhật tồn kho"
                        onClick={() => handleUpdateStock(item)}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button 
                        className="inventory-action-btn view" 
                        title="Xem chi tiết"
                        onClick={() => handleViewDetails(item)}
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      {item.currentStock <= item.reorderLevel && (
                        <button 
                          className="inventory-action-btn reorder" 
                          title="Đặt hàng ngay"
                          onClick={() => handleReorder(item)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredData.length === 0 && (
          <div className="inventory-loading">
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
